# Book Trading Club Service

Implements FCC user stories: view all books, add books, update profile settings, propose and accept/reject trades.

## Endpoints

Auth
- POST `/auth/login` { username }
- POST `/auth/logout`
- GET `/auth/me`

User Settings
- GET `/api/user/profile` (auth required)
- PUT `/api/user/profile` { fullName, city, state } (auth required)

Books
- GET `/api/books` — list all books (with owner names)
- POST `/api/books` { title, author } (auth required)
- DELETE `/api/books/:id` (owner only)

Trades
- GET `/api/trades` — my trade proposals (auth required)
- POST `/api/trades` { bookId } — propose trade (auth required)
- PUT `/api/trades/:id/accept` (owner only)
- PUT `/api/trades/:id/reject` (owner only)

## Run locally
Prereqs: MongoDB running and accessible (local or remote). Configure env:

1. Copy `.env.example` to `.env` and set values. Ensure `MONGODB_URI` is correct.
2. Install deps and start:
```bash
npm install
npm start
```

Default port: 3015. CORS with credentials enabled. Sessions are stored in MongoDB.
