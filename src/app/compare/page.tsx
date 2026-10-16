"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Swords, Plus, Trash2, Trophy, Zap, Gauge, Flame, Shield, ArrowRight, RotateCcw } from "lucide-react";
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
  performanceScore?: number;
  luxuryScore?: number;
  comfortScore?: number;
  aggressivenessScore?: number;
  specs?: {
    horsepower?: number;
    topSpeedKmH?: number;
    zeroToHundred?: number;
    fuelType?: string;
    transmission?: string;
    engine?: string;
    torque?: number;
  };
}

interface NormalizedVehicle {
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
  transmission: string;
  engine: string;
  torque: number;
  performanceScore: number;
  luxuryScore: number;
  comfortScore: number;
  aggressivenessScore: number;
}

function BattleArenaContent() {
  const searchParams = useSearchParams();
  const { compareList, removeFromCompare, clearCompare, addToCompare, formatPrice } = useApp();
  const [vehicles, setVehicles] = useState<NormalizedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectorOpenIndex, setSelectorOpenIndex] = useState<number | null>(null);

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
            transmission: v.specs?.transmission ?? "Automatic",
            engine: v.specs?.engine ?? "Twin-Turbo",
            torque: v.specs?.torque ?? 0,
            performanceScore: v.performanceScore ?? 80,
            luxuryScore: v.luxuryScore ?? 75,
            comfortScore: v.comfortScore ?? 60,
            aggressivenessScore: v.aggressivenessScore ?? 85,
          }));
          setVehicles(norm);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch vehicles for compare:", err);
        setLoading(false);
      });
  }, []);

  // Sync compareList from context or URL params
  useEffect(() => {
    const paramIds = searchParams.get("ids")?.split(",").filter(Boolean) || [];
    if (paramIds.length > 0) {
      setSelectedIds(paramIds);
    } else if (compareList.length > 0) {
      setSelectedIds(compareList);
    } else if (vehicles.length >= 2 && selectedIds.length === 0) {
      // Default to first 2 machines if nothing is chosen
      setSelectedIds([vehicles[0].id, vehicles[1].id]);
    }
  }, [compareList, searchParams, vehicles]);

  const activeVehicles = selectedIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is NormalizedVehicle => v !== undefined);

  const handleSelectVehicle = (slotIndex: number, newId: string) => {
    const updated = [...selectedIds];
    updated[slotIndex] = newId;
    setSelectedIds(updated);
    setSelectorOpenIndex(null);
  };

  const handleRemoveSlot = (index: number) => {
    const removedId = selectedIds[index];
    const updated = selectedIds.filter((_, i) => i !== index);
    setSelectedIds(updated);
    if (removedId) removeFromCompare(removedId);
  };

  const handleAddSlot = () => {
    const unselected = vehicles.find((v) => !selectedIds.includes(v.id));
    if (unselected) {
      setSelectedIds([...selectedIds, unselected.id]);
    }
  };

  // Find winners for key stats
  const maxHp = Math.max(...activeVehicles.map((v) => v.horsepower), 0);
  const minZeroToHundred = Math.min(...activeVehicles.map((v) => v.zeroToHundred || 999));
  const maxTopSpeed = Math.max(...activeVehicles.map((v) => v.topSpeed), 0);

  return (
    <div className="min-h-screen bg-matte-black text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red text-xs font-bold tracking-widest uppercase mb-3">
              <Swords className="w-3.5 h-3.5" />
              Head-to-Head Arena
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              BATTLE <span className="text-electric-blue">ARENA</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Pitch the world&apos;s greatest engineering feats against each other in real-time telemetry analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                  setSelectedIds([]);
                  clearCompare();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-neon-red transition-all text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Arena
              </button>
            )}
            {selectedIds.length < 4 && vehicles.length > selectedIds.length && (
              <button
                onClick={handleAddSlot}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-blue/10 border border-electric-blue/30 text-electric-blue hover:bg-electric-blue/20 transition-all text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Competitor
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">Loading machine telemetry...</p>
          </div>
        ) : activeVehicles.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center max-w-xl mx-auto my-12 border border-white/10">
            <Swords className="w-16 h-16 text-electric-blue/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Machines in the Arena</h2>
            <p className="text-gray-400 text-sm mb-6">
              Pick vehicles from the catalog or load a quick matchup below to see side-by-side performance metrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {vehicles.length >= 2 && (
                <button
                  onClick={() => setSelectedIds([vehicles[0].id, vehicles[1].id])}
                  className="px-6 py-3 rounded-xl bg-electric-blue text-black font-bold hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all"
                >
                  Load Quick Matchup
                </button>
              )}
              <Link
                href="/vehicles"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Machine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeVehicles.map((car, idx) => (
                <div
                  key={car.id}
                  className="glass rounded-2xl p-5 border border-white/10 relative flex flex-col justify-between group hover:border-electric-blue/40 transition-all"
                >
                  {/* Top Bar with Slot & Remove */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                      Fighter 0{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-gray-500 hover:text-neon-red transition-colors p-1"
                      title="Remove from Battle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-gunmetal">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-xs text-electric-blue font-bold tracking-wider uppercase">
                        {car.brandName}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight truncate">{car.name}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Base Price</span>
                    <span className="text-xl font-black text-white">{formatPrice(car.priceUSD, car.priceINR)}</span>
                  </div>

                  {/* Swap Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectorOpenIndex(selectorOpenIndex === idx ? null : idx)}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center justify-between transition-all"
                    >
                      <span>Swap Machine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {selectorOpenIndex === idx && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 max-h-56 overflow-y-auto glass rounded-xl border border-white/20 p-2 z-30 shadow-2xl space-y-1">
                        {vehicles.map((v) => (
                          <button
                            key={v.id}
                            disabled={selectedIds.includes(v.id)}
                            onClick={() => handleSelectVehicle(idx, v.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              v.id === car.id
                                ? "bg-electric-blue text-black font-bold"
                                : selectedIds.includes(v.id)
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span className="text-gray-400 block text-[10px]">{v.brandName}</span>
                            {v.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Telemetry Comparison Table */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 overflow-x-auto">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-electric-blue" />
                Telemetry Breakdown
              </h2>

              <div className="min-w-[600px] space-y-6">
                {/* Horsepower */}
                <div className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-neon-red" />
                      Horsepower (HP)
                    </span>
                    <span className="text-xs text-gray-500 font-mono uppercase">Higher is better</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeVehicles.map((car) => {
                      const isWinner = car.horsepower === maxHp && maxHp > 0;
                      return (
                        <div
                          key={car.id}
                          className={`p-3 rounded-xl border ${
                            isWinner ? "bg-neon-red/10 border-neon-red/40" : "bg-white/5 border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-white">{car.horsepower} HP</span>
                            {isWinner && <Trophy className="w-4 h-4 text-neon-red animate-pulse" />}
                          </div>
                          <span className="text-[11px] text-gray-400 block truncate">{car.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 0-100 km/h */}
                <div className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      0-100 km/h (Seconds)
                    </span>
                    <span className="text-xs text-gray-500 font-mono uppercase">Lower is faster</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeVehicles.map((car) => {
                      const isWinner = car.zeroToHundred === minZeroToHundred && minZeroToHundred < 999;
                      return (
                        <div
                          key={car.id}
                          className={`p-3 rounded-xl border ${
                            isWinner ? "bg-yellow-400/10 border-yellow-400/40" : "bg-white/5 border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-white">{car.zeroToHundred}s</span>
                            {isWinner && <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />}
                          </div>
                          <span className="text-[11px] text-gray-400 block truncate">{car.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Speed */}
                <div className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-electric-blue" />
                      Top Speed (km/h)
                    </span>
                    <span className="text-xs text-gray-500 font-mono uppercase">Higher is better</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeVehicles.map((car) => {
                      const isWinner = car.topSpeed === maxTopSpeed && maxTopSpeed > 0;
                      return (
                        <div
                          key={car.id}
                          className={`p-3 rounded-xl border ${
                            isWinner ? "bg-electric-blue/10 border-electric-blue/40" : "bg-white/5 border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-white">{car.topSpeed} km/h</span>
                            {isWinner && <Trophy className="w-4 h-4 text-electric-blue animate-pulse" />}
                          </div>
                          <span className="text-[11px] text-gray-400 block truncate">{car.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Drivetrain & Fuel */}
                <div>
                  <span className="text-sm font-bold text-gray-300 block mb-3">Transmission & Powertrain</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeVehicles.map((car) => (
                      <div key={car.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-xs font-semibold text-white block">{car.fuelType}</span>
                        <span className="text-[11px] text-gray-400 block leading-tight">{car.transmission}</span>
                        <span className="text-[10px] text-gray-500 block">{car.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-matte-black pt-24 text-center text-gray-400">Loading Battle Arena...</div>}>
      <BattleArenaContent />
    </Suspense>
  );
}
