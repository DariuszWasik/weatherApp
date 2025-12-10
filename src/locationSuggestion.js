export function locationSuggestions() {
	const cityInput = document.querySelector('#my-city');
	cityInput.addEventListener('input', (event) => {
		const inputValue = event.target.value;
		if (inputValue.length >= 5) {
			console.log(inputValue);
			fetchCitySuggestions(inputValue);
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
