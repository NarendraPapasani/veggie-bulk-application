const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const main = async () => {
  const products = [
    {
      name: "Carrots",
      price: 1.99,
      stock: 100,
    },
    {
      name: "Potatoes",
      price: 2.49,
      stock: 150,
    },
    {
      name: "Onions",
      price: 1.79,
      stock: 200,
    },
    {
      name: "Tomatoes",
      price: 2.99,
      stock: 120,
    },
    {
      name: "Bell Peppers",
      price: 3.49,
      stock: 80,
    },
    {
      name: "Broccoli",
      price: 2.99,
      stock: 90,
    },
    {
      name: "Cauliflower",
      price: 3.99,
      stock: 70,
    },
    {
      name: "Spinach",
      price: 2.49,
      stock: 110,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Products seeded successfully");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
