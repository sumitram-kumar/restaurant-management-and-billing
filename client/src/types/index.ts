// Mirrors api/prisma/schema.prisma. Hand-duplicated rather than shared via a
// package: this is a two-app repo, not a monorepo, and pulling in workspace
// tooling for two files of types would be more ceremony than the problem needs.

export type PaymentMode = "CASH" | "DEBIT_CARD" | "CREDIT_CARD" | "UPI" | "OTHER";
export type QuantityType = "HALF" | "FULL" | "NA";

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  halfPrice: string;
  fullPrice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemInput = Omit<MenuItem, "id" | "isActive" | "createdAt" | "updatedAt">;

export interface TaxRate {
  id?: number;
  cgst: string | number;
  sgst: string | number;
  effectiveFrom?: string | null;
}

export interface BillLineItem {
  id: number;
  menuItemId: number;
  foodNameSnapshot: string;
  quantity: number;
  quantityType: QuantityType;
  unitPrice: string;
  amount: string;
}

export interface Bill {
  id: number;
  billNumber: string;
  billDate: string;
  paymentMode: PaymentMode;
  subtotal: string;
  discountPercent: string;
  discountAmount: string;
  taxAmount: string;
  finalAmount: string;
  createdBySub: string | null;
  lineItems: BillLineItem[];
  taxRate: { cgst: string; sgst: string };
}

export interface CreateBillLineInput {
  menuItemId: number;
  quantityType: QuantityType;
  quantity: number;
}

export interface CreateBillInput {
  paymentMode: PaymentMode;
  discountPercent: number;
  lines: CreateBillLineInput[];
}

export interface StatsResponse {
  salesByItem: Array<{ foodName: string; totalSales: string }>;
  totals: {
    subtotal: string | null;
    discountAmount: string | null;
    taxAmount: string | null;
    finalAmount: string | null;
  };
}
