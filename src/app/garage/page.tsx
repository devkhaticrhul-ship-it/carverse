"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Heart, Trash2, Gauge, Flame, Zap, ArrowRight, Shield, Sparkles, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RawVehicle {
  _id?: string;
  id?: string;
  name: string;
  brand: any;
  category: string;
  price?: number;
  priceUSD?: number;
  priceINR?: number;
  imageUrl?: string;
  image?: string;
  specs?: {
    horsepower?: number;
    topSpeedKmH?: number;
    zeroToHundred?: number;
    fuelType?: string;
    transmission?: string;
  };
}

interface GarageVehicle {
  id: string;
  name: string;
  brandName: string;
  category: string;
  priceUSD: number;
  priceINR: number;
  image: string;
  horsepower: number;
  topSpeed: number;
  zeroToHundred: number;
  fuelType: string;
}

export default function GaragePage() {
  const { garage, removeFromGarage, formatPrice, addToCompare } = useApp();
  const [allVehicles, setAllVehicles] = useState<GarageVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data: RawVehicle[]) => {
        if (Array.isArray(data)) {
          const norm = data.map((v) => ({
            id: v._id || v.id || "",
            name: v.name,
            brandName: typeof v.brand === "object" ? v.brand?.name : v.brand || "Brand",
            category: v.category || "Hypercar",
            priceUSD: v.priceUSD ?? v.price ?? 0,
            priceINR: v.priceINR ?? (v.priceUSD ?? v.price ?? 0) * 83,
            image: v.imageUrl || v.image || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200",
            horsepower: v.specs?.horsepower ?? 0,
            topSpeed: v.specs?.topSpeedKmH ?? 0,
            zeroToHundred: v.specs?.zeroToHundred ?? 0,
            fuelType: v.specs?.fuelType ?? "Petrol",
          }));
          setAllVehicles(norm);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch vehicles for garage:", err);
        setLoading(false);
      });
  }, []);

  const savedVehicles = allVehicles.filter((v) => garage.includes(v.id));

  // Garage Collection Stats
  const totalValueUSD = savedVehicles.reduce((acc, v) => acc + v.priceUSD, 0);
  const totalValueINR = savedVehicles.reduce((acc, v) => acc + v.priceINR, 0);
  const totalHorsepower = savedVehicles.reduce((acc, v) => acc + v.horsepower, 0);
  const avgZeroToHundred =
    savedVehicles.length > 0
      ? (savedVehicles.reduce((acc, v) => acc + v.zeroToHundred, 0) / savedVehicles.length).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-matte-black text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-xs font-bold tracking-widest uppercase mb-3">
              <Heart className="w-3.5 h-3.5 fill-electric-blue" />
              Private Collection
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              DREAM <span className="text-neon-red">GARAGE</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Your personalized hypercar fleet, curated telemetry specs, and total collection valuation.
            </p>
          </div>

          {savedVehicles.length > 0 && (
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-electric-blue text-white text-sm font-semibold transition-all"
            >
              <Box className="w-4 h-4 text-electric-blue" />
              Add More Machines
            </Link>
          )}
        </div>

        {/* Stats Strip */}
        {savedVehicles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">
                Collection Count
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">{savedVehicles.length} Machines</span>
            </div>

            <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1">
                Total Valuation
              </span>
              <span className="text-2xl sm:text-3xl font-black text-electric-blue">
                {formatPrice(totalValueUSD, totalValueINR)}
              </span>
            </div>

            <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-neon-red" />
                Total Power
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalHorsepower.toLocaleString()} HP</span>
            </div>

            <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold block mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Avg 0-100 km/h
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">{avgZeroToHundred}s</span>
            </div>
          </div>
        )}

        {/* Collection Grid or Empty State */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">Unlocking Garage...</p>
          </div>
        ) : savedVehicles.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center max-w-xl mx-auto my-12 border border-white/10">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Your Garage is Empty</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              You haven&apos;t added any machines to your dream garage yet. Explore our ultra-exclusive catalog of hypercars, superbikes, and luxury EVs.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neon-red hover:bg-neon-red/90 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,0,85,0.4)]"
            >
              Explore Machines
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {savedVehicles.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-electric-blue/40 transition-all duration-300"
                >
                  <div className="relative h-56 bg-gunmetal overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => removeFromGarage(car.id)}
                        className="p-2 rounded-xl bg-matte-black/70 backdrop-blur-md border border-white/10 text-gray-400 hover:text-neon-red hover:border-neon-red/40 transition-all"
                        title="Remove from Garage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs text-electric-blue font-bold tracking-widest uppercase block mb-0.5">
                        {car.brandName}
                      </span>
                      <h3 className="text-xl font-black text-white truncate">{car.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-4 text-center">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Power</span>
                        <span className="text-sm font-bold text-white">{car.horsepower} HP</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">0-100</span>
                        <span className="text-sm font-bold text-yellow-400">{car.zeroToHundred}s</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Top Speed</span>
                        <span className="text-sm font-bold text-electric-blue">{car.topSpeed} km/h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Valuation</span>
                        <span className="text-lg font-black text-white">{formatPrice(car.priceUSD, car.priceINR)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCompare(car.id)}
                          className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all"
                        >
                          Battle
                        </button>
                        <Link
                          href={`/vehicles/${car.id}`}
                          className="px-3.5 py-2 rounded-lg bg-electric-blue/10 hover:bg-electric-blue/20 border border-electric-blue/30 text-xs font-bold text-electric-blue transition-all"
                        >
                          Specs
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
