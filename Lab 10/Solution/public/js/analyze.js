///analyze.js
//Load a set of twitter posts and cycle through them

var tweetAnalyzeApp = angular.module('tweetAnalyzeApp', ['chart.js']);

tweetAnalyzeApp.controller('tweetAnalyzeCtrl',
	['$scope', '$http', '$timeout',
	function($scope, $http, $timeout) {
		$scope.tweets = [];
		
		$scope.hashtags = {
			count: 0,
			hidden: 0,
			labels: [],
			data: [],
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		};
		
		$scope.scanHashtags = function() {
			var chart = $scope.hashtags;
			
			var tags = {};
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var tweet = $scope.tweets[i];
				if (!tweet.entities) continue;
				for (var j = 0; j < tweet.entities.hashtags.length; ++j) {
					var hashtag = tweet.entities.hashtags[j].text.toLowerCase();
					if (!tags[hashtag]) tags[hashtag] = 0;
					tags[hashtag] += 1;
				}
			}
			
			chart.labels = Object.keys(tags).sort(function(a, b) {
				return (tags[b] - tags[a]);
			});
			chart.data = chart.labels.map(function(tag) {
				return tags[tag];
			});
			chart.labels = chart.labels.map(function(tag) {
				return ('#' + tag);
			});
			chart.count = chart.data.length;
			
			var lengthMax = 20;
			chart.hidden = Math.max(chart.data.length - lengthMax, 0);
			if (chart.labels.length > lengthMax) {
				chart.labels.length = lengthMax;
				chart.data.length = lengthMax;
			}
		};
		
		$scope.userStatuses = {
			count: 0,
			labels: [],
			data: [],
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		};
		
		$scope.scanUserStatuses = function() {
			var chart = $scope.userStatuses;
			
			var userCount = {};
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var user = $scope.tweets[i].user;
				if (!user) continue;
				userCount[user.id] = user.statuses_count;
			}
			var count = Object.keys(userCount).map(function(user) {
				return userCount[user];
			});
			var countMin = Math.min.apply(null, count);
			var countMax = Math.max.apply(null, count);
			
			var intervalCountMax = 20;
			var intervals = [1, 5, 10, 25, 50, 100, 250, 500,
				1000, 2500, 5000, 10000, 100000, 1000000];
			var interval = intervals[0];
			for (var i = 0; i < intervals.length; ++i) {
				interval = intervals[i];
				if (countMax / interval < intervalCountMax) {
					break;
				}
			}
			
			chart.count = Object.keys(userCount).length;
			chart.labels = [];
			chart.data = [];
			for (var i = 0; i < Math.ceil(countMax / interval); ++i) {
				chart.labels[i] = (interval * i) + ' - ' + ((interval * (i + 1)) - 1);
				chart.data[i] = Object.keys(userCount).reduce(function(aggregate, user) {
					var value = userCount[user];
					var inRange = ((value >= (i * interval)) && (value < (i + 1) * interval));
					return inRange ? (aggregate + 1) : aggregate;
				}, 0);
			}
		};
		
		$scope.reload = function() {
			$http.get("db/read").then(function(response) {
				$scope.tweets = response.data;
				console.log($scope.tweets[0]);
				
				$scope.scanHashtags();
				$scope.scanUserStatuses();
				
				$timeout($scope.reload, 1000);
			});
		}
		
		$scope.reload();
	}]
);
