/**
 * Student List Controller
 */

angular.module('RDash')
    .controller('ReportCtrl', ['$scope', ReportCtrl]);

function ReportCtrl($scope) {
    console.log("TESTING!!!Phong Nguyen Class");
    $scope.reportList = {
        data: [
            {
                cls: "10A1",
                totalStudent: "39",
                totalPass: "39",
                passPercent: "100%"
            },
            {
                cls: "10A2",
                totalStudent: "41",
                totalPass: "40",
                passPercent: "99%"
            },
            {
                cls: "11A1",
                totalStudent: "43",
                totalPass: "43",
                passPercent: "100%"
            },
            {
                cls: "11A2",
                totalStudent: "39",
                totalPass: "35",
                passPercent: "89%"
            },
            {
                cls: "12A3",
                totalStudent: "42",
                totalPass: "42",
                passPercent: "100%"
            },
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'cls', displayName: 'Lớp' },
            { field: 'totalStudent', displayName: 'Sĩ Số' },
            { field: 'totalPass', displayName: 'SL Đạt' },
            { field: 'passPercent', displayName: 'Tỉ Lệ' }
        ]
    };
}