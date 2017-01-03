(function () {
    'use strict';
    angular.module('app').directive('iconButton', ['$parse', function () {
        var returnData = {
            restrict: 'A',
            scope: {
                imgSrc:'=img',
                tooltips:'=tooltips',
                onClick:'&onClick'
            },
            templateUrl: 'app/shared/directives/iconbutton/iconbtn.template.html',
            link: function(scope){
                console.log(scope.imgSrc);
                scope.onClickIcon = function() {
                    console.log("On click icon.");
                    scope.onClick();
                }
                //scope.$watch("value",function(newValue,oldValue) {
                //    for (var i=0; i<5; i++) {
                //        if (scope.value >= (i+1)) {
                //            scope.stars[i] = true;
                //        } else {
                //            scope.stars[i] = false;
                //        }
                //    }
                //});
            }
        }

        return returnData;
    }]);
})();