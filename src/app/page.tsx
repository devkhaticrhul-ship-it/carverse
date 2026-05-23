"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Swords, Sparkles, SlidersHorizontal, Zap, Award, TrendingUp, ShieldAlert, ArrowRight, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleCard, { Vehicle } from "@/components/VehicleCard";
import { useApp } from "@/context/AppContext";
import db from "@/data/vehicles.json";

export default function Home() {
  const router = useRouter();
  const { formatPrice } = useApp();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // DNA Explorer state
  const [selectedDnaVehicle, setSelectedDnaVehicle] = useState<Vehicle>(db.vehicles[0]);

  // Categories list
  const categories = [
    { name: "Hypercars", count: 3, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600", desc: "Speed without boundaries" },
    { name: "Luxury Cars", count: 1, image: "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=600", desc: "Absolute road comfort" },
    { name: "SUVs", count: 2, image: "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?q=80&w=600", desc: "Rugged utility & speed" },
    { name: "Electric Vehicles", count: 3, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600", desc: "Futuristic silent power" },
    { name: "Bikes", count: 2, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600", desc: "Pure two-wheeled adrenaline" },
    { name: "Vintage Cars", count: 1, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600", desc: "Timeless classic machines" }
  ];

  // Featured vehicles (Jesko, SF90, Spectre, Nevera)
  const featuredVehicles = db.vehicles.slice(0, 4) as Vehicle[];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = db.vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.brand.toLowerCase().includes(query) ||
          v.category.toLowerCase().includes(query)
      ) as Vehicle[];
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col w-full bg-matte-black text-foreground">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-12 pb-20">
        {/* Background Gradients & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-electric-blue/10 via-transparent to-transparent z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-red/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-electric-blue/5 blur-[120px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Glowing Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 backdrop-blur-md mb-6 hover:border-electric-blue/30 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-electric-blue" />
            <span>GLOBAL VEHICLE INTELLIGENCE PLATFORM</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance leading-[1.1]"
          >
            Explore Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-white to-neon-red">
              Machine Ever Created
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mb-10 text-balance"
          >
            Delve into complete technical specifications, analyze vehicle performance metrics, compare engineering stats side-by-side, and craft your ultimate Dream Garage.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
          >
            <Link
              href="/vehicles"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-electric-blue to-cyan-500 text-matte-black font-black text-sm tracking-wide shadow-lg hover:shadow-electric-blue/20 transition-all active:scale-98"
            >
              EXPLORE VEHICLES
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 hover:border-white/20 transition-all active:scale-98"
            >
              <Swords className="w-4 h-4 text-neon-red" />
              BATTLE ARENA
            </Link>
          </motion.div>

          {/* 2. Global Autocomplete Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-2xl px-4 relative z-50"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-5 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search specs, e.g., 'Jesko Absolut', 'Fastest electric', 'SUV'..."
                className="w-full pl-12 pr-28 py-4 sm:py-5 rounded-2xl bg-gunmetal/80 border border-white/10 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/20 shadow-2xl backdrop-blur-md transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Suggestions Panel */}
            <AnimatePresence>
              {isFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-4 right-4 mt-2 rounded-2xl bg-gunmetal border border-white/10 overflow-hidden shadow-2xl z-50 text-left"
                >
                  <div className="py-2 px-3 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    <span>Matching Vehicles</span>
                    <SlidersHorizontal className="w-3 h-3 text-electric-blue" />
                  </div>
                  <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                    {searchResults.map((v) => (
                      <Link
                        key={v.id}
                        href={`/vehicles/${v.id}`}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                      >
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-12 h-10 object-cover rounded-lg bg-matte-black border border-white/5"
                        />
                        <div className="flex-grow">
                          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{v.brand}</div>
                          <div className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">
                            {v.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-white">
                            {formatPrice(v.priceUSD, v.priceINR)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">
                            {v.horsepower} HP | {v.category}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 bg-white/5 border-t border-white/5 text-center">
                    <Link
                      href={`/vehicles?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsFocused(false)}
                      className="text-xs font-bold text-electric-blue hover:underline flex items-center justify-center gap-1"
                    >
                      View all matching results <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. Category Selector Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-20">
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              Browse by <span className="text-electric-blue">Category</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Explore specific engineering families built for track, street, or dirt.</p>
          </div>
          <Link
            href="/vehicles"
            className="text-sm font-bold text-neon-red hover:text-white flex items-center justify-center md:justify-start gap-1 transition-colors self-center md:self-end"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={`/vehicles?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-48 rounded-2xl overflow-hidden block border border-white/5 glass-hover-red"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/40 to-transparent z-10" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute bottom-5 left-5 z-20">
                  <span className="text-[10px] font-bold text-neon-red tracking-widest uppercase">
                    {cat.count} AVAILABLE
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-neon-red transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.desc}
                  </p>
                </div>
                <div className="absolute bottom-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-red group-hover:text-white group-hover:border-neon-red transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Interactive DNA System Showcase */}
      <section className="py-20 bg-gunmetal/30 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visualizer Side */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/20 text-xs font-bold text-neon-red">
                <Activity className="w-3.5 h-3.5" />
                <span>DYNAMIC VEHICLE DNA SYSTEM</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                Unlock Every Car's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-electric-blue">
                  Engineering Blueprint
                </span>
              </h2>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                Automobiles are more than simple statistics. Our DNA rating maps six core traits (Performance, Luxury, Comfort, Aggression, Technology, and Practicality) to let you compare structural design paradigms instantly.
              </p>

              {/* Vehicle selectors */}
              <div className="pt-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">
                  SELECT VEHICLE TO ANALYZE
                </span>
                <div className="flex flex-wrap gap-2">
                  {db.vehicles.slice(0, 5).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedDnaVehicle(v as Vehicle)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedDnaVehicle.id === v.id
                          ? "bg-electric-blue/15 border-electric-blue text-electric-blue shadow-lg shadow-electric-blue/10"
                          : "border-white/5 bg-matte-black/40 text-gray-400 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Bars Cards */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gunmetal/60 border border-white/5 glass backdrop-blur-lg">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">{selectedDnaVehicle.brand}</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{selectedDnaVehicle.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400">VALUATION</span>
                  <div className="text-lg font-black text-electric-blue">
                    {formatPrice(selectedDnaVehicle.priceUSD, selectedDnaVehicle.priceINR)}
                  </div>
                </div>
              </div>

              {/* DNA Bars */}
              <div className="space-y-4">
                {[
                  { key: "performance", label: "Performance", color: "from-neon-red to-orange-500" },
                  { key: "luxury", label: "Luxury", color: "from-amber-400 to-yellow-600" },
                  { key: "comfort", label: "Comfort", color: "from-teal-400 to-emerald-500" },
                  { key: "aggression", label: "Aggression", color: "from-red-600 to-neon-red" },
                  { key: "technology", label: "Technology", color: "from-electric-blue to-indigo-500" },
                  { key: "practicality", label: "Practicality", color: "from-blue-500 to-teal-500" },
                ].map((item) => {
                  const score = selectedDnaVehicle.dna[item.key as keyof typeof selectedDnaVehicle.dna] || 0;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-300">{item.label}</span>
                        <span className="font-extrabold text-white">{score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-matte-black/60 overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between items-center text-xs">
                <span className="text-gray-500">Spec Matrix: {selectedDnaVehicle.engine}</span>
                <Link
                  href={`/vehicles/${selectedDnaVehicle.id}`}
                  className="text-electric-blue font-bold hover:underline flex items-center gap-0.5"
                >
                  View Full Specs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending / Featured Vehicles Slider */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-neon-red" />
              <span className="text-xs font-bold text-neon-red uppercase tracking-widest">FEATURED RELEASES</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
              Trending <span className="text-neon-red">Machines</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">High-performance engineering taking center stage globally.</p>
          </div>
          <Link
            href="/vehicles"
            className="text-sm font-bold text-electric-blue hover:text-white flex items-center gap-1 transition-colors self-start sm:self-end"
          >
            Explore Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* 6. Top Brands Showcase */}
      <section className="py-20 bg-[#0a0a0c] border-t border-white/5 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-electric-blue" />
            <span className="text-xs font-bold text-electric-blue uppercase tracking-widest">WORLD-CLASS PEDIGREE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-4">
            Curated Automotive Giants
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-12">
            Showcasing history-defining makers, from Italian racing houses to futuristic electric platforms.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {db.brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.name}
                href={`/vehicles?brand=${encodeURIComponent(brand.name)}`}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gunmetal/40 border border-white/5 hover:border-electric-blue/30 hover:bg-gunmetal/80 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{brand.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">{brand.country}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
