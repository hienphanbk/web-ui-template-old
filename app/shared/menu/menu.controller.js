(function () {
    'use strict';
    angular.module('app')
        // .config(routerConfig)
        .controller('MenuController', MenuController);
    // .controller('MenuController', ['$state', MenuController]);

    MenuController.$inject = ['$state', 'UserServices', 'ApplicationConfig','$location','$cookies'];

    function MenuController($state, UserServices, ApplicationConfig, $location, $cookies) {
        var vm = this;
        vm.currentNavItem = $location.path();
        vm.menuItems = ApplicationConfig.menuItems;

        vm.reloadAppContext = function() {
            vm.isAndroid = ApplicationConfig.isAppAndroidScope;
            vm.isIos = ApplicationConfig.isAppIosScope;
        };
        vm.reloadAppContext();

        vm.changeToAndroid = function() {
            ApplicationConfig.setIsAppAndroidScope();
            //ApplicationConfig.isAppAndroidScope = true;
            //ApplicationConfig.isAppIosScope = false;
            vm.reloadAppContext();
        };

        vm.changeToIos = function() {
            ApplicationConfig.setIsAppIosScope();
            //ApplicationConfig.isAppAndroidScope = false;
            //ApplicationConfig.isAppIosScope = true;
            vm.reloadAppContext();
        }

        vm.androidIconUrl = "assets/css/svg/ic_android_white_36px.svg";
        vm.androidIconTooltips = "Android Stores";

        vm.iOsIconUrl="assets/css/svg/icon-ios.png";
        vm.iOsIconTooltips = "I-OS Stores";

        vm.exitIconUrl = "assets/css/svg/ic_exit_to_app_white_36px.svg";
        vm.exitButtonTooltips = "Thoát";

        // get allowed menu items
        vm.allowMenuItems = [];
        var currentRoles = UserServices.getCurrentRoles();
        for(var i=0; i<vm.menuItems.length; i++) {
            var menuItem = vm.menuItems[i];
            for (var j=0; j<currentRoles.length; j++) {
                var role = currentRoles[j];
                if (menuItem.roles.indexOf(role) >=0 ) {
                    console.log("Add allow menu item: "+menuItem);
                    vm.allowMenuItems.push(menuItem);
                    break;
                }
            }
        }

        console.log("You are entering home page");

        vm.currentUsername = UserServices.getCurrentUsername();
        vm.logout = function logout() {
            console.log("You are request to logout");
            UserServices.logout();

            // Remove cookie
            $cookies.remove(ApplicationConfig.currentUserIdKey);
            $cookies.remove(ApplicationConfig.currentUserSessionKey);
            $cookies.remove(ApplicationConfig.currentUserRolesKey);

            // Goto login page
            $state.go("login");
        }
    }
})();