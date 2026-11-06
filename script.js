const API_KEY = "e08d904b4d6f2d5e7a8c9b0f1a2b3c4d5"; // <-- Yahan apni wali key rehne do jo ab kaam kar rahi hai

function getWeatherIcon(main){
  main = main.toLowerCase();
  if(main.includes("clear")) return "☀️";
  if(main.includes("cloud")) return "☁️";
  if(main.includes("rain")) return "🌧️";
  if(main.includes("drizzle")) return "🌦️";
  if(main.includes("thunder")) return "⛈️";
  if(main.includes("snow")) return "❄️";
  if(main.includes("mist") || main.includes("haze") || main.includes("fog")) return "🌫️";
  return "🌤️";
}

async function getWeather(){
  const city = document.getElementById("cityInput").value.trim();
  if(!city) return alert("شہر کا نام لکھیں");
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ur`;
  try{
    const res = await fetch(url);
    const data = await res.json();
    if(res.status == 401){
      alert("API Key abhi active ho rahi hai, 20 minute baad try karen. Error: " + data.message);
      return;
    }
    if(data.cod != 200){
      alert("شہر نہیں ملا! " + data.message);
      return;
    }
    showWeather(data);
    getForecast(city);
    initMap(data.coord.lat, data.coord.lon);
  }catch(e){
    alert("Internet check karen");
  }
}

function showWeather(data){
  document.getElementById("weather").innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ درجہ حرارت: ${data.main.temp}°C ${getWeatherIcon(data.weather[0].main)}</p>
    <p>${getWeatherIcon(data.weather[0].main)} موسم: ${data.weather[0].description}</p>
    <p>💨 ہوا: ${data.wind.speed} m/s</p>
    <h3 style="margin-top:15px">اگلے دنوں کی پیشن گوئی:</h3>
    <div id="forecast" style="display:flex; gap:10px; overflow-x:auto; margin-top:10px"></div>
  `;
}

async function getForecast(city){
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  const forecastDiv = document.getElementById("forecast");
  if(!forecastDiv) return;
  
  forecastDiv.innerHTML = "";
  // Har din ka 1 data (12 baje wala)
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  
  daily.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    const temp = item.main.temp.toFixed(0);
    const main = item.weather[0].main;
    const icon = getWeatherIcon(main);
    
    const card = document.createElement("div");
    card.style.cssText = "background:#f0f0f0; padding:15px; border-radius:12px; min-width:80px; text-align:center;";
    card.innerHTML = `
      <div>${date.slice(5)}</div>
      <div style="font-size:32px; margin:5px 0">${icon}</div>
      <div>${temp}°C</div>
      <div style="font-size:12px">${main}</div>
    `;
    forecastDiv.appendChild(card);
  });
}

function initMap(lat, lon){
  if(window.myMap) window.myMap.remove();
  window.myMap = L.map('map').setView([lat, lon], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.myMap);
  L.marker([lat, lon]).addTo(window.myMap);
}

async function getLiveLocation(){
  document.getElementById("weather").innerHTML = "لوکیشن لی جا رہی ہے...";
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ur`;
    const res = await fetch(url);
    const data = await res.json();
    showWeather(data);
    getForecast(data.name);
    initMap(lat, lon);
  });
}