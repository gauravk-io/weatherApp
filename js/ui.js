import { formatTime, formatDay, degToCompass, getAQIDescription } from './utils.js';

export const UI = {
    elements: {
        cityName: document.getElementById('city-name'),
        currentDate: document.getElementById('current-date'),
        currentTemp: document.getElementById('current-temp'),
        weatherDesc: document.getElementById('weather-desc'),
        weatherIcon: document.getElementById('weather-icon'),
        feelsLike: document.getElementById('feels-like'),
        highLow: document.getElementById('high-low'),
        uvIndex: document.getElementById('uv-index'),
        uvText: document.getElementById('uv-text'),
        windSpeed: document.getElementById('wind-speed'),
        windDir: document.getElementById('wind-dir'),
        sunrise: document.getElementById('sunrise'),
        sunset: document.getElementById('sunset'),
        humidity: document.getElementById('humidity'),
        visibility: document.getElementById('visibility'),
        aqi: document.getElementById('aqi'),
        aqiText: document.getElementById('aqi-text'),
        hourlyForecast: document.getElementById('hourly-forecast'),
        dailyForecast: document.getElementById('daily-forecast'),
        themeToggle: document.getElementById('theme-toggle'),
        unitToggle: document.getElementById('unit-toggle'),
        settingsUnit: document.getElementById('settings-unit'),
        citySearch: document.getElementById('city-search'),
        searchResults: document.getElementById('search-results'),
        favoritesList: document.getElementById('favorites-list')
    },

    renderCurrentWeather(data, units) {
        const { elements } = this;
        const tempUnit = units === 'metric' ? '°C' : '°F';
        const speedUnit = units === 'metric' ? 'km/h' : 'mph';

        elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
        elements.currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        elements.currentTemp.textContent = `${Math.round(data.main.temp)}${tempUnit}`;
        elements.weatherDesc.textContent = data.weather[0].description;
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
        elements.highLow.textContent = `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°`;
        
        elements.windSpeed.textContent = data.wind.speed;
        elements.windDir.querySelector('.direction').textContent = degToCompass(data.wind.deg);
        elements.windDir.querySelector('i').style.transform = `rotate(${data.wind.deg}deg)`;
        
        elements.sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
        elements.sunset.textContent = formatTime(data.sys.sunset, data.timezone);
        
        elements.humidity.textContent = data.main.humidity;
        elements.visibility.textContent = (data.visibility / 1000).toFixed(1);
        

        elements.uvIndex.textContent = 'N/A';
        elements.uvText.textContent = 'Not available';
    },

    renderAQI(data) {
        const aqi = data.list[0].main.aqi;
        const { label, color } = getAQIDescription(aqi);
        this.elements.aqi.textContent = aqi;
        this.elements.aqiText.textContent = label;
        this.elements.aqiText.style.color = color;
    },

    renderForecast(data, units) {
        const tempUnit = units === 'metric' ? '°C' : '°F';
        

        this.elements.hourlyForecast.innerHTML = data.list.slice(0, 8).map(item => `
            <div class="hourly-item">
                <span>${formatTime(item.dt, data.city.timezone)}</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
                <span>${Math.round(item.main.temp)}°</span>
            </div>
        `).join('');



        let dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        if (dailyData.length === 0) {

            dailyData = data.list.filter((_, index) => index % 8 === 0);
        }

        this.elements.dailyForecast.innerHTML = dailyData.map(item => `
            <div class="daily-item">
                <span>${formatDay(item.dt)}</span>
                <div style="display:flex; align-items:center;">
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon" style="width:30px">
                    <span>${item.weather[0].main}</span>
                </div>
                <span>${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°</span>
            </div>
        `).join('');
    },

    renderSearchResults(results, onSelect) {
        if (!results || results.length === 0) {
            this.elements.searchResults.classList.add('hidden');
            return;
        }
        
        this.elements.searchResults.innerHTML = results.map((city, index) => `
            <div class="search-item" data-index="${index}">
                ${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}
            </div>
        `).join('');
        
        this.elements.searchResults.classList.remove('hidden');
        
        this.elements.searchResults.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.dataset.index;
                onSelect(results[index]);
                this.elements.searchResults.classList.add('hidden');
            });
        });
    },

    renderFavorites(favorites, onSelect, onRemove) {
        this.elements.favoritesList.innerHTML = favorites.map((city, index) => `
            <li>
                <span class="fav-city-name" style="cursor:pointer">${city.name}</span>
                <button class="remove-fav" data-lat="${city.lat}" data-lon="${city.lon}">✖</button>
            </li>
        `).join('');

        this.elements.favoritesList.querySelectorAll('.fav-city-name').forEach((el, i) => {
            el.addEventListener('click', () => onSelect(favorites[i]));
        });

        this.elements.favoritesList.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                onRemove(parseFloat(btn.dataset.lat), parseFloat(btn.dataset.lon));
            });
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    },

    showLoading() {

        this.elements.cityName.textContent = "Loading...";
    }
};
