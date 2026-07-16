require('dotenv').config();
const mongoose = require('mongoose');
const Theatre = require('./src/models/Theatre');

async function fixStatus() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Theatre.updateMany(
    { status: { $exists: false } },
    { $set: { status: 'pending' } }
  );

  console.log(`Updated ${result.modifiedCount} theatres`);
  process.exit();
}

fixStatus();