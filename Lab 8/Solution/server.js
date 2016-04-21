/// server.js

//Required modules
var express = require('express')

//Initialize the server
var port = 3000
var app = express()

//Serve the page
app.use(express.static('public'))

//Query endpoint
app.get('/query', function(req, res) {
    res.send(req.query)
})

//Open the server to requests
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
