/**
 * Alerts Controller
 */

angular.module('RDash')
    .controller('SchoolYearCtrl', ['$scope','$rootScope','$http','helper', SchoolYearCtrl]);

function SchoolYearCtrl($scope,$rootScope,$http,helper) {
   console.log("School year");
   $scope.schoolYear = [];
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

   $scope.futureSchoolYear = [];
   function getFutureSchoolYear(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year/future',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.futureSchoolYear = response.data.datas
                for(var i in $scope.futureSchoolYear){

                }
            }else{
            }
        });
   }
    getFutureSchoolYear();

    $scope.createSchoolYear = function(){
        var _year = $scope.newSchoolYear
        $http.post('/api/school_year', {year:_year}).then(function successCallBack(res){
            helper.popup.info({
                title:"Thông báo",
                message:res.data.success?"Tạo thành công năm học mới.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close:function(){
                    location.reload();
                    return;
                }
            });
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.selectFutureSchoolYear = function(){
        console.log("select future school year to current",$scope.selectedFutureSchoolYear)
    }

}