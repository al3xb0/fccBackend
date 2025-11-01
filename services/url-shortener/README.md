# URL Shortener Microservice

This service creates short URLs for any valid website and handles redirects to the original URLs.

## Features
- POST `/api/shorturl` — Create short URL from original URL
- GET `/api/shorturl/:id` — Redirect to original URL
- DNS validation of submitted URLs
- MongoDB storage for URL mappings

## Requirements
- MongoDB running locally on default port (27017) or a reachable MongoDB URI
- Node.js 18+

## Setup and run

1) Configure environment
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/urlshortener
PORT=3002
```

2) Install and start
```bash
npm install
npm start
```

## API Usage

1) Create a short URL
```bash
curl -X POST http://localhost:3002/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com"}'
```
Response: `{ "original_url": "https://www.example.com", "short_url": 1 }`

2) Use short URL: Visit or curl http://localhost:3002/api/shorturl/1
Result: Redirects to the original URL