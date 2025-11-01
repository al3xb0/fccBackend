const express = require('express');
const User = require('../models/User');
const Exercise = require('../models/Exercise');

const router = express.Router();

// POST /api/users - create user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !String(username).trim()) {
      return res.status(400).json({ error: 'username is required' });
    }
    let user = await User.findOne({ username: String(username).trim() });
    if (!user) {
      user = await User.create({ username: String(username).trim() });
    }
    res.json({ username: user.username, _id: user._id });
  } catch (err) {
    console.error('Create user error:', err);
    // Handle duplicate key error gracefully
    if (err.code === 11000) {
      const user = await User.findOne({ username: req.body.username.trim() });
      return res.json({ username: user.username, _id: user._id });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users - list users
router.get('/', async (_req, res) => {
  const users = await User.find({}, { username: 1 }).lean();
  res.json(users.map(u => ({ username: u.username, _id: u._id })));
});

// POST /api/users/:_id/exercises - add exercise
router.post('/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!description || !String(description).trim()) {
      return res.status(400).json({ error: 'description is required' });
    }
    const dur = Number(duration);
    if (!Number.isFinite(dur)) {
      return res.status(400).json({ error: 'duration must be a number' });
    }

    let d = new Date();
    if (date !== undefined && date !== null && String(date).trim() !== '') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime()) && isFinite(parsedDate.getTime())) {
        d = parsedDate;
      }
    }

    const ex = await Exercise.create({
      userId: user._id,
      description: String(description).trim(),
      duration: dur,
      date: d
    });

    res.json({
      username: user.username,
      description: ex.description,
      duration: ex.duration,
      date: new Date(ex.date).toDateString(),
      _id: user._id
    });
  } catch (err) {
    console.error('Add exercise error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = { userId: user._id };
    const dateFilter = {};
    if (from) {
      const f = new Date(from);
      if (!isNaN(f.getTime())) {
        // normalize to start of day
        const fromStart = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0, 0);
        dateFilter.$gte = fromStart;
      }
    }
    if (to) {
      const t = new Date(to);
      if (!isNaN(t.getTime())) {
        // normalize to end of day
        const toEnd = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59, 999);
        dateFilter.$lte = toEnd;
      }
    }
    if (Object.keys(dateFilter).length) {
      query.date = dateFilter;
    }

    let cursor = Exercise.find(query).sort({ date: 1 });
    const lim = Number(limit);
    if (Number.isFinite(lim) && lim > 0) {
      cursor = cursor.limit(lim);
    }

    const items = await cursor.lean();
    const log = items.map(x => ({
      description: x.description,
      duration: x.duration,
      date: new Date(x.date).toDateString()
    }));

    res.json({
      username: user.username,
      count: log.length,
      _id: user._id,
      log
    });
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
