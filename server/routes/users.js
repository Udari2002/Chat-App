// server/routes/users.js
import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all users (except current user)
router.get('/', auth, async (req, res) => {
  try {
      // Find all users where ID is not equal to current user's ID
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')// Exclude password field from results
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)
    res.json(users); // Return users as JSON response
  } catch (error) {
    console.error('GET /api/users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update online status (current user)
router.put('/online', auth, async (req, res) => {
  try {
    const { isOnline } = req.body; // Extract isOnline from request body
     // Validate input
    if (typeof isOnline !== 'boolean') {
      return res.status(400).json({ message: 'isOnline (boolean) is required' });
    }
      // Get user ID from auth middleware (supports different possible field names)

    const userId = req.user?._id || req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid auth token payload' });
    }
      // Update user's online status and lastSeen timestamp

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

// Update user profile (current user)
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

export default router;
