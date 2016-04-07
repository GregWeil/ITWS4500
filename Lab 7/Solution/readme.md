Lab 7 - node.js, mongoDB and tweets
Web Science Systems Dev
Greg Weil

Build a tweets database and allow it to be exported

/server.js
	The node server hosts the contents of the public directory
	The feed page is available at localhost:3000
	Navigating to /query will return a set of tweets
		Filter using ?track= and ?follow=
		If nothing is provided it will look in the RPI campus
		This can take some time as the server is getting tweets live
		Try something really popular like 'election'
	POSTs to /export creates a file and returns a link to it
		Send a JSON object with the same parameters as query
		The additional format parameter can be set to 'json' or 'csv'

/public/feed.html
	The layout of the page, with angular directives for tweets
	There are also three popups to show export results

/public/js/feed.js
	This script handles requests to the server for tweets
	It also manages element activation to block input while loading
/public/css/feed.css
	Some basic styling, most of the formatting is handled by Bootstrap

Resources
	NodeJS, with the twitter library are used on the server to retrieve tweets
	The Bootstrap and Angular libraries were used for layout and data handling
	The twitter library is used to access the Twitter streaming API
	The fs module is used for file writing and checking

Where would it be better to place the CSV conversion code?
	I chose to put the conversion code on the server. This means
	the server must do more work, but gives better security. If the
	conversion were done in Angular, the server would be hosting
	the result sent back. Malicious users could upload other files
	and have the server host something else. I could have the server do
	some kind of verification on the file, but that would get complex.
