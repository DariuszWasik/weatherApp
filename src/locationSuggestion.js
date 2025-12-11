import { optimizeData } from './optimizeData';
import { searchByLocation } from './searchByLocation';

let debounceTimer;
let theLocation = '';

export function locationSuggestions() {
	const cityInput = document.querySelector('#my-city');
	cityInput.addEventListener('input', (event) => {
		const inputValue = event.target.value;
		clearTimeout(debounceTimer);
		if (inputValue.length >= 3) {
			debounceTimer = setTimeout(() => {
				fetchCitySuggestions(inputValue);
			}, 500);
		}
	});
}

async function fetchCitySuggestions(value) {
	const username = 'dariolysy';
	// const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(value)}&maxRows=10&featureClass=P&username=${username}`;
	// const url = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(value)}&maxRows=10&featureClass=P&username=${username}&style=full&fuzzy=0.8`;
	const url =
		`https://secure.geonames.org/searchJSON?` +
		`name_startsWith=${encodeURIComponent(value)}` + // Wyszukuje tylko obiekty zaczynające się od ciągu
		`&maxRows=10` +
		`&featureClass=P` + // Tylko miejsca zamieszkane
		`&orderby=population` + // Sortuje według populacji (największe na górze)
		`&style=full` + // Pełny styl dla bardziej trafnych wyników
		`&username=${username}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		displaySuggestions(data);
	} catch (error) {
		console.log('Can not access data:', error);
	}
}

function displaySuggestions(obj) {
	const list = document.querySelector('#suggestions');
	list.innerHTML = '';
	for (let i = 0; i < 8; i++) {
		if (!obj.geonames[i]) break;

		const name = obj.geonames[i].toponymName;
		const admin1 = obj.geonames[i].adminName1;
		const admin3 = obj.geonames[i].adminName3;
		const country = obj.geonames[i].countryCode;
		console.log(name);

		const item = document.createElement('li');
		item.className = `item-${i}`;
		item.innerText = `${name}, ${admin1}, ${admin3}, ${country}`;

		async function handleClickOrEnter() {
			theLocation = item.innerText;
			console.log('the location:', theLocation);
			await searchByLocation(theLocation);
			optimizeData();
		}

		item.addEventListener('click', handleClickOrEnter);
		list.append(item);
	}

	const cityInput = document.querySelector('#my-city');
	cityInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const firstItem = document.querySelector('#suggestions li');
			if (firstItem) firstItem.click();
		}
	});
}
