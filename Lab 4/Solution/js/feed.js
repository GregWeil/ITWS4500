///feed.js
//Load a set of twitter posts and cycle through them

var tweetFeedApp = angular.module('tweetFeedApp', []);
tweetFeedApp.controller('TweetFeedCtrl', function($scope, $http) {
	$scope.tagline = "recent but not live";
	$scope.tweets = [];
	$scope.index = 0;
	
	$http.get("get_tweets.php").then(function(response) {
		$scope.tweets = response.data.statuses;
	});
});
