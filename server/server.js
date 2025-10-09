import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import cors from 'cors';
import http from 'http';
import { connectDB, getDatabaseStatus } from './lib/db.js';

//create express app and http server
const app = express();
const server = http.createServer(app);

//middleware setup
app.use(cors());//connet url
app.use(express.json({limit: '4mb'})); // Increased limit for large payloads


app.use('/api/status', (req, res) => res.send('Server is live!'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on port:" + PORT));