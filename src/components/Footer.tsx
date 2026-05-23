"use client";

import React from "react";
import Link from "next/link";
import { GitBranch, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-xl font-black tracking-wider text-white uppercase">
                CAR<span className="text-neon-red group-hover:text-electric-blue transition-colors duration-300">VERSE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Explore every machine ever created. The ultimate cinematic platform for vehicle specifications, comparison, and intelligence.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-electric-blue text-gray-400 hover:text-electric-blue transition-all duration-200" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-neon-red text-gray-400 hover:text-neon-red transition-all duration-200" aria-label="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white text-gray-400 hover:text-white transition-all duration-200">
                <GitBranch className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Core Directory</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/vehicles" className="hover:text-electric-blue flex items-center gap-1 transition-colors">
                  All Vehicles <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-electric-blue flex items-center gap-1 transition-colors">
                  Top Brands <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-electric-blue flex items-center gap-1 transition-colors">
                  Battle Arena <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/garage" className="hover:text-electric-blue flex items-center gap-1 transition-colors">
                  Dream Garage <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/vehicles?category=Hypercars" className="hover:text-neon-red transition-colors">Hypercars</Link></li>
              <li><Link href="/vehicles?category=Luxury Cars" className="hover:text-neon-red transition-colors">Luxury Cars</Link></li>
              <li><Link href="/vehicles?category=Electric Vehicles" className="hover:text-neon-red transition-colors">EVs & Clean Power</Link></li>
              <li><Link href="/vehicles?category=SUVs" className="hover:text-neon-red transition-colors">Performance SUVs</Link></li>
              <li><Link href="/vehicles?category=Bikes" className="hover:text-neon-red transition-colors">Superbikes</Link></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Ecosystem</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/ai-recs" className="hover:text-white transition-colors">AI Recommendation</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sponsorships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Platform Status</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 my-8" />

        {/* Bottom Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Carverse Platform. Built for automotive enthusiasts with</span>
            <Heart className="w-3.5 h-3.5 text-neon-red fill-neon-red animate-pulse" />
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">DMCA Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
