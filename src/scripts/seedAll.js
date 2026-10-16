/**
 * seedAll.js — Seeds brands and vehicles into MongoDB from src/data/vehicles.json
 * Run with: node src/scripts/seedAll.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://devkhaticrhul_db_user:EfNHtnh1FHqYLgpC@cluster0.yyxwwes.mongodb.net/carverse?appName=Cluster0';

// ── Schemas ──────────────────────────────────────────────────────────────────

const BrandSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  logoUrl:     { type: String, required: true },
  description: { type: String },
});

const VehicleSchema = new mongoose.Schema({
  name:               { type: String, required: true },
  brand:              { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category:           { type: String, required: true },
  price:              { type: Number, required: true },
  priceUSD:           { type: Number },
  priceINR:           { type: Number },
  luxuryScore:        { type: Number, default: 0 },
  performanceScore:   { type: Number, default: 0 },
  comfortScore:       { type: Number, default: 0 },
  aggressivenessScore:{ type: Number, default: 0 },
  imageUrl:           { type: String, required: true },
  year:               { type: Number },
  description:        { type: String },
  features:           [String],
  dna: {
    performance:  { type: Number, default: 0 },
    luxury:       { type: Number, default: 0 },
    comfort:      { type: Number, default: 0 },
    aggression:   { type: Number, default: 0 },
    technology:   { type: Number, default: 0 },
    practicality: { type: Number, default: 0 },
  },
  specs: {
    horsepower:    { type: Number, default: 0 },
    topSpeedKmH:   { type: Number, default: 0 },
    zeroToHundred: { type: Number, default: 0 },
    fuelType:      { type: String, default: 'Petrol' },
    transmission:  { type: String, default: 'Automatic' },
    torque:        { type: Number, default: 0 },
    engine:        { type: String, default: '' },
    mileage:       { type: String, default: 'N/A' },
    dimensions: {
      lengthMm: { type: Number, default: 0 },
      widthMm:  { type: Number, default: 0 },
      heightMm: { type: Number, default: 0 },
    },
  },
});

const Brand   = mongoose.models.Brand   || mongoose.model('Brand',   BrandSchema);
const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅ Connected!\n');

  // Load data
  const dataPath = path.join(__dirname, '../data/vehicles.json');
  const { brands: brandsData, vehicles: vehiclesData } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // ── Seed Brands ──────────────────────────────────────────────────────────
  console.log(`🚀 Seeding ${brandsData.length} brands...`);
  await Brand.deleteMany({});

  const brandMap = {}; // name → ObjectId
  for (const b of brandsData) {
    const doc = await Brand.create({
      name:        b.name,
      logoUrl:     b.logo || '',
      description: b.description || '',
    });
    brandMap[b.name] = doc._id;
    console.log(`   ✓ Brand: ${b.name}`);
  }

  // ── Seed Vehicles ────────────────────────────────────────────────────────
  console.log(`\n🚗 Seeding ${vehiclesData.length} vehicles...`);
  await Vehicle.deleteMany({});

  for (const v of vehiclesData) {
    const brandId = brandMap[v.brand];
    if (!brandId) {
      console.warn(`   ⚠️  Unknown brand "${v.brand}" for vehicle "${v.name}" — skipping`);
      continue;
    }
    await Vehicle.create({
      name:               v.name,
      brand:              brandId,
      category:           v.category,
      price:              v.priceUSD || 0,
      priceUSD:           v.priceUSD || 0,
      priceINR:           v.priceINR || (v.priceUSD ? v.priceUSD * 83 : 0),
      luxuryScore:        v.dna?.luxury       || 0,
      performanceScore:   v.dna?.performance  || 0,
      comfortScore:       v.dna?.comfort      || 0,
      aggressivenessScore:v.dna?.aggression   || 0,
      imageUrl:           v.image || '',
      year:               v.year  || 2024,
      description:        v.description || '',
      features:           v.features    || [],
      dna:                v.dna         || {},
      specs: {
        horsepower:    v.horsepower   || 0,
        topSpeedKmH:   v.topSpeed     || 0,
        zeroToHundred: v.acceleration || 0,
        fuelType:      v.fuelType     || 'Petrol',
        transmission:  v.transmission || 'Automatic',
        torque:        v.torque       || 0,
        engine:        v.engine       || '',
        mileage:       v.mileage      || 'N/A',
        dimensions: { lengthMm: 0, widthMm: 0, heightMm: 0 },
      },
    });
    console.log(`   ✓ Vehicle: ${v.brand} ${v.name}`);
  }

  console.log('\n🎉 Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
