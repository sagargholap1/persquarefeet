export async function getPincodeFromCoords(lat: number, lon: number) {
  const apiKey = process.env.GEOCODE_API_KEY!;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const pincode = data?.results?.[0]?.components?.postcode || null;
  const location =
    data?.results?.[0]?.components?.suburb ||
    data?.results?.[0]?.components?.city ||
    data?.results?.[0]?.components?.state ||
    "Unknown";

  return { pincode, location };
}
