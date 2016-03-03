///feed.js
//Load a set of twitter posts and cycle through them

var tweetFeedApp = angular.module('tweetFeedApp', []);

tweetFeedApp.filter('sliceWrap', function() {
	return function(input, count, start) {
		return input.concat(input).slice(start, start+Math.min(count, input.length));
	}
});

tweetFeedApp.controller('TweetFeedCtrl', ['$scope', '$http', '$interval',
function($scope, $http, $interval) {
	$scope.tagline = "recent but not live";
	$scope.tweets = [];
	$scope.index = 0;
	
	$http.get("get_tweets.php").then(function(response) {
		$scope.tweets = response.data.statuses;
	});
	
	$interval(function() {
		if ($scope.tweets.length > 0) {
			$scope.index = ($scope.index - 1 + $scope.tweets.length) % $scope.tweets.length;
		}
	}, 5000);
}]);
