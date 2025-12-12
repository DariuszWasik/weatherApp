// src/utils/formatDate.js

function parseISODateOnlyToUTC(dateStr) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
	if (!match) return null;

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);

	return new Date(Date.UTC(year, month - 1, day));
}

function removeDots(str) {
	// usuwa wszystkie kropki, nie tylko końcową
	return String(str).replaceAll('.', '').trim();
}

/**
 * "YYYY-MM-DD" -> "pon, 12 lut" (bez kropek, niezależnie od ustawień systemu)
 * Domyślnie locale bierze z komputera (undefined).
 */
export function formatDate(dateStr, { locale = undefined } = {}) {
	const date = parseISODateOnlyToUTC(dateStr);
	if (!date) return '';

	const weekday = removeDots(
		new Intl.DateTimeFormat(locale, {
			weekday: 'short',
			timeZone: 'UTC',
		}).format(date),
	);

	const dayMonth = removeDots(
		new Intl.DateTimeFormat(locale, {
			day: 'numeric',
			month: 'short',
			timeZone: 'UTC',
		}).format(date),
	);

	return `${weekday}, ${dayMonth}`;
}
