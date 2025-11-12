import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPincodeFromCoords } from "@/lib/geocode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode");
  const propertyType = searchParams.get("type") || "Residential";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  let finalPincode = pincode;
  let location = null;

  if (lat && lon) {
    const geo = await getPincodeFromCoords(Number(lat), Number(lon));
    finalPincode = geo.pincode;
    location = geo.location;
  }

  if (!finalPincode)
    return NextResponse.json({ error: "No pincode or coordinates provided" }, { status: 400 });

  const rate = await prisma.rate.findFirst({
    where: { pincode: finalPincode, propertyType },
  });

  if (!rate)
    return NextResponse.json({ message: "No data found for this area." });

  return NextResponse.json({ ...rate, location });
}
