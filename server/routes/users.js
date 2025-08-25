// server/routes/users.js
import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all users (except current user)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * IMPORTANT: Specific routes BEFORE parameter routes like "/:id"
 * Otherwise "/online" will match "/:id" with id="online"
 */

// Update online status (current user) — keep this BEFORE "/:id"
router.put('/online', auth, async (req, res) => {
  try {
    const { isOnline } = req.body;
    if (typeof isOnline !== 'boolean') {
      return res.status(400).json({ message: 'isOnline (boolean) is required' });
    }

    const userId = req.user?._id || req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid auth token payload' });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { isOnline, lastSeen: new Date() } },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (error) {
    console.error('PUT /api/users/online error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (current user) — also specific
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, profilePic },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('PUT /api/users/profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID — AFTER specific routes
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('GET /api/users/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (CRUD - CREATE)  ⚠️ demo only; password is dummy/unhashed
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, email, bio } = req.body;

    let normalizedEmail;
    if (email) {
      normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      fullName,
      email: normalizedEmail,
      bio: bio || 'Hi Everyone, I am Using QuickChat',
      password: 'dummy123', // Unhashed; not for login auth
      isOnline: false
    });

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('POST /api/users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (CRUD - UPDATE) — AFTER "/online"
router.put('/:id', auth, async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, bio },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('PUT /api/users/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (CRUD - DELETE) — AFTER "/online"
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/users/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
