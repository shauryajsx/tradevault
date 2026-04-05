import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user._id.toString(), username: user.username, email: user.email },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
