(function () {
    'use strict';
    angular.module('app')
        .service('AppServices', AppServices);

    AppServices.$inject = [ 'ApplicationConfig',  'HttpService'];

    function AppServices( ApplicationConfig, HttpService) {
        var vm = this;

        vm.createAppBasic = function(onSuccess, onError, appInfo){
            console.log("Trying to create app");
            // 1. Build url
            var url;
            switch (appInfo.osType) {
                case ApplicationConfig.osType.ANDROID:
                    url = ApplicationConfig.serviceUrls.app.createAppAndroid;
                    break;
                case ApplicationConfig.osType.IOS:
                    url = ApplicationConfig.serviceUrls.app.createAppIos;
                    break;
                default :
                    break;
            }
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        };

        vm.updateVersion = function (onSuccess, onError, data) {
            var url;
            switch (data.osType) {
                case ApplicationConfig.osType.ANDROID:
                    url = ApplicationConfig.serviceUrls.app.updateAndroidVersion;
                    break;
                case ApplicationConfig.osType.IOS:
                    url = ApplicationConfig.serviceUrls.app.updateIosVersion;
                    break;
                default :
                    break;
            }
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.changeStatus = function(onSuccess, onError, data){
            console.log("Trying to post change status");
            var url = ApplicationConfig.serviceUrls.app.changeUpdateStatus;
            var code ;
            switch (data.appInfo.osType) {
                case ApplicationConfig.osType.ANDROID:
                    code = data.appInfo.versionInfo.versionCode;
                    break;
                case ApplicationConfig.osType.IOS:
                    code = data.appInfo.versionInfo.bundleVersion;
                    break;
                default:
                    break;
            }
            HttpService.callServiceWithSessionHeader(url, {appId: data.appInfo.appId, versionCode: code, status: data.status}, onSuccess, onError);
        };




        // vm.updateInfoApp = function(onSuccess, onError, appInfo){
        //     console.log("Trying to create app");
        //     // 1. Build url
        //     var url = ApplicationConfig.serviceUrls.app.updateInfo;
        //     // 2. Call service
        //     HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        // };

        // vm.uploadApk = function(onSuccess, onError, appInfo){
        //     console.log("Trying to create app");
        //     // 1. Build url
        //     var url = ApplicationConfig.serviceUrls.app.uploadApk;
        //     // 2. Call service
        //     HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        // };

        vm.updateDemoImg = function(onSuccess, onError, appInfo){
            console.log("Trying to create app");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.updateDemoImgs;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        };

        vm.updateListTest = function(onSuccess, onError, data){
            console.log("Trying to post update list Test");
            var url = ApplicationConfig.serviceUrls.app.updateListTest;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.updateListManager = function(onSuccess, onError, data){
            console.log("Trying to post update list Test");
            var url = ApplicationConfig.serviceUrls.app.updateListManager;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.updateDescApp = function(onSuccess, onError, data){
            console.log("Trying to post update desc app");
            var url = ApplicationConfig.serviceUrls.app.updateDesc;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.removeVersionApp = function (onSuccess, onError, data) {
            var url = ApplicationConfig.serviceUrls.app.removeVersionApp;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.updateIconImg = function(onSuccess, onError, appInfo){
            console.log("Trying to create app");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.updateIconApp;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        };

        vm.updateImgDemo = function(onSuccess, onError, appInfo){
            console.log("Trying to create app");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.updateImgDemo;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, appInfo, onSuccess, onError);
        };


        /**************Query Data***************/

        vm.getListAppByUser = function(onSuccess, onError) {
            console.log("Trying to get list app");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.getListAppByUser;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, {}, onSuccess, onError);
        };

        vm.getListApp = function(onSuccess, onError) {
            console.log("Trying to get list app");
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.getListApp;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, {}, onSuccess, onError);
        };

        vm.getAppById = function(onSuccess, onError, app) {
            console.log("Trying to get list app");
            var version ;
            switch (app.osType) {
                case ApplicationConfig.osType.ANDROID:
                    version = app.versionInfo.versionCode;
                    break;
                case ApplicationConfig.osType.IOS:
                    version = app.versionInfo.bundleVersion;
                    break;
                default :
                    break;
            }
            // 1. Build url
            var url = ApplicationConfig.serviceUrls.app.getAppById;
            // 2. Call service
            HttpService.callServiceWithSessionHeader(url, {appId: app.appId, versionApp: version}, onSuccess, onError);
        };

    }
})();