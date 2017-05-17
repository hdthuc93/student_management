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
        console.log(888888888,newValue);
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;                
            }
        } else {
            $scope.toggle = false;
            $("#page-wrapper").removeClass('open');
        }
    });

    $scope.selectedSchoolYear = {};
    $rootScope.masterSchoolYear = [];
    $scope.$watch("selectedSchoolYear",function(year){
        console.log(8989,year);
        $rootScope.masterSelectedschoolYear = angular.fromJson(year);
        console.log("current school year ",$rootScope.masterSelectedschoolYear)
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
                $rootScope.masterSchoolYear = response.data.data
                $scope.selectedSchoolYear = $rootScope.masterSchoolYear[$scope.masterSchoolYear.length-1];
            }else{
            }
        });
    }
    getSchoolYear();
     
     
}