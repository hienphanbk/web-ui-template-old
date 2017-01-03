(function () {
    'use strict';
    angular.module('app').directive('appView', ['UtilsService', 'ApplicationConfig', function (UtilsService, ApplicationConfig) {
        var returnData = {
            restrict: 'A',
            scope: {
                app:'=data',
                'onDownloadClick':'&onDownloadClick',
                'onUsernameClick':'&onUsernameClick',
                'onImageClick':'&onImageClick'
            },
            templateUrl: 'app/shared/directives/app/appview.template.html',
            link: function(scope){
                //scope.manifestUrl="itms-services://?action=download-manifest&amp;url="+ApplicationConfig.serviceUrls.utils.getManifest+"?name="+scope.app.versionInfo.installFileName;
                scope.onUsername = function(){
                    scope.onUsernameClick();
                };

                scope.isDownloading = false;


                scope.onDownload = function(){
                    console.log("Trying to download file from server.");
                    scope.isDownloading = true;
                    var fileName = scope.app.versionInfo.installFileName;
                    console.log("fileName = "+fileName);
                    if (fileName == undefined || fileName == "" || fileName == null) {
                        console.log("File name không hợp lệ.");
                    } else {
                        var onSuccess = function(response) {
                            console.log("onSuccess download file from server.");
                            scope.isDownloading = false;
                        };

                        var onError = function(response) {
                            console.log("onError when trying to download file from server.");
                            scope.isDownloading = false;
                        };
                        UtilsService.downloadInstallFile(fileName, onSuccess, onError);
                    }
                };
                scope.onImage = function(){
                    console.log("on image click");
                    scope.onImageClick();
                };

                var calAvgRating = function() {
                    scope.avgRating = 0;
                    if (scope.app.totalReview > 0) {
                        scope.avgRating = Math.round((scope.app.totalRating/scope.app.totalReview) * 100)/100;
                        console.log(scope.avgRating);
                    }
                };
                calAvgRating();

                var loadImage = function(){
                    scope.iconUri = "assets/img/loading.gif";
                    var fileName = scope.app.iconApp;
                    if (fileName == undefined || fileName == "") {
                        scope.iconUri = "assets/img/default_app_icon.png";
                    } else {
                        var onSuccess = function(response) {
                            console.log("onSuccess load icon image.");
                            scope.iconUri = response;
                        };
                        var onError = function(response) {
                            console.log("onError load image. default icon will be used.");
                            scope.iconUri = "assets/img/default_app_icon.png";
                        };
                        UtilsService.downloadImage(fileName, onSuccess, onError);
                    }
                };
                loadImage();

                //scope.updateAppView = function () {
                //    vm.isAppAndroid =  ApplicationConfig.isAppAndroidScope;
                //    vm.isAppIos = ApplicationConfig.isAppIosScope;
                //};
                //ApplicationConfig.registerObserverCallback(scope.updateAppView);
                //scope.updateAppView();

                scope.$watch('app', function(newValue,oldValue) {
                    if (scope.app.osType=="I-OS") {
                        scope.isShowIosDownload = true;
                        scope.manifestUrl="itms-services://?action=download-manifest&url="+encodeURIComponent(ApplicationConfig.serviceUrls.utils.getManifest+"?name="+scope.app.versionInfo.installFileName);
                    } else {
                        scope.isShowIosDownload = false;
                    }
                });
            }
        };

        return returnData;
    }]);
})();