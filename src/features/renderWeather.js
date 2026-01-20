import sunriseIcon from '../assets/icons/sunrise.svg';
import sunsetIcon from '../assets/icons/sunset.svg';
import { formatDate } from '../utils/formatDate';
import { getRelevantHours } from '../utils/getRelevantHours';
import { getWeatherIcon } from '../utils/getWeatherIcon';
import { getWindDirection } from '../utils/getWindDirection';

export async function renderWeather(requiredData) {
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
	const windDirDegrees = requiredData.currentConditions.winddir;
	const windArrowEl = document.querySelector('#wind-arrow');
	const windDirTextEl = document.querySelector('#wind-dir-text');

	if (windArrowEl && windDirTextEl) {
		// Rotate the arrow according to winddir
		windArrowEl.style.transform = `rotate(${windDirDegrees}deg)`;
		windDirTextEl.textContent = getWindDirection(windDirDegrees);
	}

	const sunriseEl = document.querySelector('.sunrise');
	const sunsetEl = document.querySelector('.sunset');
	const humidityEl = document.querySelector('.humidity');
	const chanceOfRainEl = document.querySelector('.chance-of-rain');
	const pressureEl = document.querySelector('.pressure');
	const uvIndexEl = document.querySelector('.uv-index');

	const nextDaysEl = document.querySelector('.next-days');

	cityNameEl.textContent = requiredData.resolvedAddress;

	const current = requiredData.currentConditions;
	const today = requiredData.days[0]; // Define 'today' early so it's accessible everywhere

	// Box-1
	dateTodayEl.textContent = `${formatDate(today.datetime)}`;
	const iconUrl = await getWeatherIcon(current.icon);
	iconCurrentEl.innerHTML = `<img src="${iconUrl}" alt="${current.icon}" class="weather-icon-main">`;

	tempCurrentEl.textContent = `${Math.round(current.temp)}°C`;
	minTodayEl.textContent = `Min: ${Math.round(today.tempmin)}°C`;
	maxTodayEl.textContent = `Max: ${Math.round(today.tempmax)}°C`;

	// Rendering hours in box-1
	const hoursContainer = document.querySelector('.hours');

	if (hoursContainer) {
		hoursContainer.innerHTML = ''; // Clear old data

		const relevantHours = getRelevantHours(
			requiredData.days,
			requiredData.tzoffset,
		);

		// Using for...of loop because we have "await" for icons inside
		for (const hour of relevantHours) {
			const hourDiv = document.createElement('div');
			hourDiv.className = 'hour-item';
			hourDiv.style.cursor = 'pointer';

			// Prepare data for display
			const timeLabel = hour.isNight ? '23-6' : hour.datetime.slice(0, 5);
			const hourIconUrl = await getWeatherIcon(hour.icon);

			// If it's night, show temp range; if hour - single temp
			const tempDisplay = hour.isNight
				? `${Math.round(hour.tempMin)}°/${Math.round(hour.tempMax)}°`
				: `${Math.round(hour.temp)}°`;

			hourDiv.innerHTML = `
				<span class="hour-time">${timeLabel}</span>
				<img src="${hourIconUrl}" alt="icon" class="hour-icon">
				<span class="hour-temp">${tempDisplay}</span>
			`;

			// Add click listener to open modal with today's full hourly data
			hourDiv.addEventListener('click', (e) => {
				console.log('Hour clicked!'); // Debug log
				showHourlyModal(today);
			});

			hoursContainer.appendChild(hourDiv);
		}
	}

	// Box-2 (feels like + description)
	feelslikeHeadEl.textContent = 'Feels like';
	tempFeelslikeEl.textContent = `${Math.round(current.feelslike)}°C`;
	descriptionEl.textContent = today.description || today.conditions || '';

	// Box-3 (wind)
	windHeadEl.textContent = 'Wind';
	windSpeedEl.textContent = `Speed: ${current.windspeed} km/h`;
	windGustsEl.textContent = `Gusts: ${current.windgust} km/h`;

	// Extra-info
	sunriseEl.innerHTML = `
		<img src="${sunriseIcon}" class="sun-icon" alt="Sunrise">
		Sunrise ${current.sunrise}`;

	sunsetEl.innerHTML = `
		<img src="${sunsetIcon}" class="sun-icon" alt="Sunset">
		Sunset ${current.sunset}
	`;

	humidityEl.textContent = `Humidity: ${current.humidity}%`;
	chanceOfRainEl.textContent = `Cloud cover: ${today.cloudcover}%`;

	// Pressure (only from today's data)
	const pressure = today.pressure ?? 'N/A';
	pressureEl.innerHTML = `Pressure: ${pressure} hPa`;

	// UV Index (only from today's data)
	const uvindex = today.uvindex ?? 0;
	const uvColor = getUVColor(uvindex);
	const uvLevel = getUVLevel(uvindex);
	uvIndexEl.innerHTML = `
		UV Index: <span style="color: ${uvColor}; font-size: 18px;">${uvindex}</span>
		<span style="font-size: 11px; color: var(--muted);"> ${uvLevel}</span>
	`;

	// Next-days (forecast for next 6 days)
	nextDaysEl.innerHTML = ''; // Clear previous

	for (let i = 1; i < Math.min(requiredData.days.length, 7); i++) {
		const day = requiredData.days[i];

		const dayCard = document.createElement('div');
		dayCard.className = 'day-card';
		dayCard.style.cursor = 'pointer';
		dayCard.addEventListener('click', () => {
			console.log('Day clicked!'); // Debug log
			showHourlyModal(day);
		});

		const dateEl = document.createElement('div');
		dateEl.className = 'day-date';
		dateEl.textContent = formatDate(day.datetime);

		const tempEl = document.createElement('div');
		tempEl.className = 'day-temp';
		tempEl.textContent = `${Math.round(day.tempmin)}°C / ${Math.round(day.tempmax)}°C`;

		const iconEl = document.createElement('div');
		iconEl.className = 'day-icon';
		const dayIconUrl = await getWeatherIcon(day.icon);
		iconEl.innerHTML = `<img src="${dayIconUrl}" alt="${day.icon}" class="weather-icon-small">`;

		const descEl = document.createElement('div');
		descEl.className = 'day-description';
		descEl.textContent = day.description || day.conditions || '';

		dayCard.append(dateEl, tempEl, iconEl, descEl);
		nextDaysEl.append(dayCard);
	}
}

