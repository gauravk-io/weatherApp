const STORAGE_KEYS = {
    FAVORITES: 'weatherApp_favorites',
    RECENT: 'weatherApp_recent',
    SETTINGS: 'weatherApp_settings'
};

const DEFAULT_SETTINGS = {
    units: 'metric', // metric or imperial
    theme: 'dark'    // dark or light
};

export const Storage = {
    getFavorites() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
    },

    addFavorite(city) {
        const favorites = this.getFavorites();
        if (!favorites.some(f => f.lat === city.lat && f.lon === city.lon)) {
            favorites.push(city);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        }
    },

    removeFavorite(lat, lon) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(f => !(f.lat === lat && f.lon === lon));
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    },

    isFavorite(lat, lon) {
        const favorites = this.getFavorites();
        return favorites.some(f => f.lat === lat && f.lon === lon);
    },

    getRecentSearches() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT)) || [];
    },

    addRecentSearch(city) {
        let recent = this.getRecentSearches();
        // Remove duplicates
        recent = recent.filter(r => !(r.lat === city.lat && r.lon === city.lon));
        // Add to top
        recent.unshift(city);
        // Limit to 5
        if (recent.length > 5) recent.pop();
        localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent));
    },

    getSettings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    },

    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
};
