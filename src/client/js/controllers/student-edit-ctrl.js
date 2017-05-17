/**
 * Student Controller
 * Implement: Phong Nguyen
 */
angular.module('RDash')
    .controller('StudentEditCtrl', ['$scope', 'helper', '$http', '$rootScope', StudentEditCtrl]);

function StudentEditCtrl($scope, helper, $http, $rootScope) {
    if (angular.isFunction($scope.$watchCollection)) {
        $scope.$parent.$watchCollection(function () {
            return $scope.studentData;
        }, init);
    }

    function init(newValue, oldValue) {
        console.log(newValue, oldValue, "======");
        if (newValue !== oldValue && Object.keys(newValue.data).length > 0 && newValue.action == "edit") {
            //UPDATE
            console.log("UPDATE");
            $scope.title = "Cập nhật học sinh";
            $scope.data = {};
            angular.extend($scope.data, $scope.studentData.data);
        }
        if (newValue !== oldValue && Object.keys(newValue.data).length > 0 && newValue.action == "view") {
            //VIEW
            console.log("VIEW");
            $scope.title = "Thông tin học sinh";
            $scope.data = {};
            angular.extend($scope.data, $scope.studentData.data);
        }
        if (newValue.action == "create") {
            //CREATE NEW
            console.log("CREATE");
            $scope.title = "Tiếp nhận học sinh";
            $scope.data = {};
        }
    }

    $scope.reset = function () {
        if ($scope.studentData.action == "create") {
            $scope.data = {};
        } else {
            angular.extend($scope.data, $scope.studentData.data);
        }
    }

    $scope.save = function () {
        if ($scope.studentData.action == "create") {
            var dataSave = {
                address: $scope.data.address,
                birthday: $scope.data.birthday,
                email: $scope.data.email,
                gender: $scope.data.gender,
                name: $scope.data.name,
                schoolYearID: $scope.data.yearAdmission || $rootScope.masterSelectedschoolYear.schoolYearID
            }
            console.log("save create", dataSave);
            $http.post('/api/student', dataSave, {}).then(function successCallBack(res) {
                helper.popup.info({
                    title: "Thông báo",
                    message:res.data.success? "Tạo mới học sinh thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                    close: function () {
                        $scope.data = {};
                        $rootScope.$broadcast('reset-student-list');
                        return;
                    }
                });
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
        if ($scope.studentData.action == "edit") {
            var dataSave = {
                address: $scope.data.address,
                birthday: $scope.data.birthday,
                email: $scope.data.email,
                gender: $scope.data.gender,
                name: $scope.data.name,
                schoolYearID: $scope.data.schoolYearID || 1,
                studentCode: $scope.data.studentCode || "",
                studentID: $scope.data.studentID || ""
            }
            console.log("save edit", dataSave);
            $http.put('/api/student', dataSave, {}).then(function successCallBack(res) {
                helper.popup.info({
                    title: "Thông báo",
                    message: res.data.success?"Cập nhật thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                    close: function () {
                        $scope.data = {};
                        $rootScope.$broadcast('reset-student-list');
                        return;
                    }
                });
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
    }
}