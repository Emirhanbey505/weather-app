var map = L.map('map').setView([34.0151, 71.5249], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
var marker = L.marker([34.0151, 71.5249]).addTo(map).bindPopup("Peshawar");

async function getWeather(){
  const city = document.getElementById("cityInput").value;
  if(!city) return;
  const result = document.getElementById("result");
  result.innerHTML = "Loading...";
  try {
    const res = await fetch(`https://wttr.in/${city}?format=j1`);
    const data = await res.json();
    const current = data.current_condition[0];
    const area = data.nearest_area[0];
    const lat = parseFloat(area.latitude);
    const lon = parseFloat(area.longitude);
    result.innerHTML = `
      <h3>${area.areaName[0].value}, ${area.country[0].value}</h3>
      <p>🌡️ ${current.temp_C}°C - ${current.weatherDesc[0].value}</p>
      <p>💨 Wind: ${current.windspeedKmph} km/h</p>
    `;
    map.setView([lat, lon], 8);
    marker.setLatLng([lat, lon]).bindPopup(`${city} - ${current.temp_C}°C`).openPopup();
  } catch(e) {
    result.innerHTML = "City not found!";
  }
}
document.getElementById("cityInput").value = "Peshawar";
getWeather();