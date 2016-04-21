// index.js

$(document).ready(function() {
	$('#query').val(
		'prefix dbo: <http://dbpedia.org/ontology/> '
		+ 'select ?name ?birth ?subject '
		+ 'where { ?subject a dbo:Person. '
		+ '?subject dbo:birthName ?name. '
		+ '?subject dbo:birthYear ?birth. } '
		+ 'limit 10'
	)
	$('#form').submit(function(e) {
		e.preventDefault()
		$.get('/query', {
			query: $('#query').val()
		}).done(function(data) {
			console.log(data)
		})
	})
})
