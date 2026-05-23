"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useApp } from "@/context/AppContext";
import { Menu, X, ShieldAlert, Swords, Heart, Sparkles, Box, DollarSign, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currency, setCurrency, garage, compareList } = useApp();

  const navLinks = [
    { href: "/vehicles", label: "Explore", icon: Box },
    { href: "/compare", label: "Battle Arena", icon: Swords, badge: compareList.length },
    { href: "/garage", label: "Dream Garage", icon: Heart, badge: garage.length },
    { href: "/ai-recs", label: "AI Advisor", icon: Sparkles },
    { href: "/brands", label: "Brands", icon: ShieldAlert },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 group">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
                CAR<span className="text-neon-red group-hover:text-electric-blue transition-colors duration-300">VERSE</span>
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-neon-red group-hover:bg-electric-blue group-hover:animate-ping transition-colors duration-300" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-electric-blue bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1 flex h-4.5 min-w-4.5 px-1.5 items-center justify-center rounded-full bg-neon-red text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center bg-matte-black border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  currency === "USD"
                    ? "bg-electric-blue text-matte-black shadow-md shadow-electric-blue/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  currency === "INR"
                    ? "bg-neon-red text-white shadow-md shadow-neon-red/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                INR (₹)
              </button>
            </div>
            
            {/* User Auth Section */}
            <div className="flex items-center ml-2 border-l border-white/10 pl-6">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-neon-red transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-blue text-matte-black text-sm font-bold hover:bg-electric-blue/90 shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Currency Switcher */}
            <button
              onClick={() => setCurrency(currency === "USD" ? "INR" : "USD")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-bold bg-white/5 text-gray-300 active:scale-95"
            >
              <DollarSign className="w-3.5 h-3.5" />
              {currency}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-white/5 bg-matte-black"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium ${
                      isActive
                        ? "text-electric-blue bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-neon-red text-xs font-bold text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Button */}
              <div className="mt-4 pt-4 border-t border-white/5 px-3">
                {session ? (
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-neon-red bg-neon-red/10"
                  >
                    <User className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-electric-blue text-matte-black text-base font-bold shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
