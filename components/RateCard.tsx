export default function RateCard({ data }: any) {
  return (
    <div className="mt-6 border p-4 rounded-lg bg-gray-50 text-center">
      <h2 className="text-gray-900 font-bold text-lg mt-2">Average Rate -
        ₹{data.avgRatePerSqft.toLocaleString()} / sq.ft
      </h2>
      <p>
        <span className="font-semibold">{data.location}</span> —{" "}
        {data.propertyType}
      </p>
      <p><span className="font-semibold">Range: </span>
        ₹{data.minRatePerSqft.toLocaleString()} – ₹
        {data.maxRatePerSqft.toLocaleString()} per sqft
      </p>
      <p className=" font-semibold">{data.location || "Area"}</p>
      <p className="text-gray-700">Pincode: {data.pincode}</p>
      <p className="text-sm text-gray-500 mt-1">
        Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
      </p>
    </div>
  );
}
