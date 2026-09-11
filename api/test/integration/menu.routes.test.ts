import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

// These tests are about menu CRUD/validation behavior, not Auth0 token
// verification (that's covered separately in bills.auth.test.ts against
// the real middleware), so the auth gate is replaced with a stub that
// always lets a fake authenticated user through.
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

describe("menu routes", () => {
  it("creates, lists, updates and soft-deletes a menu item", async () => {
    const created = await request(app)
      .post("/api/menu")
      .send({ name: "Test Item", category: "Test", halfPrice: 50, fullPrice: 90 })
      .expect(201);

    expect(created.body).toMatchObject({ name: "Test Item", isActive: true });

    const listed = await request(app).get("/api/menu").expect(200);
    expect(listed.body.map((item: { name: string }) => item.name)).toContain("Test Item");

    const updated = await request(app)
      .put(`/api/menu/${created.body.id}`)
      .send({ name: "Test Item v2", category: "Test", halfPrice: 55, fullPrice: 95 })
      .expect(200);
    expect(updated.body.name).toBe("Test Item v2");

    await request(app).delete(`/api/menu/${created.body.id}`).expect(204);

    const afterDelete = await request(app).get("/api/menu").expect(200);
    expect(afterDelete.body.map((item: { name: string }) => item.name)).not.toContain(
      "Test Item v2"
    );
  });

  it("rejects a menu item with missing/invalid fields", async () => {
    const response = await request(app)
      .post("/api/menu")
      .send({ name: "", category: "Test", halfPrice: -5, fullPrice: "not-a-number" })
      .expect(400);

    expect(response.body.error).toBe("Validation failed");
  });

  it("returns 404 for a menu item that doesn't exist", async () => {
    await request(app).get("/api/menu/999999").expect(404);
  });
});
