(function () {
    'use strict';
    angular.module('app').directive('ratingView', ['$parse', function () {
        var returnData = {
            restrict: 'A',
            scope: {
                value:'=data',
                disable:'=disable'
            },
            templateUrl: 'app/shared/directives/rating-input/rating.template.html',
            link: function(scope){
                scope.stars = [true, true, true, false, false];
                scope.$watch("value",function(newValue,oldValue) {
                    for (var i=0; i<5; i++) {
                        if (scope.value >= (i+1)) {
                            scope.stars[i] = true;
                        } else {
                            scope.stars[i] = false;
                        }
                    }
                });
                scope.changeValue = function(newValue) {
                    scope.value = newValue;
                }
            }
        }

        return returnData;
    }]);
})();