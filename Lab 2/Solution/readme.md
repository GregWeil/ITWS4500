Lab 2 - Weather App
Web Science Systems Dev
Greg Weil

A scrolling twitter feed, loaded from a static file

/weather.html
	The layout of the page, with space for the current weather and a forecast
	There is a space for the reported min and max temperature, but they're hidden
		It seems that the values returned is the variance between measurements, not a prediction

/js/weather.js
	This script gets the user's current location, then makes retrieves weather data
	Two requests are made to OpenWeatherMap, one for the current weather, and one for a 10 day forecast
	The forecast seems unreliable, so api requests automatically retry on failure

/css/weather.css
	Some basic styling, most of the formatting is handled by Bootstrap
	A scaling transform is used on images in the forecast so they can be larger
		without having to change the table's padding and text alignment

Resources
	The Bootstrap library was used for responsive layout
	The JQuery library was used to load data and build the page
