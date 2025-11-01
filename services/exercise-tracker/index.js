require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Exercise Tracker Microservice. Use /api/users');
});

app.use('/api/users', usersRouter);

const port = process.env.PORT || 3010;
connectDB().then(() => {
  app.listen(port, () => console.log(`Exercise Tracker service listening on port ${port}`));
});
