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

	const places = data.geonames;
	if (!places || places.length === 0) return 'Unknown location';

	// Sort by distance so the closest place is first
	places.sort((a, b) => Number(a.distance) - Number(b.distance));

	// Closest place
	const place = places[0];

	const name = place.name;
	const district = place.adminName2; // powiat
	const region = place.adminName1; // land / województwo
	const country = place.countryCode;

	let fullName = name;

	// Add details if available
	if (district) fullName += `, ${district}`;
	if (region) fullName += `, ${region}`;
	if (country) fullName += `, ${country}`;

	return fullName;
}
