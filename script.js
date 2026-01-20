async function handleSearch() {
  const query = document.getElementById("cityInput").value.trim();
  if (!query) return;

  hideError();

  try {
    // Step 1: Geocoding (City -> Lat/Lon)
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError();
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Weather Fetching
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    updateUI(weatherData, `${name}, ${country}`);
  } catch (err) {
    console.error(err);
    showError();
  }
}

function updateUI(data, fullLocation) {
  document.getElementById("displayCity").innerText = fullLocation;
  document.getElementById("temperature").innerText = `${Math.round(
    data.current.temperature_2m
  )}°C`;
  document.getElementById(
    "wind"
  ).innerText = `${data.current.wind_speed_10m} km/h`;
  document.getElementById(
    "humidity"
  ).innerText = `${data.current.relative_humidity_2m}%`;

  document.getElementById("weather-display").style.display = "block";
}

function showError() {
  document.getElementById("error-msg").style.display = "block";
  document.getElementById("weather-display").style.display = "none";
}

function hideError() {
  document.getElementById("error-msg").style.display = "none";
}

// Allow "Enter" key to trigger search
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});
