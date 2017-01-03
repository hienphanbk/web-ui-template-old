(function () {
    'use strict';
    angular.module('app').service('ReportService', ReportService);

    ReportService.$inject = ['HttpService','ApplicationConfig'];

    function ReportService(HttpService, ApplicationConfig) {
        var vm = this;

        vm.getAllAndroidErrorGroups = function(onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getAllAndroidErrorGroups;
            HttpService.callServiceWithSessionHeader(url,{},onSuccess, onError);
        };

        vm.getAllIosErrorGroups = function(onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getAllIosErrorGroups;
            HttpService.callServiceWithSessionHeader(url,{},onSuccess, onError);
        };

        vm.getAndroidErrorsOfSelectedGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getAndroidErrorsOfGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.getIosErrorsOfSelectedGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getIosErrorsOfGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.updateErrorStatus = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.updateErrorsStatus;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.getErrorsOfGroupByAndroidApp = function (data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getErrorsGroupsByAndroidApp;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.getErrorsOfGroupByIosApp = function (data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.error.getErrorsGroupsByIosApp;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };
    }

})();