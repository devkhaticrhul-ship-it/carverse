"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Swords, Heart, Activity, Gauge, Flame, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  year: number;
  priceUSD: number;
  priceINR: number;
  horsepower: number;
  torque: number;
  topSpeed: number;
  acceleration: number;
  fuelType: string;
  bodyType: string;
  engine: string;
  transmission: string;
  mileage: string;
  image: string;
  description: string;
  features: string[];
  dna: {
    performance: number;
    luxury: number;
    comfort: number;
    aggression: number;
    technology: number;
    practicality: number;
  };
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { formatPrice, garage, addToGarage, removeFromGarage, isInGarage, compareList, addToCompare, removeFromCompare, isInCompare } = useApp();

  const isFav = isInGarage(vehicle.id);
  const isCompared = isInCompare(vehicle.id);

  const handleGarageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromGarage(vehicle.id);
    } else {
      addToGarage(vehicle.id);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(vehicle.id);
    } else {
      addToCompare(vehicle.id);
    }
  };

  const dna = vehicle.dna ?? { performance: 0, luxury: 0, technology: 0, comfort: 0, aggression: 0, practicality: 0 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-2xl bg-gunmetal/60 border border-white/5 overflow-hidden backdrop-blur-md glass-hover hover:border-electric-blue/40"
    >
      {/* Image Panel */}
      <Link href={`/vehicles/${vehicle.id}`} className="block relative h-52 sm:h-56 overflow-hidden">
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/20 to-transparent z-10 opacity-80" />
        
        {/* Glow Hover */}
        <div className="absolute inset-0 bg-electric-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Category Tag */}
        <span className="absolute top-4 left-4 z-20 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md bg-matte-black/80 border border-white/10 text-white backdrop-blur-sm">
          {vehicle.category}
        </span>

        {/* Price tag */}
        <span className="absolute bottom-4 right-4 z-20 px-3 py-1 text-sm font-extrabold rounded-lg bg-electric-blue text-matte-black shadow-lg shadow-electric-blue/20">
          {formatPrice(vehicle.priceUSD, vehicle.priceINR)}
        </span>

        {/* Main Image */}
        <img
          src={vehicle.image || "/placeholder-car.jpg"}
          alt={`${vehicle.brand} ${vehicle.name}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
      </Link>

      {/* Info & Stats Panel */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        {/* Header */}
        <div className="mb-4">
          <Link href={`/vehicles/${vehicle.id}`} className="hover:text-electric-blue transition-colors">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {vehicle.brand}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5 group-hover:text-electric-blue transition-colors">
              {vehicle.name}
            </h3>
          </Link>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-matte-black/50 border border-white/5 text-center mb-4">
          <div className="flex flex-col items-center">
            <Flame className="w-3.5 h-3.5 text-neon-red mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Power</span>
            <span className="text-xs font-bold text-gray-200">{vehicle.horsepower} HP</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/5">
            <Gauge className="w-3.5 h-3.5 text-electric-blue mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">0-100</span>
            <span className="text-xs font-bold text-gray-200">{vehicle.acceleration}s</span>
          </div>
          <div className="flex flex-col items-center">
            <Navigation className="w-3.5 h-3.5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Top Spd</span>
            <span className="text-xs font-bold text-gray-200">{vehicle.topSpeed} km/h</span>
          </div>
        </div>

        {/* DNA Snapshot (Mini Bars) */}
        <div className="space-y-2 mb-5">


          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-500">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-neon-red" /> Performance DNA</span>
            <span className="text-gray-300">{dna.performance}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-red to-electric-blue"
              style={{ width: `${dna.performance}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>Luxury: {dna.luxury}%</span>
            <span>Tech: {dna.technology}%</span>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="flex gap-2">
          {/* Battle Arena Comparison Toggle */}
          <button
            onClick={handleCompareClick}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 ${
              isCompared
                ? "bg-electric-blue/15 border-electric-blue text-electric-blue hover:bg-electric-blue/20"
                : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <Swords className={`w-3.5 h-3.5 ${isCompared ? "animate-pulse" : ""}`} />
            {isCompared ? "In Arena" : "Compare"}
          </button>

          {/* Dream Garage Toggle */}
          <button
            onClick={handleGarageClick}
            className={`px-3 py-2.5 rounded-xl border transition-all duration-300 ${
              isFav
                ? "bg-neon-red/15 border-neon-red text-neon-red hover:bg-neon-red/20"
                : "border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5"
            }`}
            aria-label="Save to Garage"
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-neon-red" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
