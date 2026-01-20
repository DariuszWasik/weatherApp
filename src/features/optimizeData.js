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
		uvindex,
		icon,
		sunrise,
		sunset,
		temp,
		windspeed,
		windgust,
		winddir,
		precip,
	} = allData.currentConditions;

	requiredData.currentConditions = {
		feelslike,
		humidity,
		pressure,
		uvindex,
		icon,
		sunrise,
		sunset,
		temp,
		windspeed,
		windgust,
		winddir,
		precip,
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
			precip,
			precipprob,
			pressure,
			uvindex,
			hours,
		} = allData.days[n];

		const optimizedHours = (hours || []).map((hour) => ({
			datetime: hour.datetime,
			temp: hour.temp,
			icon: hour.icon,
			windspeed: hour.windspeed,
			winddir: hour.winddir,
			precip: hour.precip,
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
			precip,
			precipprob,
			pressure, // ✅ TERAZ TEŻ ZAPISUJEMY PRESSURE
			uvindex,
			hours: optimizedHours,
		};
	}

	console.log('requiredData', requiredData);

	return requiredData;
}
