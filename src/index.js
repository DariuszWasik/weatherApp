// src/index.js
import './styles.css';
import { locationSuggestions } from './locationSuggestion.js';
import { optimizeData } from './optimizeData.js';
import { getAllData, searchByLocation } from './searchByLocation.js';

async function init(place) {
	locationSuggestions();
	// await searchByLocation(place);
	// console.log(getAllData());

	// optimizeData();
}

init('wadowice gorne, subcarpatia, pl');
