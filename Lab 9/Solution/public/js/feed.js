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
	var taglines = ["A finished product!", "With MongoDB", "Supports exporting",
		"Look at those tweets", "Find tweets near RPI", "One stream at a time"];
	var tagIndex = (Math.pow(Math.random(), 2) * taglines.length);
	$scope.tagline = taglines[Math.floor(tagIndex)];
	
	$scope.tweets = [];
	$scope.index = 0;
	$scope.display = 5;
	
	$interval(function() {
		if ($scope.tweets.length > 0) {
			$scope.index = ($scope.index - 1 + $scope.tweets.length) % $scope.tweets.length;
		}
	}, 5000);
	
	
	$scope.count = 10;
	$scope.query = "";
	
	$scope.waiting = false;
	$scope.exportStatus = '';
	
	$scope.exportName = '';
	$scope.exportFormat = '';
	$scope.exportData = '';
	
	$scope.search = function () {
		$scope.tweets = [];
		$scope.waiting = 'retrieving tweets directly from Twitter';
		$scope.exportStatus = '';
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
	
	$scope.exportStart = function (format) {
		$scope.exportName = '';
		$scope.exportFormat = format;
		$scope.exportStatus = 'input';
	};
	
	
	$scope.dbBuild = function () {
		$scope.waiting = 'populating the database with tweets';
		$scope.exportStatus = '';
		$http.post("db/build", {
			track: $scope.query,
			count: $scope.count,
			clear: true
		}).then(function(response) {
			$scope.waiting = false;
		});
	}
	
	$scope.dbRead = function () {
		$scope.tweets = [];
		$scope.index = 0;
		$scope.waiting = true;
		$scope.exportStatus = '';
		$http.get("db/read")
		.then(function(response) {
			console.log(response.data.length);
			$scope.tweets = response.data;
			$scope.index = 0;
			$scope.waiting = false;
		});
	}
	
	$scope.dbExport = function () {
		$scope.waiting = true;
		$http.post("db/export", {
			name: $scope.exportName,
			format: $scope.exportFormat
		}).then(function(response) {
			$scope.exportStatus = response.data.status;
			if ($scope.exportStatus != 'error') {
				$scope.exportData = response.data.file;
			}
			$scope.waiting = false;
		});
	}
}]);
