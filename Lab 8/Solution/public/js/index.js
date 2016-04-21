// index.js

$(document).ready(function() {
	$('#query').val(
		'prefix dbo: <http://dbpedia.org/ontology/> '
		+ 'select ?name ?birth ?subject '
		+ 'where { ?subject a dbo:Person. '
		+ '?subject dbo:birthName ?name. '
		+ '?subject dbo:birthDate ?birth. } '
		+ 'limit 10'
	)
	$('#form').submit(function(e) {
		e.preventDefault()
		var output = $('#output')
		output.children().remove()
		$.get('/query', {
			query: $('#query').val()
		}).done(function(data) {
			console.log(data)
			output.children().remove()
			var head = $('<tr>').prependTo(output)
			for (var i = 0; i < data.head.vars.length; ++i) {
				$('<th>').text(data.head.vars[i]).appendTo(head)
			}
			for (var i = 0; i < data.results.bindings.length; ++i) {
				var row = $('<tr>').appendTo(output)
				for (var j = 0; j < data.head.vars.length; ++j) {
					var value = data.results.bindings[i][data.head.vars[j]]
					var elem = $('<td>')
					if (value.type == 'uri') {
						elem.append($('<a>').attr('href', value.value).text(value.value))
					} else {
						elem.text(value.value)
					}
					row.append(elem)
				}
			}
		})
	})
})
