# File Metadata Microservice

A small service that accepts a file upload and returns its metadata, following the freeCodeCamp API & Microservices project spec.

## Endpoints

- GET `/` — HTML form to upload a file
- POST `/api/fileanalyse` — accepts multipart/form-data with a file field named `upfile` and responds with `{ name, type, size }`

## Quick start

```bash
# From this directory
npm install
npm start
```

Service runs on http://localhost:3004 by default (configurable via PORT env variable).

## FCC Requirements mapping

- Provide your own project URL — this service runs locally or can be deployed
- You can submit a form that includes a file upload — provided at GET /
- The form file input field has the name attribute set to `upfile` — ensured in the form
- When you submit a file, you receive the file name, type, and size in bytes — returned by POST /api/fileanalyse

## Notes

- Uses `multer` with in-memory storage. No files are written to disk.
- CORS enabled for convenience in testing.
