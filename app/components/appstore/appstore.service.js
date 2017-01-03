(function () {
    'use strict';
    angular.module('app').service('AppStoreService', AppStoreService);

    AppStoreService.$inject = ['HttpService','ApplicationConfig'];

    function AppStoreService(HttpService, ApplicationConfig) {
        var vm = this;

        vm.getAllApps = function(onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.app.getListApp;
            HttpService.callServiceWithSessionHeader(url,{},onSuccess, onError);
        }
    }
})();