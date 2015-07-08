/* set the app module */
var app = angular.module('flapperNews', []);

/* setup the main controller */
app.controller('MainCtrl', [
    '$scope',
    function($scope){
        $scope.test = 'Hello world!';
    }
]);
