# Exercise Tracker

A FreeCodeCamp-style Exercise Tracker microservice built with Express and Mongoose.

## Endpoints

- POST /api/users — create a new user (form field: username)
- GET /api/users — list all users
- POST /api/users/:_id/exercises — add an exercise (form fields: description, duration, date[yyyy-mm-dd optional])
- GET /api/users/:_id/logs?from=&to=&limit= — get exercise logs with optional filters

## Responses

User:
{
  "username": "fcc_test",
  "_id": "5fb5853f734231456ccb3b05"
}

Exercise:
{
  "username": "fcc_test",
  "description": "test",
  "duration": 60,
  "date": "Mon Jan 01 1990",
  "_id": "5fb5853f734231456ccb3b05"
}

Log:
{
  "username": "fcc_test",
  "count": 1,
  "_id": "5fb5853f734231456ccb3b05",
  "log": [{
    "description": "test",
    "duration": 60,
    "date": "Mon Jan 01 1990"
  }]
}

Note: Dates are rendered using JavaScript Date#toDateString.

## Setup

- Copy .env.example to .env and set MONGODB_URI (defaults to local Mongo) and PORT (defaults to 3010).
- Install dependencies and start:

```bash
npm install
npm run dev
```
