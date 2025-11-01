require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { connectDB, getSessionStore } = require('./db');

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const goingRoutes = require('./routes/going');

const PORT = process.env.PORT || 3006;
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
  const SERP_KEY = process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY || ''
  res.json({ message: 'Nightlife Coordination Service', search: '/api/search?location=City', provider: SERP_KEY ? 'serpapi:yelp' : 'sample' });
});

app.use('/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/going', goingRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Nightlife service listening on ${PORT}`));
}).catch(err => {
  console.error('Mongo connection failed', err);
  process.exit(1);
});
