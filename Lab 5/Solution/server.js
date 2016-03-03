// Required modules
var express = require('express');
var OAuth = require('oauth');
var url = require('url');


// Init the server
var app = express();


// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/feed.html');
});


// Query the API
var config = {
	oauth_access_token: '47282406-UyxyVM0rkAwuti3YpgwLGyi84Yh8KXxKOv4mQ6Xhv',
    oauth_access_token_secret: 'DLEtDS9DFGpPUVG1SVC5A4J15iTd8VPZ68HmOU3BJmtGx',
    consumer_key: 'luI2jnjp3GOuyqKuWsSKIFstD',
    consumer_secret: 'HvEmsAiI8M5TE972F081eBgZDLR8pJnTg2UFdqXs7SC3WpzehT'
};

var oauth = new OAuth.OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	config.consumer_key, config.consumer_secret,
	'1.0A', null, 'HMAC-SHA1'
);

app.get('/query', function(req, res) {
	var query = req.query;
	if (!('q' in query)) query.geocode = '42.725,-73.675,1mi';
	oauth.get(url.format({
			protocol: 'https', host: 'api.twitter.com',
			pathname: '/1.1/search/tweets.json',
			query: query
		}),
		config.oauth_access_token, config.oauth_access_token_secret,
		function (e, data) {
			if (e) console.log(e);
			res.send(data);
		}
	);
});


// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
