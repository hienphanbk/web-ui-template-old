angular.module('app')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['ApplicationConfig'];
function HeaderController(ApplicationConfig) {
    var vm = this;
    vm.logo = ApplicationConfig.logoPath;
    vm.title = ApplicationConfig.appTitle;
    vm.updateScope = function() {
        console.log("update app context scope.");
        vm.isAndroid = ApplicationConfig.isAppAndroidScope;
        vm.isIos = ApplicationConfig.isAppIosScope;
    }
    vm.updateScope();
    ApplicationConfig.registerObserverCallback(vm.updateScope);
}

