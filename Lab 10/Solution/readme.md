Lab 10 - Lets look at some of the data - Visualizations
Web Science Systems Dev
Greg Weil

Build visualizations based on the tweets in the database

/public/analyze.html
	Display three charts of data about the tweets stored in the database
	First is common hashtags and how many tweets used them
	Second is the average number of followers for different languages
	Third is the number of users who fall into different buckets of status counts
/public/analyze.js
	Regulary reload tweets from the server, and process them to update the charts
	The reload interval is increased when no new tweets are found
	Some charts will filter out outliers to keep the actual trend visible

/public/feed.html
	The layout of the page, with angular directives for tweets
	Users are now allowed to read from the database while a store operation is in progress
	The analyze button redirects to /analyze.html, a store operation must be run first
/public/js/feed.js
	This script handles requests to the server for tweets
	It also manages element activation to block input while loading
/public/css/feed.css
	Some basic styling, most of the formatting is handled by Bootstrap

/server.js
	The node server hosts the contents of the public directory
	The feed page is available at localhost:3000
	Available endpoints are /query, /db/store, /db/read, and /db/export
	The server is largely unchanged from previous assignments
/twitterStream.js
	A utility library for interacting with the streaming API
	Has functions for building queries and getting a specific number of tweets
/twitterExport.js
	Functions to pass into twitterStream to convert to different formats
	It's based on streaming output, so it doesn't store any intermediary data
	Includes JSON, CSV, and XML conversion

Resources
	NodeJS, with the twitter library are used on the server to retrieve tweets
	The Bootstrap and Angular libraries were used for layout and data handling
	Chart.js is used to generate charts based on the processed data
	The angular-chartjs library is used to bind the charts to Angular
	The twitter library is used to access the Twitter streaming API
	The mongodb library is used to interact with the mongo database
	The xml module is used to build the database xml export
	The fs module is used for file writing and checking
