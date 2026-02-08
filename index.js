import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/location", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
    const response = await fetch(url, {
      headers: { "User-Agent": "my-app/1.0" },
    });
    const data = await response.json();
    if (data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    const place = data[0];
    const { lat, lon } = place;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`;
    const weatherRes = await fetch(weatherUrl);
    const weather = await weatherRes.json();

    res.json({
      name: place.address.city || place.address.town || place.address.village || place.name,
      country: place.address.country,
      countryCode: place.address.country_code,
      lat,
      lon,
      displayName: place.display_name,
      weather: {
        temperature: weather.current.temperature_2m,
        feelsLike: weather.current.apparent_temperature,
        humidity: weather.current.relative_humidity_2m,
        windSpeed: weather.current.wind_speed_10m,
        code: weather.current.weather_code,
        units: weather.current_units,
      },
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]);
});

app.get("/users/:id", (req, res) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
