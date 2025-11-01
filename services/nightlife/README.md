# Nightlife Coordination Service

Implements FCC Nightlife user stories: search bars by city (SerpApi Yelp), mark yourself as going tonight, remove yourself, and keep search after login.

## Endpoints

Auth
- POST `/auth/login` { username }
- POST `/auth/logout`

Search
- GET `/api/search?location=City` — returns bars with going counts for today (via SerpApi Yelp engine)

Going
- POST `/api/going` — body: `{ businessId, date? }` (date defaults to today UTC)
- DELETE `/api/going` — body: `{ businessId, date? }`

## Notes
- Uses SerpApi Yelp engine (set `SERPAPI_KEY` or `SERPAPI_API_KEY`). If missing, falls back to `sample_bars.json`.
- CORS with credentials is enabled; frontend should send `credentials: 'include'` on requests.
- Persistence via MongoDB (Mongoose). Going data stored per dateKey/businessId with user arrays.

## Run locally
Prereqs: MongoDB available.

1. Copy `.env.example` to `.env` and set `PORT`, `SESSION_SECRET`, `MONGODB_URI`, optionally `SERPAPI_KEY`.
2. Install and start:
```bash
npm install
npm start
```
Default port: 3013. Sessions stored in MongoDB.
