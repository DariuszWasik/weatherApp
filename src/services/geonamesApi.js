// src/services/geonamesApi.js
const USERNAME = 'dariolysy';

/**
 * Fetch city suggestions based on user input
 */
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

/**
 * Reverse geocoding: get city name from coordinates
 */
export async function fetchCityNameFromCoords(lat, lon) {
	const url =
		`https://secure.geonames.org/findNearbyPlaceNameJSON?` +
		`lat=${lat}` +
		`&lng=${lon}` +
		`&username=${USERNAME}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Geonames API error: ${response.status}`);
	}

	const data = await response.json();

	const place = data.geonames?.[0];
	if (!place) return 'Unknown location';

	// Extract details
	const name = place.name;
	const region = place.adminName1; // e.g. Bavaria
	const country = place.countryCode; // e.g. DE

	// Build string dynamically
	let fullName = name;

	if (region) fullName += `, ${region}`;
	if (country) fullName += `, ${country}`;

	return fullName;
}
