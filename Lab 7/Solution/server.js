// Required modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var twitter = require('./twitterStream.js');

// Init the server
var app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/feed.html');
});


// API querying
app.get('/query', function(req, res) {
	var query = twitter.queryBuild(req.query);
	var count = req.query.count || 1;
	twitter.queryAPI(query, count, res,
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
	var query = twitter.queryBuild(req.body);
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
		twitter.queryAPI(query, count, file,
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
		twitter.queryAPI(query, count, file,
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
