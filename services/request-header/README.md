# Request Header Parser Microservice

This service returns information about the requester's IP address, preferred language, and software (user agent).

Endpoints:
- GET /api/whoami — returns { ipaddress, language, software }

Run locally:

```
cd services/request-header
npm install
npm start
```
