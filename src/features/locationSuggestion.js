// src/features/locationSuggestion.js

import { fetchCitySuggestions } from '../services/geonamesApi.js';
import { searchByLocation } from '../services/weatherApi.js';
import { optimizeData } from './optimizeData.js';
import { renderWeather } from './renderWeather.js';

let debounceTimer;
let theLocation = '';

export function locationSuggestions() {
	const cityInput = document.querySelector('#my-city');

	cityInput.addEventListener('input', (event) => {
		const inputValue = event.target.value;
		clearTimeout(debounceTimer);
		if (inputValue.length >= 3) {
			debounceTimer = setTimeout(() => {
				handleFetchSuggestions(inputValue);
			}, 500);
		}
	});

	cityInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const firstItem = document.querySelector('#suggestions li');
			if (firstItem) firstItem.click();
		}
	});
}

async function handleFetchSuggestions(value) {
	try {
		const data = await fetchCitySuggestions(value);
		displaySuggestions(data);
	} catch (error) {
		console.log('Cannot load city suggestions:', error);
	}
}

function displaySuggestions(obj) {
	const list = document.querySelector('#suggestions');
	list.innerHTML = '';

	for (let i = 0; i < 8; i++) {
		if (!obj.geonames[i]) break;

		const { toponymName, adminName1, adminName3, countryCode } =
			obj.geonames[i];

		const item = document.createElement('li');
		item.className = `item-${i}`;
		item.innerText = `${toponymName}, ${adminName1}, ${adminName3}, ${countryCode}`;

		item.addEventListener('click', async () => {
			theLocation = item.innerText;
			console.log('Selected location:', theLocation);
			const allData = await searchByLocation(theLocation);
			const requiredData = optimizeData(allData);
			//here comes renderWeather(reqiuredData)
			renderWeather(requiredData);
			console.log('optimized data: ', requiredData);
			list.innerHTML = '';
		});

		list.append(item);
	}
}
