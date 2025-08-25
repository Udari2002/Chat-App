import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get messages between two users
router.get('/:receiverId', auth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id }
      ]
    })
    .populate('senderId', 'fullName profilePic')
    .populate('receiverId', 'fullName profilePic')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    // Mark messages as seen
    await Message.updateMany(
      {
        senderId: receiverId,
        receiverId: req.user._id,
        seen: false
      },
      { seen: true }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      text,
      image: image || ''
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'fullName profilePic')
      .populate('receiverId', 'fullName profilePic');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as seen
router.put('/seen/:senderId', auth, async (req, res) => {
  try {
    const { senderId } = req.params;

    await Message.updateMany(
      {
        senderId,
        receiverId: req.user._id,
        seen: false
      },
      { seen: true }
    );

    res.json({ message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      seen: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 