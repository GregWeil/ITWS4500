///analyze.js
//Load a set of twitter posts and cycle through them

var tweetAnalyzeApp = angular.module('tweetAnalyzeApp', ['chart.js']);

tweetAnalyzeApp.controller('tweetAnalyzeCtrl',
	['$scope', '$http', '$timeout',
	function($scope, $http, $timeout) {
		$scope.tweets = [];
		
		$scope.hashtags = {
			labels: ["Red", "Green", "Blue"],
			data: [2, 3, 1]
		};
		
		$scope.options = {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		};
		
		$scope.scanHashtags = function() {
			var tags = {}
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var tweet = $scope.tweets[i];
				for (var j = 0; j < tweet.entities.hashtags.length; ++j) {
					var hashtag = tweet.entities.hashtags[j].text;
					if (!tags[hashtag]) tags[hashtag] = 0;
					tags[hashtag] += 1;
				}
			}
			
			$scope.hashtags.labels = Object.keys(tags).sort(function(a, b) {
				return (tags[b] - tags[a]);
			});
			$scope.hashtags.data = $scope.hashtags.labels.map(function(tag) {
				return tags[tag];
			});
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
