import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Flame, Gauge, Navigation, Zap, Calendar, Settings } from 'lucide-react';
import VehicleDna from '@/components/VehicleDna';
import GarageButton from '@/components/GarageButton';

async function getVehicle(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/vehicles/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch vehicle');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function VehicleDetailsPage({ params }: { params: { id: string } }) {
  // Await params if needed in Next 15+, but for Next 13/14 it's okay sync, although we can just await it safely
  const { id } = await params;
  const vehicle = await getVehicle(id);

  if (!vehicle) {
    notFound();
  }

  // Format price (assuming stored in USD cents)
  const priceUSD = (vehicle.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white pt-24 pb-16">
      {/* Cinematic Hero Image */}
      <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[70vh] -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0c]/60 to-[#0b0b0c] z-10" />
        <img 
          src={vehicle.imageUrl} 
          alt={vehicle.name} 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb / Back Navigation */}
        <Link 
          href="/vehicles" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-electric-blue transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold tracking-wide uppercase text-sm">Back to Catalog</span>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-electric-blue backdrop-blur-sm">
              {vehicle.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
              <span className="text-gray-400 font-light block text-2xl md:text-3xl mb-1">{vehicle.brand?.name || vehicle.brand || 'Brand'}</span>
              {vehicle.name}
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end">
            <span className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-1">Starting at</span>
            <div className="text-3xl md:text-4xl font-extrabold text-neon-red drop-shadow-[0_0_15px_rgba(255,0,85,0.3)]">
              {priceUSD}
            </div>
            <GarageButton vehicleId={vehicle._id} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Specs Matrix */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gunmetal/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-electric-blue" />
                Technical Specifications
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Spec items */}
                <div className="flex flex-col">
                  <Flame className="w-6 h-6 text-neon-red mb-2" />
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Power</span>
                  <span className="text-xl font-bold">{vehicle.specs?.horsepower || 'N/A'} HP</span>
                </div>
                
                <div className="flex flex-col">
                  <Gauge className="w-6 h-6 text-electric-blue mb-2" />
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">0-100 km/h</span>
                  <span className="text-xl font-bold">{vehicle.specs?.zeroToHundred || 'N/A'}s</span>
                </div>
                
                <div className="flex flex-col">
                  <Navigation className="w-6 h-6 text-emerald-400 mb-2" />
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Top Speed</span>
                  <span className="text-xl font-bold">{vehicle.specs?.topSpeedKmH || 'N/A'} km/h</span>
                </div>

                <div className="flex flex-col">
                  <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Fuel Type</span>
                  <span className="text-xl font-bold">{vehicle.specs?.fuelType || 'N/A'}</span>
                </div>
              </div>

              <div className="h-px w-full bg-white/10 my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-4">Drivetrain</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Transmission</span>
                      <span className="font-semibold">{vehicle.specs?.transmission || 'N/A'}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-4">Dimensions</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Length</span>
                      <span className="font-semibold">{vehicle.specs?.dimensions?.lengthMm ? `${vehicle.specs.dimensions.lengthMm} mm` : 'N/A'}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Width</span>
                      <span className="font-semibold">{vehicle.specs?.dimensions?.widthMm ? `${vehicle.specs.dimensions.widthMm} mm` : 'N/A'}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Height</span>
                      <span className="font-semibold">{vehicle.specs?.dimensions?.heightMm ? `${vehicle.specs.dimensions.heightMm} mm` : 'N/A'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: DNA & Extras */}
          <div className="space-y-8">
            <VehicleDna scores={{
              performanceScore: vehicle.performanceScore || 0,
              luxuryScore: vehicle.luxuryScore || 0,
              comfortScore: vehicle.comfortScore || 0,
              aggressivenessScore: vehicle.aggressivenessScore || 0,
            }} />
          </div>

        </div>
      </div>
    </div>
  );
}
