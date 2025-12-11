// src/services/geonamesApi.js
const USERNAME = 'dariolysy';

export async function fetchCitySuggestions(value) {
	const url =
		`https://secure.geonames.org/searchJSON?` +
		`name_startsWith=${encodeURIComponent(value)}` +
		`&maxRows=10` +
		`&featureClass=P` +
		`&orderby=population` +
		`&style=full` +
		`&username=${USERNAME}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Geonames API error: ${response.status}`);
	}

	const data = await response.json();
	return data;
}
