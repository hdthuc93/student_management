var module = angular.module('mod.helper');
module.controller('studentListNotInClassCtrl', ['$scope', '$uibModalInstance', '$http', 'helper', function ($scope, $uibModalInstance, $http, helper) {
    $scope.selectedRows = null;

    $scope.loadStudentNotInClass = function(){
        console.log("loading student not in class")
        $http({
            method: 'GET',
            url: '/api/student',
            params: {inClass: false}
        }).then(function successCallback(response) {
            if (response.data.success) {
                console.log(111112222,response);
                $scope.studentList.data = response.data.datas;
            } else {
                $scope.studentList.data = [];
                $scope.studentListStatus = "Không có dữ liệu";
            }

        }, function errorCallback(response) {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }
    $scope.loadStudentNotInClass();

    $scope.studentList = {
        enableSorting: true,
        enableRowSelection: true,
        multiSelect:true,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        data: [],
        columnDefs: [
            { field: 'studentCode', displayName: 'Mã học sinh', minWidth: 110, maxWidth: 120  },
            { field: 'name', displayName: 'Họ Tên', minWidth: 220 },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderToText', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 100, maxWidth: 120},
            // { field: 'inCLass', displayName: 'Có lớp', minWidth: 100, maxWidth: 120},
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedRows = rowsSelected.length?rowsSelected:null;            
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (gridData) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedRows = rowsSelected.length?rowsSelected:null;
            });
        }
    };
    $scope.selectStudent = function () {
        //get student list
        var callBack = {
            title: "studentID",
            data: $scope.selectedRows || null
        }
        $uibModalInstance.close(callBack);
    };

    $scope.closeModal = function(){
        $uibModalInstance.close("");
    }
}]);

