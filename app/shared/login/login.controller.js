(function () {
    'use strict';
    // Khai báo controller
    angular.module('app').controller('LoginController', LoginController);

    // Khai báo các dependencies
    LoginController.$inject = ['UserServices', 'ApplicationConfig', '$location', 'Cookies'];

    // Hàm xử lý login
    function LoginController(UserServices, ApplicationConfig, $location, Cookies) {
        var vm = this;

        vm.loginVia = "SSO";
        vm.LOGIN_VIA_MSISDN="MSISDN";
        vm.LOGIN_VIA_SSO="SSO";

        vm.msisdn;
        vm.staffCode;
        vm.password;

        vm.showLoading = false;
        vm.showError = false;
        vm.errormessage;
        vm.logo = ApplicationConfig.logoPath;

        vm.login = login;

        var onLoginSuccess = function onLoginSuccess (data) {
            vm.showLoading = false;
            if ((data != null) && (data != "") && (data.status!="0")) {
                vm.showError = false;
                console.log('login success: '+data);
                // store session data
                Cookies.storeSessionOnCookies(data);
                ApplicationConfig.sessionKey = data.sessionKey;
                console.log("save sessionKey to ApplicationConfig: "+ApplicationConfig.sessionKey);

                ApplicationConfig.isAutoRedirect = true;
                $location.path("/authenticated/appstore");
            } else {
                vm.showError = true;
                var serverMessage = data.errorMessage;
                if (serverMessage) {
                    vm.errormessage = "Đăng nhập thất bại. "+serverMessage;
                } else {
                    vm.errormessage = "Đăng nhập thất bại. Vui lòng thử lại!";
                }
            }
        };

        var onLoginError = function onLoginError (data) {
            vm.showLoading = false;
            vm.showError = true;
            vm.errormessage = "Đăng nhập thất bại. Vui lòng thử lại!";
        };

        function login() {
            console.log("logging ...");
            vm.showLoading = true;
            if (vm.loginVia == vm.LOGIN_VIA_MSISDN) {
                UserServices.login(vm.msisdn, onLoginSuccess, onLoginError);
            } else if (vm.loginVia == vm.LOGIN_VIA_SSO) {
                var data = {staffCode:vm.staffCode, password:vm.password};
                UserServices.loginSso(data, onLoginSuccess, onLoginError);
            } else {
                console.log("Un-supported login type!");
            }

        }

        vm.processKeyPress = function(keyEvent) {
            if (keyEvent.which === 13) {
                console.log("Enter key pressed. process to login.");
                login();
            }
        }
    }

})();