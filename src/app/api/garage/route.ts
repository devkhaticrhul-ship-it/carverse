import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Vehicle from '@/models/Vehicle';

// Helper to get authenticated user
async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  await connectToDatabase();
  return User.findOne({ email: session.user.email });
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Populate the garage with actual vehicle data
    const populatedUser = await user.populate('garage');
    return NextResponse.json(populatedUser.garage);
  } catch (error) {
    console.error('GET /api/garage error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { vehicleId } = await request.json();
    if (!vehicleId) return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });

    // Add to garage if not already present
    if (!user.garage.includes(vehicleId)) {
      user.garage.push(vehicleId);
      await user.save();
    }

    return NextResponse.json({ message: 'Added to garage', garage: user.garage }, { status: 200 });
  } catch (error) {
    console.error('POST /api/garage error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });

    // Remove from garage
    user.garage = user.garage.filter((id: any) => id.toString() !== vehicleId);
    await user.save();

    return NextResponse.json({ message: 'Removed from garage', garage: user.garage }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/garage error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
