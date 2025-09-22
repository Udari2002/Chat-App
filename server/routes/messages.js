import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get messages between two users
router.get('/:receiverId', auth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { page = 1, limit = 50 } = req.query;
     // Find messages where either:
    // - Current user is sender and param user is receiver, OR
    // - Param user is sender and current user is receiver

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id }
      ]
    })
    .populate('senderId', 'fullName profilePic')
    .populate('receiverId', 'fullName profilePic')
    .sort({ createdAt: -1 })// Sort by newest first
    .limit(limit * 1)// Convert string to number, limit results
    .skip((page - 1) * limit)// Calculate pagination offset
    .exec();// Execute the query

    // Mark messages as seen
    await Message.updateMany(
      {
        senderId: receiverId,
        receiverId: req.user._id,
        seen: false  // That haven't been seen yet
      },
      { seen: true }// Update to mark as seen
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete single message (for me or for everyone if within 2 minutes)
router.delete('/item/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;// Get message ID from URL
    const { forEveryone = false } = req.query;// Check if deletion is for everyone

    const msg = await Message.findById(messageId); // Find the message
    if (!msg) return res.status(404).json({ message: 'Message not found' }); // Handle not found

    const isSender = String(msg.senderId) === String(req.user._id); // Check if user is sender
    const withinWindow = Date.now() - new Date(msg.createdAt).getTime() <= 2 * 60 * 1000;// Check if message was created within last 2 minutes (120,000 ms)

    if (forEveryone && isSender && withinWindow) {
      msg.text = '';
      msg.image = '';
      msg.deletedForEveryoneAt = new Date();
      await msg.save();
      return res.json({ message: 'Deleted for everyone' });
    }

    // Delete for me only
    if (!msg.deletedFor) msg.deletedFor = [];
    if (!msg.deletedFor.includes(req.user._id)) msg.deletedFor.push(req.user._id);
    await msg.save();
    return res.json({ message: 'Deleted for me' });// Success response
  } catch (error) {
    res.status(500).json({ message: 'Server error' });// Error handling
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;// Extract message data from request


    const message = new Message({
      senderId: req.user._id,// Set sender to current authenticated user
      receiverId,// Set receiver
      text,// Set message text
      image: image || ''// Set image (empty string if not provided)
    });

    await message.save();// Save message to database

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'fullName profilePic')
      .populate('receiverId', 'fullName profilePic');

    res.status(201).json(populatedMessage); // Return created message with status 201
  } catch (error) {
    res.status(500).json({ message: 'Server error' });// Error handling
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

// Delete entire conversation between current user and receiver
router.delete('/:receiverId', auth, async (req, res) => {
  try {
    const { receiverId } = req.params;// Get receiver ID from URL
     
    // Delete all messages between current user and receiver

    await Message.deleteMany({
      $or: [// Either direction of messaging
        { senderId: req.user._id, receiverId },// Messages I sent
        { senderId: receiverId, receiverId: req.user._id }// Messages I received
      ]
    });

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,// Messages addressed to current user
      seen: false     // That haven't been seen yet
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 