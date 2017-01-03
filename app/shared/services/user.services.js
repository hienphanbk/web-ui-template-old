(function () {
    'use strict';
    angular.module('app')
        .service('UserServices', UserServices);

    UserServices.$inject = ['ApplicationConfig', 'Cookies', 'HttpService'];

    function UserServices(ApplicationConfig, Cookies, HttpService) {
        var vm = this;

        // Get cached user from cookies
        vm.getCurrentUser = function () {
            console.log('trying to get current user');

            var currentUser = null;

            var userId = Cookies.get(ApplicationConfig.currentUserIdKey);
            var sessionKey = Cookies.get(ApplicationConfig.currentUserSessionKey);
            var name = Cookies.get(ApplicationConfig.currentUsernameKey);
            var roles = Cookies.get(ApplicationConfig.currentUserRolesKey);

            if (userId && sessionKey && roles) {
                currentUser = {};
                currentUser.userId = userId;
                currentUser.sessionKey = sessionKey;
                currentUser.roles = roles;
                currentUser.name = name;
            }

            //vm.currentUser = {'userId':userId, 'sessionKey':sessionKey, 'roles':roles};
            console.log("current user: " + currentUser);
            return currentUser;
        };


        vm.getGroups = function(onSuccess, onError) {
            console.log("Trying to get list users");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.user.getGroups;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, {}, onSuccess, onError);
        }

        /**
         * Lay ve tap quyen hien tai cua user
         */
        vm.getCurrentRoles = function() {
            var roles = Cookies.get(ApplicationConfig.currentUserRolesKey);
            if (roles != undefined) {
                console.log("current roles: "+(roles.split(",")));
                return roles.split(",");
            } else {
                return null;
            }
        };

        vm.getCurrentUsername = function() {
            var name = Cookies.get(ApplicationConfig.currentUsernameKey);
            if (name != undefined) {
                console.log("current user full name: "+name);
                return name;
            } else {
                return "Anonymous";
            }
        };

        vm.checkSession = function (sessionKey, onSuccess, onError) {
            console.log("Starting to check session ...");
            var url = ApplicationConfig.serviceUrls.user.checkSession;
            HttpService.callServiceWithSessionHeader(url,{}, onSuccess, onError);
        };

        vm.ping = function (onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.ping;
            var onSuccess = function(data) {
                console.log("ping response data: "+data);
            };

            var onError = function(data) {
                console.log("ping error, data: "+data);
            };

            HttpService.callService(url,{"client":"hienpt9 pc"}, onSuccess, onError);
        };

        // Login service
        vm.login = function (msisdn, onSuccess, onError) {
            console.log('trying to login with msisdn=' + msisdn);
            // 1. build login service url
            var serviceUrl = ApplicationConfig.serviceUrls.user.login;
            // 2. call login service
            HttpService.callService(serviceUrl, {"msisdn":msisdn}, onSuccess, onError);
        };

        // login via sso
        vm.loginSso = function(data, onSuccess, onError) {
            console.log('trying to login with sso: staffCode = '+data.staffCode);
            // 1. build login service url
            var serviceUrl = ApplicationConfig.serviceUrls.user.loginSso;
            // 2. call login service
            HttpService.callService(serviceUrl, data, onSuccess, onError);
        };

        // logout service
        vm.logout = function () {
            console.log('trying to logout');
            // 1. build logout service url
            var msisdn = Cookies.get(ApplicationConfig.currentUserIdKey);
            var url = ApplicationConfig.serviceUrls.user.logout;
            // call logout service
            var onSuccess = function(data) {
                console.log("call logout service succes" + data);
            };

            var onError = function(data) {
                console.log("call logout service error" + data);
            };

            HttpService.callServiceWithSessionHeader(url,{"msisdn":msisdn}, onSuccess, onError);
        };

        vm.getListUser = function(onSuccess, onError) {
            console.log("Trying to get list users");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.user.getListUsers;
            // 2. Call service
            HttpService.callGetServiceWithSessionHeader(url, {}, onSuccess, onError);
        }
    }
})();
