# Timestamp Microservice

This is a simple Express-based timestamp microservice that implements the FreeCodeCamp Timestamp Microservice project.

Features:
- GET /api/:date? returns JSON { unix, utc } for valid dates
- Returns { error: "Invalid Date" } for invalid inputs
- Supports empty parameter (returns current time)

Run locally:

1. cd into the service folder

```
cd services/timestamp
npm install
npm start
```

2. Examples:
- GET http://localhost:3000/api/1451001600000
- GET http://localhost:3000/api/2015-12-25
- GET http://localhost:3000/api/ (current time)
