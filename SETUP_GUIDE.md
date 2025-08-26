# 🚀 QuickChat App Setup Guide

A comprehensive guide to set up and run your real-time chat application.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for cloning the repository)

## 🗄️ Step 1: MongoDB Setup

### Option A: Local MongoDB
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Recommended)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

## ⚙️ Step 2: Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chat-app
# OR for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-12345

# Server Configuration
PORT=5000

# Client Origins (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

## 🚀 Step 3: Installation & Startup

### Backend Setup
```bash
cd server
npm install
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🧪 Step 4: Testing the App

1. **Open** [http://localhost:5173](http://localhost:5173)
2. **Sign Up** with your details
3. **Login** and start chatting
4. **Test Features**:
   - Send messages
   - Share images
   - Update profile
   - Delete messages

## 🔧 Troubleshooting

### Common Issues
- **"MONGODB_URI is missing"** → Create `.env` file
- **"Connection refused"** → MongoDB not running
- **"JWT_SECRET is missing"** → Add to `.env` file
- **Port conflicts** → Check if ports 5000/5173 are free

### Solutions
1. Verify MongoDB is running
2. Check `.env` file exists and has correct values
3. Ensure no other services use the same ports
4. Check console for detailed error messages

## 📱 Features Available

- ✅ **Real-time messaging** with Socket.IO
- ✅ **User authentication** (login/register)
- ✅ **Image sharing** in chat
- ✅ **Profile management** (name, bio, profile pic)
- ✅ **Message deletion** (individual and conversations)
- ✅ **Typing indicators**
- ✅ **Online/offline status**
- ✅ **User search**
- ✅ **Responsive design**

## 🎯 Next Steps

1. **Create multiple accounts** for testing
2. **Test real-time features** between accounts
3. **Customize the UI** to your preference
4. **Deploy to production** when ready

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check if all dependencies are installed

Your chat app is now ready for real-time messaging! 🎉

