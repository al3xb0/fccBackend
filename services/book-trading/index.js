require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { connectDB, getSessionStore } = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');
const tradesRoutes = require('./routes/trades');

const PORT = process.env.PORT || 3008;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: getSessionStore(session),
  cookie: { httpOnly: true }
}));

app.get('/', (req, res) => {
  res.json({ message: 'Book Trading Club Service' });
});

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/trades', tradesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Book Trading service listening on ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});
