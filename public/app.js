async function loadHealth() {
  const card = document.getElementById("health-card");
  try {
    const res = await fetch("/health");
    const data = await res.json();
    const uptime = Math.floor(data.uptime);
    card.innerHTML = `<span class="status ok"></span> Status: ${data.status} &mdash; Uptime: ${uptime}s`;
  } catch {
    card.innerHTML = `<span class="status error"></span> Unable to reach server`;
  }
}

async function loadUsers() {
  const list = document.getElementById("user-list");
  try {
    const res = await fetch("/users");
    const users = await res.json();
    list.innerHTML = users
      .map(
        (u) => `<li><span>${u.name}</span><span class="user-id">#${u.id}</span></li>`
      )
      .join("");
  } catch {
    list.innerHTML = "<li>Failed to load users</li>";
  }
}

function getWeatherState(temperature, humidity, windSpeed) {
  if (temperature <= 0) return "cold";
  if (temperature > 25) return "heat";
  if (temperature > 10 && humidity > 70 && windSpeed > 30) return "rain";
  return "normal";
}

const weatherLabels = {
  cold: "Brrr! Bundle up!",
  normal: "Nice and pleasant!",
  rain: "Grab an umbrella!",
  heat: "Beach time!",
};

const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location-input");
const locationResult = document.getElementById("location-result");

locationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = locationInput.value.trim();
  if (!query) return;

  locationResult.hidden = false;
  locationResult.innerHTML = "Searching...";

  try {
    const res = await fetch(`/api/location?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) {
      locationResult.innerHTML = `<span class="status error"></span> ${data.error}`;
      return;
    }
    const w = data.weather;
    locationResult.innerHTML = `
      <div class="location-header">
        <strong>${data.name}</strong>, ${data.country}
        <span class="location-coords">${data.lat}, ${data.lon}</span>
      </div>
      <div class="weather-grid">
        <div class="weather-item">
          <div class="weather-value">${w.temperature}${w.units.temperature_2m}</div>
          <div class="weather-label">Temperature</div>
        </div>
        <div class="weather-item">
          <div class="weather-value">${w.feelsLike}${w.units.apparent_temperature}</div>
          <div class="weather-label">Feels like</div>
        </div>
        <div class="weather-item">
          <div class="weather-value">${w.humidity}${w.units.relative_humidity_2m}</div>
          <div class="weather-label">Humidity</div>
        </div>
        <div class="weather-item">
          <div class="weather-value">${w.windSpeed} ${w.units.wind_speed_10m}</div>
          <div class="weather-label">Wind</div>
        </div>
      </div>
      <div class="weather-corgi">
        <img src="/images/${getWeatherState(w.temperature, w.humidity, w.windSpeed)}.jpg"
             alt="${weatherLabels[getWeatherState(w.temperature, w.humidity, w.windSpeed)]}">
        <div class="weather-state-label">${weatherLabels[getWeatherState(w.temperature, w.humidity, w.windSpeed)]}</div>
      </div>
    `;
  } catch {
    locationResult.innerHTML = `<span class="status error"></span> Failed to search location`;
  }
});

loadHealth();
