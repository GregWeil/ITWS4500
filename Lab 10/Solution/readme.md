Lab 8 - Putting it all together
Web Science Systems Dev
Greg Weil

Build a tweets database and allow it to be exported

/server.js
	The node server hosts the contents of the public directory
	The feed page is available at localhost:3000
	POSTs to /db/build will repopulate the database
		Filter using ?track= and ?follow=
		If nothing is provided it will look in the RPI campus
		This can take some time as the server is getting tweets live
		Try something really popular like 'election'
		Include clear=true to wipe previous results
			The webpage always sets clear to true
	GETs to /db/read get the current contents of the database
		No parameters are supported, it just returns everything
	POSTs to /db/export creates a file and returns a link to it
		The 'name' parameter specifies part of the output file name
		The 'format' parameter can be either 'csv', 'json', or 'xml'

/twitterStream.js
	A utility library for interacting with the streaming API
	Has functions for building queries and getting a specific number of tweets
/twitterExport.js
	Functions to pass into twitterStream to convert to different formats
	It's based on streaming output, so it doesn't store any intermediary data
	Includes JSON, CSV, and XML conversion

/public/feed.html
	The layout of the page, with angular directives for tweets
	The export file name only appears after selecting a format
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
	The mongodb library is used to interact with the mongo database
	The xml module is used to build the database xml export
	The fs module is used for file writing and checking
