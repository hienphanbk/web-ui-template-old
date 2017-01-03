(function () {
    'use strict';
    angular.module('app')
        .service('Cookies', Cookies);

    Cookies.$inject = ['$cookies', 'ApplicationConfig'];

    function Cookies($cookies, ApplicationConfig) {
        var vm = this;
        var secretKey = "qwe123!@#";

        vm.set = function(key, value) {
            var encryptedValue = CryptoJS.AES.encrypt(value, secretKey);
            $cookies.put(key, encryptedValue);
        }

        vm.get = function(key) {
            var encryptedValue = $cookies.get(key);
            var value = undefined;
            if (encryptedValue) {
                value = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
            }
            return value;
        }

        vm.storeSessionOnCookies = function(data) {
            vm.set(ApplicationConfig.currentUserIdKey, data.userId);
            vm.set(ApplicationConfig.currentUserSessionKey, data.sessionKey);
            vm.set(ApplicationConfig.currentUserRolesKey, data.roles);
            vm.set(ApplicationConfig.currentUsernameKey, data.name);
        }
    }
})();
