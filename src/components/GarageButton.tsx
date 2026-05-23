"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Heart } from 'lucide-react';

interface GarageButtonProps {
  vehicleId: string;
}

export default function GarageButton({ vehicleId }: GarageButtonProps) {
  const { isInGarage, addToGarage, removeFromGarage } = useApp();
  const isFav = isInGarage(vehicleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFromGarage(vehicleId);
    } else {
      addToGarage(vehicleId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
        isFav
          ? "bg-neon-red/15 border border-neon-red text-neon-red hover:bg-neon-red/20 shadow-[0_0_15px_rgba(255,0,85,0.2)]"
          : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30"
      }`}
    >
      <Heart className={`w-5 h-5 ${isFav ? "fill-neon-red" : ""}`} />
      {isFav ? "In Dream Garage" : "Add to Garage"}
    </button>
  );
}
