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

module.filter('schoolYearStatusToText', function () {
    return function (input) {
        switch (input) {
            case "1":
                return "Năm học hiện tại";
                break;
            case "2":
                return "Năm học đã qua";
                break;
            default:
                return "Năm học chưa mở";
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
