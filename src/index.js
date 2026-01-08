// src/index.js
import './styles/main.css';
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

init('wadowice gorne, subcarpatia, pl');
