// src/index.js
import './styles/main.css';
import { locationSuggestions } from './features/locationSuggestion.js';
import { optimizeData } from './features/optimizeData.js';
import { getAllData, searchByLocation } from './services/weatherApi.js';

async function init(place) {
	locationSuggestions();
	// await searchByLocation(place);
	// console.log(getAllData());

	// optimizeData();
}

init('wadowice gorne, subcarpatia, pl');
