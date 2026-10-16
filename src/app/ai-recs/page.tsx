"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Sparkles, ArrowRight, RotateCcw, Zap, Flame, Shield, Gauge, Check, Heart, Swords } from "lucide-react";
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
  luxuryScore?: number;
  performanceScore?: number;
  comfortScore?: number;
  aggressivenessScore?: number;
  specs?: {
    horsepower?: number;
    topSpeedKmH?: number;
    zeroToHundred?: number;
    fuelType?: string;
    transmission?: string;
  };
}

interface AdvisorVehicle {
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
  performanceScore: number;
  luxuryScore: number;
  comfortScore: number;
  aggressivenessScore: number;
}

export default function AiRecsPage() {
  const { formatPrice, addToGarage, isInGarage, addToCompare } = useApp();
  const [vehicles, setVehicles] = useState<AdvisorVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Wizard State
  const [step, setStep] = useState(1);
  const [preference, setPreference] = useState<string>("track");
  const [budget, setBudget] = useState<string>("any");
  const [powertrain, setPowertrain] = useState<string>("any");
  const [dnaFocus, setDnaFocus] = useState<string>("performance");
  const [isCalculated, setIsCalculated] = useState(false);

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
        console.error("Failed to fetch vehicles for AI advisor:", err);
        setLoading(false);
      });
  }, []);

  // Scoring algorithm based on user selections
  const getScoredVehicles = () => {
    return vehicles
      .map((car) => {
        let matchScore = 70; // baseline

        // Category / Preference bonus
        if (preference === "track" && (car.category === "Hypercars" || car.category === "Track")) matchScore += 18;
        if (preference === "luxury" && car.luxuryScore >= 80) matchScore += 18;
        if (preference === "electric" && (car.fuelType.toLowerCase().includes("electric") || car.category.toLowerCase().includes("electric"))) matchScore += 22;
        if (preference === "bikes" && car.category.toLowerCase().includes("bike")) matchScore += 25;

        // DNA Focus bonus
        if (dnaFocus === "performance") matchScore += Math.round((car.performanceScore / 100) * 10);
        if (dnaFocus === "luxury") matchScore += Math.round((car.luxuryScore / 100) * 10);
        if (dnaFocus === "aggressiveness") matchScore += Math.round((car.aggressivenessScore / 100) * 10);

        // Powertrain preference
        if (powertrain === "electric" && car.fuelType.toLowerCase().includes("electric")) matchScore += 10;
        if (powertrain === "petrol" && car.fuelType.toLowerCase().includes("petrol")) matchScore += 10;

        // Budget preference
        if (budget === "under500k" && car.priceUSD <= 500000) matchScore += 8;
        if (budget === "above2m" && car.priceUSD >= 2000000) matchScore += 10;

        // Cap at 99%
        const finalPercentage = Math.min(Math.max(matchScore, 65), 99);
        return { ...car, matchPercentage: finalPercentage };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const results = isCalculated ? getScoredVehicles() : [];

  const handleCalculate = () => {
    setIsCalculated(true);
  };

  const handleReset = () => {
    setStep(1);
    setIsCalculated(false);
  };

  return (
    <div className="min-h-screen bg-matte-black text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Neural Machine Matching
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-3">
            AI <span className="text-neon-red">ADVISOR</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Answer 4 questions regarding your driving ambition, and our telemetry engine will match you with your soul machine.
          </p>
        </div>

        {!isCalculated ? (
          <div className="glass rounded-3xl p-6 sm:p-10 border border-white/10 max-w-2xl mx-auto">
            {/* Step 1: Driving Desire */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-xs text-electric-blue font-mono uppercase tracking-widest block mb-2">Step 01 / 04</span>
                <h2 className="text-2xl font-black text-white mb-6">What excites you the most?</h2>
                <div className="space-y-3">
                  {[
                    { id: "track", label: "Breaking Track Records & Maximum G-Force", icon: Flame },
                    { id: "luxury", label: "Pure Opulence, Handcrafted Leather & Prestige", icon: Shield },
                    { id: "electric", label: "Instant Electric Torque & Next-Gen Tech", icon: Zap },
                    { id: "bikes", label: "Wind-in-Face Adrenaline on Two Wheels", icon: Gauge },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPreference(opt.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                        preference === opt.id
                          ? "bg-electric-blue/15 border-electric-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <opt.icon className={`w-5 h-5 ${preference === opt.id ? "text-electric-blue" : "text-gray-400"}`} />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </div>
                      {preference === opt.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Target Price */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-xs text-electric-blue font-mono uppercase tracking-widest block mb-2">Step 02 / 04</span>
                <h2 className="text-2xl font-black text-white mb-6">Select your acquisition budget</h2>
                <div className="space-y-3">
                  {[
                    { id: "any", label: "Unlimited — Only Peak Engineering Matters" },
                    { id: "above2m", label: "Ultra Hypercar Tier ($2,000,000+)" },
                    { id: "mid", label: "High Performance Tier ($500,000 - $2,000,000)" },
                    { id: "under500k", label: "Entry Exotic ($100,000 - $500,000)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBudget(opt.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                        budget === opt.id
                          ? "bg-electric-blue/15 border-electric-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {budget === opt.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Powertrain */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-xs text-electric-blue font-mono uppercase tracking-widest block mb-2">Step 03 / 04</span>
                <h2 className="text-2xl font-black text-white mb-6">What powerplant do you crave?</h2>
                <div className="space-y-3">
                  {[
                    { id: "petrol", label: "Internal Combustion (V8, V10, V12 Roar)" },
                    { id: "electric", label: "Pure Electric Propulsion (Silent Shockwave)" },
                    { id: "any", label: "No Preference — Surprise Me with Pure Output" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPowertrain(opt.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                        powertrain === opt.id
                          ? "bg-electric-blue/15 border-electric-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {powertrain === opt.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: DNA Personality */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-xs text-electric-blue font-mono uppercase tracking-widest block mb-2">Step 04 / 04</span>
                <h2 className="text-2xl font-black text-white mb-6">Primary Machine Character</h2>
                <div className="space-y-3">
                  {[
                    { id: "performance", label: "Extreme Velocity & 0-100 Sprints" },
                    { id: "aggressiveness", label: "Menacing Aerodynamics & Presence" },
                    { id: "luxury", label: "First-Class Cockpit Refinement" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDnaFocus(opt.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                        dnaFocus === opt.id
                          ? "bg-neon-red/15 border-neon-red text-white shadow-[0_0_15px_rgba(255,0,85,0.2)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {dnaFocus === opt.id && <Check className="w-4 h-4 text-neon-red" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium transition-all"
                >
                  Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-electric-blue hover:bg-electric-blue/90 text-black font-bold text-sm transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-red hover:bg-neon-red/90 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(255,0,85,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Telemetry
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs text-electric-blue font-mono uppercase tracking-widest block mb-1">
                  Neural Matching Complete
                </span>
                <h2 className="text-2xl font-black text-white">Top Machine Matches</h2>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-gray-300 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.slice(0, 6).map((car, idx) => (
                <div
                  key={car.id}
                  className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-electric-blue/40 transition-all duration-300"
                >
                  <div className="relative h-52 bg-gunmetal overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-matte-black/80 backdrop-blur-md border border-electric-blue/40 text-electric-blue font-black text-xs">
                        {car.matchPercentage}% MATCH
                      </span>
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
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Price</span>
                        <span className="text-base font-black text-white">{formatPrice(car.priceUSD, car.priceINR)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCompare(car.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300"
                          title="Battle"
                        >
                          <Swords className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addToGarage(car.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            isInGarage(car.id)
                              ? "bg-neon-red/20 border-neon-red text-neon-red"
                              : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                          }`}
                          title="Save to Garage"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/vehicles/${car.id}`}
                          className="px-3 py-2 rounded-lg bg-electric-blue/15 hover:bg-electric-blue/25 border border-electric-blue/30 text-xs font-bold text-electric-blue"
                        >
                          Inspect
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
