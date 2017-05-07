/**
 * Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','$http','$rootScope', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $rootScope) {
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
                setTimeout(function(){
                    $scope.selectedSchoolYear = $scope.schoolYear[0];
                    $rootScope.schoolYear = $scope.selectedSchoolYear;
                    console.log(299999,$scope.selectedSchoolYear,$rootScope.schoolYear);    
                },1000) 
            }else{
            }
        });
    }
    getSchoolYear();

    $scope.changeSchoolYear = function(){
        $rootScope.schoolYear = $scope.selectedSchoolYear;
        console.log(19999999,$scope.selectedSchoolYear,$rootScope.schoolYear);                
    }
     
}