// Pure, framework- and DB-free on purpose: this is the one place a bug
// costs real money, so it needs to be trivially unit-testable in isolation
// from Express and Prisma.

export type QuantityType = "HALF" | "FULL" | "NA";

export interface BillLineInput {
  menuItemId: number;
  foodNameSnapshot: string;
  quantity: number;
  quantityType: QuantityType;
  unitPrice: number;
}

export interface PricedLine extends BillLineInput {
  amount: number;
}

export interface TaxRateInput {
  cgst: number;
  sgst: number;
}

export interface BillTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  lines: PricedLine[];
}

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function computeBillTotals(
  lines: BillLineInput[],
  discountPercent: number,
  taxRate: TaxRateInput
): BillTotals {
  const pricedLines: PricedLine[] = lines.map((line) => ({
    ...line,
    amount: round2(line.unitPrice * line.quantity),
  }));

  const subtotal = round2(pricedLines.reduce((sum, line) => sum + line.amount, 0));
  const discountAmount = round2((subtotal * discountPercent) / 100);
  const taxableAmount = round2(subtotal - discountAmount);
  const taxPercent = taxRate.cgst + taxRate.sgst;
  const taxAmount = round2((taxableAmount * taxPercent) / 100);
  const finalAmount = round2(taxableAmount + taxAmount);

  return { subtotal, discountAmount, taxAmount, finalAmount, lines: pricedLines };
}
