import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

const EMAIL = 'multiversecar@.com';
const PASSWORD = 'Aryan@273164';
const SALT_ROUNDS = 10;

async function seed() {
  try {
    await connectToDatabase();
    const existing = await User.findOne({ email: EMAIL });
    if (existing) {
      console.log('User already exists');
      return;
    }
    const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
    const user = new User({ email: EMAIL, passwordHash: hash, garage: [] });
    await user.save();
    console.log('Demo user created');
  } catch (err) {
    console.error('Error seeding user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
