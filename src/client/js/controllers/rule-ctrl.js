/**
 * Rule Controller
 */

angular.module('RDash')
    .controller('RuleCtrl', ['$scope','$http', RuleCtrl]);

function RuleCtrl($scope,$http) {
    var minRowGrade = 5, minRowCourse = 9, rowHeight = 30;

    function init(){
            $scope.rule = {
            grade10: [
                {className: "10A1", maxQty: 40},
                {className: "10A2", maxQty: 40},
                {className: "10A3", maxQty: 40},
                {className: "10A4", maxQty: 40}],
            grade11: [
                {className: "11A1", maxQty: 40},
                {className: "11A2", maxQty: 40},
                {className: "11A3", maxQty: 40}],
            grade12: [
                {className: "12A1", maxQty: 40},
                {className: "12A2", maxQty: 40}],
            course:[
                {courseName: "Toán"},
                {courseName: "Lý"},
                {courseName: "Hóa"},
                {courseName: "Sinh"},
                {courseName: "Sử"},
                {courseName: "Địa"},
                {courseName: "Văn"},
                {courseName: "Đạo đức"},
                {courseName: "Thể dục"}],
            minAge: 15,
            maxAge: 20,
            minScore: 5,
            schoolYearID: ""
        }

        $scope.slider = {
            minValue: $scope.rule.minAge,
            maxValue: $scope.rule.maxAge,
            options: {
                floor: 4,
                ceil: 50,
                translate: function(value, sliderId, label) {
                    switch (label) {
                        case 'model':
                        return '<b>Tuổi MIN:</b>'+ value;
                        case 'high':
                        return '<b>Tuổi MAX:</b>' + value;
                        default:
                        return  value
                    }
                }
            }
        };

        $scope.selectedRowGrade10 = null;
        $scope.selectedRowGrade11 = null;
        $scope.selectedRowGrade12 = null;
    }
    init();

    function getFutureSchoolYear(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year/future',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.futureSchoolYear = response.data.datas
            }else{
            }
        });
   }
    getFutureSchoolYear();

    $scope.grade10 = {
        data: $scope.rule.grade10,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', type: 'text', minWidth: 100 },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', type: 'number', minWidth: 70 }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade10 = row.entity;
                } else {
                    $scope.selectedRowGrade10 = null;
                }
            });
        }
    };

    $scope.addRowGrade10 = function(data){
        var dataLength = $scope.grade10.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade10.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.rule.grade10.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade10 = function () {
        if ($scope.selectedRowGrade10) {
            for (var i in $scope.grade10.data) {
                if ($scope.grade10.data[i] === $scope.selectedRowGrade10) {
                    $scope.grade10.data.splice(i, 1);
                    $scope.selectedRowGrade10 = false;
                    break;
                }
            }
        }
    };

    $scope.grade11 = {
        data: $scope.rule.grade11,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', minWidth: 100  },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', minWidth: 70  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade11 = row.entity;
                } else {
                    $scope.selectedRowGrade11 = null;
                }
            });
        }
    };

    $scope.addRowGrade11 = function(data){
        var dataLength = $scope.grade11.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade11.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.rule.grade11.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade11 = function () {
        if ($scope.selectedRowGrade11) {
            for (var i in $scope.grade11.data) {
                if ($scope.grade11.data[i] === $scope.selectedRowGrade11) {
                    $scope.grade11.data.splice(i, 1);
                    $scope.selectedRowGrade11 = false;
                    break;
                }
            }
        }
    };

    $scope.grade12 = {
        data: $scope.rule.grade12,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', minWidth: 100  },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', minWidth: 70  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade12 = row.entity;
                } else {
                    $scope.selectedRowGrade12 = null;
                }
            });
        }
    };

    $scope.addRowGrade12 = function(data){
        var dataLength = $scope.grade12.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade12.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.rule.grade12.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade12 = function () {
        if ($scope.selectedRowGrade12) {
            for (var i in $scope.grade12.data) {
                if ($scope.grade12.data[i] === $scope.selectedRowGrade12) {
                    $scope.grade12.data.splice(i, 1);
                    $scope.selectedRowGrade12 = false;
                    break;
                }
            }
        }
    };

    $scope.course = {
        data: $scope.rule.course,
        minRowsToShow: minRowCourse,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'courseName', displayName: 'Môn Học', minWidth: 130  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowCourse = row.entity;
                } else {
                    $scope.selectedRowCourse = null;
                }
            });
        }
    };

    $scope.addRowCourse = function(data){
        var dataLength = $scope.course.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.course.data[dataLength-1];
            if (lastRecord.courseName.trim() === "" ) {return;}
        }
        if (!data) { data = {};}
        $scope.rule.course.unshift(
            {courseName: data.courseName || ""}
        )
    }
    
    $scope.deleteRowCourse = function () {
        if ($scope.selectedRowCourse) {
            for (var i in $scope.course.data) {
                if ($scope.course.data[i] === $scope.selectedRowCourse) {
                    $scope.course.data.splice(i, 1);
                    $scope.selectedRowCourse = false;
                    break;
                }
            }
        }
    };
    
    $scope.save = function(){
        console.log(77778888,$scope.rule);
        //khoi 10: string
        
    }

}