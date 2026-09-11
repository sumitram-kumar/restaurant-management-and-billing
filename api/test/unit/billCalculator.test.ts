import { describe, expect, it } from "vitest";
import { computeBillTotals, BillLineInput } from "../../src/modules/bills/billCalculator";

const line = (overrides: Partial<BillLineInput> = {}): BillLineInput => ({
  menuItemId: 1,
  foodNameSnapshot: "Paneer Butter Masala",
  quantity: 1,
  quantityType: "FULL",
  unitPrice: 220,
  ...overrides,
});

describe("computeBillTotals", () => {
  it("computes subtotal, discount, tax and final amount for a single line", () => {
    const totals = computeBillTotals([line({ quantity: 2, unitPrice: 100 })], 10, {
      cgst: 2.5,
      sgst: 2.5,
    });

    expect(totals.subtotal).toBe(200);
    expect(totals.discountAmount).toBe(20);
    expect(totals.taxAmount).toBe(9); // 5% of (200 - 20)
    expect(totals.finalAmount).toBe(189);
    expect(totals.lines[0]?.amount).toBe(200);
  });

  it("sums multiple line items before applying discount and tax", () => {
    const totals = computeBillTotals(
      [line({ quantity: 1, unitPrice: 220 }), line({ quantity: 4, unitPrice: 15 })],
      0,
      { cgst: 2.5, sgst: 2.5 }
    );

    expect(totals.subtotal).toBe(280);
    expect(totals.discountAmount).toBe(0);
    expect(totals.taxAmount).toBe(14);
    expect(totals.finalAmount).toBe(294);
  });

  it("handles a 0% discount without altering the subtotal", () => {
    const totals = computeBillTotals([line({ unitPrice: 100 })], 0, { cgst: 0, sgst: 0 });
    expect(totals.discountAmount).toBe(0);
    expect(totals.finalAmount).toBe(100);
  });

  it("handles a 100% discount, zeroing tax and final amount", () => {
    const totals = computeBillTotals([line({ unitPrice: 100 })], 100, {
      cgst: 5,
      sgst: 5,
    });
    expect(totals.discountAmount).toBe(100);
    expect(totals.taxAmount).toBe(0);
    expect(totals.finalAmount).toBe(0);
  });

  it("returns zero tax when the tax rate is zero", () => {
    const totals = computeBillTotals([line({ unitPrice: 50 })], 0, { cgst: 0, sgst: 0 });
    expect(totals.taxAmount).toBe(0);
    expect(totals.finalAmount).toBe(50);
  });

  it("rounds to 2 decimal places", () => {
    const totals = computeBillTotals([line({ quantity: 3, unitPrice: 33.33 })], 12.5, {
      cgst: 1.25,
      sgst: 1.25,
    });

    // subtotal = 99.99, discount = 12.5% of 99.99 = 12.49875 -> 12.5
    expect(totals.subtotal).toBe(99.99);
    expect(totals.discountAmount).toBe(12.5);
    expect(Number.isInteger(totals.finalAmount * 100)).toBe(true);
  });
});
