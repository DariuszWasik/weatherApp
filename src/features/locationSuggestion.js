// src/features/locationSuggestion.js

import { fetchCitySuggestions } from '../services/geonamesApi.js';
import { searchByLocation } from '../services/weatherApi.js';
import { optimizeData } from './optimizeData.js';
import { renderWeather } from './renderWeather.js';

let debounceTimer;
let theLocation = '';
let activeIndex = -1;

export function locationSuggestions() {
	const cityInput = document.querySelector('#my-city');

	cityInput.addEventListener('input', (event) => {
		const inputValue = event.target.value;
		clearTimeout(debounceTimer);
		if (inputValue.length >= 3) {
			debounceTimer = setTimeout(() => {
				handleFetchSuggestions(inputValue);
			}, 500);
		} else {
			document.querySelector('#suggestions').innerHTML = '';
			activeIndex = -1;
		}
	});

	cityInput.addEventListener('keydown', (e) => {
		const list = document.querySelector('#suggestions');
		const items = list.querySelectorAll('li');

		if (items.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveSuggestion(activeIndex + 1);
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveSuggestion(activeIndex - 1);
		}

		if (e.key === 'Enter') {
			e.preventDefault(); //dont sent formular
			if (activeIndex >= 0 && items[activeIndex]) {
				items[activeIndex].click();
			} else if (items[0]) {
				items[0].click(); // fallback
			}
		}

		if (e.key === 'Escape') {
			list.innerHTML = '';
			activeIndex = -1;
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
	activeIndex = -1;

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

function setActiveSuggestion(index) {
	const list = document.querySelector('#suggestions');
	const items = list.querySelectorAll('li');

	if (items.length === 0) {
		activeIndex = -1;
		return;
	}

	//to high or to small index then make circut (loop)
	if (index >= items.length) index = 0;
	if (index < 0) index = items.length - 1;

	//remove 'active' class from all items
	items.forEach((li) => {
		li.classList.remove('active');
	});
	//and set it on current element
	items[index].classList.add('active');
	activeIndex = index;
	items[index].scrollIntoView({ block: 'nearest' });
}
