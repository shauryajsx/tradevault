import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import Strategy from '../../../models/Strategy';

export async function GET() {
  try {
    await dbConnect();
    const strategies = await Strategy.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(strategies.map(s => ({ ...s, _id: s._id.toString() })));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const strategy = await Strategy.create(data);
    return NextResponse.json({ ...strategy.toObject(), _id: strategy._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create strategy' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    const strategy = await Strategy.findByIdAndUpdate(_id, update, { new: true }).lean();
    if (!strategy) return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    return NextResponse.json({ ...strategy, _id: strategy._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update strategy' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await Strategy.findByIdAndDelete(id);
    // Also delete associated trades
    const Trade = (await import('../../../models/Trade')).default;
    await Trade.deleteMany({ strategyId: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete strategy' }, { status: 500 });
  }
}
