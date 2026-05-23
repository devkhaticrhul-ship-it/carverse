import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  brand: mongoose.Types.ObjectId;
  category: string; // e.g., 'SUV', 'Electric', etc.
  price: number; // store in USD cents
  luxuryScore: number; // 0-100
  performanceScore: number;
  comfortScore: number;
  aggressivenessScore: number;
  imageUrl: string;
  specs: {
    horsepower: number;
    topSpeedKmH: number;
    zeroToHundred: number; // seconds
    fuelType: string; // 'Electric', 'Petrol', etc.
    transmission: string;
    dimensions: {
      lengthMm: number;
      widthMm: number;
      heightMm: number;
    };
  };
}

const VehicleSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  luxuryScore: { type: Number, required: true },
  performanceScore: { type: Number, required: true },
  comfortScore: { type: Number, required: true },
  aggressivenessScore: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  specs: {
    horsepower: { type: Number, required: true },
    topSpeedKmH: { type: Number, required: true },
    zeroToHundred: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    dimensions: {
      lengthMm: { type: Number, required: true },
      widthMm: { type: Number, required: true },
      heightMm: { type: Number, required: true },
    },
  },
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
