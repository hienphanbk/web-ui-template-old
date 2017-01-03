(function () {
        'use strict';
        angular.module('app')
            .service('AuthenService', AuthenService);

        AuthenService.$inject=['$http', 'ApplicationConfig'];
         
        function AuthenService($http, ApplicationConfig) {
            var vm = this;
            // var currentUser = {username:'hienphanbk', role:'admin'};
            var currentUser;

            // Get cached user from cookies
            vm.getCurrentUser = function () {
                console.log('trying to get current user');
                return currentUser;
            }

            // Login service
            vm.login = function (msisdn, onSuccess, onError) {
                console.log('trying to login with msisdn=' + msisdn);
                // 1. build login service url
                var serviceUrl = ApplicationConfig.commandServiceUrls.user.login+"?msisdn="+msisdn;
                // 2. call login service
                $http
                .post(serviceUrl)
                .then(function (response) {
                    console.log("On success, Response data: "+response.data);
                    return onSuccess(response.data);
                })
                .catch(function (rejectResponse) {
                    console.log("On error");
                    return onError(rejectResponse.data);
                });
            }

            // logout service
            vm.logout = function () {
                console.log('trying to logout');
                currentUser = null;
            }

            // store login data to cookies

        }
    })();
