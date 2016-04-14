/// server.js

//Required modules
var express = require('express')

//Initialize the server
var port = 3000
var app = express()

//Serve the page
app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

//Open the server to requests
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
