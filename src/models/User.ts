import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string; // bcrypt hash
  garage: mongoose.Types.ObjectId[]; // references Vehicle IDs
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  garage: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
