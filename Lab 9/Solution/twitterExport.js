/// Conversion functions for use with twitterStream

var xml = require('xml');

// Full JSON stream
module.exports.full = {
	start: function(stream) {
		stream.write("[");
	},
	data: function(stream, data, first) {
		if (!first) stream.write(",");
		stream.write(JSON.stringify(data));
	},
	end: function(stream, ok) {
		stream.write("]");
		stream.end();
	}
};

// Stream to CSV
module.exports.csv = {
	start: function(stream) {
		stream.write('"id","text","created_at",');
		stream.write('"user_id","user_name","user_screen_name",');
		stream.write('"user_location","user_followers_count","user_friends_count",');
		stream.write('"user_created_at","user_time_zone",');
		stream.write('"user_profile_background_color","user_profile_image_url",');
		stream.write('"geo","coordinates","place"\n');
	},
	data: function(stream, data, first) {
		stream.write('"'+data.id+'","'+data.text+'","'+data.created_at+'",');
		stream.write('"'+data.user.id+'","'+data.user.name+'",');
		stream.write('"'+data.user.screen_name+'","'+data.user.location+'",');
		stream.write('"'+data.user.followers_count+'","'+data.user.friends_count+'",');
		stream.write('"'+data.user.created_at+'","'+data.user.time_zone+'",');
		stream.write('"'+data.user.profile_background_color+'",');
		stream.write('"'+data.user.profile_image_url+'","'+data.geo+'",');
		stream.write('"'+data.coordinates+'","'+data.place+'"');
		stream.write('\n');
	},
	end: function(stream, ok) {
		stream.end();
	}
};

// Stream to JSON
module.exports.json = {
	start: function(stream) {
		stream.write("[");
	},
	data: function(stream, data, first) {
		if (!first) stream.write(",");
		stream.write(JSON.stringify({
			id: data.id, text: data.text,
			created_at: data.created_at,
			user_id: data.user.id, user_name: data.user.name,
			user_screen_name: data.user.screen_name,
			user_location: data.user.location,
			user_followers_count: data.user.followers_count,
			user_friends_count: data.user.friends_count,
			user_created_at: data.user.created_at,
			user_time_zone: data.user.time_zone,
			user_profile_background_color: data.user.profile_background_color,
			user_profile_image_url: data.user.profile_image_url,
			geo: data.geo, coordinates: data.coordinates, place: data.place
		}));
	},
	end: function(stream, ok) {
		stream.write("]");
		stream.end();
	}
};

//Stream to XML
module.exports.xml = {
	start: function(stream) {
		stream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
		stream.write('<tweets>\n');
	},
	data: function(stream, data, first) {
		stream.write('\t')
		stream.write(xml({
			tweet: [
				{
					_attr: {
						id: data.id,
						user_id: data.user.id,
						user_name: data.user.name,
						created_at: data.created_at
					}
				},
				data.text
			]
		}));
		stream.write('\n')
	},
	end: function(stream, ok) {
		stream.write('</tweets>\n')
	}
};
