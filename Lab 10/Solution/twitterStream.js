/// Stream tweets from Twitter
var Twitter = require('twitter');

// Create the API link
var config = {
	access_token_key: '47282406-UyxyVM0rkAwuti3YpgwLGyi84Yh8KXxKOv4mQ6Xhv',
    access_token_secret: 'DLEtDS9DFGpPUVG1SVC5A4J15iTd8VPZ68HmOU3BJmtGx',
    consumer_key: 'luI2jnjp3GOuyqKuWsSKIFstD',
    consumer_secret: 'HvEmsAiI8M5TE972F081eBgZDLR8pJnTg2UFdqXs7SC3WpzehT'
};
var client = new Twitter(config);

var endStream = null;

module.exports.queryBuild = function(req) {
	var query = {};
	if (req.track) query['track'] = req.track;
	if (req.follow) query['follow'] = req.follow;
	if (!('track' in query) && !('follow' in query)) {
		query.locations = "42.72,-73.68,42.73,-73.67";
	}
	return query;
}

module.exports.queryAPI = function(query, count, output, handler, done) {
	if (endStream) {
		console.log("cancel request");
		endStream(false);
	}
	
	console.log("requested " + count);
	client.stream("statuses/filter", query, function(stream) {
		if (handler.start) handler.start(output);
		var first = true;
		
		//Close the stream
		endStream = function(ok) {
			endStream = null;
			stream.destroy( );
			if (handler.end) handler.end(output, ok);
			if (done) done(ok);
		}
		
		//Receive a tweet
		stream.on('data', function(tweet) {
			handler.data(output, tweet, first);
			first = false;
			if (--count <= 0 ) {
				endStream(true);
				console.log("done");
			} else {
				console.log(count + " remaining");
			}
		});
		
		//Error, Close the stream and close out the response
		stream.on('error', function(error) {
			endStream(false);
			console.log(error);
		});
	});
}
