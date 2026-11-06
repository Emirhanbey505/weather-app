let map;
let marker;

const API_KEY = "e08d904b007cb14f02d470cb76f2543a"; // یہاں اپنی OpenWeather API Key ڈالیں

// نقشہ شروع میں لوڈ کرنا
function initMap(lat = 34.0151, lon = 71.5249) { // Default Peshawar
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
}
initMap();

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("شہر کا نام لکھیں");
    fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                document.getElementById("result").innerHTML = "شہر نہیں ملا!";
                return;
            }
            showWeather(data);
            initMap(data.coord.lat, data.coord.lon);
            fetchForecast(data.name);
        });
}

function getLiveLocation() {
    document.getElementById("result").innerHTML = "لوکیشن لی جا رہی ہے...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    showWeather(data);
                    initMap(lat, lon);
                    fetchForecast(data.name);
                });
        }, () => {
            alert("لوکیشن کی اجازت دیں!");
        });
    } else {
        alert("آپ کا براؤزر لوکیشن سپورٹ نہیں کرتا");
    }
}

function showWeather(data) {
    document.getElementById("result").innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>🌡️ درجہ حرارت: ${data.main.temp}°C</p>
        <p>☁️ موسم: ${data.weather[0].description}</p>
        <p>💨 ہوا: ${data.wind.speed} m/s</p>
    `;
}

function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url).then(res => res.json()).then(data => {
        let html = "<h4>اگلے دنوں کی پیشن گوئی:</h4><div style='display:flex;gap:8px;overflow:auto'>";
        for (let i = 0; i < data.list.length; i += 8) {
            const d = data.list[i];
            html += `<div style='background:#f0f0f0;padding:8px;border-radius:8px'><p>${d.dt_txt.split(' ')[0]}</p><p>${d.main.temp}°C</p><p>${d.weather[0].main}</p></div>`;
        }
        html += "</div>";
        document.getElementById("forecast").innerHTML = html;
    });
}