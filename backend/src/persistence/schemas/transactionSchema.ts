import { ITransactionPersistence } from '../../dataschema/ITransactionPersistence';
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    value: { type: Number, unique: false },
    date: { type: Date, unique: false },
    description: { type: String, unique: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITransactionPersistence & mongoose.Document>('Transaction', TransactionSchema);
