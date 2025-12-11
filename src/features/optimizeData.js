// src/features/optimizeData.js

export function optimizeData(allData) {
	const requiredData = {};

	// Podstawowe dane
	requiredData.resolvedAddress = allData.resolvedAddress;
	requiredData.tzoffset = allData.tzoffset;

	// Aktualna pogoda
	const {
		feelslike,
		humidity,
		pressure,
		icon,
		sunrise,
		sunset,
		temp,
		windspeed,
		windgust,
	} = allData.currentConditions;

	requiredData.currentConditions = {
		feelslike,
		humidity,
		pressure,
		icon,
		sunrise,
		sunset,
		temp,
		windspeed,
		windgust,
	};

	// Prognoza na 7 dni
	requiredData.days = [];
	for (let n = 0; n < 7; n++) {
		const {
			datetime,
			icon,
			tempmin,
			tempmax,
			description,
			windspeed,
			windgust,
			conditions,
			cloudcover,
		} = allData.days[n];

		requiredData.days[n] = {
			datetime,
			icon,
			tempmin,
			tempmax,
			description,
			windspeed,
			windgust,
			conditions,
			cloudcover,
		};
	}

	console.log('requiredData', requiredData);

	return requiredData; // zwracamy nowy obiekt
}
