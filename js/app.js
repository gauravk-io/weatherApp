import * as API from './api.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { renderCharts } from './charts.js';
import { debounce } from './utils.js';


let currentState = {
    lat: 22.5726,
    lon: 88.3639,
    city: 'Kolkata',
    units: 'metric',
    theme: 'dark'
};

let mapInstance = null;
let mapMarker = null;


async function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Failed', err));
    }

    loadSettings();
    setupEventListeners();
    

    console.log("Initializing app...");
    if (navigator.geolocation) {
        console.log("Requesting location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("Location found");
                currentState.lat = pos.coords.latitude;
                currentState.lon = pos.coords.longitude;
                fetchWeatherData();
            },
            (err) => {
                console.warn("Location access denied or timed out, using default.", err);
                fetchWeatherData();
            },
            { timeout: 5000, enableHighAccuracy: true }
        );
    } else {
        console.log("Geolocation not supported");
        fetchWeatherData();
    }
}

function loadSettings() {
    const settings = Storage.getSettings();
    currentState.units = settings.units;
    currentState.theme = settings.theme;
    
    UI.setTheme(currentState.theme);
    UI.elements.unitToggle.textContent = currentState.units === 'metric' ? '°C' : '°F';
    UI.elements.settingsUnit.value = currentState.units;
    
    updateFavoritesUI();
}

function setupEventListeners() {

    const handleSearch = debounce(async (e) => {
        const query = e.target.value.trim();
        if (query.length < 3) {
            UI.renderSearchResults([]);
            return;
        }
        try {
            const results = await API.getGeoCoordinates(query);
            UI.renderSearchResults(results, (city) => {
                currentState.lat = city.lat;
                currentState.lon = city.lon;
                currentState.city = city.name;
                UI.elements.citySearch.value = '';
                fetchWeatherData();
            });
        } catch (error) {
            console.error(error);
        }
    }, 500);

    UI.elements.citySearch.addEventListener('input', handleSearch);


    document.getElementById('search-btn').addEventListener('click', () => {
        const query = UI.elements.citySearch.value;
        if (query) {
            API.getGeoCoordinates(query).then(results => {
                if (results.length > 0) {
                    currentState.lat = results[0].lat;
                    currentState.lon = results[0].lon;
                    fetchWeatherData();
                }
            });
        }
    });


    document.getElementById('location-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                currentState.lat = pos.coords.latitude;
                currentState.lon = pos.coords.longitude;
                fetchWeatherData();
            });
        }
    });


    UI.elements.themeToggle.addEventListener('click', () => {
        currentState.theme = currentState.theme === 'dark' ? 'light' : 'dark';
        UI.setTheme(currentState.theme);
        Storage.saveSettings({ ...Storage.getSettings(), theme: currentState.theme });
    });


    UI.elements.unitToggle.addEventListener('click', toggleUnits);
    UI.elements.settingsUnit.addEventListener('change', (e) => {
        if (e.target.value !== currentState.units) toggleUnits();
    });


    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(btn.dataset.target).classList.add('active');

            if (btn.dataset.target === 'map-view') {
                setTimeout(initMap, 100);
            }
        });
    });
}

function toggleUnits() {
    currentState.units = currentState.units === 'metric' ? 'imperial' : 'metric';
    UI.elements.unitToggle.textContent = currentState.units === 'metric' ? '°C' : '°F';
    UI.elements.settingsUnit.value = currentState.units;
    Storage.saveSettings({ ...Storage.getSettings(), units: currentState.units });
    fetchWeatherData();
}

async function fetchWeatherData() {
    UI.showLoading();
    try {
        const [current, forecast, aqi] = await Promise.all([
            API.getCurrentWeather(currentState.lat, currentState.lon, currentState.units),
            API.getForecast(currentState.lat, currentState.lon, currentState.units),
            API.getAirQuality(currentState.lat, currentState.lon)
        ]);

        UI.renderCurrentWeather(current, currentState.units);
        UI.renderForecast(forecast, currentState.units);
        UI.renderAQI(aqi);
        renderCharts(forecast);
        

        Storage.addRecentSearch({ name: current.name, lat: currentState.lat, lon: currentState.lon });
        

        if (mapInstance) {
            mapInstance.setView([currentState.lat, currentState.lon], 10);
            if (mapMarker) mapMarker.setLatLng([currentState.lat, currentState.lon]);
        }

    } catch (error) {
        console.error("Error updating weather:", error);
        alert(`Failed to fetch weather data: ${error.message}`);
        UI.elements.cityName.textContent = "Error loading data";
    }
}

function updateFavoritesUI() {
    const favorites = Storage.getFavorites();
    UI.renderFavorites(favorites, 
        (city) => {
            currentState.lat = city.lat;
            currentState.lon = city.lon;
            fetchWeatherData();
        },
        (lat, lon) => {
            Storage.removeFavorite(lat, lon);
            updateFavoritesUI();
        }
    );
}


function initMap() {
    if (mapInstance) {
        mapInstance.invalidateSize();
        return;
    }

    mapInstance = L.map('map').setView([currentState.lat, currentState.lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    mapMarker = L.marker([currentState.lat, currentState.lon]).addTo(mapInstance);
    

    mapInstance.on('click', (e) => {
        currentState.lat = e.latlng.lat;
        currentState.lon = e.latlng.lng;
        mapMarker.setLatLng(e.latlng);
        fetchWeatherData();

        document.querySelector('[data-target="dashboard"]').click();
    });
}


window.addToFavorites = () => {
    const city = {
        name: document.getElementById('city-name').textContent.split(',')[0],
        lat: currentState.lat,
        lon: currentState.lon
    };
    Storage.addFavorite(city);
    updateFavoritesUI();
    alert("Added to favorites!");
};


document.addEventListener('DOMContentLoaded', init);
