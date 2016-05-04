///analyze.js
//Load a set of twitter posts and cycle through them

var tweetAnalyzeApp = angular.module('tweetAnalyzeApp', ['chart.js']);

tweetAnalyzeApp.controller('tweetAnalyzeCtrl',
	['$scope', '$http', '$timeout',
	function($scope, $http, $timeout) {
		$scope.tweets = [];
		
		$scope.hashtags = {
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
		
		$scope.scanHashtags = function() {
			var chart = $scope.hashtags;
			
			var tags = {}
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var tweet = $scope.tweets[i];
				for (var j = 0; j < tweet.entities.hashtags.length; ++j) {
					var hashtag = tweet.entities.hashtags[j].text.toLowerCase();
					if (!tags[hashtag]) tags[hashtag] = 0;
					tags[hashtag] += 1;
				}
			}
			
			chart.count = Object.keys(tags).length;
			chart.labels = Object.keys(tags).sort(function(a, b) {
				return (tags[b] - tags[a]);
			});
			chart.data = chart.labels.map(function(tag) {
				return tags[tag];
			});
			chart.labels = chart.labels.map(function(tag) {
				return ('#' + tag);
			})
			
			var lengthMax = 20;
			if (chart.labels.length > lengthMax) {
				chart.labels.length = lengthMax;
				chart.labels[lengthMax - 1] = "Other";
				chart.data[lengthMax - 1] = chart.data.reduce(function(aggregate, value, index) {
					return (index >= lengthMax-1) ? (value + aggregate) : aggregate;
				}, 0);
				chart.data.length = lengthMax;
			}
		};
		
		$scope.reload = function() {
			$http.get("db/read").then(function(response) {
				$scope.tweets = response.data;
				console.log($scope.tweets[0]);
				
				$scope.scanHashtags();
				
				$timeout($scope.reload, 1000);
			});
		}
		
		$scope.reload();
	}]
);
