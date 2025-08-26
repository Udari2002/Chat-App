import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';

// Load .env
dotenv.config();

// Config
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'chat-app';

// CORS: support single or multiple origins
const rawOrigins =
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  'http://localhost:5173';

const ALLOWED_ORIGINS = rawOrigins.split(',').map(s => s.trim());

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (no Origin header)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Express
const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health
app.get('/', (_req, res) => res.json({ ok: true, service: 'chat-server' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// HTTP + Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join_room', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    }
  });

  socket.on('send_message', (data) => {
    if (data?.receiverId) {
      socket.to(data.receiverId).emit('receive_message', data);
    }
  });

  socket.on('delete_conversation', (data) => {
    if (data?.receiverId) {
      socket.to(data.receiverId).emit('conversation_deleted', data);
    }
  });

  socket.on('typing', (data) => {
    if (data?.receiverId) {
      socket.to(data.receiverId).emit('user_typing', data);
    }
  });

  socket.on('stop_typing', (data) => {
    if (data?.receiverId) {
      socket.to(data.receiverId).emit('user_stop_typing', data);
    }
  });

  socket.on('delete_message', (data) => {
    if (data?.receiverId) {
      socket.to(data.receiverId).emit('message_deleted', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Mongo
async function connectDB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('🚫 MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Start
(async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
  });
})();
