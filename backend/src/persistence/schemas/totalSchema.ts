import { ITotalPersistence } from '../../dataschema/ITotalPersistence';
import mongoose from 'mongoose';

const TotalSchema = new mongoose.Schema(
  {
    did: { type: String, unique: true },
    value: { type: Number, unique: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITotalPersistence & mongoose.Document>('Total', TotalSchema);
