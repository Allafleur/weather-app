function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let daynumber = date.getDate();
  let month = date.getMonth() + 1;
  return `${day}, ${daynumber}.${month}, ${hours}:${minutes}`;
}
let now = new Date();
let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = formatDate(now);

function showTemperature(response) {
  console.log(response);
  /*if (response.data.name) {
    document.querySelector("#show-city").innerHTML = response.data.name;
  } else {
    alert("Please type a real city name");
  }*/
  document.querySelector("#show-city").innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#celcius-link");
  temperatureElement.innerHTML = `${temperature}°C`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  //document.querySelector("#sunrise").innerHTML = response.data.sys.sunrise;
  //document.querySelector("#sunset").innerHTML = response.data.sys.sunset;

  function convertFahrenheit() {
    if (fahrenheit.addEventListener) {
      fahrenheit.innerHTML = Math.round((temperature * 9) / 5 + 32);
    }
  }
  let fahrenheit = document.querySelector("#fahrenheit-link");
  fahrenheit.addEventListener("click", convertFahrenheit);
}

function defaultCity() {
  let city = "Vienna";
  let apiKey = "a106d60ef865934fed5a96e8563d9489";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
defaultCity();

function searchCity() {
  let city = document.querySelector("#enter-city").value;
  if (city) {
    let apiKey = "a106d60ef865934fed5a96e8563d9489";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
  } else {
    alert("Please type a city");
  }
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

//5week
function showCurrentLocation() {
  function showCurrentTemperature(response) {
    let temperature = Math.round(response.data.main.temp);
    let city = response.data.name;
    let cityName = document.querySelector("#show-city");
    cityName.innerHTML = `${city}`;
    let h1 = document.querySelector("#celcius-link");
    h1.innerHTML = `${temperature}°C`;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(
      response.data.wind.speed
    );
    //console.log(response);
  }

  function searchCurrentPosition(position) {
    //console.log(position);

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "a106d60ef865934fed5a96e8563d9489";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    {
      axios.get(apiUrl).then(showCurrentTemperature);
    }
  }

  //function showCurrentCity()
  navigator.geolocation.getCurrentPosition(searchCurrentPosition);
}

let currentLocationButton = document.querySelector("#current-city");
currentLocationButton.addEventListener("click", showCurrentLocation);
