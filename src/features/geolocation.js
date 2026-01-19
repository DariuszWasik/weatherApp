// features/geolocation.js

import { fetchCityNameFromCoords } from '../services/geonamesApi.js';
import { fetchWeatherByCoords } from '../services/weatherApi.js';
import { optimizeData } from './optimizeData.js';
import { renderWeather } from './renderWeather.js';

/**
 * Handles full geolocation workflow:
 * 1. Gets user location
 * 2. Fetches weather for coordinates
 * 3. Optimizes data
 * 4. Renders weather
 * 5. Reverse geocodes city name
 */
export async function handleGeolocation() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not supported by your browser.'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				try {
					const { latitude, longitude } = coords;

					// 1. Fetch weather by coordinates
					const allData = await fetchWeatherByCoords(latitude, longitude);

					// 2. Optimize
					const requiredData = optimizeData(allData);

					// 3. Render
					renderWeather(requiredData);

					// 4. Reverse geocode
					const cityName = await fetchCityNameFromCoords(latitude, longitude);

					// 5. Update UI
					const cityInput = document.querySelector('#my-city');
					if (cityInput) cityInput.value = cityName;

					const cityTitle = document.querySelector('.city-name');
					if (cityTitle) cityTitle.textContent = cityName;

					resolve(cityName);
				} catch (err) {
					reject(err);
				}
			},
			(err) => reject(err), // user denied or error
			{
				enableHighAccuracy: false,
				timeout: 8000,
				maximumAge: 5 * 60 * 1000,
			},
		);
	});
}
