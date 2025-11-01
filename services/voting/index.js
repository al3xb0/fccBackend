require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { connectDB, getSessionStore } = require('./db');

const authRoutes = require('./routes/auth');
const pollsRoutes = require('./routes/polls');

const PORT = process.env.PORT || 3005;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: getSessionStore(session),
  cookie: { httpOnly: true }
}));

app.get('/', (req, res) => {
  res.json({ message: 'Voting service', docs: '/README' });
});

app.use('/auth', authRoutes);
app.use('/api/polls', pollsRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Voting service listening on ${PORT}`));
}).catch(err => {
  console.error('Mongo connection failed', err);
  process.exit(1);
});
