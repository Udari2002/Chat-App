# QuickChat - Setup Guide for Evaluation

## 🚀 Simple Setup Steps

### 1. **Install Dependencies**

#### Backend Setup:
```bash
cd server
npm install
```

#### Frontend Setup:
```bash
cd client
npm install
```

### 2. **Start the Application**

#### Start Backend (Terminal 1):
```bash
cd server
npm run dev
```
You should see: "Server running on port 5000" and "Connected to MongoDB"

#### Start Frontend (Terminal 2):
```bash
cd client
npm run dev
```
You should see: "Local: http://localhost:5173/"

### 3. **Access the Application**
- Open: http://localhost:5173
- You'll be redirected to login page
- Create an account or login

## 🎯 Features for Evaluation

### **CRUD Operations Demo:**
1. Click "Show CRUD Demo" button (top-right)
2. Test these operations:
   - **CREATE**: Add new user
   - **READ**: Refresh users list
   - **UPDATE**: Update user details
   - **DELETE**: Delete user

### **Real-time Chat Features:**
1. **User List**: See all users in left sidebar
2. **Chat**: Click on any user to start chatting
3. **Real-time Messaging**: Send and receive messages instantly
4. **Typing Indicators**: See when someone is typing
5. **Online Status**: Green dot for online users

### **User Management:**
1. **Profile**: Click menu → Edit Profile
2. **Search**: Search users by name
3. **Logout**: Click menu → Logout

## 📁 Project Structure

```
chat-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Chat components
│   │   ├── pages/         # Login, Home, Profile
│   │   ├── lib/           # API utilities
│   │   └── assets/        # Images and dummy data
│   └── package.json
├── server/                # Node.js Backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication
│   └── package.json
└── README.md
```

## 🔧 Troubleshooting

### **If MongoDB connection fails:**
- Make sure MongoDB is running
- Check if MongoDB is installed: `mongod --version`

### **If ports are busy:**
- Backend: Change PORT in `server/.env`
- Frontend: Change port in `client/vite.config.js`

### **If users don't appear:**
- The app uses dummy data automatically
- Users should appear: Alison, Martin, Enrique, Marco, Richard

## 🎉 Ready for Evaluation!

Your chat app includes:
- ✅ User Authentication (Login/Register)
- ✅ Real-time Messaging
- ✅ CRUD Operations
- ✅ User Search
- ✅ Profile Management
- ✅ Responsive Design
- ✅ Modern UI with Dark Theme
