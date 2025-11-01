require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { promisify } = require('util');
const mongoose = require('mongoose');
const Url = require('./models/Url');

const dnsLookup = promisify(dns.lookup);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Validate URL format and DNS
async function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // DNS lookup to verify host exists
    await dnsLookup(urlObj.hostname);
    return true;
  } catch (err) {
    return false;
  }
}

app.get('/', (req, res) => {
  res.send('URL Shortener Microservice. POST to /api/shorturl to create, GET /api/shorturl/:id to use.');
});

// Create short URL
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;

  try {
    // Validate URL format and DNS
    if (!await isValidUrl(url)) {
      return res.json({ error: 'invalid url' });
    }

    // Find or create URL entry
    let urlDoc = await Url.findOne({ original_url: url });
    if (!urlDoc) {
      // Get next short_url number
      const count = await Url.countDocuments();
      urlDoc = await Url.create({
        original_url: url,
        short_url: count + 1
      });
    }

    res.json({
      original_url: urlDoc.original_url,
      short_url: urlDoc.short_url
    });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect to original URL
app.get('/api/shorturl/:short_url', async (req, res) => {
  const { short_url } = req.params;

  try {
    const urlDoc = await Url.findOne({ short_url: Number(short_url) });
    if (!urlDoc) {
      return res.status(404).json({ error: 'No short URL found' });
    }

    res.redirect(urlDoc.original_url);
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`URL Shortener service listening on port ${port}`);
});