///feed.js
//Load a set of twitter posts and cycle through them

var tweetFeedApp = angular.module('tweetFeedApp', ['ngAnimate']);

tweetFeedApp.filter('sliceWrap', function() {
	return function(input, count, start) {
		return input.concat(input).slice(start, start+Math.min(count, input.length));
	}
});

tweetFeedApp.controller('TweetFeedCtrl', ['$scope', '$http', '$interval',
function($scope, $http, $interval) {
	$scope.tagline = "It'll load eventually";
	
	$scope.tweets = [];
	$scope.index = 0;
	$scope.display = 5;
	
	$scope.count = 10;
	$scope.query = "";
	
	$scope.waiting = false;
	$scope.exportSuccess = false;
	$scope.exportOverwrite = false;
	$scope.exportFailure = false;
	
	$scope.search = function () {
		$scope.tweets = [];
		$scope.waiting = true;
		$http.get("query", {
			params: {
				track: $scope.query,
				count: $scope.count
			}
		}).then(function(response) {
			$scope.tweets = response.data;
			$scope.index = 0;
			$scope.waiting = false;
		});
	};
	
	$scope.exportInfoClear = function () {
		$scope.exportSuccess = false;
		$scope.exportOverwrite = false;
		$scope.exportFailure = false;
	}
	
	$scope.export = function (format) {
		$scope.exportInfoClear();
		$scope.exportSuccess = (format == 'json');
		$scope.exportOverwrite = (format == 'csv');
	};
	
	$interval(function() {
		if ($scope.tweets.length > 0) {
			$scope.index = ($scope.index - 1 + $scope.tweets.length) % $scope.tweets.length;
		}
	}, 5000);
}]);
