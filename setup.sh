#!/bin/bash

echo "🚀 QuickChat Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file for backend
echo "🔧 Creating backend environment file..."
if [ ! -f "server/.env" ]; then
    cat > server/.env << EOF
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
EOF
    echo "✅ Created server/.env file"
else
    echo "⚠️  server/.env already exists"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB (if running locally)"
echo "2. Start the backend: cd server && npm run dev"
echo "3. Start the frontend: cd client && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "Happy chatting! 💬" 