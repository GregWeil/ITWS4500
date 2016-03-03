Lab 4 - Responsive App
Web Science Systems Dev
Greg Weil

A scrolling twitter feed, loaded from the Twitter API

/feed.html
	The layout of the page, with angular directives for tweets

/js/feed.js
	This script does the work of loading in the tweets
	It uses AngularJS to manage the tweet information and DOM modification
	After initializing the controller, it retrieves the tweets
	A custom filter is used with ng-repeat so that the shown tweets can wrap around
	An angular interval increments the tweet index every five seconds
/css/feed.css
	Some basic styling, most of the formatting is handled by Bootstrap
	A media query is used to switch to a smaller profile picture
		It allows a little extra room for text when the screen is too small

Resources
	The Bootstrap and Angular libraries were used, for layout and data handling
