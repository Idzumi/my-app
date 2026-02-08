# my-app

A Node.js REST API built with Express 5, with a built-in web dashboard.

## Getting Started

```bash
npm install
npm start
```

The server runs at http://localhost:3000.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Web dashboard UI |
| GET | `/health` | Server status and uptime |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get a user by ID |
| GET | `/api/location?q=` | Geocode a city name via OpenStreetMap Nominatim |

## Web UI

The dashboard at `/` displays:

- **Server health** — live status and uptime from the `/health` endpoint
- **Location search** — enter a city name to get its country and coordinates

Static files are served from the `public/` directory.

## Deployment

The app is hosted on [Fly.io](https://fly.io) at:

**https://my-app-idzumi.fly.dev**

To deploy updates:

```bash
fly deploy
```
