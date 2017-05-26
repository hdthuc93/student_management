angular
    .module('RDash')
    .directive('viewScore', viewScore);

function viewScore() {
    var directive = {
        restrict: 'AE',
        templateUrl: "templates/view_score.html"
    };
    return directive;
};