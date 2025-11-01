require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 3004;

app.use(cors());

// Serve the minimal form
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>File Metadata Microservice</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 2rem; }
    .card { max-width: 520px; padding: 1.5rem; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.08); }
    h1 { font-size: 1.25rem; margin: 0 0 .75rem; }
    p { color: #4b5563; margin: 0 0 1rem; }
    input[type=file] { display: block; margin: 1rem 0; }
    button { background:#111827; color:#fff; border:0; padding:.6rem 1rem; border-radius:8px; cursor:pointer; }
    button:hover { background:#0b1220; }
    .hint { font-size: .85rem; color:#6b7280; margin-top: .5rem; }
    footer { margin-top: 2rem; color:#6b7280; font-size: .875rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>File Metadata Microservice</h1>
    <p>Upload a file to get its name, type, and size in bytes.</p>
    <form method="POST" action="/api/fileanalyse" enctype="multipart/form-data">
      <input id="upfile" type="file" name="upfile" required />
      <button type="submit">Upload</button>
    </form>
    <div class="hint">Input name attribute is <code>upfile</code> as required by tests.</div>
  </div>
  <footer>POST /api/fileanalyse returns JSON: { name, type, size }</footer>
</body>
</html>`);
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, mimetype, size } = req.file;
  return res.json({
    name: originalname,
    type: mimetype,
    size: size
  });
});

app.listen(PORT, () => {
  console.log(`File Metadata service listening on port ${PORT}`);
});
