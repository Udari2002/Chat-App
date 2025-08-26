# 🚀 QuickChat App Startup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

## 🗄️ Step 1: Setup MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB Community Server
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
# Windows: MongoDB runs as a service
# Mac/Linux: brew services start mongodb-community
```

### Option B: MongoDB Atlas (Recommended for beginners)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string

## ⚙️ Step 2: Environment Setup

Create `server/.env` file with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chat-app
# OR for Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-12345

# Server Port
PORT=5000

# Client URL
CLIENT_ORIGIN=http://localhost:5173
```

## 🚀 Step 3: Start the App

### Terminal 1: Start Server
```bash
cd server
npm install
npm start
```

### Terminal 2: Start Client
```bash
cd client
npm install
npm run dev
```

## 🧪 Step 4: Test the App

1. Open [http://localhost:5173](http://localhost:5173)
2. Click "Sign Up" to create account
3. Fill in:
   - Full Name: Your Name
   - Email: your@email.com (or leave blank)
   - Password: 123456
4. Click "Create Account"
5. You'll be redirected to chat interface

## 🔧 Troubleshooting

### "MONGODB_URI is missing"
- Create `server/.env` file
- Check MongoDB is running

### "Connection refused"
- MongoDB not started
- Wrong connection string

### "Invalid credentials"
- User doesn't exist
- Wrong password

### "JWT_SECRET is missing"
- Add JWT_SECRET to .env file

## 📱 Features Available

✅ **Real-time messaging** with Socket.IO  
✅ **Image sharing** (click gallery icon)  
✅ **Profile picture upload** (Profile → Edit Profile)  
✅ **Message deletion** (hover message → Me/All)  
✅ **Delete entire chat** (header delete button)  
✅ **Typing indicators**  
✅ **Online/offline status**  
✅ **Dummy users** for testing  

## 🎯 Next Steps

1. Create multiple accounts in different browsers
2. Start chatting between accounts
3. Test image sharing
4. Try message deletion features

## 📞 Support

If you get stuck:
1. Check console for errors
2. Verify MongoDB connection
3. Ensure .env file exists
4. Check if ports 5000 and 5173 are free
