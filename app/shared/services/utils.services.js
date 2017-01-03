(function () {
    'use strict';
    angular.module('app')
        .service('UtilsService', UtilsService);

    UtilsService.$inject = ['HttpService', 'ApplicationConfig', 'Cookies', '$http'];

    function UtilsService(HttpService, ApplicationConfig, Cookies, $http) {
        var vm = this;

        /**
         * Lấy về image link
         * @param fileName
         * @param onSuccess
         * @param onError
         */
        vm.downloadImage = function(fileName, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.utils.downloadImage;
            var input = {fileName:fileName};
            var onSuccessInteral = function(response) {
                onSuccess(response);
            }

            var onErrorInternal = function(response) {
                onError(response);
            }
            HttpService.callServiceWithSessionHeader(url, input, onSuccessInteral, onErrorInternal);
        }

        vm.downloadInstallFile = function(fileName, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.utils.downloadInstallFile;
            var input = {fileName:fileName};
            var onSuccessInternal = function(response) {
                console.log("onSuccess.");
                if (fileName.indexOf(".apk")>0){
                    var file = new Blob([response], { type: 'application/vnd.android.package-archive' });
                    // for ipa: try application/octet-stream .ipa

                    saveAs(file, fileName);
                    onSuccess();
                } else if (fileName.indexOf(".ipa")>0) {
                    var file = new Blob([response], { type: 'application/octet-stream'});
                    // for ipa: try application/octet-stream .ipa

                    saveAs(file, fileName);
                    onSuccess();
                }
            }
            var onErrorInternal = function(response) {
                console.log("onError");
                onError(response);
            }
            HttpService.callDownloadServiceWithSessionHeader(url, input, onSuccessInternal, onErrorInternal);
        }

        vm.uploadInstallFile = function (fileName, onSuccess, onError) {
            var file = fileName;
            console.log('file is ' );
            console.dir(file);
            var url = ApplicationConfig.serviceUrls.utils.uploadInstallFile;
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
            }).success(onSuccess).error(onError);
        }

        vm.uploadImage = function (fileName, onSuccess, onError) {
            var file = fileName;
            console.log('file is ' );
            //console.dir(file);
            // call upload file service here
            var url = ApplicationConfig.serviceUrls.utils.uploadImageFile;
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
            }).success(onSuccess).error(onError);
        }
    }
})();
