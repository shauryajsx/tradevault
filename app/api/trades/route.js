import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Trade from '../../../models/Trade';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const query = userId ? { userId } : {};
    const trades = await Trade.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(trades.map(t => ({ ...t, _id: t._id.toString() })));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const trade = await Trade.create(data);
    return NextResponse.json({ ...trade.toObject(), _id: trade._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    const trade = await Trade.findByIdAndUpdate(_id, update, { new: true }).lean();
    if (!trade) return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    return NextResponse.json({ ...trade, _id: trade._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await Trade.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 });
  }
}
