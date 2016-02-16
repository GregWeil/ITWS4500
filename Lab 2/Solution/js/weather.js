///weather.js
//Load a weather information and display it

var apiURL = "http://api.openweathermap.org/data/2.5/";
var apiIcon = "http://openweathermap.org/img/w/";
var apiID = "9410341da379924e6b3b11c8837a7aac";

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function loadWeather(position) {
	var lat = position.coords.latitude.toString();
	var lon = position.coords.longitude.toString();
	$.when()
	.then(function () {
		//Get current weather
		return $.get(apiURL+"weather?lat="+lat+"&lon="+lon
			+"&units=imperial"+"&appid="+apiID)
		.done(function (data) {
			console.log(data);
			$(".location").text(data.name);
			$(".temp").text(data.main.temp);
			$(".tempMin").text(data.main.temp_min);
			$(".tempMax").text(data.main.temp_max);
			for (var i = 0; i < data.weather.length; ++i) {
				$(".weatherItems").append(
					$('<li class="list-group-item"></li>').append(
						$('<img src="'+apiIcon+data.weather[i].icon+'.png"/>')
					).append($("<span></span>").text(data.weather[i].main))
				);
			}
		});
	})
	.then(function () {
		//Get forecast
		return $.get(apiURL+"forecast/daily?lat="+lat+"&lon="+lon
			+"&cnt=14&units=imperial"+"&appid="+apiID)
		.done(function (data) {
			console.log(data);
			var date = new Date();
			for (var i = 0; i < data.list.length; ++i) {
				var weather = data.list[i];
				var label = $("<td>").text(days[(date.getDay()+i+1) % days.length]);
				if (weather.weather.length > 0) {
					label.prepend($('<img src="'+apiIcon+weather.weather[0].icon+'.png"/>'));
				}
				$(".forecast").append($("<tr>").append($(label))
					.append($("<td>").text(weather.temp.day+"°F"))
				);
			}
		});
	})
}

$(document).ready(function () {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(loadWeather);
	}
});
