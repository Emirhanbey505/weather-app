<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Weather App with Map</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
body{margin:0;font-family:Arial;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;justify-content:center;padding:15px}
.card{background:#fff;width:100%;max-width:400px;border-radius:20px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.3)}
input{width:100%;padding:12px;border-radius:10px;border:1px solid #ccc;box-sizing:border-box}
button{width:100%;padding:12px;margin-top:10px;border:none;border-radius:10px;background:#667eea;color:#fff;font-weight:bold}
#result{text-align:center;margin-top:15px;font-size:18px}
#map{height:300px;border-radius:15px;margin-top:15px}
</style>
</head>
<body>
<div class="card">
<h2 style="text-align:center">Weather App 🌦️ with Map</h2>
<input id="city" placeholder="Enter city e.g. Peshawar, Berlin">
<button onclick="searchCity()">Search</button>
<button onclick="myLoc()" style="background:#333">📍 My Location</button>
<div id="result">Loading Peshawar...</div>
<div id="map"></div>
</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
let map=L.map('map').setView([34.0151,71.5249],6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;
async function getWeather(lat,lon,name){
 document.getElementById('result').innerText='Loading...';
 let r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
 let d=await r.json();
 document.getElementById('result').innerHTML=`<b>${name}</b><br>🌡️ ${d.current_weather.temperature}°C<br>💨 ${d.current_weather.windspeed} km/h wind`;
 map.setView([lat,lon],10);
 if(marker) map.removeLayer(marker);
 marker=L.marker([lat,lon]).addTo(map);
}
async function searchCity(){
 let city=document.getElementById('city').value;
 if(!city) return alert('Enter city');
 let r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
 let d=await r.json();
 if(!d.results){alert('City not found');return;}
 let p=d.results[0];
 getWeather(p.latitude,p.longitude,p.name+', '+p.country);
}
function myLoc(){
 navigator.geolocation.getCurrentPosition(pos=>{
   getWeather(pos.coords.latitude,pos.coords.longitude,'My Location');
 },()=>alert('Allow location permission'));
}
getWeather(34.0151,71.5249,'Peshawar');
</script>
</body>
</html>