import { formatDate } from '../utils/formatDate';

export function renderWeather(requiredData) {
	const cityNameEl = document.querySelector('.city-name');
	const dateTodayEl = document.querySelector('.date-today');
	const iconCurrentEl = document.querySelector('.icon-current');
	const tempCurrentEl = document.querySelector('.temp-current');
	const minTodayEl = document.querySelector('.min-today');
	const maxTodayEl = document.querySelector('.max-today');

	const feelslikeHeadEl = document.querySelector('.feelslike-head');
	const tempFeelslikeEl = document.querySelector('.temp-feelslike');
	const descriptionEl = document.querySelector('.description');

	const windHeadEl = document.querySelector('.wind-head');
	const windSpeedEl = document.querySelector('.wind-speed');
	const windGustsEl = document.querySelector('.wind-gusts');

	const sunriseEl = document.querySelector('.sunrise');
	const sunsetEl = document.querySelector('.sunset');
	const humidityEl = document.querySelector('.humidity');
	const chanceOfRainEl = document.querySelector('.chance-of-rain');

	const nextDaysEl = document.querySelector('.next-days');

	cityNameEl.textContent = requiredData.resolvedAddress;
	dateTodayEl.textContent = `Today ${formatDate(requiredData.days[0].datetime)}`;
}
