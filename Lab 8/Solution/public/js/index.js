// index.js

$(document).ready(function() {
	$('#form').submit(function(e) {
		e.preventDefault()
		$.get('/query', {
			query: $('#query').val()
		}).done(function(data) {
			console.log(data)
		})
	})
})
