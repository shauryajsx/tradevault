import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  strategyId: { type: String, required: true },
  symbol: { type: String, required: true },
  direction: { type: String, enum: ['LONG', 'SHORT'], required: true },
  entryPrice: { type: Number, required: true },
  stopLoss: { type: Number, default: 0 },
  takeProfit: { type: Number, default: 0 },
  entryDate: { type: String, required: true },
  lotSize: { type: Number, default: 0.01 },
  accountBalance: { type: Number, default: 10000 },
  riskPct: { type: Number, default: 2 },
  notes: { type: String, default: '' },
  pnl: { type: Number, default: 0 },
  outcome: { type: String, enum: ['Before', 'Win', 'Loss', 'Break-Even'], default: 'Before' },
  confluenceScore: { type: Number, default: 0 },
  beforeChart: { type: String, default: null },
  afterChart: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Trade || mongoose.model('Trade', TradeSchema);
