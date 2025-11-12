import fs from "fs";
import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";

// 🔍 Cities you care about
const targetCities = [
  "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Surat", "Nagpur", "Chandigarh",
  "Noida", "Gurugram", "Thane", "Navi Mumbai", "Vadodara", "Bhopal",
];

// 📁 Input and output paths
const inputFile = "data/pincodes.csv";   // change if needed
const outputFile = "data/filtered_pincodes.csv";

const output: any[] = [];

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    // normalize to lower case for matching
    const district = (row.district || row.DivisionName || "").toLowerCase();

    // check if any target city matches
    const match = targetCities.find(
      (c) => district.includes(c.toLowerCase()) || (row.officeName || "").toLowerCase().includes(c.toLowerCase())
    );

    if (match) {
      output.push({
        pincode: row.pincode || row.Pincode,
        city: match,
        latitude: row.latitude || row.Latitude,
        longitude: row.longitude || row.Longitude,
        state: row.state || row.stateName,
      });
    }
  })
  .on("end", async () => {
    console.log(`✅ Found ${output.length} matching pincodes`);

    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "pincode", title: "pincode" },
        { id: "city", title: "city" },
        { id: "latitude", title: "latitude" },
        { id: "longitude", title: "longitude" },
        { id: "state", title: "state" },
      ],
    });

    await csvWriter.writeRecords(output);
    console.log(`✅ Filtered data saved to ${outputFile}`);
  });
