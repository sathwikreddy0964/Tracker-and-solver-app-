const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateRoles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tracker_and_solver_db';
    await mongoose.connect(mongoUri);

    // Promote pawan account if present
    const pawan = await User.findOne({ email: '242fa04077@vignan.ac.in' });
    if (pawan) {
      pawan.role = 'admin';
      await pawan.save();
      console.log('✅ Promoted pawan (242fa04077@vignan.ac.in) to ADMIN!');
    }

    const allUsers = await User.find().select('-password');
    console.table(
      allUsers.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
      }))
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRoles();
