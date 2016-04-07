/// Conversion functions to use with twitterStream

// Full JSON stream

module.exports.startFull = function(stream) {
	stream.write("[");
};

module.exports.dataFull = function(stream, data, first) {
	if (!first) stream.write(",");
	stream.write(JSON.stringify(data));
};

module.exports.endFull = function(stream, ok) {
	stream.write("]");
	stream.end();
};

// Convert to CSV

module.exports.startCSV = function(stream) {
	stream.write('"id","text","created_at",');
	stream.write('"user_id","user_name","user_screen_name",');
	stream.write('"user_location","user_followers_count","user_friends_count",');
	stream.write('"user_created_at","user_time_zone",');
	stream.write('"user_profile_background_color","user_profile_image_url",');
	stream.write('"geo","coordinates","place"\n');
};

module.exports.dataCSV = function(stream, data, first) {
	stream.write('"'+data.id+'","'+data.text+'","'+data.created_at+'",');
	stream.write('"'+data.user.id+'","'+data.user.name+'",');
	stream.write('"'+data.user.screen_name+'","'+data.user.location+'",');
	stream.write('"'+data.user.followers_count+'","'+data.user.friends_count+'",');
	stream.write('"'+data.user.created_at+'","'+data.user.time_zone+'",');
	stream.write('"'+data.user.profile_background_color+'",');
	stream.write('"'+data.user.profile_image_url+'","'+data.geo+'",');
	stream.write('"'+data.coordinates+'","'+data.place+'"');
	stream.write('\n');
};

module.exports.endCSV = function(stream, ok) {
	stream.end();
};

// Condense JSON

module.exports.startJSON = function(stream) {
	stream.write("[");
};

module.exports.dataJSON = function(stream, data, first) {
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
};

module.exports.endJSON = function(stream, ok) {
	stream.write("]");
	stream.end();
};
