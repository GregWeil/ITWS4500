///analyze.js
//Load a set of twitter posts and cycle through them

function reload() {
	$.get("db/read").done(function(data) {
		var tweetCount = $('#tweetCount')
		tweetCount.text('Loaded ' + data.length + ' tweet');
		if (data.length > 1) tweetCount.text(tweetCount.text() + 's');
		if (data.length <= 0) tweetCount.text('No tweets found yet');
		console.log(data[0]);
		setTimeout(reload, 1000);
	});
}

$(document).ready(reload);
