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
		
		$scope.scanUserStatuses = function() {
			var chart = $scope.userStatuses;
			
			var userCount = {};
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var user = $scope.tweets[i].user;
				if (!user) continue;
				userCount[user.id] = user.statuses_count;
			}
			chart.count = Object.keys(userCount).length;
			chart.hidden = 0;
			
			var count, countMin, countMax;
			var intervalCountMax = 15;
			var intervals = [1, 2.5, 5];
			var interval = intervals[0];
			var intervalCompute = function() {
				count = Object.keys(userCount).map(function(user) {
					return userCount[user];
				});
				countMin = Math.min.apply(null, count);
				countMax = Math.max.apply(null, count);
				interval = null;
				intervalScale = 1;
				while (!interval) {
					var intervalsScaled = intervals.map(function(value) {
						return Math.round(value * intervalScale);
					})
					for (var i = 0; i < intervalsScaled.length; ++i) {
						interval = intervalsScaled[i];
						if ((countMax / interval) > intervalCountMax) {
							interval = null;
						} else {
							break;
						}
					}
					intervalScale *= 10;
				}
			};
			intervalCompute();
			
			chart.labels = [];
			chart.data = [];
			for (var i = 0; i < Math.ceil(countMax / interval); ++i) {
				var lower = (interval * i).toLocaleString();
				var upper = ((interval * (i + 1)) - 1).toLocaleString();
				chart.labels[i] = (lower + ' - ' + upper);
				chart.data[i] = Object.keys(userCount).reduce(function(aggregate, user) {
					var value = userCount[user];
					var inRange = ((value >= (i * interval)) && (value < (i + 1) * interval));
					return inRange ? (aggregate + 1) : aggregate;
				}, 0);
			}
		};
		
		$scope.languages = {
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
		
		$scope.scanLanguages = function() {
			var chart = $scope.languages;
			
			var userLanguages = {};
			var userFollowers = {};
			for (var i = 0; i < $scope.tweets.length; ++i) {
				var user = $scope.tweets[i].user;
				if (!user) continue;
				userLanguages[user.id] = user.lang;
				userFollowers[user.id] = user.followers_count;
			}
			
			var users = Object.keys(userFollowers);
			var languageUsers = {};
			var languageFollowers = {};
			for (var i = 0; i < users.length; ++i) {
				var userLanguage = userLanguages[users[i]];
				if (!languageUsers[userLanguage]) {
					languageUsers[userLanguage] = 0;
					languageFollowers[userLanguage] = 0;
				}
				languageUsers[userLanguage] += 1;
				languageFollowers[userLanguage] += userFollowers[users[i]];
			}
			
			var languages = Object.keys(languageFollowers);
			var followers = {};
			for (var i = 0; i < languages.length; ++i) {
				var lang = languages[i];
				followers[lang] = (languageFollowers[lang] / languageUsers[lang]);
			}
			
			chart.labels = languages.sort(function(a, b) {
				return (followers[b] - followers[a]);
			});
			chart.data = chart.labels.map(function(lang) {
				return followers[lang];
			});
			chart.count = chart.labels.length;
			
			var lengthMax = 15;
			chart.hidden = Math.max(chart.data.length - lengthMax, 0);
			if (chart.labels.length > lengthMax) {
				chart.labels.length = lengthMax;
				chart.data.length = lengthMax;
			}
		};
		
		$scope.reload = function() {
			$http.get("db/read").then(function(response) {
				$scope.tweets = response.data;
				
				$scope.scanHashtags();
				$scope.scanLanguages();
				$scope.scanUserStatuses();
				
				$timeout($scope.reload, 1000);
			});
		}
		
		$scope.reload();
	}]
);
