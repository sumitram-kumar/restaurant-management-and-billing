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

describe("tax routes", () => {
  it("returns a default when no tax rate has been set yet", async () => {
    const response = await request(app).get("/api/tax").expect(200);
    expect(response.body).toMatchObject({ cgst: 0, sgst: 0 });
  });

  it("creates a new tax rate and returns it as the current rate", async () => {
    await request(app).post("/api/tax").send({ cgst: 2.5, sgst: 2.5 }).expect(201);

    const current = await request(app).get("/api/tax").expect(200);
    expect(current.body.cgst).toBe("2.5");
    expect(current.body.sgst).toBe("2.5");
  });

  it("uses the most recently created rate when several exist", async () => {
    await request(app).post("/api/tax").send({ cgst: 2.5, sgst: 2.5 }).expect(201);
    await request(app).post("/api/tax").send({ cgst: 9, sgst: 9 }).expect(201);

    const current = await request(app).get("/api/tax").expect(200);
    expect(current.body.cgst).toBe("9");
  });

  it("rejects a tax rate outside 0-100", async () => {
    await request(app).post("/api/tax").send({ cgst: 150, sgst: 5 }).expect(400);
    await request(app).post("/api/tax").send({ cgst: -1, sgst: 5 }).expect(400);
  });
});
