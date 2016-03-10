Lab 5 - node.js, angularJS, and the Twitter API
Web Science Systems Dev
Greg Weil

A scrolling twitter feed, loaded from the streaming Twitter API

/server.js
	The node server hosts the contents of the public directory
	The feed page is available at localhost:3000
	Navigating to /query will return a set of tweets
		Filter using ?track= and ?follow=
		If nothing is provided it will look in the RPI campus
		This can take some time as the server is getting tweets live
		Try something really popular like 'election'

/public/feed.html
	The layout of the page, with angular directives for tweets
	There is also now input for a query and a number to return

/public/js/feed.js
	This script handles requests to the server for tweets
	It uses AngujarJS to update the DOM elements
/public/css/feed.css
	Some basic styling, most of the formatting is handled by Bootstrap
	A media query is used to switch to a smaller profile picture
		It allows a little extra room for text when the screen is too small

Resources
	NodeJS, with the twitter library are used on the server to retrieve tweets
	The Bootstrap and Angular libraries were used for layout and data handling
