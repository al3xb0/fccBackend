## FCC Microservices Monorepo

This repository hosts a set of freeCodeCamp-style microservices and a React/Vite TypeScript frontend. Everything runs locally with consistent ports and a single command to start all services.

### Services and ports

- Timestamp: http://localhost:3000
- Request Header: http://localhost:3001
- URL Shortener: http://localhost:3002
- Image Search: http://localhost:3003
- File Metadata: http://localhost:3004
- Voting: http://localhost:3005
- Nightlife: http://localhost:3006
- Stock Market: http://localhost:3007
- Book Trading: http://localhost:3008
- Pinterest: http://localhost:3009
- Frontend (Vite dev server): http://localhost:5173

### Prerequisites

- Node.js 18+
- MongoDB running locally (required for: url-shortener, image-search recents, voting, nightlife, stock-market, book-trading, pinterest)
- Optional API keys:
  - SerpAPI (Image Search, Nightlife Yelp engine)
  - Alpha Vantage (Stock Market)
  - GitHub OAuth App (Pinterest)

### First-time setup

1) Copy each service's `.env.example` to `.env` and adjust as needed. At minimum, ensure `MONGODB_URI` points to a running MongoDB and set any API keys you have.
2) Install all dependencies for every package:

   - Windows PowerShell: run `npm run install:all` from the repo root.

### Run everything

- Start all backend services only: `npm run start:backend`
- Start everything (backend + frontend): `npm run start:all`

The frontend uses environment variables from `frontend/.env` to call the microservices at the ports listed above.

### Frontend environment

Frontend environment variables are in `frontend/.env` (see `frontend/.env.example`). They are preconfigured to the unified ports, for example:

```
VITE_API_BASE_TIMESTAMP=http://localhost:3000
VITE_API_BASE_REQUEST_HEADER=http://localhost:3001
VITE_API_BASE_URL_SHORTENER=http://localhost:3002
VITE_IMAGE_SEARCH_API=http://localhost:3003
VITE_FILE_METADATA_API=http://localhost:3004
VITE_VOTING_API=http://localhost:3005
VITE_NIGHTLIFE_API=http://localhost:3006
VITE_STOCK_MARKET_API=http://localhost:3007
VITE_BOOK_TRADING_API=http://localhost:3008
VITE_PINTEREST_API=http://localhost:3009
```

### Notes

- Pinterest GitHub OAuth: set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `CALLBACK_URL=http://localhost:3009/auth/github/callback` in `services/pinterest/.env`.
- Nightlife and Image Search: set `SERPAPI_KEY` if you want live results; otherwise a limited fallback may be used.
- Stock Market: set `ALPHA_VANTAGE_KEY` for live quotes; otherwise it runs with mock/delayed data.

### Troubleshooting

- If a service fails to start, ensure its `.env` exists and the configured port isn't taken.
- Confirm MongoDB is running and reachable at each service's `MONGODB_URI`.
- The Vite dev server runs at http://localhost:5173. If you change its port, update any OAuth `FRONTEND_URL` variables accordingly (e.g., Pinterest).
