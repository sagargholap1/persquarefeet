"use client";

import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import RateCard from "@/components/RateCard";
import Image from "next/image";
import logo from "@/public/logo.jpeg";
import insytric from "@/public/insytric logo.png";
import { getUserLocation } from "@/utils/getLocation";
import { HelpCircle, Menu, MenuIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <main className="min-h-screen flex flex-col  items-center justify-center  ">
      {/* Navbar */}
        <div className="absolute top-0 left-0 w-full z-50 shadow-md bg-white backdrop-blur-md py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              {/* Help Icon */}
              <button className="text-gray-700 hover:text-amber-500 transition">
                <HelpCircle size={24} />
              </button>

              {/* Hamburger menu for mobile */}
              <button
                className="md:hidden text-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-2 flex flex-col gap-2 bg-white rounded-lg p-4">
              <a
                href="#home"
                className="text-gray-700 hover:text-[#f93114] transition"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-[#f93114] transition"
              >
                Cities
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-[#f93114] transition"
              >
                Calculate Rate
              </a>
            </div>
          )}
        </div>
        
      <section className="relative h-screen w-full bg-white">
        {/* Background Image */}
        {/* <Image
          src={heroBg}
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        /> */}

        

        {/* Overlays */}
        {/* <div className="absolute inset-0 bg-amber-500/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/50" /> */}

        {/* Centered Content */}
        <div className="h-[calc(100vh-85px)] flex flex-col items-center justify-center gap-6 z-10 bg-gray-100">
          <h2 className="text-center text-gray-800 text-4xl">
            Find accurate real estate rates instantly in your area.
          </h2>
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
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
      {/* Footer */}

      <div className="flex flex-col  items-center shadow-[0_35px_35px_rgba(0,0,0,0.25)] justify-center py-4">
        <h2 className="font-semibold">Powered by </h2>
        <Link href="https://insytric.com" target="_blank" rel="noopener noreferrer">
        <Image src={insytric} alt="Insytric" className="w-[80px]" /></Link>
      </div>
      </section>
    </main>
  );
}
