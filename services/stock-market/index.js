require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
const fetch = require('node-fetch');
const { connectDB } = require('./db');
const Stock = require('./models/Stock');

const PORT = process.env.PORT || 3007;
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || '';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast to all connected WS clients
function broadcast(msg) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(msg));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('WS client connected');
  ws.on('close', () => console.log('WS client disconnected'));
});

app.get('/', (req, res) => {
  res.json({ message: 'Stock Market Chart Service', stocks: '/api/stocks' });
});

// Get all stocks
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find({}).lean()
    res.json(stocks || [])
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
});

// Add stock
app.post('/api/stocks', async (req, res) => {
  const { symbol } = req.body || {};
  if (!symbol || typeof symbol !== 'string') return res.status(400).json({ error: 'symbol is required' });
  const sym = symbol.toUpperCase().trim();
  try {
    const exists = await Stock.findOne({ symbol: sym }).lean()
    if (exists) return res.status(409).json({ error: 'Stock already exists' })

  // Fetch data from Alpha Vantage (or fallback to mock)
  let prices = [];
  if (ALPHA_VANTAGE_KEY) {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sym}&apikey=${ALPHA_VANTAGE_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      const ts = data['Time Series (Daily)'];
      if (ts) {
        prices = Object.entries(ts).slice(0, 30).reverse().map(([date, vals]) => ({
          date,
          close: parseFloat(vals['4. close'])
        }));
      }
    } catch (e) {
      console.error('Alpha Vantage error:', e);
    }
  }
  
  // Fallback to mock data if no key or error
  if (prices.length === 0) {
    prices = generateMockPrices(sym);
  }
  const stock = await Stock.create({ symbol: sym, prices })
  broadcast({ type: 'add', stock: stock.toObject() });
  res.status(201).json(stock.toObject());
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
});

// Remove stock
app.delete('/api/stocks/:symbol', async (req, res) => {
  try {
    const sym = req.params.symbol.toUpperCase();
    const result = await Stock.deleteOne({ symbol: sym })
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' })
    broadcast({ type: 'remove', symbol: sym });
    res.json({ ok: true, symbol: sym });
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
});

function generateMockPrices(symbol) {
  const base = 100 + Math.random() * 100;
  const prices = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const close = base + (Math.random() - 0.5) * 10;
    prices.push({ date: dateStr, close });
  }
  return prices;
}

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Stock Market service listening on ${PORT}`));
}).catch(err => {
  console.error('Mongo connection failed', err)
  process.exit(1)
});
