var rpsls = angular.module('rpslsApp', ["chart.js"])
.controller('mainController', function($scope) {  //Main controller for the app, this holds the player name, the choices for the game, and the labels for the pie chart
	
	$scope.playerName = "Player"; //Player's name, if they choose not to enter anything, the default will be player.
	
	// The list of choices for the player to choose from.  This can be expanded upon, if you want a more complicated version of the game, but the 5
	// choices of Rock, Paper, Scissors, Lizard and Spock are here right now.
	$scope.choices = [
	                  {name: "Rock", beats: ["Scissors", "Lizard"], image: "img/rock.jpg"}, 
	                  {name: "Paper", beats: ["Rock", "Spock"], image: "img/paper.jpg"}, 
	                  {name: "Scissors", beats: ["Paper", "Lizard"], image: "img/scissors.jpg"}, 
	                  {name: "Lizard", beats: ["Paper", "Spock"], image: "img/lizard.jpg"}, 
	                  {name: "Spock", beats: ["Rock", "Scissors"], image: "img/spock2.jpg"}
	                  ];
	
	// Labels for the pie chart that shows the wins, losses and ties.
	$scope.labels = ["Wins", "Losses", "Ties"];
})
.controller('rpslsController', ['$scope', '$interval', function($scope, $interval) { //Controller for the game and stat portions.
	$scope.stats = {"wins": 0, "losses": 0, "ties": 0}; // Object to store the stats in.
	$scope.data = []; // Empty data array for the pie chart
	$scope.playerChoice = []; //Empty array for the player's choice
	$scope.computerChoice = []; //Empty array for the computer's choice
	$scope.min = 0; //The minimum value for the random number generator that chooses for the computer
	//Max value for the RNG, this is set to the length of the choices array, so that as options are added to the choices, this doesn't have to be adjusted
	$scope.max = $scope.choices.length - 1;
	$scope.played = 0; // Total number of games played
	$scope.won = 0; // Total number of games won
	$scope.lost = 0; // Total number of games lost
	$scope.tied = 0; // Total number of games tied
	
	// Function that resets the stats back to 0
	$scope.resetStats = function() {
		$scope.played = 0;
		$scope.won = 0;
		$scope.lost = 0;
		$scope.tied = 0;
		$scope.stats["wins"] = 0;
		$scope.stats["losses"] = 0;
		$scope.stats["ties"] = 0;
		$scope.data = [];
	};
	
	// Function to get a random number, for when the computer chooses.  It takes the minimum and maximum values, to get a random number,
	// in this instance, from 0-4 inclusive.
	$scope.getRandomNumber = function(min, max) {
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		return random;
	};
	
	// Function to get the computer choice.  It uses the random number generator to generate a number from 0-4 inclusive, and uses that to choose an array index
	// from the choices array.
	$scope.getComputerChoice = function(){
		var random = $scope.getRandomNumber($scope.min, $scope.max);
		return $scope.choices[random];
	};
	
	// Set default images for the player and computer to question marks, used for when the page first loads.
	$scope.playerChoice.image = "img/question-mark.png";
	$scope.computerChoice.image = "img/question-mark.png";
	
	// The text to display for the game results.
	$scope.resultText = "";
	
	// Main game function.  This will choose for the computer, and compare the results with the player's choice to determine who won.
	// As the games are played, the total played, won, lost, and tied variables are incremented, and the stats object is updated, as is the data for the pie chart
	// so the chart can be displayed in real time.
	$scope.letsPlay = function(playerChoice) {
		// Assume at the start that player lost
		var playerWon = false;
		
		// Select the computer's option
		var computerChoice = $scope.getComputerChoice();
		
		//Set the computer and player choices to scope variables, to display data in the view
		$scope.playerChoice = playerChoice;
		$scope.computerChoice = computerChoice;
		
		// Check the player's choice against the computer's.  If the names are the same, then they tied
		if (playerChoice.name === computerChoice.name) {
			$scope.resultText = $scope.playerName + " and computer tied!";
			$scope.tied += 1;
		} else { 
			// Otherwise, we need to check the strings in the Beats array in the choice object to see if the option the computer chose is beaten by the player's
			// choice.  I chose to use a for loop here because the angular.forEach() loop doesn't allow breaking out of the loop, and for this operation, the
			// standard for loop was a faster choice.
			for (var i=0; i < playerChoice.beats.length; i++) {
				if (playerChoice.beats[i] === computerChoice.name) {
					playerWon = true;
					break;
				}
			}
			
			// If the player won, then increment the won variable, and add the result text
			if (playerWon) {
				$scope.won += 1;
				$scope.resultText = $scope.playerName + " Won!";
			} else {
				// Otherwise, the player lost, increment the lost variable, and add the result text.
				$scope.lost += 1;
				$scope.resultText = $scope.playerName + " lost.";
			}
		}
		$scope.played += 1;
		$scope.stats["wins"] = $scope.won;
		$scope.stats["losses"] = $scope.lost;
		$scope.stats["ties"] = $scope.tied;
		$scope.data = [$scope.stats["wins"], $scope.stats["losses"], $scope.stats["ties"]];
	};
}]);

// Directive to highlight the text in the playername text box.  I pulled this directive from stack overflow to use in this app.
rpsls.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);