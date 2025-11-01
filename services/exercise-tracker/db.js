const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fcc_exercise';

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true
  });
  console.log('Exercise Tracker: connected to MongoDB');
  return mongoose.connection;
}

module.exports = { connectDB };
