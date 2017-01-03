(function () {
    'use strict';
    angular.module('app')
        .service('ReviewServices', ReviewServices);

    ReviewServices.$inject = ['ApplicationConfig', 'HttpService'];

    function ReviewServices(ApplicationConfig, HttpService) {
        var vm = this;

        vm.addNewReview = function (onSuccess, onError, data) {
            var url = ApplicationConfig.serviceUrls.review.addNewReview;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.updateReview = function (onSuccess, onError, data) {
            var url = ApplicationConfig.serviceUrls.review.updateReview;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

        vm.removeReview = function (onSuccess, onError, data) {
            var url = ApplicationConfig.serviceUrls.review.removeReview;
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        };

    }
})();