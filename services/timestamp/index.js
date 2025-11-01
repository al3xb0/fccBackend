const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Timestamp Microservice. Use GET /api/:date?');
});

app.get('/api/:date?', (req, res) => {
  const { date: dateParam } = req.params;
  let date;

  if (!dateParam) {
    date = new Date();
  } else {
    if (/^\d+$/.test(dateParam)) {
      date = new Date(Number(dateParam));
    } else {
      date = new Date(dateParam);
    }
  }

  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  return res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Timestamp service listening on port ${port}`);
});
