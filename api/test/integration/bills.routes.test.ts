import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type express from "express";
import request from "supertest";

vi.mock("../../src/middleware/auth", () => ({
  requireAuth: (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    req.auth = { payload: { sub: "test-user" } } as express.Request["auth"];
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

async function seedMenuAndTax() {
  const item = await prisma.menuItem.create({
    data: { name: "Butter Chicken", category: "Main", halfPrice: 150, fullPrice: 280 },
  });
  await prisma.taxRate.create({ data: { cgst: 2.5, sgst: 2.5 } });
  return item;
}

describe("POST /api/bills", () => {
  it("computes totals from server-side prices, ignoring any amount the client sends", async () => {
    const item = await seedMenuAndTax();

    const response = await request(app)
      .post("/api/bills")
      .send({
        paymentMode: "CASH",
        discountPercent: 10,
        lines: [
          {
            menuItemId: item.id,
            quantityType: "FULL",
            quantity: 2,
            // A tampered/malicious client sending its own price and amount —
            // the server must not use these for anything.
            unitPrice: 1,
            amount: 1,
          },
        ],
      })
      .expect(201);

    // subtotal = 2 * 280 = 560; discount 10% = 56; taxable = 504; tax 5% = 25.2; final = 529.2
    expect(response.body.subtotal).toBe("560");
    expect(response.body.discountAmount).toBe("56");
    expect(response.body.taxAmount).toBe("25.2");
    expect(response.body.finalAmount).toBe("529.2");
    expect(response.body.lineItems[0].unitPrice).toBe("280");
    expect(response.body.lineItems[0].amount).toBe("560");
    expect(response.body.createdBySub).toBe("test-user");
  });

  it("rejects a bill that references a menu item that doesn't exist", async () => {
    await seedMenuAndTax();

    const response = await request(app)
      .post("/api/bills")
      .send({
        paymentMode: "CASH",
        discountPercent: 0,
        lines: [{ menuItemId: 999999, quantityType: "FULL", quantity: 1 }],
      })
      .expect(400);

    expect(response.body.error).toMatch(/not found or inactive/);
  });

  it("rejects a bill with an out-of-range discount", async () => {
    const item = await seedMenuAndTax();

    await request(app)
      .post("/api/bills")
      .send({
        paymentMode: "CASH",
        discountPercent: 150,
        lines: [{ menuItemId: item.id, quantityType: "FULL", quantity: 1 }],
      })
      .expect(400);
  });

  it("rejects a bill with no line items", async () => {
    await seedMenuAndTax();

    await request(app)
      .post("/api/bills")
      .send({ paymentMode: "CASH", discountPercent: 0, lines: [] })
      .expect(400);
  });
});
