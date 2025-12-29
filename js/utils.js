
export function formatTime(unixTimestamp, timezoneOffset = 0) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


export function formatDay(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short' });
}


export function degToCompass(deg) {
    const val = Math.floor((deg / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}


export function getAQIDescription(aqi) {
    const map = {
        1: { label: "Good", color: "#4caf50" },
        2: { label: "Fair", color: "#ffeb3b" },
        3: { label: "Moderate", color: "#ff9800" },
        4: { label: "Poor", color: "#f44336" },
        5: { label: "Very Poor", color: "#9c27b0" }
    };
    return map[aqi] || { label: "Unknown", color: "#ccc" };
}


export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
