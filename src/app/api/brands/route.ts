import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Brand from '@/models/Brand';

export async function GET() {
  await connectToDatabase();
  const brands = await Brand.find().lean();
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const data = await request.json();
  const brand = new Brand(data);
  await brand.save();
  return NextResponse.json(brand, { status: 201 });
}
