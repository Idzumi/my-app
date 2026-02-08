# my-app

A Node.js REST API built with Express 5.

## Getting Started

```bash
npm install
npm start
```

The server runs at http://localhost:3000.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Server status and uptime |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get a user by ID |
