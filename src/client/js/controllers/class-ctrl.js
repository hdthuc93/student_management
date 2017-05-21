/**
 * Class Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('ClassCtrl', ['$scope','$uibModal','$http','helper', ClassCtrl]);

function ClassCtrl($scope,$uibModal,$http,helper) {
    $scope.grade = null;
    $scope.class = null;
    $scope.grades = [];
    $scope.classes = [];

    $scope.studentList = {
        enableSorting: false,
        enableRowSelection: true,
        multiSelect:false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'studentID', displayName: 'Mã học sinh', minWidth: 110, maxWidth: 140  },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120},
            { field: 'email', displayName: 'Email', minWidth: 220 },
            { field: 'address', displayName: 'Địa chỉ', minWidth: 350}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRow = row.entity;
                } else {
                    $scope.selectedRow = null;
                }
            });
        }
    };

    function getGrades(){
         $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/grade',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.grades = response.data.data;
                console.log("Khoi hoc",$scope.grades);
                $scope.grade = null;
                $scope.class = null;
                $scope.studentList.data = [];
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }
    getGrades();
    
    $scope.getClasses = function(){
        console.log("khoi hoc chon",$scope.grade)
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/class',
            params:{gradeID: $scope.grade}
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.classes = response.data.datas;
                $scope.class = null;
                $scope.studentList.data = [];
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }
    
    $scope.getStudentInClass = function(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/student_class',
            params:{classID: $scope.class}
        }).then(function successCallback(response) {
            if(response.data.success){
                console.log("===dassadas=====")
                $scope.studentList.data = response.data.datas;
                console.log(222222222,$scope.studentList.data);
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }

    $scope.openStudentList = function(){
        var configs = {
            templateUrl: 'templates/popup_student_list.html',
            animation: true,
            appendTo: angular.element("#modal_area"),
            size: 'lg'
        };
        modalInstance = $uibModal.open(configs)
    }
}