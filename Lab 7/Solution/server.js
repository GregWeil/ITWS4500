// Required modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;

var twitter = require('./twitterStream.js');
var twitterExport = require('./twitterExport.js');


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
	twitter.queryAPI(query, count, res, twitterExport.full);
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
	
	var done = function(ok) {
		res.send({
			file: fname,
			status: ok ? (!exists ? 1 : 0) : -1
		});
	};
	
	if (req.body.format == 'csv') {
		twitter.queryAPI(query, count, file, twitterExport.csv, done);
	} else {
		twitter.queryAPI(query, count, file, twitterExport.json, done);
	}
});


// Database usage
MongoClient.connect('mongodb://localhost:27017', function(err, db) {
	if (err) console.log(err);
	else console.log('connected');
});


// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
