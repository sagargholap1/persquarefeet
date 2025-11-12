import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const propertyTypes = ["Residential", "Commercial", "Land", "Industrial"];

function randomRate(type: string) {
  switch (type) {
    case "Residential": return Math.floor(Math.random() * (25000 - 3000) + 3000);
    case "Commercial": return Math.floor(Math.random() * (50000 - 8000) + 8000);
    case "Land": return Math.floor(Math.random() * (15000 - 2000) + 2000);
    case "Industrial": return Math.floor(Math.random() * (20000 - 5000) + 5000);
    default: return 5000;
  }
}

async function main() {
  console.log("🌱 Reading filtered pincodes CSV...");
  const data: any[] = [];

  fs.createReadStream("data/filtered_pincodes.csv")
    .pipe(csv())
    .on("data", (row) => {
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const avg = randomRate(propertyType);

      // Create ±10–20% spread around avg
      const min = Math.max(avg * (0.85 + Math.random() * 0.05), 1000);
      const max = avg * (1.10 + Math.random() * 0.10);

      data.push({
        pincode: row.pincode,
        location: row.city,
        propertyType,
        avgRatePerSqft: avg,
        minRatePerSqft: Math.round(min),
        maxRatePerSqft: Math.round(max),
      });
    })
    .on("end", async () => {
      console.log(`📦 Inserting ${data.length} records...`);
      await prisma.rate.deleteMany({});
      await prisma.rate.createMany({ data });
      console.log("✅ Seeding complete!");
      await prisma.$disconnect();
    });
}

main();
