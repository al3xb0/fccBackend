require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { connectDB, getSessionStore } = require('./db');
const { customAlphabet } = require('nanoid')
const nid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const pinsRoutes = require('./routes/pins');
const searchRoutes = require('./routes/search');

const PORT = process.env.PORT || 3009;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3009/auth/github/callback';
const OAUTH_ENABLED = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: getSessionStore(session),
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    message: 'Pinterest Clone Service',
    auth: '/auth/github',
    oauthEnabled: OAUTH_ENABLED,
    note: OAUTH_ENABLED ? undefined : 'GitHub OAuth disabled: set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env'
  });
});

// Passport GitHub OAuth (conditionally enabled)
if (OAUTH_ENABLED) {
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id }).lean()
      if (!user) {
        const created = await User.create({
          id: nid(),
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
        })
        user = created.toObject()
      }
      return done(null, { id: user.id })
    } catch (e) {
      return done(e)
    }
  }));
} else {
  console.warn('[Pinterest] GitHub OAuth is disabled: missing GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET');
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ id }).lean()
    done(null, user)
  } catch (e) {
    done(e)
  }
});

// OAuth endpoints mounted from routes/auth (they call passport middleware)
app.use('/auth', authRoutes);
app.use('/api/pins', pinsRoutes);
app.use('/api/search', searchRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Pinterest service listening on ${PORT}`));
}).catch(err => {
  console.error('Mongo connection failed', err);
  process.exit(1);
});
