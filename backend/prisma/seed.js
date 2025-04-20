const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  console.log("Starting to seed database...");

  // Create an admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@veggibulk.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@veggibulk.com",
      password: adminPassword,
      mobileNumber: "0000000000",
    },
  });

  console.log("Created admin user:", admin.email);

  // Seed products
  const products = [
    { name: "Potatoes", price: 1.99, stock: 500 },
    { name: "Tomatoes", price: 2.49, stock: 350 },
    { name: "Onions", price: 1.29, stock: 800 },
    { name: "Carrots", price: 1.79, stock: 450 },
    { name: "Broccoli", price: 2.99, stock: 200 },
    { name: "Spinach", price: 2.29, stock: 150 },
    { name: "Bell Peppers", price: 2.99, stock: 180 },
    { name: "Cucumbers", price: 1.49, stock: 300 },
    { name: "Lettuce", price: 1.99, stock: 100 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id:
          (
            await prisma.product.findFirst({ where: { name: product.name } })
          )?.id || 0,
      },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .then(async () => {
    console.log("Seeding completed successfully!");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error during seeding:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
