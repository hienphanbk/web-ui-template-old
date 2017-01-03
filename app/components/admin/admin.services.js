(function () {
    'use strict';
    angular.module('app').service('AdminService', AdminService);

    AdminService.$inject = ['HttpService','ApplicationConfig'];

    function AdminService(HttpService, ApplicationConfig) {
        var vm = this;

        vm.getAllGroups = function(onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.getGroups;
            HttpService.callServiceWithSessionHeader(url,{},onSuccess, onError);
        };

        vm.addGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.createGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.removeGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.removeGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.getUsersOfGroups = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.getUsersOfGroups;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.getGroupsOfGroups = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.getGroupsOfGroups;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.searchUser = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.searchUser;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.searchGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.searchGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.addUsersToGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.addUsersToGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.addGroupsToGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.addGroupsToGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.removeUsersFromGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.removeUsersFromGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.removeGroupsFromGroup = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.removeGroupsFromGroup;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        };

        vm.updateGroupInfo = function(data, onSuccess, onError) {
            var url = ApplicationConfig.serviceUrls.user.updateGroupInfo;
            HttpService.callServiceWithSessionHeader(url,data,onSuccess, onError);
        }
    }
})();