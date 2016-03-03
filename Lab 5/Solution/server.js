// Server init
var express = require('express');
var app = express();

// Listen for requests
app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
