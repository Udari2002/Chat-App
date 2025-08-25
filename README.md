# QuickChat - Real-time Chat Application

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time messaging.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time messaging with Socket.IO
- 👥 User search and online status
- 📱 Responsive design
- 🎨 Modern UI with dark theme
- 👤 User profiles with bio and profile pictures
- 📍 Typing indicators
- 🔔 Message notifications
- 📸 Media sharing support

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd chat-app
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

#### Frontend Configuration
The frontend is configured to connect to `http://localhost:5000` by default. If you change the backend port, update the `API_BASE_URL` in `client/src/lib/api.js`.

### 4. Start the application

#### Start the backend server
```bash
cd server
npm run dev
```

#### Start the frontend development server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

### 1. Registration/Login
- Navigate to http://localhost:5173/login
- Create a new account or login with existing credentials
- You'll be redirected to the main chat interface

### 2. Chat Interface
- **Left Sidebar**: Shows all users with their online status
- **Center**: Main chat area where messages are displayed
- **Right Sidebar**: User details and profile information

### 3. Features
- **Real-time Messaging**: Messages are sent and received instantly
- **User Search**: Search for users by name or email
- **Online Status**: See who's online in real-time
- **Typing Indicators**: See when someone is typing
- **Profile Management**: Edit your profile details

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (except current user)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/online` - Update online status

### Messages
- `GET /api/messages/:receiverId` - Get messages between users
- `POST /api/messages` - Send a message
- `PUT /api/messages/seen/:senderId` - Mark messages as seen
- `GET /api/messages/unread/count` - Get unread message count

## Socket.IO Events

### Client to Server
- `join_room` - Join user's room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server to Client
- `receive_message` - Receive a new message
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing

## Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API and socket utilities
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 