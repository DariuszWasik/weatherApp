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
	};

	console.log('requiredData', requiredData);
	console.log(allData, 'alldata');
}

export { requiredData, optimizeData };
