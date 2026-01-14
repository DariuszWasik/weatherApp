export async function getWeatherIcon(iconCode) {
	//fallback
	const safeIconCode = iconCode || 'cloudy';

	try {
		//dynamic import
		const iconModule = await import(`../assets/icons/${safeIconCode}.svg`);
		//return icon url from default
		return iconModule.default;
	} catch (error) {
		//if file with this name dosnt exist load fallback
		const fallbackModule = await import(`../assets/icons/cloudy.svg`);
		return fallbackModule.default;
	}
}
