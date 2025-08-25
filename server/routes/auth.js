import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const sanitize = (u) => {
  const obj = u.toObject ? u.toObject() : u;
  delete obj.password;
  return obj;
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !password) {
      return res.status(400).json({ message: 'Full name and password are required' });
    }

    let normalizedEmail;
    if (email) {
      normalizedEmail = email.toLowerCase().trim();
      const exists = await User.findOne({ email: normalizedEmail });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,           // allowed to be undefined due to sparse:true
      password: hash,
      isOnline: false,
    });

    const token = signToken(user._id);
    return res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    console.error('POST /api/auth/register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'User not found. Please register first.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.json({ token, user: sanitize(user) });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Optional ping
router.get('/me', (_req, res) => res.status(200).json({ ok: true }));

export default router;
