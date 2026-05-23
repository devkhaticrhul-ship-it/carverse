"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
// Dynamic fetch from API


import VehicleCard, { Vehicle } from "@/components/VehicleCard";
import { SlidersHorizontal, RotateCcw, ArrowUpDown, Grid, List, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function VehiclesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency, formatPrice } = useApp();

  // URL Initial State
  const initialCategory = searchParams.get("category") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialSearch = searchParams.get("search") || "";

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTrans, setSelectedTrans] = useState("");
  
  // Slider Ranges
  const [maxPrice, setMaxPrice] = useState(3000000); // Default USD max
  const [maxHP, setMaxHP] = useState(2000);
  const [maxSpeed, setMaxSpeed] = useState(500);

  // Sorting
  const [sortBy, setSortBy] = useState("default");

  // Sync inputs with URL changes
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialBrand, initialSearch]);

  // Adjust default max price slider if currency is INR vs USD
  useEffect(() => {
    if (currency === "INR") {
      setMaxPrice(250000000); // 25 Crore INR
    } else {
      setMaxPrice(3000000); // 3M USD
    }
  }, [currency]);

  // Filtering Logic
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Get unique categories & brands for filter options
  const allCategories = Array.from(new Set(vehicles.map((v) => v.category)));
  const allBrands = Array.from(new Set(vehicles.map((v) => v.brand)));

useEffect(() => {
  fetch('/api/vehicles')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch vehicles: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      // Normalize data shape expected by the UI
      const normalized = (data as any[]).map((v) => ({
        id: v._id ?? v.id,
        name: v.name,
        brand: v.brand?.name || v.brand || '',
        category: v.category,
        priceUSD: v.priceUSD ?? v.price,
        priceINR: v.priceINR ?? (v.priceUSD ? v.priceUSD * 83 : 0),
        horsepower: v.specs?.horsepower ?? v.horsepower ?? 0,
        topSpeed: v.specs?.topSpeedKmH ?? v.topSpeed ?? 0,
        acceleration: v.specs?.zeroToHundred ?? v.acceleration ?? 0,
        fuelType: v.specs?.fuelType ?? v.fuelType ?? '',
        transmission: v.specs?.transmission ?? v.transmission ?? '',
        image: v.imageUrl ?? v.image ?? '',
        dna: v.dna ?? {
          performance: 0,
          luxury: 0,
          comfort: 0,
          aggression: 0,
          technology: 0,
          practicality: 0,
        },
      }));
      setVehicles(normalized);
    })
    .catch((err) => console.error('Failed to load vehicles', err));
}, []);

  // Handle resets
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedFuel("");
    setSelectedTrans("");
    setMaxHP(2000);
    setMaxSpeed(500);
    if (currency === "INR") {
      setMaxPrice(250000000);
    } else {
      setMaxPrice(3000000);
    }
    setSortBy("default");
    router.replace("/vehicles");
  };
  // Vehicles data state


