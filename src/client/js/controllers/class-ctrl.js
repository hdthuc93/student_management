/**
 * Class Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('ClassCtrl', ['$scope','$uibModal', ClassCtrl]);

function ClassCtrl($scope,$uibModal) {
    $scope.studentList = {
        enableSorting: false,
        enableRowSelection: true,
        multiSelect:false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 50 },
            { field: 'studentID', displayName: 'Mã học sinh', width: 100 },
            { field: 'name', displayName: 'Họ Tên', width: 230 },
            { field: 'gender', displayName: 'Giới', width: 50 },
            { field: 'birthday', displayName: 'Ngày Sinh' , width: 100},
            { field: 'email', displayName: 'Email', width: 200 },
            { field: 'address', displayName: 'Địa chỉ', width: 350 }
        ]
    };

    $scope.addStudentToClass = function(){
        var configs = {
            templateUrl: 'templates/popup_student_list.html',
            animation: true,
            controller: 'ClassCtrl',
            appendTo: angular.element("#modal_area"),
            size: 'lg'
        };
        modalInstance = $uibModal.open(configs)
    }
}