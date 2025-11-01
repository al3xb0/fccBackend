require('dotenv').config()
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fcc_image_search'

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  mongoose.set('strictQuery', true)
  await mongoose.connect(MONGODB_URI, { autoIndex: true })
  return mongoose.connection
}

module.exports = { connectDB }
