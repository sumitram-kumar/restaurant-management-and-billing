import { prisma } from "../src/lib/prisma";

// Deletes in FK-safe order (children before parents) so tests can start
// each case from a known-empty state without disabling constraints.
export async function resetDb() {
  await prisma.billLineItem.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.taxRate.deleteMany();
  await prisma.menuItem.deleteMany();
}
