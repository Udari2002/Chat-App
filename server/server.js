import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB} from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRout.js';
import { Server } from 'socket.io';

//create express app and http server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online users
export const UserSocketMap = {};//{userId:socketId}

//Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId);

    if(userId) UserSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(UserSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        delete UserSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(UserSocketMap));
    })
})

//middleware setup
app.use(cors());//connet url
app.use(express.json({limit: '4mb'})); // Increased limit for large payloads

//route setup
app.use('/api/status', (req, res) => res.send('Server is live!'));
app.use("/api/auth", userRouter);
app.use("/api/message", messageRouter);

//connect to mongoDB database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on port:" + PORT));