"use client";

import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import RateCard from "@/components/RateCard";
import Image from "next/image";
import logo from "@/public/logo.jpeg";
import heroBg from "@/public/home-5-2.jpg";
import { getUserLocation } from "@/utils/getLocation";
import { HelpCircle, Menu, MenuIcon } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUserLocation()
      .then(async ({ lat, lon }) => {
        const res = await fetch(
          `/api/rate?lat=${lat}&lon=${lon}&type=Residential`
        );
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
    <main className="min-h-screen flex flex-col gap-10 items-center justify-center  ">
      <section className="relative h-screen w-full">
        {/* Background Image */}
        <Image
          src={heroBg}
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute top-0 left-0 w-full z-50 bg-white backdrop-blur-md py-4 px-6 ">
          <div className="max-w-7xl mx-auto   flex items-center justify-between">
            {/* Logo */}
            <Image src={logo} alt="logo" className="w-[150px]" />

            {/* Links for desktop */}
            <div className="hidden md:flex gap-8 text-xl text-gray-700 font-medium">
              <a href="#home" className="hover:text-[#f93114] transition">
                Home
              </a>
              <a href="#about" className="hover:text-[#f93114] transition">
                Cities
              </a>
              <a href="#contact" className="hover:text-[#f93114] transition">
                Calculate Rate
              </a>
            </div>

            {/* Right side icons (mobile + help) */}
    <div className="flex items-center gap-4">
      {/* Help Icon */}
      <button className="text-gray-700 hover:text-amber-500 transition">
       <HelpCircle/>
      </button>

      {/* Hamburger menu for mobile */}
      <button className="md:hidden text-gray-700">
        <MenuIcon/>
      </button>
    </div>
          </div>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-amber-500/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/50" />

        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 ">
          <h2 className="text-center text-gray-200 text-4xl">
            Find accurate real estate rates instantly in your area.
          </h2>
          <div className="bg-gray-100 shadow-lg rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-2xl font-semibold text-center mb-6">
              Enter PinCode you want to search the rates for
            </h1>

            {loading ? (
              <p className="text-center text-gray-600">
                Detecting your location...
              </p>
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
        </div>
      </section>
    </main>
  );
}
