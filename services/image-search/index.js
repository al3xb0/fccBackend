require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const searchRoutes = require('./routes/search');
const recentRoutes = require('./routes/recent');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Image Search Abstraction Layer - visit /api/imagesearch/:query?page=1 or /api/recent');
});

// Mount routes
app.use('/api', searchRoutes);
app.use('/api', recentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Image search service listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Mongo connection failed', err)
  process.exit(1)
});
