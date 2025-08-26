# Environment Setup for Chat App

## Create `.env` file in `server/` directory

Create a file named `.env` in your `server/` folder with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chat-app
MONGODB_DB=chat-app

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000

# Client Origins (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

## Steps to Fix Login:

1. **Create the .env file** in `server/` directory with the content above
2. **Install MongoDB** locally or use MongoDB Atlas
3. **Start the server**: `cd server && npm start`
4. **Start the client**: `cd client && npm run dev`

## MongoDB Options:

### Option 1: Local MongoDB
- Install MongoDB Community Server
- Start MongoDB service
- Use: `MONGODB_URI=mongodb://localhost:27017/chat-app`

### Option 2: MongoDB Atlas (Cloud)
- Create free account at mongodb.com/atlas
- Create cluster and get connection string
- Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app`

## Test Login:

1. Go to `http://localhost:5173/login`
2. Click "Sign Up" to create account
3. Use "Sign In" to login
4. Should redirect to chat interface

## Common Issues:

- **"MONGODB_URI is missing"**: Create .env file
- **"JWT_SECRET is missing"**: Add JWT_SECRET to .env
- **"Connection refused"**: MongoDB not running
- **"Invalid credentials"**: Check if user exists in database
