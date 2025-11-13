import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const type = searchParams.get("type");

    let finalPincode = pincode;

    // ✅ If no pincode, try to reverse-geocode from lat/lon
    if (!finalPincode && lat && lon) {
      const { getPincodeFromCoords } = await import("@/lib/getPincodeFromCoords");
      finalPincode = await getPincodeFromCoords(Number(lat), Number(lon));
    }

    // ✅ Validate inputs before Prisma query
    if (!finalPincode || !type) {
      return Response.json({ message: "Missing pincode or property type" }, { status: 400 });
    }

    const rate = await prisma.rate.findFirst({
      where: {
        pincode: finalPincode,
        propertyType: type,
      },
    });

    if (!rate) {
      return Response.json({ message: "No data found for this location" });
    }

    return Response.json(rate);
  } catch (error: any) {
    console.error("API error:", error);
    return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
