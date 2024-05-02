import { ITransactionPersistence } from '../../dataschema/ITransactionPersistence';
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    value: { type: Number, unique: true },
    date: { type: Date, unique: false },
    description: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITransactionPersistence & mongoose.Document>('Transaction', TransactionSchema);
