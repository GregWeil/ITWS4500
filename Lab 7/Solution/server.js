// Required modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var xml = require('xml');

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
		var status = 'success';
		if (exists) status = 'overwrite';
		if (!ok) status = 'error';
		res.send({
			file: fname,
			status: status
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
	if (err) {
		console.log(err);
		return;
	}
	
	app.post('/db/build', function(req, res) {
		var query = twitter.queryBuild(req.body);
		var count = req.body.count || 1;
		var errors = false;
		twitter.queryAPI(query, count, db.collection('tweets'), {
			start: function(collection) {
				collection.deleteMany({}, function(err, result) {
					if (err) {
						console.log(err);
						errors = true;
					}
				});
			},
			data: function(collection, tweet) {
				collection.insertOne(tweet, function(err, result) {
					if (err) {
						console.log(err);
						errors = true;
					}
				});
			}
		}, function(ok) {
			res.send(ok && !errors);
		});
	});

	app.get('/db/read', function(req, res) {
		db.collection('tweets').find({}).toArray(function(err, docs) {
			if (err) {
				console.log(err);
				res.send([]);
			} else {
				res.send(docs);
			}
		})
	});

	app.post('/db/export', function(req, res) {
		var fname = "/out/out-database";
		if (req.body.name) fname += '-' + req.body.name;
		fname += '.xml';
		
		var exists = true;
		try {
			fs.accessSync("./public/" + fname);
		} catch (err) {
			exists = false;
		}
		
		var file = fs.createWriteStream("./public/" + fname);
		db.collection('tweets').find({}).toArray(function(err, docs) {
			var tweets = [];
			if (err) {
				console.log(err);
			} else {
				tweets = docs.map(function(tweet) {
					return { tweet: [
						{ _attr: {
							id: tweet.id,
							user_id: tweet.user.id,
							created_at: tweet.created_at
						} },
						tweet.text
					] };
				});
			}
			file.write(xml({tweets: tweets}, {
				declaration: true,
				indent: '\t'
			}));
			var status = 'success';
			if (exists) status = 'overwrite';
			if (err) status = 'error';
			res.send({
				file: fname,
				status: status
			});
		})
	});
});


// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
