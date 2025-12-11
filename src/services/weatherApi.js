// src/services/weatherApi.js

export async function searchByLocation(location) {
	console.log('Fetching weather for:', location);

	const response = await fetch(
		`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours,days,current&key=GP4ERC9CCBP7EKM9KA7ZTY6LD&contentType=json`,
	);

	if (!response.ok) {
		throw new Error(
			`Weather API request failed with status ${response.status}`,
		);
	}

	const data = await response.json();
	console.log('allData', data);

	return data; // zwracamy dane, nie zapisujemy globalnie
}
