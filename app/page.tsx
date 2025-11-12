"use client";

import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import RateCard from "@/components/RateCard";
import Image from "next/image";
import logo from "@/public/logo.jpeg"


export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `/api/rate?lat=${latitude}&lon=${longitude}&type=Residential`
        );
        const result = await res.json();
        setData(result);
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
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
