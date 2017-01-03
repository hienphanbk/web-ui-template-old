(function () {
    'use strict';
    angular.module('app')
        .service('ApplicationConfig', ApplicationConfig);

    ApplicationConfig.$inject = ['$location'];

    function ApplicationConfig($location) {
        var vm = this;

        // session timeout
        vm.isSessionTimeout = false;
        vm.isAutoRedirect = false;

        vm.COMMAND_SERVICE_BASE_URL = "https://10.61.138.72:8443/mam-command-services/api";
        vm.QUERY_SERVICE_BASE_URL = "https://10.61.138.72:8443/mam-query-services/api";

        vm.states = {
            "LOGIN":"login",
            "HOME":"authenticated.home",
            "STORE":"authenticated.store",
            "PUBLISH":"authenticated.publish",
            "REPORT":"authenticated.reports",
            "ADMIN":"authenticated.admin"
        };

        // �?ư�?ng dẫn logo ứng dụng
        vm.logoPath = 'assets/img/mam-logo.png';
        // Tên ứng dụng
        vm.appTitle = 'Viettel Mobile Application Management';

        // Write & read services URL
        vm.serviceUrls = {
            user : {
                ping: vm.COMMAND_SERVICE_BASE_URL+"/user/ping",
                login: vm.COMMAND_SERVICE_BASE_URL+"/user/login",
                loginSso: vm.COMMAND_SERVICE_BASE_URL+"/user/loginSso",
                logout: vm.COMMAND_SERVICE_BASE_URL+"/user/logout",
                create: vm.COMMAND_SERVICE_BASE_URL+"/user/create",
                updateStatus: vm.COMMAND_SERVICE_BASE_URL+"/user/changeStatus",
                checkSession: vm.COMMAND_SERVICE_BASE_URL+"/user/checksession",
                updateRoles: vm.COMMAND_SERVICE_BASE_URL+"/user/updateRoles",
                updateName: vm.COMMAND_SERVICE_BASE_URL+"/user/updateName",
                getListUsers: vm.QUERY_SERVICE_BASE_URL+"/user/getUsers",
                // group
                createGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/createGroup",
                removeGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/removeGroup",
                addUsersToGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/addUsersToGroup",
                addGroupsToGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/addGroupsToGroup",
                removeGroupsFromGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/removeGroupsFromGroup",
                removeUsersFromGroup:vm.COMMAND_SERVICE_BASE_URL+"/user/removeUsersFromGroup",
                getGroups:vm.COMMAND_SERVICE_BASE_URL+"/user/getGroups",
                getUsersOfGroups:vm.COMMAND_SERVICE_BASE_URL+"/user/getUsersOfGroups",
                getGroupsOfGroups:vm.COMMAND_SERVICE_BASE_URL+"/user/getGroupsOfGroups",
                searchUser:vm.QUERY_SERVICE_BASE_URL+"/user/searchUser",
                searchGroup:vm.QUERY_SERVICE_BASE_URL+"/user/searchGroup",
                updateGroupInfo:vm.COMMAND_SERVICE_BASE_URL+"/user/updateGroupInfo"
            },
            app: {
                createAppAndroid:vm.COMMAND_SERVICE_BASE_URL+"/app/createAndroid",
                createAppIos:vm.COMMAND_SERVICE_BASE_URL+"/app/createIos",
                // uploadApk:vm.COMMAND_SERVICE_BASE_URL+"/app/uploadApk",
                updateDemoImgs:vm.COMMAND_SERVICE_BASE_URL+"/app/updateDemoImgs",
                updateIconApp:vm.COMMAND_SERVICE_BASE_URL+"/app/updateIconApp",
                updateImgDemo:vm.COMMAND_SERVICE_BASE_URL+"/app/updateDemoImgs",
                changeUpdateStatus: vm.COMMAND_SERVICE_BASE_URL+"/app/updateStatus",
                updateListTest: vm.COMMAND_SERVICE_BASE_URL+"/app/updateListTest",
                updateListManager: vm.COMMAND_SERVICE_BASE_URL+"/app/updateListManager",
                updateDesc: vm.COMMAND_SERVICE_BASE_URL+"/app/updateDesc",
                updateAndroidVersion: vm.COMMAND_SERVICE_BASE_URL+"/app/updateAndroidVersion",
                updateIosVersion: vm.COMMAND_SERVICE_BASE_URL+"/app/updateIosVersion",
                removeVersionApp: vm.COMMAND_SERVICE_BASE_URL+"/app/removeVersion",
                removeApp: vm.COMMAND_SERVICE_BASE_URL+"/app/remove",

                /*********Query Data*********/
                getListApp: vm.COMMAND_SERVICE_BASE_URL+"/app/getApps",
                getAppById: vm.COMMAND_SERVICE_BASE_URL+"/app/getAppDetail",
                getListAppByUser: vm.COMMAND_SERVICE_BASE_URL+"/app/getAppsByUser"

            },
            utils: {
                uploadInstallFile: vm.COMMAND_SERVICE_BASE_URL+"/utils/uploadInstallFile",
                uploadImageFile: vm.COMMAND_SERVICE_BASE_URL+"/utils/uploadImageFile",
                downloadImage:vm.COMMAND_SERVICE_BASE_URL+"/utils/loadImageFile",
                downloadInstallFile:vm.COMMAND_SERVICE_BASE_URL+"/utils/downloadInstallFile",
                getManifest:vm.COMMAND_SERVICE_BASE_URL+"/utils/getManifest"
            },
            error: {
                getAllAndroidErrorGroups: vm.COMMAND_SERVICE_BASE_URL+"/error/getAllAndroidErrorGroups",
                getAllIosErrorGroups: vm.COMMAND_SERVICE_BASE_URL+"/error/getAllIosErrorGroups",

                getAndroidErrorsOfGroup: vm.COMMAND_SERVICE_BASE_URL+"/error/getAndroidErrorsOfGroup",
                getIosErrorsOfGroup:vm.COMMAND_SERVICE_BASE_URL+"/error/getIosErrorsOfGroup",

                updateErrorsStatus: vm.COMMAND_SERVICE_BASE_URL+"/error/updateStatus",
                getErrorsGroupsByAndroidApp: vm.COMMAND_SERVICE_BASE_URL+"/error/getErrorGroupsOfAndroidApp",
                getErrorsGroupsByIosApp: vm.COMMAND_SERVICE_BASE_URL+"/error/getErrorGroupsOfIosApp"
            },
            review: {
                addNewReview: vm.COMMAND_SERVICE_BASE_URL+"/review/addReview",
                updateReview: vm.COMMAND_SERVICE_BASE_URL+"/review/updateReview",
                removeReview: vm.COMMAND_SERVICE_BASE_URL+"/review/removeReview"
            }
        };

        vm.roles = {
            ADMIN:"ADMIN",
            PUBLISHER:"PUBLISHER",
            NORMAL:"NORMAL"
        };


        vm.appStatus = {
            PUBLISHED: "PUBLISHED",
            TESTING:"TESTING",
            DRAFT:"DRAFT"
        };

        vm.osType = {
            ANDROID: "ANDROID",
            IOS:"I-OS"
        };

        // Khai báo menu ứng dụng
        vm.menuItems = [
            //{
            //    name: "Trang chủ",
            //    state: vm.states.HOME,
            //    url: "/authenticated/home",
            //    view: "app/components/home/home.view.html",
            //    roles: [vm.roles.ADMIN, vm.roles.PUBLISHER, vm.roles.NORMAL]
            //},
            {
                name: "Ứng dụng",
                state: vm.states.STORE,
                url: "/authenticated/appstore",
                view: "app/components/appstore/appstore.view.html",
                roles: [vm.roles.ADMIN, vm.roles.PUBLISHER, vm.roles.NORMAL]
            },
            {
                name: "Phát hành",
                state: vm.states.PUBLISH,
                url: "/authenticated/publish",
                view: "app/components/publish/publish.view.html",
                roles: [vm.roles.ADMIN, vm.roles.PUBLISHER]
            },
            {
                name: "Báo cáo",
                state: vm.states.REPORT,
                url: "/authenticated/reports",
                view: "app/components/reports/reports.view.html",
                roles: [vm.roles.ADMIN, vm.roles.PUBLISHER]
            },
            {
                name: "Quản trị",
                state: vm.states.ADMIN,
                url: "/authenticated/admin",
                view: "app/components/config/admin.view.html",
                roles: [vm.roles.ADMIN]
            }
        ];

        //vm.defaultState = vm.states.STORE;
        vm.defaultPath = "/authenticated/appstore";

        vm.currentUserIdKey = "MAM-CURRENT-ID";
        vm.currentUserSessionKey = "MAM-CURRENT-SESSION-KEY";
        vm.currentUserRolesKey = "MAM-CURRENT-ROLE";
        vm.currentUsernameKey = "MAM-CURRENT-USER-NAME";
        //view Android - I-OS sope
        vm.isAppAndroidScope = true;
        vm.isAppIosScope = false;
        vm.observerCallbacks = [];
        vm.registerObserverCallback = function(callback){
            vm.observerCallbacks.push(callback);
        };

        vm.notifyObservers = function(){
            //for (var i=0; i<vm.observerCallbacks.length; i++) {
            //    vm.observerCallbacks[i]();
            //}
            angular.forEach(vm.observerCallbacks, function(callback){
                callback();
            });
        };

        vm.setIsAppAndroidScope = function() {
            vm.isAppAndroidScope = true;
            vm.isAppIosScope = false;
            vm.notifyObservers();
        };

        vm.setIsAppIosScope = function() {
            vm.isAppIosScope = true;
            vm.isAppAndroidScope = false;
            vm.notifyObservers();
        };

        vm.HEADER_SESSION_KEY = 'session-key';
        vm.sessionKey = "";

        vm.goToLoginPage = function() {
            console.log("Begin redirect to login page.");
            vm.isAutoRedirect = true;
            $location.path("/login");
        }
    }
})();



	
