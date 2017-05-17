/**
 * Alerts Controller
 */

angular.module('RDash')
    .controller('SchoolYearCtrl', ['$scope','$rootScope','$http','helper', SchoolYearCtrl]);

function SchoolYearCtrl($scope,$rootScope,$http,helper) {
   console.log("School year");
   $scope.schoolYear = 0;
   function createNewSchoolYearVariable(){
       $scope.schoolYear = [];
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.schoolYear = response.data.data
                $scope.newSchoolYear = parseInt($scope.schoolYear[$scope.schoolYear.length-1].schooYearCode)+1;
            }else{
            }
        });
   }
   createNewSchoolYearVariable();

    $scope.createSchoolYear = function(){
        var _year = $scope.newSchoolYear
        $http.post('/api/school_year', {year:_year}).then(function successCallBack(){
            helper.popup.info({
                title:"Thông báo",
                message:"Tạo thành công năm học mới.",
                close:function(){
                    location.reload();
                    return;
                }
            });
        }, function errorCallback(){
            ////console.log("000000000000")
        });
    }

}