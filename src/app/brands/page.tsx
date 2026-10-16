"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Search, ArrowRight, Gauge, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BrandItem {
  _id: string;
  name: string;
  logoUrl?: string;
  description?: string;
}

interface RawVehicle {
  _id?: string;
  id?: string;
  brand: any;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [vehicles, setVehicles] = useState<RawVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/brands").then((r) => r.json()),
      fetch("/api/vehicles").then((r) => r.json()),
    ])
      .then(([brandsData, vehiclesData]) => {
        if (Array.isArray(brandsData)) setBrands(brandsData);
        if (Array.isArray(vehiclesData)) setVehicles(vehiclesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch brands:", err);
        setLoading(false);
      });
  }, []);

  const getVehicleCount = (brandName: string) => {
    return vehicles.filter((v) => {
      const b = typeof v.brand === "object" ? v.brand?.name : v.brand;
      return b && b.toLowerCase() === brandName.toLowerCase();
    }).length;
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-matte-black text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-xs font-bold tracking-widest uppercase mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              World Elite Constructors
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              ICONIC <span className="text-electric-blue">BRANDS</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Explore the history, engineering philosophy, and vehicle rosters of the world&apos;s most prestigious hypercar and motorcycle marques.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by marque..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-all"
            />
          </div>
        </div>

        {/* Brands Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">Loading Constructors...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto my-12 border border-white/10">
            <p className="text-gray-400 mb-4">No manufacturers found matching &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch("")}
              className="text-electric-blue text-sm font-semibold hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((brand) => {
              const count = getVehicleCount(brand.name);
              return (
                <Link
                  key={brand._id}
                  href={`/vehicles?brand=${encodeURIComponent(brand.name)}`}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-electric-blue/50 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full blur-2xl group-hover:bg-electric-blue/15 transition-all" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {brand.logoUrl ? (
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-white">
                          {brand.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                        {count} {count === 1 ? "Machine" : "Machines"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-electric-blue transition-colors mb-2">
                      {brand.name}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {brand.description || "Pioneering automotive craftsmanship and peak engineering excellence."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                    <span>Explore Fleet</span>
                    <ArrowRight className="w-4 h-4 text-electric-blue group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
