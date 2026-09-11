import { PrismaClient, PaymentMode, QuantityType } from "@prisma/client";

const prisma = new PrismaClient();

const MENU_ITEMS = [
  {
    name: "Paneer Butter Masala",
    category: "Main Course",
    halfPrice: 120,
    fullPrice: 220,
  },
  { name: "Dal Makhani", category: "Main Course", halfPrice: 90, fullPrice: 160 },
  { name: "Butter Chicken", category: "Main Course", halfPrice: 150, fullPrice: 280 },
  { name: "Veg Biryani", category: "Rice", halfPrice: 110, fullPrice: 200 },
  { name: "Chicken Biryani", category: "Rice", halfPrice: 140, fullPrice: 260 },
  { name: "Tandoori Roti", category: "Bread", halfPrice: 15, fullPrice: 15 },
  { name: "Butter Naan", category: "Bread", halfPrice: 30, fullPrice: 30 },
  { name: "Masala Papad", category: "Starter", halfPrice: 25, fullPrice: 40 },
  { name: "Veg Spring Roll", category: "Starter", halfPrice: 80, fullPrice: 140 },
  { name: "Gulab Jamun (2 pc)", category: "Dessert", halfPrice: 40, fullPrice: 40 },
];

async function main() {
  await Promise.all(
    MENU_ITEMS.map((item) =>
      prisma.menuItem.upsert({
        where: { name: item.name },
        update: {},
        create: item,
      })
    )
  );

  const taxRate = await prisma.taxRate.create({
    data: { cgst: 2.5, sgst: 2.5 },
  });

  const paneer = await prisma.menuItem.findUniqueOrThrow({
    where: { name: "Paneer Butter Masala" },
  });
  const roti = await prisma.menuItem.findUniqueOrThrow({
    where: { name: "Tandoori Roti" },
  });

  const subtotal = 220 + 4 * 15;
  const discountPercent = 5;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * 5) / 100;
  const finalAmount = taxableAmount + taxAmount;

  await prisma.bill.create({
    data: {
      billNumber: BigInt(Date.now()),
      paymentMode: PaymentMode.CASH,
      subtotal,
      discountPercent,
      discountAmount,
      taxAmount,
      finalAmount,
      taxRateId: taxRate.id,
      lineItems: {
        create: [
          {
            menuItemId: paneer.id,
            foodNameSnapshot: paneer.name,
            quantity: 1,
            quantityType: QuantityType.FULL,
            unitPrice: paneer.fullPrice,
            amount: paneer.fullPrice,
          },
          {
            menuItemId: roti.id,
            foodNameSnapshot: roti.name,
            quantity: 4,
            quantityType: QuantityType.FULL,
            unitPrice: roti.fullPrice,
            amount: Number(roti.fullPrice) * 4,
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
