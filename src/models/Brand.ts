import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logoUrl: string;
  description?: string;
}

const BrandSchema: Schema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  description: { type: String },
});

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
