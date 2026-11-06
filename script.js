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
    initMap(data.coord.lat, data.coord.lon);
  }catch(e){
    alert("Internet check karen");
  }
}