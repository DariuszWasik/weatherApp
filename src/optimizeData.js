import { allData } from './searchByLocation';

const requiredData = {};

function optimizeData() {
	// requiredData = getAllData();
	requiredData.resolvedAddress = allData.resolvedAddress;
	requiredData.tzoffset = allData.tzoffset;
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
	console.log(allData, 'alldata');
}

//probably function gerReqiuredData should return the actual data in other modules

export { requiredData, optimizeData };
