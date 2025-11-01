# Stock Market Chart Service

Real-time stock charting app with WebSocket sync. Implements FCC user stories: view trend lines, add/remove stocks, real-time updates.

## Endpoints

REST API
- GET `/api/stocks` — list all tracked stocks
- POST `/api/stocks` — add stock by `{ symbol }` (fetches price data)
- DELETE `/api/stocks/:symbol` — remove stock

WebSocket
- Connect to `ws://localhost:3014` for real-time broadcasts
- Message types: `{ type: 'add', stock }` | `{ type: 'remove', symbol }`

## Data Source
- Alpha Vantage API if `ALPHA_VANTAGE_KEY` is set (30 days of closing prices)
- Falls back to mock data if key missing

## Run locally
Prereqs: MongoDB available.

1. Copy `.env.example` to `.env` and set `PORT`, `MONGODB_URI`, optionally `ALPHA_VANTAGE_KEY`.
2. Install and start:
```bash
npm install
npm start
```

Default port: 3014. CORS enabled. Stocks persist in MongoDB.
