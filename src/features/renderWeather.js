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
		//rotate the arrow according to winddir
		windArrowEl.style.transform = `rotate(${windDirDegrees}deg)`;
		windDirTextEl.textContent = getWindDirection(windDirDegrees);
	}

	const sunriseEl = document.querySelector('.sunrise');
	const sunsetEl = document.querySelector('.sunset');
	const humidityEl = document.querySelector('.humidity');
	const chanceOfRainEl = document.querySelector('.chance-of-rain');

	const nextDaysEl = document.querySelector('.next-days');

	cityNameEl.textContent = requiredData.resolvedAddress;

	const current = requiredData.currentConditions;
	const today = requiredData.days[0];

	//box-1
	dateTodayEl.textContent = `${formatDate(requiredData.days[0].datetime)}`;
	// iconCurrentEl.innerHTML = current.icon;
	const iconUrl = await getWeatherIcon(current.icon);
	iconCurrentEl.innerHTML = `<img src="${iconUrl}" alt="${current.icon}" class="weather-icon-main">`;

	tempCurrentEl.textContent = `${Math.round(current.temp)}°C`;
	minTodayEl.textContent = `Min: ${Math.round(today.tempmin)}°C`;
	maxTodayEl.textContent = `Max: ${Math.round(today.tempmax)}°C`;

	// Renderowanie godzin w box-1
	const hoursContainer = document.querySelector('.hours');

	if (hoursContainer) {
		hoursContainer.innerHTML = ''; // Czyścimy stare dane

		const relevantHours = getRelevantHours(
			requiredData.days,
			requiredData.tzoffset,
		);

		// Używamy pętli for...of, bo w środku mamy "await" dla ikon
		for (const hour of relevantHours) {
			const hourDiv = document.createElement('div');
			hourDiv.className = 'hour-item';

			// Przygotowujemy dane do wyświetlenia
			const timeLabel = hour.isNight ? '23-6' : hour.datetime.slice(0, 5);
			const iconUrl = await getWeatherIcon(hour.icon);

			// Jeśli to noc, pokazujemy zakres temp, jeśli godzina - jedną temp
			const tempDisplay = hour.isNight
				? `${Math.round(hour.tempMin)}°/${Math.round(hour.tempMax)}°`
				: `${Math.round(hour.temp)}°`;

			hourDiv.innerHTML = `
            <span class="hour-time">${timeLabel}</span>
            <img src="${iconUrl}" alt="icon" class="hour-icon">
            <span class="hour-temp">${tempDisplay}</span>
        `;

			hoursContainer.appendChild(hourDiv);
		}
	}

	// box-2 (feels like + opis)
	feelslikeHeadEl.textContent = 'Feels like';
	tempFeelslikeEl.textContent = `${Math.round(current.feelslike)}°C`;
	descriptionEl.textContent = today.description || today.conditions || '';

	// box-3 (wiatr)
	windHeadEl.textContent = 'Wind';
	windSpeedEl.textContent = `Speed: ${current.windspeed} km/h`;
	windGustsEl.textContent = `Gusts: ${current.windgust} km/h`;

	// extra-info
	sunriseEl.textContent = `Sunrise: ${current.sunrise}`;
	sunsetEl.textContent = `Sunset: ${current.sunset}`;
	humidityEl.textContent = `Humidity: ${current.humidity}%`;
	chanceOfRainEl.textContent = `Cloud cover: ${today.cloudcover}%`;

	// next-days (prognoza 6 kolejnych dni)
	nextDaysEl.innerHTML = ''; // wyczyść poprzednie

	for (let i = 1; i < Math.min(requiredData.days.length, 7); i++) {
		const day = requiredData.days[i];

		const dayCard = document.createElement('div');
		dayCard.className = 'day-card';

		const dateEl = document.createElement('div');
		dateEl.className = 'day-date';
		dateEl.textContent = formatDate(day.datetime);

		const tempEl = document.createElement('div');
		tempEl.className = 'day-temp';
		tempEl.textContent = `${Math.round(day.tempmin)}°C / ${Math.round(day.tempmax)}°C`;

		const iconEl = document.createElement('div');
		iconEl.className = 'day-icon';
		const iconUrl = await getWeatherIcon(day.icon);
		iconEl.innerHTML = `<img src="${iconUrl}" alt="${day.icon}" class="weather-icon-small">`;

		// iconEl.textContent = day.icon;

		const descEl = document.createElement('div');
		descEl.className = 'day-description';
		descEl.textContent = day.description || day.conditions || '';

		dayCard.append(dateEl, tempEl, iconEl, descEl);
		nextDaysEl.append(dayCard);
	}
}
