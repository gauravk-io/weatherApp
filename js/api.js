const API_KEY = "67f64a81ec23196be3643c12a7160d16";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";


export async function getCurrentWeather(lat, lon, units = 'metric') {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Weather data not found');
        return await response.json();
    } catch (error) {
        console.error("Error fetching current weather:", error);
        throw error;
    }
}


export async function getForecast(lat, lon, units = 'metric') {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Forecast data not found');
        return await response.json();
    } catch (error) {
        console.error("Error fetching forecast:", error);
        throw error;
    }
}


export async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('AQI data not found');
        return await response.json();
    } catch (error) {
        console.error("Error fetching AQI:", error);
        throw error;
    }
}


export async function getGeoCoordinates(query) {
    try {
        const response = await fetch(`${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
    }
}


export async function getReverseGeo(lat, lon) {
    try {
        const response = await fetch(`${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Location not found');
        return await response.json();
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        throw error;
    }
}
