(function () {
    angular
        .module('app')
        .controller('LoadingController', LoadingController);

    LoadingController.$inject = [];

    function LoadingController($rootScope) {
        console.log("Enter LoadingController");
        var vm = this;
        vm.isLoading = false;
        while (true) {
            if ($rootScope.isLoading) {
                vm.isLoading = true;
                break;
            }
        }
    }
})();
