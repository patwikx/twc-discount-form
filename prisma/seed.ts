import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Companies
  const companies = [
    { name: "Anchor Hotel", approverEmail: "plmiranda@rdrealty.com.ph" },
    { name: "Dolores Tropicana Resort", approverEmail: "manager@dolorestropicana.ph" },
    { name: "Dolores Farm Resort", approverEmail: "manager@doloresfarm.ph" },
    { name: "Dolores Lake Resort", approverEmail: "manager@doloreslake.ph" },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { approverEmail: company.approverEmail },
      create: company,
    });
  }
  console.log(`✅ Seeded ${companies.length} companies`);

  // Seed Hotels
  const hotels = [
    "Anchor Hotel",
    "Dolores Tropicana Resort",
    "Dolores Farm Resort",
    "Dolores Lake Resort",
  ];

  for (const name of hotels) {
    await prisma.hotel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ Seeded ${hotels.length} hotels`);

  // Seed Discount Types
  const discountTypes = [
    "Entrance Fee + 2 Children",
    "Cottage",
    "Room Accommodation",
    "Food & Beverage",
  ];

  for (const name of discountTypes) {
    await prisma.discountType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ Seeded ${discountTypes.length} discount types`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
