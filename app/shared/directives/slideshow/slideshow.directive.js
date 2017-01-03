(function () {
    'use strict';
    angular.module('app').directive('slideShow', ['UtilsService', function (UtilsService) {
        var returnData = {
            restrict: 'A',
            scope: {
                images:'=images'
            },
            templateUrl: 'app/shared/directives/slideshow/slideshow.template.html',
            link: function(scope){
                console.log("Initial slide show.");
                scope.currentIndex = 0; // Initially the index is at the first image

                scope.next = function() {
                    scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                };

                scope.prev = function() {
                    scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
                };


                scope.showImageUrls = [];
                var loadShowImageUrl = function() {
                    scope.showImageUrls = [];
                    if (scope.images != null && scope.images != undefined) {
                        console.log("currentIndex = "+scope.currentIndex);

                        var getShowImage = function(showIndex) {
                            if ((scope.currentIndex + showIndex) < scope.images.length) {
                                return scope.images[scope.currentIndex + showIndex];
                            } else {
                                return scope.images[(scope.currentIndex + showIndex)-scope.images.length];
                            }
                        };

                        if (scope.images.length <3) {
                            for (var i=0; i<scope.images.length; i++) {
                                scope.showImageUrls[i] = getShowImage(i);

                                //var url = scope.images[scope.currentIndex+(scope.currentIndex+i)%(scope.images.length)];
                                //scope.showImageUrls.push(url);
                            }
                        } else {
                            for (var i=2; i>=0; i--) {
                                scope.showImageUrls[i] = getShowImage(i);
                                //
                                //var url = scope.images[scope.currentIndex+(scope.currentIndex+i)%3];
                                //scope.showImageUrls.push(url);
                            }
                        }

                        //if (scope.images.length <3) {
                        //    for (var i=(scope.images.length-1); i>=0; i--) {
                        //        scope.showImageUrls[i] = getShowImage(i);
                        //    }
                        //} else {
                        //    for (var i=2; i>=0; i--) {
                        //        scope.showImageUrls[i] = getShowImage(i);
                        //    }
                        //}

                        console.log("showImages = "+scope.showImageUrls);
                    }
                }

                scope.$watchCollection("images",function(newValue,oldValue) {
                    console.log("Refresh image data.");
                    scope.currentIndex = 0;
                    loadShowImageUrl();
                });

                scope.$watch("currentIndex",function(newValue,oldValue) {
                    console.log("Change image index: "+scope.currentIndex);
                    loadShowImageUrl();
                });

                //setInterval(function(){
                //    console.log("scope.images = "+scope.images);
                //    //loadShowImageUrl();
                //}, 500);
            }
        };

        return returnData;
    }]);
})();