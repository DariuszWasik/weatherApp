// src/features/optimizeData.js

export function optimizeData(allData) {
	const requiredData = {};

	// Basic data
	requiredData.resolvedAddress = allData.resolvedAddress;
	requiredData.tzoffset = allData.tzoffset;

	// Current weather
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
		winddir,
		precip, // Added precipitation
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
		winddir,
		precip, // Added
	};

	// 7-day forecast
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
			precip, // Daily precipitation total
			precipprob, // Probability of precipitation
			hours,
		} = allData.days[n];

		const optimizedHours = (hours || []).map((hour) => ({
			datetime: hour.datetime,
			temp: hour.temp,
			icon: hour.icon,
			windspeed: hour.windspeed,
			winddir: hour.winddir,
			precip: hour.precip, // Hourly precipitation
		}));

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
			precip, // Added
			precipprob, // Added
			hours: optimizedHours,
		};
	}

	console.log('requiredData', requiredData);

	return requiredData;
}
