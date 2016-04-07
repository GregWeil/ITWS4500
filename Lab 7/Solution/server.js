// Required modules
var express = require('express');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var fs = require('fs');


// Init the server
var app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/feed.html');
});


// Create the API link
var config = {
	access_token_key: '47282406-UyxyVM0rkAwuti3YpgwLGyi84Yh8KXxKOv4mQ6Xhv',
    access_token_secret: 'DLEtDS9DFGpPUVG1SVC5A4J15iTd8VPZ68HmOU3BJmtGx',
    consumer_key: 'luI2jnjp3GOuyqKuWsSKIFstD',
    consumer_secret: 'HvEmsAiI8M5TE972F081eBgZDLR8pJnTg2UFdqXs7SC3WpzehT'
};
var client = new Twitter(config);

function queryBuild(req) {
	var query = {};
	if (req.track) query['track'] = req.track;
	if (req.follow) query['follow'] = req.follow;
	if (!('track' in query) && !('follow' in query)) {
		query.locations = "42.72,-73.68,42.73,-73.67";
	}
	return query;
}

function queryAPI(query, count, output, start, write, end) {
	console.log("requested " + count);
	client.stream("statuses/filter", query, function(stream) {
		start(output);
		var first = true;
		
		//Receive a tweet
		stream.on('data', function(tweet) {
			write(output, tweet, first);
			first = false;
			if (--count <= 0 ) {
				end(output, true);
				stream.destroy( );
				console.log("done");
			} else {
				console.log(count + " remaining");
			}
		});
		
		//Error, Close the stream and close out the response
		stream.on('error', function(error) {
			end(output, false);
			stream.destroy();
			console.log(error);
		});
	});
}


// API querying
app.get('/query', function(req, res) {
	var query = queryBuild(req.query);
	var count = req.query.count || 1;
	queryAPI(query, count, res,
		function(stream) {
			stream.write("[");
		},
		function(stream, data, first) {
			if (!first) stream.write(",");
			stream.write(JSON.stringify(data));
		},
		function(stream, ok) {
			stream.write("]");
			stream.end();
		}
	);
});

// API export
app.post('/export', function(req, res) {
	var query = queryBuild(req.body);
	var count = req.body.count || 1;
	
	var fdate = new Date();
	var fdatestr = (fdate.getUTCFullYear()+"-"+fdate.getUTCMonth()+"-"+fdate.getUTCDate());
	var fname = ("out/out-"+fdatestr+"&count="+count);
	if ('track' in query) fname += ("&track="+query.track);
	if (req.body.format) fname += ("." + req.body.format);
	
	var exists = true;
	try {
		fs.accessSync("./public/" + fname);
	} catch (err) {
		exists = false;
	}
	var file = fs.createWriteStream("./public/" + fname);
	
	if (req.body.format == 'csv') {
		queryAPI(query, count, file,
			function(stream) {
				stream.write('"id","text","created_at",');
				stream.write('"user_id","user_name","user_screen_name",');
				stream.write('"user_location","user_followers_count","user_friends_count",');
				stream.write('"user_created_at","user_time_zone",');
				stream.write('"user_profile_background_color","user_profile_image_url",');
				stream.write('"geo","coordinates","place"\n');
			},
			function(stream, data, first) {
				stream.write('"'+data.id+'","'+data.text+'","'+data.created_at+'",');
				stream.write('"'+data.user.id+'","'+data.user.name+'",');
				stream.write('"'+data.user.screen_name+'","'+data.user.location+'",');
				stream.write('"'+data.user.followers_count+'","'+data.user.friends_count+'",');
				stream.write('"'+data.user.created_at+'","'+data.user.time_zone+'",');
				stream.write('"'+data.user.profile_background_color+'",');
				stream.write('"'+data.user.profile_image_url+'","'+data.geo+'",');
				stream.write('"'+data.coordinates+'","'+data.place+'"');
				stream.write('\n');
			},
			function(stream, ok) {
				stream.end();
				res.send({
					file: fname,
					status: ok ? (!exists ? 1 : 0) : -1
				});
			}
		);
	} else {
		queryAPI(query, count, file,
			function(stream) {
				stream.write("[");
			},
			function(stream, data, first) {
				if (!first) stream.write(",");
				stream.write(JSON.stringify({
					id: data.id, text: data.text,
					created_at: data.created_at,
					user_id: data.user.id, user_name: data.user.name,
					user_screen_name: data.user.screen_name,
					user_location: data.user.location,
					user_followers_count: data.user.followers_count,
					user_friends_count: data.user.friends_count,
					user_created_at: data.user.created_at,
					user_time_zone: data.user.time_zone,
					user_profile_background_color: data.user.profile_background_color,
					user_profile_image_url: data.user.profile_image_url,
					geo: data.geo, coordinates: data.coordinates, place: data.place
				}));
			},
			function(stream, ok) {
				stream.write("]");
				stream.end();
				res.send({
					file: fname,
					status: ok ? (!exists ? 1 : 0) : -1
				});
			}
		);
	}
});


// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
