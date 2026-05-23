const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('../lib/mongodb');
const User = require('../models/User');

const EMAIL = 'multiversecar@.com';
const PLAIN_PASSWORD = 'Aryan@273164';

async function seed() {
  try {
    await connectToDatabase();
    const existing = await User.findOne({ email: EMAIL });
    if (existing) {
      console.log('User already exists');
      process.exit(0);
    }
    const passwordHash = await bcrypt.hash(PLAIN_PASSWORD, 10);
    const user = new User({ email: EMAIL, passwordHash, garage: [] });
    await user.save();
    console.log('Demo user created');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

seed();
