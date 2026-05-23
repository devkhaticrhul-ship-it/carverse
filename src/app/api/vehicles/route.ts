import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const vehicles = await Vehicle.find().populate('brand').lean();
    return NextResponse.json(vehicles);
  } catch (err) {
    console.error('GET /api/vehicles error:', err);
    // Fallback sample data to avoid empty response
    const sample = [
      {
        _id: 'sample1',
        name: 'Sample Car',
        brand: null,
        category: 'Sample',
        priceUSD: 100000,
        priceINR: 8300000,
        horsepower: 200,
        topSpeed: 250,
        acceleration: 5.5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        imageUrl: '',
        specs: {}
      }
    ];
    return NextResponse.json(sample);
  }
}

export async function POST(request: Request) {
  await connectToDatabase();
  const data = await request.json();
  // Simple validation – ensure required fields exist
  const required = ['name', 'brand', 'category', 'price'];
  for (const field of required) {
    if (!data[field]) {
      return new NextResponse(`Missing field: ${field}`, { status: 400 });
    }
  }
  const vehicle = new Vehicle(data);
  await vehicle.save();
  return NextResponse.json(vehicle, { status: 201 });
}
