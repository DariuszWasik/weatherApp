let allData = {};

async function searchByLocation(location) {
	console.log('jestem w search');
	const response = await fetch(
		`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours,days,current&key=GP4ERC9CCBP7EKM9KA7ZTY6LD&contentType=json`,
	);
	allData = await response.json();
	console.log('allData', allData);
	return allData;
}

function getAllData() {
	return allData;
}

export { searchByLocation, allData, getAllData };
