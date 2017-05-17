/**
 * Student List Controller
 * Implement: Phong Nguyen
 */
var module = angular.module('RDash');
module.filter('GenderText', function () {
    return function (input) {
        switch (input) {
            case "1":
                return "Nam";
                break;
            case "0":
                return "Nữ";
                break;
            default:
                return "Nam";
        }
    };
});

module.controller('StudentListCtrl', ['$scope', 'helper', '$http', '$rootScope', StudentListCtrl]);

function StudentListCtrl($scope, helper, $http, $rootScope) {
    $scope.showHandleArea = false; //Hien vung xu ly Them/Sua
    $scope.studentData = {};
    $scope.action = "";
    $scope.studentListStatus = "Không có dữ liệu"
    function initOptions() {
        $scope.options = {
            studentCode: "",
            gender: "",
            name: "",
            email: "",
            address: "",
            birthdayFrom: "",
            birthdayTo: "",
            yearAdmission: ""
        }
    }
    initOptions();

    $scope.reset = function () {
        initOptions();
        $scope.getStudentList();
    }

    $scope.studentList = {
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'studentCode', displayName: 'Mã Học Sinh', minWidth: 110, maxWidth: 140 },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderText', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120 },
            { field: 'email', displayName: 'Email', minWidth: 220 },
            { field: 'address', displayName: 'Địa Chỉ', minWidth: 350 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.showHandleArea = false;
                $scope.action = "";
                if (row.isSelected) {
                    $scope.selectedRow = row.entity;
                } else {
                    $scope.selectedRow = null;
                }
            });
        }
    };


    $scope.getStudentList = function () {
        $scope.studentListStatus = "Đang tải...";
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/student',
            params: $scope.options
        }).then(function successCallback(response) {
            if (response.data.success) {
                $scope.studentList.data = response.data.datas;
                $scope.studentList.data.forEach(function (e, i) {
                    $scope.studentList.data[i].no = i + 1;
                });
            } else {
                $scope.studentList.data = [];
                $scope.studentListStatus = "Không có dữ liệu";
            }

        }, function errorCallback(response) {
            helper.popup.info({
                title: "Lỗi",
                message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    //$scope.getStudentList();
                    return;
                }
            })
        });
    }
    $scope.getStudentList();

    $scope.viewStudent = function () {
        console.log("view student");
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "view"
        };
        helper.scrollTo("handle-student-area");
    }

    $scope.addStudent = function () {
        console.log("create student");
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: {},
            action: "create"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.editStudent = function () {
        console.log("edit student", $scope.selectedRow);
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "edit"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.removeStudent = function () {
        console.log("remove student", $scope.selectedRow);
        $scope.showHandleArea = false;
        $scope.action = "";
        helper.popup.confirm({
            title: "Xoá học sinh",
            message: "Bạn có thưc sự muốn xoá học sinh này?",
            ok: function () {
                $http.delete('/api/student', { params: { studentID: $scope.selectedRow.studentID } }).then(function successCallBack(res) {
                    helper.popup.info({
                        title: "Thông báo",
                        message: res.data.success ? "Xoá học sinh thành công." : "Xoá thất bại. Hãy thử lại",
                        close: function () {
                            $scope.reset();
                            return;
                        }
                    });
                }, function errorCallback() {
                });
            },
            cancel: function () {
                return;
            }
        })
    }

    $scope.$on('reset-student-list', function (event, mass) {
        $scope.reset();
    });
}