"use client";

import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import RateCard from "@/components/RateCard";
import Image from "next/image";
import logo from "@/public/logo.jpeg"
import { getUserLocation } from "@/utils/getLocation";


export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  setLoading(true);
  getUserLocation()
    .then(async ({ lat, lon }) => {
      const res = await fetch(`/api/rate?lat=${lat}&lon=${lon}&type=Residential`);
      const result = await res.json();
      setData(result);
      setLoading(false);
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
    });
}, []);


  return (
    <main className="min-h-screen flex flex-col gap-10 items-center justify-center  p-6">

      <div>
        <Image src={logo} alt="logo" className="w-[250px] "/>
      </div>
      <div className="bg-gray-50 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Real Estate Rate Finder
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Detecting your location...</p>
        ) : error ? (
          <>
            <p className="text-center text-red-500">{error}</p>
            <SearchForm />
          </>
        ) : data && !data.message ? (
          <RateCard data={data} />
        ) : (
          <>
            <p className="text-center text-gray-600">
              No data found for your area.
            </p>
            <div className="my-4 border-t" />
            <SearchForm />
          </>
        )}
      </div>
    </main>
  );
}
