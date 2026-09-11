import { PaymentMode, QuantityType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../lib/AppError";
import { BillLineInput, computeBillTotals } from "./billCalculator";

export interface CreateBillLineInput {
  menuItemId: number;
  quantityType: QuantityType;
  quantity: number;
}

export interface CreateBillInput {
  paymentMode: PaymentMode;
  discountPercent: number;
  createdBySub?: string;
  lines: CreateBillLineInput[];
}

// The client only ever sends *which* items and *how many* — never a price
// or a total. Every number that ends up on the bill is looked up or derived
// here, so a tampered client request can't change what gets charged.
export async function createBill(input: CreateBillInput) {
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: input.lines.map((line) => line.menuItemId) }, isActive: true },
  });
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

  const lineInputs: BillLineInput[] = input.lines.map((line) => {
    const menuItem = menuItemById.get(line.menuItemId);
    if (!menuItem) {
      throw new BadRequestError(`Menu item ${line.menuItemId} not found or inactive`);
    }
    const unitPrice =
      line.quantityType === QuantityType.HALF ? menuItem.halfPrice : menuItem.fullPrice;

    return {
      menuItemId: menuItem.id,
      foodNameSnapshot: menuItem.name,
      quantity: line.quantity,
      quantityType: line.quantityType,
      unitPrice: Number(unitPrice),
    };
  });

  const taxRate = await prisma.taxRate.findFirst({ orderBy: { effectiveFrom: "desc" } });
  if (!taxRate) {
    throw new BadRequestError("No tax rate configured — set one via POST /api/tax first");
  }

  const totals = computeBillTotals(lineInputs, input.discountPercent, {
    cgst: Number(taxRate.cgst),
    sgst: Number(taxRate.sgst),
  });

  // Prisma's nested `create` for a relation runs as a single transaction,
  // so the bill and its line items are never left partially written.
  return prisma.bill.create({
    data: {
      billNumber: BigInt(Date.now()),
      paymentMode: input.paymentMode,
      subtotal: totals.subtotal,
      discountPercent: input.discountPercent,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      finalAmount: totals.finalAmount,
      taxRateId: taxRate.id,
      createdBySub: input.createdBySub,
      lineItems: {
        create: totals.lines.map((line) => ({
          menuItemId: line.menuItemId,
          foodNameSnapshot: line.foodNameSnapshot,
          quantity: line.quantity,
          quantityType: line.quantityType,
          unitPrice: line.unitPrice,
          amount: line.amount,
        })),
      },
    },
    include: { lineItems: true },
  });
}
