/**
 * Report Controller
 */

angular.module('RDash')
    .controller('ReportCtrl', ['$scope','$http','helper', ReportCtrl]);

function ReportCtrl($scope,$http,helper) {
    function getSubject(){
        $http({
                method: 'GET',
                url: '/api/subject',
            }).then(function successCallback(response) {
                if (response.data.success) {
                    $scope.subjectList = response.data.datas;
                } else {
                    $scope.subjectList = null;
                }
            }, function errorCallback(response) {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            });
    }
    getSubject();

    $scope.reset = function(){
        $scope.subjectID = "";
        $scope.semesterID = "1";
        if($scope.reportList){
            $scope.reportList.data = [];
        }
       };
    $scope.reset();

    $scope.report = function(){
        console.log(1111,$scope.gradeID,  $scope.semesterID, $scope.subjectID);
        if($scope.subjectID){
            console.log("BAO CAO THEO SUBJECT")
            var semesterID = $scope.semesterID?parseInt($scope.semesterID):"";
            var subjectID = $scope.subjectID?parseInt($scope.subjectID):"";

             $http({
                method: 'GET',
                url: '/api/statistic/subject',
                params:{semesterID: semesterID,subjectID: subjectID}
            }).then(function successCallback(response) {
                if (response.data.success) {
                    console.log("ket qua",response.data);
                    $scope.reportList.minRowsToShow = response.data.datas.length;
                    $scope.reportList.data = response.data.datas;
                } else {
                    $scope.reportList.data = [];
                    helper.popup.info({title: "Lỗi",message: "Không có dữ liệu.",close: function () {; return;}})
                }
            }, function errorCallback(response) {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            });
        }else{
            console.log("BAO CAO THEO HOC KI")

            var semesterID = $scope.semesterID?parseInt($scope.semesterID):"";
             $http({
                method: 'GET',
                url: '/api/statistic/semester',
                params:{semesterID: semesterID}
            }).then(function successCallback(response) {
                if (response.data.success) {
                    console.log("ket qua",response.data);
                    $scope.reportList.minRowsToShow = response.data.datas.length;
                    $scope.reportList.data = response.data.datas;
                } else {
                    $scope.reportList.data = [];
                    helper.popup.info({title: "Lỗi",message: "Không có dữ liệu.",close: function () {; return;}})
                }
            }, function errorCallback(response) {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            });
        }
        helper.scrollTo("report-area")
    }

    $scope.reportList = {
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'cls', displayName: 'Lớp' },
            { field: 'totalStudent', displayName: 'Sĩ Số' },
            { field: 'totalPass', displayName: 'SL Đạt' },
            { field: 'passPercent', displayName: 'Tỉ Lệ' }
        ]
    };
}
