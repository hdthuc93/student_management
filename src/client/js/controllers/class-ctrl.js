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
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'studentID', displayName: 'Mã học sinh', minWidth: 110, maxWidth: 140  },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120},
            { field: 'email', displayName: 'Email', minWidth: 220 },
            { field: 'address', displayName: 'Địa chỉ', minWidth: 350}
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