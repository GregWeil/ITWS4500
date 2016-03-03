// Server init
var express = require('express');
var app = express();

// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/feed.html');
});

// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
