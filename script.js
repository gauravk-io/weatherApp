const apiKey = "67f64a81ec23196be3643c12a7160d16";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkweather(city) {
    const response = await fetch(apiurl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else {
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "assets/clouds.png";
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "assets/clear.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "assets/rain.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "assets/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "assets/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

}

searchBtn.addEventListener("keypress", function (e) {
    if(e.key === 'Enter'){
        checkweather(searchBox.value);
    }
})

