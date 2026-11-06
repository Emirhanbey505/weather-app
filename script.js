const API_KEY = "e08d904b007cb14f02d470cb76f2543a";

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
      alert("API Key galat hai. Apni asal key lagao");
      return;
    }
    if(data.cod != 200){
      alert("شہر نہیں ملا!");
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
  const icon = getWeatherIcon(data.weather[0].main);
  document.getElementById("weather").innerHTML = `
    <h2>${data.name}, ${data.sys.country} ${icon}</h2>
    <p>درجہ حرارت: ${data.main.temp}°C</p>
    <p>موسم: ${data.weather[0].description}</p>
    <p>ہوا: ${data.wind.speed} m/s</p>
    <div id="forecast" style="display:flex;gap:10px;overflow-x:auto;margin-top:15px;"></div>
  `;
}

async function getForecast(city){
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  const forecastDiv = document.getElementById("forecast");
  if(!forecastDiv) return;
  forecastDiv.innerHTML = "";
  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  daily.forEach(item => {
    const date = item.dt_txt.split(" ")[0].slice(5);
    const temp = Math.round(item.main.temp);
    const icon = getWeatherIcon(item.weather[0].main);
    const card = document.createElement("div");
    card.style.cssText = "background:#eee;padding:10px;border-radius:10px;min-width:70px;text-align:center;";
    card.innerHTML = `<div>${date}</div><div style="font-size:24px">${icon}</div><div>${temp}°C</div>`;
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