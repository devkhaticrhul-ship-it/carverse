"use client";

import React from 'react';
import { Activity, Shield, Zap, Sparkles, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface DnaScores {
  performanceScore: number;
  luxuryScore: number;
  comfortScore: number;
  aggressivenessScore: number;
}

interface VehicleDnaProps {
  scores: DnaScores;
}

export default function VehicleDna({ scores }: VehicleDnaProps) {
  const dnaAttributes = [
    { label: 'Performance', score: scores.performanceScore, icon: Zap, color: 'text-neon-red', bg: 'bg-neon-red', gradient: 'from-neon-red to-electric-blue' },
    { label: 'Luxury', score: scores.luxuryScore, icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-400', gradient: 'from-yellow-400 to-amber-600' },
    { label: 'Comfort', score: scores.comfortScore, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400', gradient: 'from-blue-400 to-electric-blue' },
    { label: 'Aggression', score: scores.aggressivenessScore, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500', gradient: 'from-purple-500 to-neon-red' },
  ];

  return (
    <div className="bg-gunmetal/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-electric-blue" />
        Vehicle DNA
      </h3>
      
      <div className="space-y-5">
        {dnaAttributes.map((attr, index) => {
          const Icon = attr.icon;
          return (
            <div key={attr.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  <Icon className={`w-4 h-4 ${attr.color}`} />
                  {attr.label}
                </span>
                <span className="text-sm font-bold text-white">{attr.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${attr.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${attr.gradient}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
