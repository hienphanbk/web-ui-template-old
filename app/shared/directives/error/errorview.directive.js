(function () {
    'use strict';
    angular.module('app').directive('errorView', ['$parse', function () {
        var returnData = {
            restrict: 'A',
            scope: {
                error:'=data',
                'onStatusChange':'&onStatusChange'
            },
            templateUrl: 'app/shared/directives/error/errorview.template.html',
            link: function(scope){
                scope.onStatusChangeClick = function(){
                    scope.onStatusChange();
                };
            }
        }

        return returnData;
    }]);
})();