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
	$scope.tagline = "Now with MongoDB!";
	
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
	
	$scope.dbName = "";
	
	$scope.waiting = false;
	$scope.exportStatus = '';
	$scope.exportData = '';
	
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
	
	$scope.exportSearch = function (format) {
		$scope.exportStatus = '';
		$scope.waiting = true;
		$http.post("export", {
			track: $scope.query,
			count: $scope.count,
			format: format
		}).then(function(response) {
			if (response.data.status >= 0) {
				$scope.exportStatus = (response.data.status > 0) ? 'success' : 'overwrite';
				$scope.exportData = response.data.file;
			} else {
				$scope.exportStatus = 'error';
			}
			$scope.waiting = false;
		});
	};
	
	
	$scope.dbBuild = function () {
		$scope.waiting = true;
		$http.post("db/build", {
			track: $scope.query,
			count: $scope.count
		}).then(function(response) {
			$scope.waiting = false;
		});
	}
	
	$scope.dbRead = function () {
		$scope.tweets = [];
		$scope.index = 0;
		$scope.waiting = true;
		$http.get("db/read")
		.then(function(response) {
			console.log(response.data.length);
			$scope.tweets = response.data;
			$scope.index = 0;
			$scope.waiting = false;
		});
	}
	
	$scope.dbExport = function () {
		$scope.exportStatus = '';
		$scope.waiting = true;
		$http.post("db/export", {
			name: $scope.dbName
		}).then(function(response) {
			console.log(response.data);
			$scope.waiting = false;
		});
	}
}]);
