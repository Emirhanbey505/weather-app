async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    const apiKey = 'YOUR_API_KEY'; // بعد میں یہاں اپنی API key ڈالنا
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // For now, demo data without API
    document.getElementById('cityName').innerText = city;
    document.getElementById('temp').innerText = Math.floor(Math.random() * 15 + 20) + '°C';
    document.getElementById('desc').innerText = 'Sunny / Clear Weather - Demo';

    // جب تمہارے پاس API key آئے گی تو اوپر والا url استعمال ہوگا
    // try {
    //   const response = await fetch(url);
    //   const data = await response.json();
    //   document.getElementById('temp').innerText = data.main.temp + '°C';
    //   document.getElementById('desc').innerText = data.weather[0].description;
    // } catch (error) {
    //   alert('City not found');
    // }
}