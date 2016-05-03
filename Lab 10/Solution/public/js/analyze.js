///analyze.js
//Load a set of twitter posts and cycle through them

var tweetAnalyzeApp = angular.module('tweetAnalyzeApp', []);

tweetAnalyzeApp.controller('tweetAnalyzeCtrl',
	['$scope', '$http', '$timeout',
	function($scope, $http, $timeout) {
		$scope.tweets = [];
		
		$scope.reload = function() {
			$http.get("db/read").then(function(response) {
				$scope.tweets = response.data;
				console.log($scope.tweets[0]);
				
				$timeout($scope.reload, 1000);
			});
		}
		
		$scope.reload();
	}]
);
