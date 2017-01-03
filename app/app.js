(function () {
        angular.module('app', ['ngMaterial', 'ui.router', 'ngMessages', 'ngCookies', 'googlechart', 'ngAnimate']);
        angular.module('app').config(config);
        angular.module('app').run(run);

        // Cau hinh
        config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$compileProvider'];

        function config($stateProvider, $urlRouterProvider, $mdThemingProvider, $compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|itms-services):/);

            $mdThemingProvider.theme('default');

            console.log("config");
            // Các URL không khớp với bất kỳ trạng thái nào, redirect về home
            $urlRouterProvider.otherwise("/");

            // Điều hướng
            $stateProvider
                .state('authenticated', {
                    url: "/authenticated",
                    views: {
                        "view": {
                            templateUrl: "content.html"
                        }
                    }
                })
                .state('login', {
                    url: "/login",
                    views: {
                        "view": {
                            templateUrl: "app/shared/login/login.view.html",
                        }
                    }
                });
            $stateProvider
                .state('authenticated.store', {
                    url: "/appstore",
                    views: {
                        "view": {
                            templateUrl: "app/components/appstore/appstore.view.html",
                        }
                    }
                })
                .state('authenticated.publish', {
                    url: "/publish",
                    views: {
                        "view": {
                            templateUrl: "app/components/publish/publish.view.html",
                        }
                    }
                })
                .state('authenticated.reports', {
                    url: "/reports",
                    views: {
                        "view": {
                            templateUrl: "app/components/reports/reports.view.html",
                        }
                    }
                })
                .state('authenticated.admin', {
                    url: "/admin",
                    views: {
                        "view": {
                            templateUrl: "app/components/admin/admin.view.html",
                        }
                    }
                })
        }


        run.$inject = ['$location', '$rootScope', 'UserServices', 'ApplicationConfig', 'Cookies'];

        function run($location, $rootScope, UserServices, ApplicationConfig, Cookies) {
            /**
             * Kiem tra co user nao dang duoc cached?
             */
            console.log("first run");
            var vm = this;
            vm.processLoggedUser = function() {
                var lastUserLogged = UserServices.getCurrentUser();
                if (lastUserLogged) {
                    console.log("User is logged-in, start to check session ...");
                    /**
                     * Kiem tra session
                     */
                    var onCheckSessionOk = function onCheckSessionOk (response) {
                        if (response == "true") {
                            ApplicationConfig.isSessionTimeout = false;
                            console.log("Session is valid, go direct to entered link.");

                            var currentPath =  $location.path();
                            // Go to current PATH neu current path hop le
                            if (currentPath && currentPath != null && currentPath != "" && currentPath != "/" && currentPath != "/login") {
                                console.log("Current path is authentication required path. Enter current path.");
                                ApplicationConfig.isAutoRedirect = true;
                                $location.path(currentPath);
                            }
                            // Go to default PATH neu current path khong hop le
                            else {
                                console.log("Current path is not an authentication required link. Enter default authenticated path.");
                                ApplicationConfig.isAutoRedirect = true;
                                $location.path(ApplicationConfig.defaultPath);
                            }
                        } else {
                            console.log("Session is in-valid, go login link.");
                            ApplicationConfig.isSessionTimeout = true;
                            ApplicationConfig.goToLoginPage();
                        }
                    };

                    var onCheckSessionError = function onCheckSessionError (response) {
                        console.log("Session is in-valid, go login link.");
                        ApplicationConfig.goToLoginPage();
                    };

                    // Kiem tra xem sessionKey con hop le hay không
                    UserServices.checkSession(Cookies.get(ApplicationConfig.currentUserSessionKey), onCheckSessionOk, onCheckSessionError);
                } else {
                    console.log("User is not logged-in.");
                    ApplicationConfig.goToLoginPage();
                }
            };
            vm.processLoggedUser();

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                /**
                 * Neu la manual change location, check.
                 */
                if (ApplicationConfig.isAutoRedirect == false) {
                    console.log("Manual change location to "+next+" from "+current+". Re-check session process start...");
                    vm.processLoggedUser();
                } else {
                    console.log("Auto redirect to "+next+" from "+current+". Do not to check anything.");
                    ApplicationConfig.isAutoRedirect = false;
                }
            });
        }
    })();