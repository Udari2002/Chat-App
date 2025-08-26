# 🔐 Simple Login Guide for QuickChat

A quick guide to get you logged into your real-time chat application.

## 🚀 Quick Start

### 1. **Start the App**
```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend  
cd client
npm run dev
```

### 2. **Access Login Page**
- Open: http://localhost:5173
- You'll see the login page automatically

## 📝 Login Process

### **Option 1: Create New Account**
1. **Click "Sign Up"** button
2. **Enter Full Name** (required)
3. **Enter Email** (optional - will auto-generate if blank)
4. **Enter Password** (minimum 6 characters)
5. **Click "Create Account"**

### **Option 2: Login with Existing Account**
1. **Click "Sign In"** button
2. **Enter Email** (required)
3. **Enter Password**
4. **Click "Sign In"**

## 🎯 What Happens After Login

1. **Redirected to Chat Interface**
2. **See User List** in left sidebar
3. **Select a User** to start chatting
4. **Start Sending Messages** in real-time

## 🔧 Troubleshooting

### **"MONGODB_URI is missing"**
- Create `server/.env` file with MongoDB connection string

### **"Connection refused"**
- MongoDB not running
- Check if MongoDB service is started

### **"Invalid credentials"**
- User doesn't exist - create account first
- Wrong password - try again

### **"JWT_SECRET is missing"**
- Add JWT_SECRET to `server/.env` file

## 📱 Features You'll Get

- ✅ **Real-time messaging** with Socket.IO
- ✅ **Image sharing** in chat
- ✅ **Profile picture upload**
- ✅ **Message deletion** (individual and conversations)
- ✅ **Typing indicators**
- ✅ **Online/offline status**
- ✅ **User search**
- ✅ **Responsive design**

## 🎉 Ready to Chat!

Once logged in, you can:
1. **Send messages** to other users
2. **Share images** by clicking gallery icon
3. **Update your profile** (name, bio, profile pic)
4. **Delete messages** (hover over message for options)
5. **Delete entire conversations** (header delete button)

Your real-time chat app is now ready! 🚀

