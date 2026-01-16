export function getRelevantHours(days) {
	const now = new Date();
	const currentHour = now.getHours();

	const todayHours = days[0].hours;
	const tomorrowHours = days[1]?.hours || [];

	const allPossibleSlots = [6, 9, 12, 15, 18, 21];

	const relevantHours = allPossibleSlots
		.filter((h) => h > currentHour)
		.map((h) => {
			return todayHours.find((hour) => parseInt(hour.datetime) === h);
		})
		.filter((hour) => hour !== undefined);

	const nightHoursToday = todayHours.filter((h) => parseInt(h.datetime) >= 23);
	const nightHoursTomorrow = tomorrowHours.filter(
		(h) => parseInt(h.datetime) <= 6,
	);

	const allNightHours = [...nightHoursToday, ...nightHoursTomorrow];

	if (allNightHours.length > 0) {
		const temps = allNightHours.map((h) => h.temp);
		relevantHours.push({
			datetime: '23-6',
			tempMin: Math.min(...temps),
			tempMax: Math.max(...temps),
			icon: allNightHours[0].icon,
			isNight: true,
		});
	}

	return relevantHours;
}
