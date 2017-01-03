(function () {
    'use strict';
    angular.module('app')
        .service('HttpService', HttpService);

    HttpService.$inject = ['$http', 'ApplicationConfig', 'Cookies'];

    function HttpService($http, ApplicationConfig, Cookies) {
        var vm = this;

        function isSessionInvalid(rejectResponse) {
            if (rejectResponse && (rejectResponse.status == "401")) {
                console.log("Session is invalid, please re-login");
                return false;
            } else {
                return true;
            }
        }

        vm.callService = function (url, data, onSuccess, onError) {
            console.log("call "+url);
            $http(
                {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*'
                    },
                    data: data
                }
            ).then(function (response) {
                    console.log("on success");
                    onSuccess(response.data);
                })
                .catch(function (rejectResponse) {
                    if (isSessionInvalid(rejectResponse)) {
                        ApplicationConfig.goToLoginPage();
                    } else {
                        console.log("on error");
                        onError(rejectResponse.data);
                    }
                });
        };

        vm.callServiceWithSessionHeader = function (url, data, onSuccess, onError) {
            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);
            console.log("call "+url+" with session key = "+sessionKey);

            $http(
                {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*',
                        'session-key': sessionKey
                    },
                    data: data
                }
            ).then(function (response) {
                    console.log("on success");
                    onSuccess(response.data);
                })
                .catch(function (rejectResponse) {
                    console.log("on error");
                    if (isSessionInvalid(rejectResponse)) {
                        ApplicationConfig.goToLoginPage();
                    } else {
                        onError(rejectResponse.data);
                    }
                });
        };

        vm.callDownloadServiceWithSessionHeader = function(url, data, onSuccess, onError) {
            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);
            console.log("call "+url+" with session key = "+sessionKey);

            $http(
                {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*',
                        'session-key': sessionKey
                    },
                    data: data,
                    responseType : 'arraybuffer'
                }
            ).then(function (response) {
                    console.log("on success");
                    onSuccess(response.data);
                })
                .catch(function (rejectResponse) {
                    console.log("on error");
                    //onError(rejectResponse.data);
                    if (isSessionInvalid(rejectResponse)) {
                        ApplicationConfig.goToLoginPage();
                    } else {
                        onError(rejectResponse.data);
                    }
                });
        }

        vm.callGetServiceWithSessionHeader = function (url, data, onSuccess, onError) {
            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);
            console.log("call "+url+" with session key = "+sessionKey);

            $http(
                {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*',
                        'session-key': sessionKey
                    },
                    data: data
                }
            ).then(function (response) {
                    console.log("on success");
                    onSuccess(response.data);
                })
                .catch(function (rejectResponse) {
                    console.log("on error");
                    //onError(rejectResponse.data);
                    if (isSessionInvalid(rejectResponse)) {
                        ApplicationConfig.goToLoginPage();
                    } else {
                        onError(rejectResponse.data);
                    }
                });
        }
    }
})();
