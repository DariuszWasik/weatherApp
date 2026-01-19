// src/index.js
import './styles/main.css';
import { handleGeolocation } from './features/geolocation.js';
import { locationSuggestions } from './features/locationSuggestion.js';
import { optimizeData } from './features/optimizeData.js';
import { renderWeather } from './features/renderWeather.js';
import { getAllData, searchByLocation } from './services/weatherApi.js';

async function init(place) {
	locationSuggestions(place);
	const allData = await searchByLocation(place);
	// console.log(getAllData());

	const requiredData = optimizeData(allData);
	console.log(requiredData);
	renderWeather(requiredData);
}

const geoBtn = document.querySelector('#geo-btn');
const geoText = geoBtn.querySelector('.geo-text');
const geoIcon = geoBtn.querySelector('.geo-icon');

geoBtn.addEventListener('click', async () => {
	geoBtn.disabled = true;
	geoText.textContent = 'Loading';
	geoIcon.textContent = '⏳';

	try {
		await handleGeolocation();
	} catch (err) {
		alert('Unable to get your location.');
	} finally {
		geoBtn.disabled = false;
		geoText.textContent = 'Current';
		geoIcon.textContent = '📍';
	}
});

init('wadowice gorne, subcarpatia, pl');
