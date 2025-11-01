# Image Search Abstraction Layer

A simple microservice for image search. Uses SerpApi (Google Images Light) when available; otherwise falls back to bundled sample data. Recent queries are persisted in MongoDB.

## Endpoints

- GET `http://localhost:3003/api/imagesearch/:query?page=N` — list images (url, snippet, thumbnail, context) for the given query
- GET `http://localhost:3003/api/recent` — most recent search terms (last 10)

## Setup

1) Get a SerpApi key (optional but recommended)

2) Configure environment
```bash
# .env
PORT=3003
MONGODB_URI=mongodb://127.0.0.1:27017/fcc_image_search
# Optional: use SerpApi when set
SERPAPI_KEY=your_key_here
# or SERPAPI_API_KEY=your_key_here
```

3) Install and run
```bash
npm install
npm start
```

## Example requests

```
GET http://localhost:3003/api/imagesearch/cats?page=1
```

```
GET http://localhost:3003/api/recent
```

## Notes
