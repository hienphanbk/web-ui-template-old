/**
 * Created by hienpt on 9/11/16.
 */
(function(){
    'use strict';

    angular.module('app').controller('AppStoreController', AppStoreController);

    AppStoreController.$inject = ['AppStoreService','ApplicationConfig'];

    function AppStoreController(AppStoreService, ApplicationConfig){
        var vm = this;
        console.log("Begin AppStoreController ...");

        vm.isMsgErrorGobal = false;
        vm.msgGobal = "";
        vm.closeMessageGobal = function () {
            vm.isMsgErrorGobal = false;
            vm.msgGobal = "";
        };

        vm.updateAppView = function () {
            vm.isAppAndroid =  ApplicationConfig.isAppAndroidScope;
            vm.isAppIos = ApplicationConfig.isAppIosScope ;
        };
        vm.updateAppView();

        ApplicationConfig.registerObserverCallback(vm.updateAppView);

        // load data
        var initData = function() {
            vm.closeMessageGobal();
            vm.isShowAppDetails = false;
            vm.islistApp = true;
            vm.selectedApp = {};
            vm.isAppAndroid = ApplicationConfig.isAppAndroidScope;
            vm.isAppIos = ApplicationConfig.isAppIosScope;
            vm.publishedAppsAndroid = [
            ];

            vm.testingAppsAndroid = [
            ];

            vm.publishedAppsIos = [
            ];

            vm.testingAppsIos = [
            ];

            var onSuccess = function(data){
                console.log("onSuccess init data.");
                var listApps = [];
                if (data.code == "OK") {
                    listApps = data.listApp;
                    for (var i=0; i< listApps.length; i++) {
                        switch (listApps[i].versionInfo.status) {
                            case ApplicationConfig.appStatus.PUBLISHED:
                                switch (listApps[i].osType) {
                                    case ApplicationConfig.osType.ANDROID:
                                        vm.publishedAppsAndroid.push(listApps[i]);
                                        break;
                                    case ApplicationConfig.osType.IOS:
                                        vm.publishedAppsIos.push(listApps[i]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case ApplicationConfig.appStatus.TESTING:
                                switch (listApps[i].osType) {
                                    case ApplicationConfig.osType.ANDROID:
                                        vm.testingAppsAndroid.push(listApps[i]);
                                        break;
                                    case ApplicationConfig.osType.IOS:
                                        vm.testingAppsIos.push(listApps[i]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    vm.isMsgErrorGobal = true;
                    vm.msgGobal = data.message;
                }
            } ;

            var onError = function(data) {
                console.log("onError data = "+data);
                vm.isMsgErrorGobal = true;
                vm.msgGobal = "Có lỗi xảy ra khi gọi WS.";
            };
            AppStoreService.getAllApps(onSuccess, onError);
        };
        initData();


        vm.onDownloadClick = function(app){
            console.log("on download button click. appId="+app.appId);

        };

        vm.onImageClick = function(app){
            console.log("on image click.");
            vm.selectedApp = app;
            vm.isShowAppDetails = true;
            vm.islistApp = false;
        };

        vm.onUsernameClick = function(app){
            console.log("on username click.");
        };

        vm.closeAppDetailsView = function() {
            vm.isShowAppDetails = false;
            vm.islistApp = true;
            initData();
        }
    }

})();
