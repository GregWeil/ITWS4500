/// server.js

//Required modules
var express = require('express')
var request = require('request')

//Initialize the server
var port = 3000
var app = express()

//Serve the page
app.use(express.static('public'))

//Query endpoint
app.get('/query', function(req, res) {
    request.get({
        url: 'http://dbpedia.org/sparql',
        qs: {
            query: 'select+distinct+%3FConcept+where+%7B%5B%5D+a+%3FConcept%7D+LIMIT+100',
            format: 'application/sparql-results+json'
        }
    }).pipe(res)
})

//Open the server to requests
app.listen(port, function() {
    console.log('Server listening on port ' + port)
})
