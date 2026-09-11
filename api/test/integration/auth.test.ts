import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
// No mock here, deliberately — this file exercises the real
// express-oauth2-jwt-bearer middleware, unlike the other integration
// tests which stub it out to focus on business logic.
import { app } from "../../src/app";
import { prisma } from "../../src/lib/prisma";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("API authentication", () => {
  it("rejects requests to protected routes with no token", async () => {
    await request(app).get("/api/menu").expect(401);
  });

  it("rejects requests with a malformed bearer token", async () => {
    await request(app)
      .get("/api/menu")
      .set("Authorization", "Bearer not-a-real-token")
      .expect(401);
  });

  it("leaves /health reachable without a token", async () => {
    await request(app).get("/health").expect(200);
  });
});
