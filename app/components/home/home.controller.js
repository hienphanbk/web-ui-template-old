(function () {
    'use strict';
    // Khai báo controller
    angular.module('app').controller('HomeController', HomeController);

    // Thêm các dependencies ở đây
    HomeController.$inject = ['$http', 'ApplicationConfig', 'Cookies', 'HttpService'];

    // Hàm controller
    function HomeController($http, ApplicationConfig, Cookies, HttpService) {
        var vm = this;

        vm.fileData = undefined;
        vm.imageFileData = undefined;


        vm.appInfo = {
            appName: undefined,
            os: undefined,
            versionName: undefined,
            versionCode: undefined,
            minSdk: undefined,
            targetSdk: undefined,
            uploadedFilePath: undefined
        };


        vm.imageViewName = "";
        vm.image;
        vm.downloadImg = function() {
            console.log("on download image button click");

            var url = "http://10.61.138.72:8080/mam-command-services/api/utils/loadImageFile";
            var data = {
                "fileName":vm.imageViewName
            };

            var onSuccess = function(response) {
                console.log("onSuccess.");
                vm.image =response;
            }

            var onError = function(response) {
                console.log("onSuccess.  response="+response);
            }

            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        }


        // RESPONSE DATA IF SUCCESS
        //String appName;
        //String os;
        //String versionName;
        //long versionCode;
        //String minSdk;
        //String maxSdk;
        //String targetSdk;


        vm.uploadFile = function(){
            var file = vm.fileData;

            console.log('file is ' );
            console.dir(file);

            // call upload file service here

            var url = ApplicationConfig.serviceUrls.utils.uploadInstallFile; //"http://10.61.138.72:8080/mam-command-services/api/utils/uploadFile";
            var fd = new FormData();
            fd.append('file', file);

            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Accept':"*",
                    'session-key':sessionKey
                }
            }).success(function(response){
                    console.log("on success. data="+response);
                    vm.appInfo = response;
                })
                .error(function(response){
                    console.log("on success. data="+response);
                });
        }


        vm.imageURI = "";
        vm.uploadImageFile = function(){
            var file = vm.imageFileData;

            console.log('file is ' );
            console.dir(file);

            // call upload file service here

            var url = ApplicationConfig.serviceUrls.utils.uploadImageFile; //"http://10.61.138.72:8080/mam-command-services/api/utils/uploadFile";
            var fd = new FormData();
            fd.append('file', file);

            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'Accept':"*",
                    'session-key':sessionKey
                }
            }).success(function(response){
                console.log("on success. data="+response);
                vm.imageURI = response;
                vm.image = response;
            })
                .error(function(response){
                    console.log("on success. data="+response);
                });
        }
    }

    // upload file directive
    //angular.module('app').directive('apsUploadFile', apsUploadFile);
    //
    //function apsUploadFile() {
    //    var directive = {
    //        restrict: 'E',
    //        templateUrl: 'upload.file.template.html',
    //        link: apsUploadFileLink
    //    };
    //    return directive;
    //}
    //
    //function apsUploadFileLink(scope, element, attrs) {
    //    var input = $(element[0].querySelector('#fileInput'));
    //    var button = $(element[0].querySelector('#uploadButton'));
    //    var textInput = $(element[0].querySelector('#textInput'));
    //
    //    if (input.length && button.length && textInput.length) {
    //        button.click(function (e) {
    //            input.click();
    //        });
    //        textInput.click(function (e) {
    //            input.click();
    //        });
    //    }
    //
    //    input.on('change', function (e) {
    //        var files = e.target.files;
    //        if (files[0]) {
    //            scope.fileName = files[0].name;
    //        } else {
    //            scope.fileName = null;
    //        }
    //        scope.$apply();
    //    });
    //}



})();