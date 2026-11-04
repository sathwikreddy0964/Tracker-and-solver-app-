const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tracker_and_solver_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed or reset Admin
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = new User({
        name: 'Administrator',
        email: 'admin@example.com',
        password: 'AdminPassword123',
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Created Admin Account: admin@example.com / AdminPassword123');
    } else {
      admin.role = 'admin';
      admin.password = 'AdminPassword123'; // pre-save hook will hash
      await admin.save();
      console.log('✅ Admin Account already existed - password & role refreshed: admin@example.com / AdminPassword123');
    }

    // 2. Seed or reset Demo User
    let demoUser = await User.findOne({ email: 'john@example.com' });
    if (!demoUser) {
      demoUser = new User({
        name: 'John Developer',
        email: 'john@example.com',
        password: 'Password123',
        role: 'user',
      });
      await demoUser.save();
      console.log('✅ Created Demo User Account: john@example.com / Password123');
    } else {
      demoUser.password = 'Password123';
      await demoUser.save();
      console.log('✅ Demo User Account password refreshed: john@example.com / Password123');
    }

    // Display all users
    const allUsers = await User.find().select('-password');
    console.log('\n--- ALL REGISTERED ACCOUNTS IN DATABASE ---');
    console.table(
      allUsers.map((u) => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        Role: u.role,
      }))
    );

    console.log('\n🎉 Admin seeding complete. You can now login as admin!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
