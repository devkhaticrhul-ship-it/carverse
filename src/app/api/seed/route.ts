import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Vehicle from '@/models/Vehicle';
import data from '@/data/vehicles.json';

export async function GET() {
  try {
    await connectToDatabase();

    // ── Seed Brands ──────────────────────────────────────────────────────────
    await Brand.deleteMany({});
    const brandMap: Record<string, any> = {};

    for (const b of (data as any).brands) {
      const doc = await Brand.create({
        name:        b.name,
        logoUrl:     b.logo || '',
        description: b.description || '',
      });
      brandMap[b.name] = doc._id;
    }

    // ── Seed Vehicles ────────────────────────────────────────────────────────
    await Vehicle.deleteMany({});
    let seeded = 0;
    const skipped: string[] = [];

    for (const v of (data as any).vehicles) {
      const brandId = brandMap[v.brand];
      if (!brandId) {
        skipped.push(v.name);
        continue;
      }
      await Vehicle.create({
        name:                v.name,
        brand:               brandId,
        category:            v.category,
        price:               v.priceUSD || 0,
        priceUSD:            v.priceUSD || 0,
        priceINR:            v.priceINR || (v.priceUSD ? v.priceUSD * 83 : 0),
        luxuryScore:         v.dna?.luxury        || 0,
        performanceScore:    v.dna?.performance   || 0,
        comfortScore:        v.dna?.comfort       || 0,
        aggressivenessScore: v.dna?.aggression    || 0,
        imageUrl:            v.image || '',
        year:                v.year  || 2024,
        description:         v.description || '',
        features:            v.features    || [],
        dna:                 v.dna         || {},
        specs: {
          horsepower:    v.horsepower   || 0,
          topSpeedKmH:   v.topSpeed     || 0,
          zeroToHundred: v.acceleration || 0,
          fuelType:      v.fuelType     || 'Petrol',
          transmission:  v.transmission || 'Automatic',
          torque:        v.torque       || 0,
          engine:        v.engine       || '',
          mileage:       v.mileage      || 'N/A',
          dimensions:    { lengthMm: 0, widthMm: 0, heightMm: 0 },
        },
      });
      seeded++;
    }

    return NextResponse.json({
      success: true,
      brands:  Object.keys(brandMap).length,
      vehicles: seeded,
      skipped,
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
