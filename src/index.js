// src/index.js
import './styles.css';
import { optimizeData } from './optimizeData.js';
import { getAllData, searchByLocation } from './searchByLocation.js';

async function init(place) {
	await searchByLocation(place);
	console.log(getAllData());

	optimizeData();
}

init('uniejowice');
