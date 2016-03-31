// Required modules
var express = require('express');
var Twitter = require('twitter');
var fs = require('fs');


// Init the server
var app = express();


// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/feed.html');
});


// Write out a set of tweets to a file
function writeFile(data) {
	var fdate = (new Date()).toISOString().replace(new RegExp(':', 'g'), '-');
	var fname = "./public/out/out-" + fdate + "-tweets.json";
	fs.writeFile(fname, JSON.stringify(data), function(e) {
		if (e) console.log(e);
	});
}


// Create the API link
var config = {
	access_token_key: '47282406-UyxyVM0rkAwuti3YpgwLGyi84Yh8KXxKOv4mQ6Xhv',
    access_token_secret: 'DLEtDS9DFGpPUVG1SVC5A4J15iTd8VPZ68HmOU3BJmtGx',
    consumer_key: 'luI2jnjp3GOuyqKuWsSKIFstD',
    consumer_secret: 'HvEmsAiI8M5TE972F081eBgZDLR8pJnTg2UFdqXs7SC3WpzehT'
};
var client = new Twitter(config);


// API querying
app.get('/query', function(req, res) {
	var query = {};
	if (req.query.track) query.track = req.query.track;
	if (req.query.follow) query.follow = req.query.follow;
	if (!('track' in query) && !('follow' in query)) {
		query.locations = "42.72,-73.68,42.73,-73.67";
	}
	var count = req.query.count || 1;
	var data = [];
	console.log("requested " + count);
	
	//Open the stream
	client.stream("statuses/filter", query, function(stream) {
		res.write("[");
		
		//Receive a tweet
		stream.on('data', function(tweet) {
			res.write(JSON.stringify(tweet));
			data.push(tweet);
			if (--count <= 0 ) {
				res.write("]");
				res.end();
				stream.destroy( );
				console.log("done");
				writeFile(data)
			} else {
				res.write(",");
				console.log(count + " remaining");
			}
		});
		
		//Error, Close the stream and close out the response
		stream.on('error', function(error) {
			stream.destroy();
			console.log(error);
			res.write("]");
			res.end();
		});
	});
});


// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
