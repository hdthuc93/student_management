var module = angular.module('RDash', [
'ui.bootstrap', 
'ui.router', 
'ngCookies', 
'ui.grid', 
'ui.grid.selection', 
'ui.grid.resizeColumns',
'mod.helper',
'rzModule', 
'ui.grid.edit',
'ui.grid.rowEdit', 
'ui.grid.cellNav']);

module.factory('Auth',['$cookieStore','$rootScope',function($cookieStore,$rootScope){
    var user;
    return{
        getUser : function(){
            return $cookieStore.get("userdata");
        },
        isLoggedIn : function(){
            if($cookieStore.get('userdata')){
                if($cookieStore.get('userdata')){
                    $rootScope.masterToken = $cookieStore.get('userdata').token;
                    return $cookieStore.get('userdata').loggedIn;
                }
                return false;
            }else{
                return false;
            }
        }
    }
}] )
module.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
     $rootScope.$on('$locationChangeStart', function (event) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
        else {
            $rootScope.masterUserName = Auth.getUser().name;
            //$location.path('/');
        }
    });
}]);

module.filter('schoolYearStatusToText', function () {
    return function (input) {
        switch (input) {
            case "1":
                return "ĐANG DIỄN RA";
                break;
            case "2":
                return "ĐÃ KẾT THÚC";
                break;
            default:
                return "CHƯA MỞ";
        }
    };
});

module.filter('GenderToText', function () {
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

module.filter('toPercent', function () {
    return function (input) {           
        if(typeof input == 'number' && input>=0){
            return Math.round(input*100).toFixed(0) +"%";
        }
    };
});
