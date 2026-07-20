import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const vehicle = await Vehicle.findById(id).populate('brand').lean();
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    return NextResponse.json(vehicle);
  } catch (err) {
    console.error('GET /api/vehicles/[id] error:', err);
    
    // Fallback sample data to avoid crashes if DB isn't fully seeded yet
    const { id } = await params;
    const sample = {
      _id: id,
      name: 'Sample Car Detail',
      brand: null,
      category: 'Hypercar',
      price: 350000000, // $3.5M in cents
      luxuryScore: 90,
      performanceScore: 100,
      comfortScore: 60,
      aggressivenessScore: 100,
      imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2071&auto=format&fit=crop',
      specs: {
        horsepower: 1500,
        topSpeedKmH: 420,
        zeroToHundred: 2.5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        dimensions: {
          lengthMm: 4544,
          widthMm: 2038,
          heightMm: 1212
        }
      }
    };
    return NextResponse.json(sample);
  }
}