async function showHourlyModal(dayData) {
	const modal = document.getElementById('hourly-modal');
	const tableBody = document.getElementById('modal-table-body');
	const modalTitle = document.getElementById('modal-title');

	const dateObj = new Date(dayData.datetime);
	const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
		dateObj,
	);

	modalTitle.textContent = `${dayName}, ${dayData.datetime}`;

	tableBody.innerHTML = '';
	for (const hour of dayData.hours) {
		const row = document.createElement('tr');
		const iconUrl = await getWeatherIcon(hour.icon);

		row.innerHTML = `
			<td>${hour.datetime.substring(0, 5)}</td>
			<td>
				<img src="${iconUrl}" class="modal-icon" alt="${hour.icon}">
			</td>
			<td><strong>${Math.round(hour.temp)}°C</strong></td>
			<td>${hour.precip || 0} mm</td>
			<td>
				<div class="wind-cell">
					<span>${Math.round(hour.windspeed)} km/h</span>
					<span class="wind-arrow-small" style="transform: rotate(${hour.winddir}deg)">↑</span>
				</div>
			</td>
		`;
		tableBody.appendChild(row);
	}

	modal.classList.remove('hidden');

	const closeBtn = document.getElementById('close-modal');
	const overlay = modal.querySelector('.modal-overlay');

	const closeModal = () => modal.classList.add('hidden');
	closeBtn.onclick = closeModal;
	overlay.onclick = closeModal;
}

/**
 * Returns color based on UV index level
 */
function getUVColor(uv) {
	if (uv <= 2) return '#4ade80'; // green (low)
	if (uv <= 5) return '#facc15'; // yellow (moderate)
	if (uv <= 7) return '#fb923c'; // orange (high)
	if (uv <= 10) return '#f87171'; // red (very high)
	return '#c084fc'; // purple (extreme)
}

/**
 * Returns UV level text
 */
function getUVLevel(uv) {
	if (uv <= 2) return 'Low';
	if (uv <= 5) return 'Moderate';
	if (uv <= 7) return 'High';
	if (uv <= 10) return 'Very High';
	return 'Extreme';
}
