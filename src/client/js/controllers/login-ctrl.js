/**
 * login Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('loginCtrl', ['$scope', '$cookieStore','$http','$rootScope','$timeout','$location','helper', authenCtrl]);

function authenCtrl($scope, $cookieStore, $http, $rootScope,$timeout,$location,helper) {
    // Login
    var loggedIn = false;
    function init(){
        $scope.username = "";
        $scope.password = "";
    }
    init();

    $scope.logout = function(){
        console.log(9999999)
        $cookieStore.put('userdata', {});
        $location.path('/login');
    }

    $scope.login = function(){
        if ($scope.loginForm.$invalid) {
            return;
        }
        var param = {
            username: $scope.username||null,
            password: $scope.password||null
        }
        $http.post('/api/user/login', param).then(function successCallBack(res){
            console.log("ket qua dang nhap",res.data);
            if(res.data.success){
                var data = res.data;
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);
                // Setting a cookie
                $cookieStore.put('userdata', {loggedIn: true, name: data.name, token: data.token}, {'expires': expireDate});
                $location.path('/');
            }else{                
                helper.popup.info({title: "Đăng nhập thất bại",message: "Tên đăng nhập hoặc mật khẩu không đúng, vui lòng thử lại.",close: function () { return;}})
                init();
            }
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { location.reload(); return;}})
        });
    }
}