import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carverse';

// If no env var is set we fallback to a local MongoDB instance.


/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API route usage.
 */
let cached = (globalThis as any).mongoose;
if (!cached) {
  // @ts-ignore
  cached = globalThis.mongoose = { conn: null, promise: null } as any;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    } as any;
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
