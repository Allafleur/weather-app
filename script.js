function formatDate(timestamp) {
  let date = new Date(timestamp);
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
  return `Last updated: ${day}, ${daynumber}.${month}, ${hours}:${minutes}`;
}

function formatDateSun(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="card">
          <div class="card-body">
            <div class="card-title"></div>
              <div class="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</div>
                <p class="card-text">
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"  
                />                 
                 <div class="weather-forecast-temperatures">
                    <span class="forecast-temp-max">${Math.round(
                      forecastDay.temp.max
                    )}°</span>
                    <span class="forecast-temp-min">${Math.round(
                      forecastDay.temp.min
                    )}°</span>
                  </div>
                </p>
          </div>
        </div>        
      </div> `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function showTemperature(response) {
  document.querySelector("#show-city").innerHTML = response.data.name;
  celciusTemperature = response.data.main.temp;

  let temperature = Math.round(celciusTemperature);
  temperatureElement.innerHTML = `${temperature}`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  let dateElement = document.querySelector("#current-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  document.querySelector("#sunrise").innerHTML = formatDateSun(
    response.data.sys.sunrise
  );
  document.querySelector("#sunset").innerHTML = formatDateSun(
    response.data.sys.sunset
  );
  getForecast(response.data.coord);
  clearSearchCity();
}

function displayFahrenheit(event) {
  event.preventDefault();
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
  temperatureElement.innerHTML = Math.round((celciusTemperature * 9) / 5 + 32);
}

function displayCelcius(event) {
  event.preventDefault();
  fahrenheit.classList.remove("active");
  celcius.classList.add("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

var apiKey = "a106d60ef865934fed5a96e8563d9489";
var celciusTemperature = null;
let temperatureElement = document.querySelector("#celcius-link");
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", displayFahrenheit);
let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", displayCelcius);

function defaultCity() {
  let city = "Vienna";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
defaultCity();

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#enter-city").value;
  if (!isNaN(city)) {
    alert("Wrong city name!");
    return;
  }

  if (city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
    axios
      .get(`${apiUrl}&appid=${apiKey}`)
      .then(showTemperature)
      .catch(function (e) {
        console.log(e);
        alert(
          "Error, you entered wrong city name! Please try another city name!"
        );
      });
  } else {
    alert("Please type a city");
  }
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

//Current location

function clearSearchCity() {
  let input = document.querySelector("#enter-city");
  input.value = "";
}

function showCurrentTemperature(response) {
  celciusTemperature = response.data.main.temp;
  let temperature = Math.round(celciusTemperature);
  let city = response.data.name;
  let cityName = document.querySelector("#show-city");
  cityName.innerHTML = `${city}`;
  let h1 = document.querySelector("#celcius-link");
  h1.innerHTML = `${temperature}`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#sunrise").innerHTML = formatDateSun(
    response.data.sys.sunrise
  );
  document.querySelector("#sunset").innerHTML = formatDateSun(
    response.data.sys.sunset
  );
  getForecast(response.data.coord);
}
function searchCurrentPosition(position) {
  //console.log(position);

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  {
    axios.get(apiUrl).then(showCurrentTemperature);
  }
}

function showCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentPosition);
  clearSearchCity();
}

let currentLocationButton = document.querySelector("#current-city");
currentLocationButton.addEventListener("click", showCurrentLocation);
