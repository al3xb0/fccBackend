require('dotenv').config()
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fcc_book_trading'

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  mongoose.set('strictQuery', true)
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true
  })
  return mongoose.connection
}

function getSessionStore(session) {
  return MongoStore.create({ mongoUrl: MONGODB_URI, collectionName: 'sessions' })
}

module.exports = { connectDB, getSessionStore }
