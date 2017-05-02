/**
 * Student List Controller
 */

angular.module('RDash')
    .controller('RuleCtrl', ['$scope', RuleCtrl]);

function RuleCtrl($scope) {
    console.log("TESTING!!!Phong Nguyen Class");
    $scope.ruleNameAndMaxStudentClass10 = {
        data: [
            {
                id:"",
                clsName: "10A1",
                maxStudent: "39"
            },
            {
                id:"",
                clsName: "10A2",
                maxStudent: "35"
            },
            {
                id:"",
                clsName: "10A3",
                maxStudent: "45"
            }
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'clsName', displayName: 'Tên Lớp' },
            { field: 'maxStudent', displayName: 'Sĩ Số Tối Đa' }
        ]
    };

    $scope.ruleNameAndMaxStudentClass11 = {
        data: [
            {
                id:"",
                clsName: "11A1",
                maxStudent: "30"
            },
            {
                id:"",
                clsName: "11A2",
                maxStudent: "29"
            },
            {
                id:"",
                clsName: "11A3",
                maxStudent: "31"
            },
            {
                id:"",
                clsName: "11A4",
                maxStudent: "31"
            }
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'clsName', displayName: 'Tên Lớp' },
            { field: 'maxStudent', displayName: 'Sĩ Số Tối Đa' }
        ]
    };

    $scope.ruleNameAndMaxStudentClass12 = {
        data: [
            {
                id:"",
                clsName: "12A1",
                maxStudent: "25"
            },
            {
                id:"",
                clsName: "12A2",
                maxStudent: "26"
            },
            {
                id:"",
                clsName: "12A3",
                maxStudent: "27"
            },
            {
                id:"",
                clsName: "12A4",
                maxStudent: "26"
            },
            {
                id:"",
                clsName: "12A5",
                maxStudent: "25"
            }
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'clsName', displayName: 'Tên Lớp' },
            { field: 'maxStudent', displayName: 'Sĩ Số Tối Đa' }
        ]
    };
    $scope.ruleCourses = {
        data: [
            {
                id:"",
                courseName: "Toán"    
            }, {
                id:"",
                courseName: "Lý"    
            }, {
                id:"",
                courseName: "Hoá"    
            }, {
                id:"",
                courseName: "Sinh"    
            }, {
                id:"",
                courseName: "Sử"    
            }, {
                id:"",
                courseName: "Địa"    
            },{
                id:"",
                courseName: "Văn"    
            },{
                id:"",
                courseName: "Đạo đức"    
            },{
                id:"",
                courseName: "Thể dục"    
            }
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'courseName', displayName: 'Môn Học' }
        ]
    };
}