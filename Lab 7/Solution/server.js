// Required modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var twitter = require('./twitterStream.js');
var convert = require('./twitterExport.js');


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
	twitter.queryAPI(query, count, res, convert.startFull, convert.dataFull, convert.endFull);
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
		twitter.queryAPI(query, count, file, convert.startCSV, convert.dataCSV, convert.endCSV,
			function(ok) {
				res.send({
					file: fname,
					status: ok ? (!exists ? 1 : 0) : -1
				});
			}
		);
	} else {
		twitter.queryAPI(query, count, file, convert.startJSON, convert.dataJSON, convert.endJSON,
			function(ok) {
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
