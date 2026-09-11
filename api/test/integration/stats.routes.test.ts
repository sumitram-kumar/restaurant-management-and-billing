import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../../src/middleware/auth", () => ({
  requireAuth: (req: any, _res: any, next: () => void) => {
    req.auth = { payload: { sub: "test-user" } };
    next();
  },
}));

const { app } = await import("../../src/app");
const { prisma } = await import("../../src/lib/prisma");
const { resetDb } = await import("../dbHelpers");

beforeEach(resetDb);
afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/stats", () => {
  it("aggregates sales by item and period totals within a date range", async () => {
    const item = await prisma.menuItem.create({
      data: { name: "Butter Chicken", category: "Main", halfPrice: 150, fullPrice: 280 },
    });
    const taxRate = await prisma.taxRate.create({ data: { cgst: 2.5, sgst: 2.5 } });

    await prisma.bill.create({
      data: {
        billNumber: 1n,
        billDate: new Date("2026-01-15"),
        paymentMode: "CASH",
        subtotal: 280,
        discountPercent: 0,
        discountAmount: 0,
        taxAmount: 14,
        finalAmount: 294,
        taxRateId: taxRate.id,
        lineItems: {
          create: [
            {
              menuItemId: item.id,
              foodNameSnapshot: item.name,
              quantity: 1,
              quantityType: "FULL",
              unitPrice: 280,
              amount: 280,
            },
          ],
        },
      },
    });

    // Outside the queried range — must not be included.
    await prisma.bill.create({
      data: {
        billNumber: 2n,
        billDate: new Date("2025-01-15"),
        paymentMode: "CASH",
        subtotal: 100,
        discountPercent: 0,
        discountAmount: 0,
        taxAmount: 5,
        finalAmount: 105,
        taxRateId: taxRate.id,
        lineItems: {
          create: [
            {
              menuItemId: item.id,
              foodNameSnapshot: item.name,
              quantity: 1,
              quantityType: "FULL",
              unitPrice: 100,
              amount: 100,
            },
          ],
        },
      },
    });

    const response = await request(app)
      .get("/api/stats")
      .query({ from: "2026-01-01", to: "2026-01-31" })
      .expect(200);

    expect(response.body.salesByItem).toEqual([
      { foodName: "Butter Chicken", totalSales: "280" },
    ]);
    expect(response.body.totals.subtotal).toBe("280");
    expect(response.body.totals.finalAmount).toBe("294");
  });

  it("rejects a range where from is after to", async () => {
    await request(app)
      .get("/api/stats")
      .query({ from: "2026-02-01", to: "2026-01-01" })
      .expect(400);
  });
});
