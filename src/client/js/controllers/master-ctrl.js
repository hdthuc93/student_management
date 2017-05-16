/**
 * Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','$http','$rootScope','$timeout', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $rootScope,$timeout) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }
    });

    $scope.selectedSchoolYear = "";
    $scope.schoolYear = [];
    $scope.$watch("selectedSchoolYear",function(year){
        if(!$scope.schoolYear.length){
            return;
        }
        $rootScope.schoolYear = angular.fromJson(year);
        console.log("current school year ",$rootScope.schoolYear)
        $rootScope.$broadcast('change-school-year');
    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    function getSchoolYear(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.schoolYear = response.data.data
                $scope.selectedSchoolYear = $scope.schoolYear[$scope.schoolYear.length-1];
            }else{
            }
        });
    }
    getSchoolYear();
     
     
}