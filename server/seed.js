// server/seed.js
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const { MONGODB_URI, MONGODB_DB = 'chat-app' } = process.env;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ Connected to MongoDB:', mongoose.connection.db.databaseName);

  // Wipe only demo users you created before (optional)
  await User.deleteMany({
    email: { $in: ['admin@quickchat.com', 'alice@quickchat.com', 'bob@quickchat.com'] }
  });

  const users = [
    { fullName: 'Admin User',  email: 'admin@quickchat.com',  password: 'admin123',  bio: 'I am the admin.' },
    { fullName: 'Alice Wonder',email: 'alice@quickchat.com',  password: 'alice123',  bio: 'Hey, I am Alice!' },
    { fullName: 'Bob Builder', email: 'bob@quickchat.com',    password: 'bob123',    bio: 'Bob here!' },
  ];

  const docs = [];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const doc = await User.create({
      fullName: u.fullName,
      email: u.email,          // your schema allows optional emails, but auth needs this filled
      password: hash,          // 🔒 store hashed (auth will bcrypt.compare)
      bio: u.bio,
      isOnline: false,
    });
    docs.push(doc);
    console.log('👤 Created:', doc.fullName, doc.email);
  }

  const count = await User.countDocuments();
  console.log(`✅ Seeding done. Users now in DB: ${count}`);
  await mongoose.connection.close();
  console.log('🔌 Disconnected');
}

main().catch(async (e) => {
  console.error('🚫 Seed error:', e);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
