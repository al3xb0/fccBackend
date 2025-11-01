# Voting Service

Simple voting backend implementing FCC user stories: polls, voting, results, delete, add option, and demo session auth.

## Endpoints

Auth
- POST `/auth/login` { username }
- POST `/auth/logout`

Polls
- GET `/api/polls` — list all polls
- GET `/api/polls/:id` — get poll
- POST `/api/polls` — create poll (auth)
- DELETE `/api/polls/:id` — delete poll (owner only)
- POST `/api/polls/:id/vote` — vote for an option or add new option `{ optionId }` or `{ newOptionText }`

## Data shape
```
Poll {
  id: string,
  title: string,
  ownerId: string,
  createdAt: ISOString,
  options: Array<{ id: string, text: string, votes: number }>,
  voters: { [sessionId: string]: optionId }
}
```

## Run locally
Prereqs: MongoDB running and accessible. Configure env:

1. Copy `.env.example` to `.env` and set values (PORT, SESSION_SECRET, MONGODB_URI).
2. Install deps and start:
```bash
npm install
npm start
```
Default port: 3012. Sessions stored in MongoDB via connect-mongo.

## Notes
- Persistence uses MongoDB via Mongoose.
- Session auth is demo-grade only. Replace with OAuth/real auth for production.
