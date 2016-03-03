///feed.js
//Load a set of twitter posts and cycle through them

var tweetBase = undefined;

function buildTweet(data) {
	//Take a twitter style json object generate html
	var tweet = tweetBase.clone()
	tweet.find(".tweetText").text(data.text);
	tweet.find(".tweetName").text(data.user.name);
	tweet.find(".tweetImage").attr('src', data.user.profile_image_url);
	return tweet;
}

function spawnTweetsFromJSON(json) {
	//Take a list of twitter json objects and show all of them
	for (var i = 0; i < json.length; ++i) {
		buildTweet(json[i]).prependTo("#tweets");
	}
}

var tweetIndex, tweetData;
var tweetCount = 5;

function cycleTweets() {
	//Move to the next tweet
	var tweet = buildTweet(tweetData[tweetIndex++]);
	tweetIndex = tweetIndex % tweetData.length;
	//Animations - Fade in new, fade out old
	tweet.prependTo("#tweets").css("opacity", 0).delay(500).fadeTo(750, 1);
	$("#tweets").children().slice(tweetCount).fadeTo(500, 0,
		function () {
			$(this).remove();
		}
	);
	//Bump everything up, then slide it back down
	//The bump is to negate the offset of the new tweet
	$("#tweets").css("top", -tweet.height())
		.animate({top: 0}, {duration: 1000, queue: false});
}

function cycleInit(data) {
	//Preparation for the tweet cycler
	tweetData = $.parseJSON(data).statuses;
	console.log(tweetData)
	for (tweetIndex = 0; tweetIndex < tweetCount; ++tweetIndex) {
		$("#tweets").append(buildTweet(tweetData[tweetIndex]));
	}
	$("#tweets").css("position", "relative");
	setInterval(cycleTweets, 3000);
}

$( document ).ready(function() {
	//Pull the template tweet and load everything in
	tweetBase = $("#tweets").find(".tweet").remove();
	$.get("get_tweets.php", cycleInit);
});

var tweetFeedApp = angular.module('tweetFeedApp', []);
tweetFeedApp.controller('TweetFeedCtrl', function($scope) {
	$scope.tagline = "recent but not live";
});
