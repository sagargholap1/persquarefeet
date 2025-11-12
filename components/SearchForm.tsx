"use client";

import { useState } from "react";
import RateCard from "./RateCard";

export default function SearchForm() {
  const [pincode, setPincode] = useState("");
  const [type, setType] = useState("Residential");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/rate?pincode=${pincode}&type=${type}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option>Residential</option>
          <option>Commercial</option>
          <option>Land</option>
          <option>Industrial</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Get Rate"}
        </button>
      </form>

      {data && !data.message && <RateCard data={data} />}
      {data?.message && (
        <p className="text-center mt-4 text-gray-500">{data.message}</p>
      )}
    </div>
  );
}