const filteredVehicles = vehicles.filter((vehicle) => {
    // 1. Text Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        vehicle.name.toLowerCase().includes(q) ||
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.category.toLowerCase().includes(q) ||
        vehicle.engine.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Category
    if (selectedCategory && vehicle.category !== selectedCategory) {
      return false;
    }

    // 3. Brand
    if (selectedBrand && vehicle.brand !== selectedBrand) {
      return false;
    }

    // 4. Fuel type
    if (selectedFuel && vehicle.fuelType !== selectedFuel) {
      return false;
    }

    // 5. Transmission
    if (selectedTrans) {
      if (selectedTrans === "Manual" && !vehicle.transmission.toLowerCase().includes("manual")) return false;
      if (selectedTrans === "Automatic" && vehicle.transmission.toLowerCase().includes("manual")) return false;
    }

    // 6. Price Slider
    if (currency === "INR") {
      if (vehicle.priceINR > maxPrice) return false;
    } else {
      if (vehicle.priceUSD > maxPrice) return false;
    }

    // 7. Horsepower
    if (vehicle.horsepower > maxHP) return false;

    // 8. Top speed
    if (vehicle.topSpeed > maxSpeed) return false;

    return true;
  }) as Vehicle[];

  // Sorting Logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return currency === "INR" ? a.priceINR - b.priceINR : a.priceUSD - b.priceUSD;
      case "price-desc":
        return currency === "INR" ? b.priceINR - a.priceINR : b.priceUSD - a.priceUSD;
      case "power-desc":
        return b.horsepower - a.horsepower;
      case "acc-asc":
        return a.acceleration - b.acceleration;
      case "speed-desc":
        return b.topSpeed - a.topSpeed;
      default:
        return 0; // Natural JSON order
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow flex flex-col">
      {/* Page Header */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-electric-blue">Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          THE MACHINE <span className="text-electric-blue">ARCHIVE</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Explore complete specification profiles. Use the filter panel to narrow down by price, horsepower, or drivetrain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Filter Control Board */}
        <aside className="lg:col-span-1 p-6 rounded-2xl bg-gunmetal/60 border border-white/5 sticky top-24 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-electric-blue" />
              FILTERS
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-gray-400 hover:text-neon-red flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-matte-black/80 border border-white/10 text-white text-sm focus:outline-none focus:border-electric-blue/40"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-matte-black/80 border border-white/10 text-white text-sm focus:outline-none focus:border-electric-blue/40"
            >
              <option value="">All Brands</option>
              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Fuel Type</label>
            <div className="flex flex-wrap gap-1.5">
              {["Petrol", "Electric", "Hybrid"].map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(selectedFuel === fuel ? "" : fuel)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedFuel === fuel
                      ? "bg-neon-red/10 border-neon-red text-neon-red"
                      : "border-white/5 bg-matte-black/40 text-gray-400 hover:text-white"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Transmission</label>
            <div className="flex gap-2">
              {["Automatic", "Manual"].map((trans) => (
                <button
                  key={trans}
                  onClick={() => setSelectedTrans(selectedTrans === trans ? "" : trans)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedTrans === trans
                      ? "bg-electric-blue/10 border-electric-blue text-electric-blue"
                      : "border-white/5 bg-matte-black/40 text-gray-400 hover:text-white"
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Max Price</span>
              <span className="font-extrabold text-electric-blue">
                {currency === "INR"
                  ? formatPrice(maxPrice / 83, maxPrice) // Approximate formatting conversion
                  : formatPrice(maxPrice, maxPrice * 83)}
              </span>
            </div>
            <input
              type="range"
              min={currency === "INR" ? 5000000 : 50000}
              max={currency === "INR" ? 250000000 : 3000000}
              step={currency === "INR" ? 5000000 : 25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-electric-blue bg-matte-black h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Horsepower Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Max Horsepower</span>
              <span className="font-extrabold text-neon-red">{maxHP} HP</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={maxHP}
              onChange={(e) => setMaxHP(Number(e.target.value))}
              className="w-full accent-neon-red bg-matte-black h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Top Speed Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Max Speed</span>
              <span className="font-extrabold text-emerald-400">{maxSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="150"
              max="500"
              step="10"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-matte-black h-1 rounded-full cursor-pointer"
            />
          </div>
        </aside>

        {/* Right Side: Search Results & Grid */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-2xl bg-gunmetal/40 border border-white/5">
            {/* Inner Search Box */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, engine sizes, tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-matte-black/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-electric-blue/40"
              />
            </div>

            {/* Sorter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-matte-black/60 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-electric-blue/40"
              >
                <option value="default">Default Catalog</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="power-desc">Horsepower: High to Low</option>
                <option value="acc-asc">0-100 Acceleration: Fastest</option>
                <option value="speed-desc">Top Speed: Highest</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-gray-500 uppercase">{sortedVehicles.length} results</span>
            {selectedCategory && (
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("")} className="hover:text-neon-red text-gray-500">×</button>
              </span>
            )}
            {selectedBrand && (
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand("")} className="hover:text-neon-red text-gray-500">×</button>
              </span>
            )}
            {selectedFuel && (
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                Fuel: {selectedFuel}
                <button onClick={() => setSelectedFuel("")} className="hover:text-neon-red text-gray-500">×</button>
              </span>
            )}
            {selectedTrans && (
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                Shift: {selectedTrans}
                <button onClick={() => setSelectedTrans("")} className="hover:text-neon-red text-gray-500">×</button>
              </span>
            )}
          </div>

          {/* Vehicle Cards Grid */}
          {sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 px-8 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center bg-gunmetal/20"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-4 text-xl font-bold">
                !
              </div>
              <h3 className="text-xl font-bold text-white uppercase">No Machines Match</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                We couldn't find any vehicles in our database fitting those filters. Try broadening your parameters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-3 rounded-xl bg-electric-blue text-matte-black font-black text-xs tracking-wider uppercase hover:shadow-lg hover:shadow-electric-blue/15 transition-all"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function VehiclesCatalog() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-400">
        Loading Vehicle Database...
      </div>
    }>
      <VehiclesCatalogContent />
    </Suspense>
  );
}
