# Pinterest Clone Service

Pinterest-style image pinning app with GitHub OAuth and email/password authentication.

## Features
- GitHub OAuth login
- Email/password signup and login
- Add image pins with description
- Delete your own pins
- Browse all pins in masonry grid layout
- View pins by specific user
- Search images via the Image Search microservice (proxies backend-to-backend)
- Automatic broken image placeholder

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Set "Authorization callback URL" to `http://localhost:3009/auth/github/callback`
   - Copy Client ID and Client Secret to `.env`
   - Note: If `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET` are missing, GitHub OAuth is disabled and `/auth/github` will return 503 with setup instructions.

4. Configure Image Search service base URL:
   - Ensure the Image Search service is running (default http://localhost:3003)
   - Set `IMAGE_SEARCH_API=http://localhost:3003` in `.env` (or your deployed URL)

5. Start the service (requires MongoDB):
```bash
npm start
```

## API Endpoints

### Auth
- `GET /auth/github` - Initiate GitHub OAuth flow
- `GET /auth/github/callback` - OAuth callback (redirects to frontend)
- `GET /auth/me` - Get current authenticated user
- `POST /auth/logout` - Logout
// Email auth
- `POST /auth/register` - Register with email and password
   ```json
   { "email": "user@example.com", "password": "secret123", "displayName": "Optional Name" }
   ```
- `POST /auth/login` - Login with email and password
   ```json
   { "email": "user@example.com", "password": "secret123" }
   ```
  
   If OAuth is not configured, `GET /auth/github` responds with:
   ```json
   { "error": "GitHub OAuth not configured", "setup": "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env and restart the service." }
   ```

### Pins
- `GET /api/pins` - Get all pins (optional `?userId=X` filter)
- `POST /api/pins` - Create pin (requires auth)
  ```json
  { "imageUrl": "https://...", "description": "..." }
  ```
- `DELETE /api/pins/:id` - Delete own pin (requires auth)

### Search
- `GET /api/search?q=query` - Proxies to Image Search (`/api/imagesearch/:query?page=1`) and returns a simplified list

## Port
Default: `3009`. Sessions and data stored in MongoDB. Configure `MONGODB_URI` in `.env`.
