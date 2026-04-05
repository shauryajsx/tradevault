import mongoose from 'mongoose';

const StrategySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  market: { type: String, default: 'Equities' },
  timeframe: { type: String, default: '5min' },
  checklist: [{ type: String }],
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  winRate: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Strategy || mongoose.model('Strategy', StrategySchema);
