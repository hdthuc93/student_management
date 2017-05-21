/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */

angular
    .module('RDash')
    .directive('rdLoading', ['$http' ,rdLoading]);

function rdLoading($http) {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading">'+
        '<div class="modal-backdrop fade in" uib-modal-animation-class="fade" modal-in-class="in" uib-modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 10000; opacity: 0.3;"></div>'+
        '<i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div></div>',
        link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (bool)
                {
                    if(bool){
                        //console.log("Show loading")
                        elm.show();
                    }else{
                        //console.log("HIDE loading")
                        elm.hide();
                    }
                });
            }
    };
    return directive;
};
