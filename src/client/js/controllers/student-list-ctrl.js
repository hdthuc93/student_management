/**
 * Student List Controller
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
            default :
                return "Nam";
        }
    };
});
module.filter('formatDDMMYYYY', function () {
    return function (input) {
        console.log(77777,input)
        if (!input) {
            return "";
        }
        var d = new Date(input);
        var dd = d.getDate();
        var mm = d.getMonth()+1; //January is 0!
        var yyyy = d.getFullYear();

        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        return dd+'/'+mm+'/'+yyyy;
    };
});

module.controller('StudentListCtrl', ['$scope','helper','$http', StudentListCtrl]);

function StudentListCtrl($scope, helper, $http) {
    console.log("TESTING!!!Phong Nguyen");
    $scope.showHandleArea = false; //Hien vung xu ly Them/Sua
    $scope.studentData = {};
    $scope.action = "";
    $scope.studentListStatus = "Không có dữ liệu"
    function initOptions(){
        $scope.options = {
            studentCode: "",
            gender: "",
            name:"",
            email:"",
            address:"",
            birthdayFrom:"",
            birthdayTo:""
        }
    }
    initOptions();

    $scope.reset = function(){
        initOptions();
        $scope.getStudentList();
    }

    $scope.studentList = {
        enableSorting: false,
        enableRowSelection: true,
        multiSelect:false,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'studentCode', displayName: 'Mã học sinh' },
            // { field: 'firstname', displayName: 'Họ' },
            { field: 'name', displayName: 'Họ Tên' },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderText'},
            { field: 'birthday', displayName: 'Ngày Sinh'},
            // { field: 'class', displayName: 'Lớp' },
            { field: 'email', displayName: 'Email' },
            { field: 'address', displayName: 'Địa chỉ' }
        ],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                $scope.showHandleArea = false;
                $scope.action = "";
                if(row.isSelected){
                    $scope.selectedRow = row.entity;
                }else{
                    $scope.selectedRow = null;
                }
            });
        }
    };

    
    $scope.getStudentList = function(){
        $scope.studentListStatus = "Đang tải...";
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/student',
            params:$scope.options
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.studentList.data = response.data.datas;
                $scope.studentList.data.forEach(function (e, i) {
                    $scope.studentList.data[i].no = i + 1;
                });
            }else{
                $scope.studentList.data = [];
                $scope.studentListStatus = "Không có dữ liệu";
            }
            
        }, function errorCallback(response) {
            helper.popup.info({
                title:"Lỗi",
                message:"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close:function(){
                    $scope.getStudentList();
                    return;
                }
            }) 
        });
    }
    $scope.getStudentList();

    $scope.viewStudent = function(){
        console.log("view student");
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "view"
        };
        helper.scrollTo("handle-student-area");
    }

    $scope.addStudent = function(){
        console.log("create student");
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: {},
            action: "create"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.editStudent = function(){
        console.log("edit student",$scope.selectedRow);
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "edit"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.removeStudent = function(){
        console.log("remove student",$scope.selectedRow);
        $scope.showHandleArea = false;
                $scope.action = "";
        helper.popup.confirm({
            title:"Xoá học sinh",
            message:"Bạn có thưc sự muốn xoá học sinh này?",
            ok: function(){
                $http.delete('/api/student', {params: {studentID: $scope.selectedRow.studentID}}).then(function successCallBack(res){
                    console.log(8888,res)
                    helper.popup.info({
                        title:"Thông báo",
                        message:res.data.success?"Xoá học sinh thành công.":"Xoá thất bại. Hãy thử lại",
                        close:function(){
                            $scope.reset();                                               
                            return;
                        }
                    });
                }, function errorCallback(){
                    //console.log("000000000000")
                });
            },
            cancel:function(){
                //Do nothing
                return;
            }
        })        
    }

    $scope.$on('reset-student-list', function(event, mass) { 
        console.log(123123123)
        $scope.reset();
    });
}