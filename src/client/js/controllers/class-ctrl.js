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
        enableSorting: true,
        enableRowSelection: true,
        multiSelect:true,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'studentCode', displayName: 'Mã học sinh', minWidth: 110, maxWidth: 140  },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderToText', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120},
            { field: 'email', displayName: 'Email', minWidth: 220 },
            { field: 'address', displayName: 'Địa chỉ', minWidth: 350}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedStudents = rowsSelected.length?rowsSelected:null;
                console.log("====",$scope.selectedStudents);
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (gridData) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedStudents = rowsSelected.length?rowsSelected:null;
                console.log("====",$scope.selectedStudents);
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
                $scope.selectedStudents = null;
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
            params:{classID: angular.fromJson($scope.class).classID}
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.studentList.data = response.data.datas;
                $scope.studentList.data.forEach(function (e, i) {
                    $scope.studentList.data[i].no = i + 1;
                });
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }

    $scope.openStudentList = function(){
        helper.loadStudentNotInClass({
            close: function (callBackStudent) {
                if(callBackStudent&&callBackStudent.length){
                    console.log("return student ID", callBackStudent);
                    var callBackData = callBackStudent;
                    if(angular.fromJson($scope.class).maxNum < ($scope.studentList.data.length + callBackStudent.length - 40)){
                        helper.popup.info({title: "Lỗi",
                        message: "Số học sinh vừa thêm vào vượt quá quy định.",
                        close: function () { $scope.openStudentList(); return;}})
                    }
                    var studentIDList = [];
                    for(var i in callBackData){
                        studentIDList.push(callBackData[i].studentID);
                    }
                    if(studentIDList.length){
                        console.log(angular.fromJson($scope.class),88888888)
                        addStudentToClass(studentIDList,angular.fromJson($scope.class).classID);
                    }
                }else{
                }
            }
        })
    }

    function addStudentToClass(studentIDList,classID){
        console.log("action add student to class");
        $http.post('/api/student_class', {studentList : studentIDList, classID: classID}, {}).then(function successCallBack(res) {
                helper.popup.info({
                title: "Thông báo",
                message:res.data.success? "Thêm học sinh thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    return;
                }
            });
            $scope.getStudentInClass();
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.removeStudentFromClass = function(){
        var studentIDList = [];
        console.log("select student to del",$scope.selectedStudents);
        for(var i in $scope.selectedStudents){
            console.log(77777,$scope.selectedStudents[i].studentID)
            studentIDList.push($scope.selectedStudents[i].studentID);
        }
        var param = {
            studentList: studentIDList,
            classID: angular.fromJson($scope.class).classID
        }

        console.log("param    - - - - - -",param);
        helper.popup.confirm({
            title: "Xoá học sinh khỏi lớp",
            message: "Bạn có thưc sự muốn xoá (những) học sinh này?",
            ok: function () {
                $http.post('/api/student_class/del', param).then(function successCallBack(res) {
                    helper.popup.info({
                        title: "Thông báo",
                        message: res.data.success ? "Xoá học sinh thành công." : "Xoá thất bại. Vui lòng thử lại",
                        close: function () {
                            return;
                        }
                    });
                    $scope.getStudentInClass();
                }, function errorCallback() {
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
                });
            },
            cancel: function () {
                return;
            }
        })
    }
}