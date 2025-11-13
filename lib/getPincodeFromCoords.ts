export async function getPincodeFromCoords(lat: number, lon: number) {
  const apiKey = process.env.OPENCAGE_API_KEY!;
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`
  );
  const data = await res.json();

  if (!data.results?.length) return null;

  const components = data.results[0].components;
  return components.postcode || null;
}
