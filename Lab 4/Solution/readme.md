Lab 1 - Tweet Ticker
Web Science Systems Dev
Greg Weil

A scrolling twitter feed, loaded from a static file

/feed.html
	The layout of the page, with a single empty template tweet element

/js/feed.js
	This script does the work of loading in and animating the tweets
	On document load, it takes the template tweet and removes it from the DOM
		The script then loads the tweets file, and parses the json
	The buildTweet function will take the json object for a single tweet,
		and return a DOM object which can be added to the document
	The functions cycleInit and cycleTweets will handle showing a fixed number
		of tweets, transitioning them in and out smoothly using JQuery

/css/feed.css
	Some basic styling, most of the formatting is handled by Bootstrap

Resources
	The Bootstrap and JQuery libraries were used for layout and animaiton
