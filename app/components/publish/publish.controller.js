/**
 * Created by anhvv4 on 9/15/2016.
 */
(function(){
    'use strict';

    angular.module('app').controller('PublishAppController', PublishAppController);

    PublishAppController.$inject = [ 'ReportService', 'UtilsService', 'UserServices', 'AppServices','ApplicationConfig','$scope','$mdDialog'];

    function PublishAppController(ReportService, UtilsService, UserServices, AppServices, ApplicationConfig, $scope, $mdDialog){
        var vm = this;
        console.log("Begin PublishAppController ...");
        vm.isMsgErrorGobal = false;
        vm.msgGobal = "";
        vm.closeMessageGobal = function () {
            vm.isMsgErrorGobal = false;
            vm.msgGobal = "";
        };
        //Ham tao cho listApp
        vm.initDataListApp = function () {
            vm.isListing = true;
            vm.isCreating = false;
            vm.isviewDetails = false;
            vm.closeMessageGobal();
            vm.updateAppView = function () {
                vm.isAppAndroid =  ApplicationConfig.isAppAndroidScope;
                vm.isAppIos = ApplicationConfig.isAppIosScope ;
            };
            vm.updateAppView();

            ApplicationConfig.registerObserverCallback(vm.updateAppView);

            vm.draftAppsAndroid = [
            ];
            vm.publishedAppsAndroid = [
            ];
            vm.testingAppsAndroid = [
            ];
            vm.draftAppsIos = [
            ];
            vm.publishedAppsIos = [
            ];
            vm.testingAppsIos = [
            ];
            var onSuccess = function(data){
                console.log("Call WS getAllApp success");
                if(data.code == "OK"){
                    for (var i=0; i< data.listApp.length; i++) {
                        switch (data.listApp[i].versionInfo.status) {
                            case ApplicationConfig.appStatus.PUBLISHED:
                                switch (data.listApp[i].osType) {
                                    case ApplicationConfig.osType.ANDROID:
                                        vm.publishedAppsAndroid.push(data.listApp[i]);
                                        break;
                                    case ApplicationConfig.osType.IOS:
                                        vm.publishedAppsIos.push(data.listApp[i]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case ApplicationConfig.appStatus.TESTING:
                                switch (data.listApp[i].osType) {
                                    case ApplicationConfig.osType.ANDROID:
                                        vm.testingAppsAndroid.push(data.listApp[i]);
                                        break;
                                    case ApplicationConfig.osType.IOS:
                                        vm.testingAppsIos.push(data.listApp[i]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case ApplicationConfig.appStatus.DRAFT:
                                switch (data.listApp[i].osType) {
                                    case ApplicationConfig.osType.ANDROID:
                                        vm.draftAppsAndroid.push(data.listApp[i]);
                                        break;
                                    case ApplicationConfig.osType.IOS:
                                        vm.draftAppsIos.push(data.listApp[i]);
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
            };
            var onError = function(data){
                console.log("Lay danh sach app error" + data);
                vm.isMsgErrorGobal = true;
                vm.msgGobal = "Lấy danh sách ứng dụng bị lỗi."
            };
            AppServices.getListAppByUser(onSuccess, onError);

        };
        vm.initDataListApp();
        //end khoi tao danh sach

        var calAvgRating = function() {
            vm.selectedApp.appInfo.avgRating = 0;
            if (vm.selectedApp.appInfo.totalReview > 0) {
                vm.selectedApp.appInfo.avgRating =  Math.round((vm.selectedApp.appInfo.totalRating/vm.selectedApp.appInfo.totalReview)*100)/100;
            }
        };

        //Xem chi tiet ung dung
        vm.initDataViewDetail = function(app) {
            vm.selectedApp = app;
            vm.isviewDetails = true;
            vm.isCreating = false;
            vm.isListing = false;
            vm.isErrorUpdateStatus = false;
            vm.isSuccesUpdateStatus = false;
            vm.messageUpdateStatus = "";
            vm.closeMessageGobal();
            var onSuccess = function(data){
                console.log("Call WS getDetail app success");
                if(data.code == "OK"){
                    vm.selectedApp = {appInfo: data.applicationModel, reviewDetail: data.reviewsModel, listTester: data.listTest, listManager: data.listManager};
                    calAvgRating();
                    if(data.listTest == undefined){
                        vm.listCurrentTest = [];
                    } else {
                        vm.listCurrentTest = data.listTest;
                    }
                    if(data.listManager == undefined){
                        vm.listCurrentManager = [];
                    } else {
                        vm.listCurrentManager = data.listManager;
                    }
                    loadImagesIcon();
                    vm.initDataUpdateDesc();
                    vm.initListAllUser();
                    vm.initDataUpdateTest();
                    vm.initUpdateManage();
                    vm.initDataReview();
                    vm.errorModule();
                    vm.loadImagesApp();
                } else {
                    vm.isMsgErrorGobal = true;
                    vm.msgGobal = data.message;
                    console.log(data.message);
                }
            };
            var onError = function (data) {
                console.log("getDetail app error" + data);
                vm.isMsgErrorGobal = true;
                vm.msgGobal = "Có lỗi xảy ra khi gọi WS...";
            };
            AppServices.getAppById(onSuccess, onError, app);

            //Doi status
            vm.changeStatus = function(status){
                vm.closeMessageUpdateStatus = function () {
                    vm.isErrorUpdateStatus = false;
                    vm.isSuccesUpdateStatus = false;
                    vm.messageUpdateStatus = "";
                };
                var onSuccess = function(data){
                    console.log("Call WS change status success.");
                    if(data.code =="OK"){
                        //Thong bao thanh cong, update lai view trang thai status tuong ung
                        vm.selectedApp.appInfo.versionInfo.status = status;
                        vm.isErrorUpdateStatus = false;
                        vm.isSuccesUpdateStatus = true;
                        vm.messageUpdateStatus = "Cập nhật trạng thái ứng dụng thành công";
                    } else {
                        //Thong bao loi tu ws ra ngoai man hinh ung dung
                        vm.isErrorUpdateStatus = true;
                        vm.isSuccesUpdateStatus = false;
                        vm.messageUpdateStatus = data.message;
                    }
                };

                var onError = function(data){
                    console.log("Call WS change status error." + data);
                    //Thong bao loi ra man hinh ung dung
                    vm.isErrorUpdateStatus = true;
                    vm.isSuccesUpdateStatus = false;
                    vm.messageUpdateStatus = "Cập nhật trạng thái ứng dụng thất bại.";
                };

                var param = {appInfo : vm.selectedApp.appInfo,status: status };
                AppServices.changeStatus(onSuccess, onError, param )
            };
            //init danh sach user
            vm.initListAllUser = function () {
                var onGetListUserSuccess = function (data) {
                    console.log("users: " + data);
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            vm.listAllUser.push(data[i]);
                        }
                    }
                };
                var onGetListUserError = function (data) {
                    console.log("Error when trying to get users from server.");
                };
                UserServices.getListUser(onGetListUserSuccess, onGetListUserError);
            };
            //Xu li update tester cho ung dung
            vm.initDataUpdateTest = function () {
                vm.selectedTest = undefined ;
                vm.searchText = "";
                vm.listAllUser = [];
                vm.isMsgTestSucc = false;
                vm.isMsgTestError = false;
                vm.msgTest = "";
                vm.closeMsgTest = function () {
                    vm.isMsgTestSucc = false;
                    vm.isMsgTestError = false;
                    vm.msgTest = "";
                };
                vm.querySearch = function(searchText) {
                    //Goi ham service tra ve list
                    var listResult = [];
                    for(var i = 0 ; i < vm.listAllUser.length; i++ ){
                        var j = vm.listAllUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({userId: vm.listAllUser[i].id, userName: vm.listAllUser[i].name});
                            continue;
                        }
                        j = vm.listAllUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({userId: vm.listAllUser[i].id, userName: vm.listAllUser[i].name});
                        }
                    }
                    return listResult;
                };
                vm.selectedItemChange = function(item){
                    console.log("selectedItem " + vm.selectedTest);
                    if(item != undefined){
                        var itemFilter =  function (obj) {
                            return obj.userId == item.userId;
                        };
                        var itemArr = vm.listCurrentTest.filter(itemFilter);
                        if(itemArr.length == 0){
                            vm.listCurrentTest.push(item);
                        }
                        vm.searchText = "";
                        vm.selectedTest = "";
                    }
                };
                vm.removeTest = function(item){
                    var i = vm.listCurrentTest.indexOf(item);
                    if(i >= 0){
                        vm.listCurrentTest.splice(i, 1);
                    }
                };
                vm.updateListTest = function () {
                    var onSuccess = function(data){
                        console.log("Call WS update test success.");
                        if(data.code =="OK"){
                            //Thong bao thanh cong, update lai view trang thai status tuong ung
                            vm.selectedApp.listTester = vm.listCurrentTest;
                            vm.isMsgTestSucc = true;
                            vm.msgTest = "Cập nhật tester thành công.";
                            vm.isMsgTestError = false;
                        } else {
                            //Thong bao loi tu ws ra ngoai man hinh ung dung
                            vm.isMsgTestSucc = false;
                            vm.msgTest = data.message;
                            vm.isMsgTestError = true;
                        }
                    };
                    var onError = function(data){
                        console.log("Call WS update Test error.");
                        //Thong bao loi ra man hinh ung dung
                        vm.isMsgTestSucc = false;
                        vm.msgTest = "Cập nhật tester thất bại.";
                        vm.isMsgTestError = true;
                    };
                    var listId = [];
                    if(vm.listCurrentTest.length > 0){
                        for (var i = 0; i < vm.listCurrentTest.length ; i++){
                            listId.push(vm.listCurrentTest[i].userId)
                        }
                    }

                    var param = {"appId" : vm.selectedApp.appInfo.appId, "testers": listId }
                    AppServices.updateListTest(onSuccess, onError, param )
                };
            };
            //Xu li update desc cho ung dung
            vm.initDataUpdateDesc = function () {
                vm.isEditDesc = false;
                vm.isMsgDescSucc = false;
                vm.isMsgErrorDesc = false;
                vm.message = "";
                vm.newDescApp = vm.selectedApp.appInfo.descApp;
                vm.cancelEditDesc = function () {
                    vm.isEditDesc = false;
                };

                vm.closeMsgDesc = function () {
                    vm.isMsgDescSucc = false;
                    vm.isMsgErrorDesc = false;
                    vm.message = "";
                };

                vm.updateDescApp = function () {
                    var onSuccess = function (response) {
                        if(response.code == "OK"){
                            console.log("Cap nhat thanh doi thanh cong");
                            vm.selectedApp.appInfo.appDesc = vm.newDescApp;
                            vm.isMsgErrorDesc = false;
                            vm.isMsgDescSucc = true;
                            vm.isEditDesc = false;
                            vm.message = "Cập nhật thông tin chi tiết ứng dụng thành công";
                        } else {
                            vm.isMsgErrorDesc = true;
                            vm.isMsgDescSucc = false;
                            vm.message = response.message;
                        }
                    };
                    var onError = function (response) {
                        console.log("Co loi xay ra khi goi ws" + response);
                        vm.isMsgErrorDesc = true;
                        vm.isMsgDescSucc = false;
                        vm.message = "Co loi xay ra khi cập nhật thông tin chi tiết của App";
                    };
                    AppServices.updateDescApp(onSuccess, onError, {appId: vm.selectedApp.appInfo.appId, "descApp": vm.newDescApp} );

                }
            };
            //Xu li xem review
            vm.initDataReview = function () {
                vm.avgRating = vm.selectedApp.appInfo.avgRating;
                vm.totalReview = vm.selectedApp.appInfo.totalReview;
                vm.appReviews = vm.selectedApp.reviewDetail;
            };
            //Xu li update icon App
            var loadImagesIcon = function () {
                var loadImg = function (nameImg) {
                    vm.urlIcon = "assets/img/loading.gif";
                    var fileName = nameImg;
                    if (fileName == undefined || fileName == "") {
                        vm.urlIcon = "assets/img/default_app_icon.png";
                    } else {
                        var onSuccess = function(response) {
                            console.log("onSuccess load icon image.");
                            vm.urlIcon = response;
                        };
                        var onError = function(response) {
                            console.log("onError load image. default icon will be used.");
                            vm.urlIcon = "assets/img/default_app_icon.png";
                        };
                        UtilsService.downloadImage(fileName, onSuccess, onError);
                    }

                };
                vm.urlIcon = "";
                loadImg(vm.selectedApp.appInfo.iconApp);
            };
            //Xu li update img app
            vm.loadImagesApp = function () {
                var loadImg = function (nameImg) {
                    var data = "assets/img/loading.gif";
                    var fileName = nameImg;
                    if (fileName == undefined || fileName == "") {
                        vm.urlIcon = "assets/img/default_app_icon.png";
                    } else {
                        var onSuccess = function(response) {
                            console.log("onSuccess load icon image.");
                            vm.images.push(response);
                        };
                        var onError = function(response) {
                            console.log("onError load image. default icon will be used.");
                            data = "assets/img/default_app_icon.png";
                            vm.images.push(data);
                        };
                        UtilsService.downloadImage(fileName, onSuccess, onError);
                    }
                };
                vm.images = [];
                for(var i = 0 ; i < vm.selectedApp.appInfo.demoImgs.length ; i++){
                    loadImg(vm.selectedApp.appInfo.demoImgs[i]);
                }

            };
            //Xu li ErrorInfo
            vm.errorModule = function () {
                vm.listErrorGroups = [
                    {
                        appId: undefined,
                        type: undefined,
                        status: undefined,
                        quantity: undefined,
                        info: undefined,
                        errors:[
                            {
                                ANDROID_VERSION: undefined,
                                APP_VERSION_CODE: undefined,
                                APP_VERSION_NAME: undefined,
                                BRAND: undefined,
                                DEVICE_ID: undefined,
                                PHONE_MODEL: undefined,
                                count: undefined,
                                errorIds: undefined
                            }
                        ],
                        isShowErrors: undefined
                    }
                ];
                vm.errorGroupFilter ="";
                vm.isShowDetailErrorGroup = false;
                vm.initData = function() {
                    console.log("init data for reports...");
                    // 1. Get all error group
                    var onSuccess = function(response){
                        console.log("Init data ok.");
                        // vm.dataLoaded = true;
                        vm.listErrorGroups = response;
                    };
                    var onError = function(response){
                        console.log("Init data error. response ="+response);
                    };
                    if (vm.selectedApp.osType==ApplicationConfig.osType.ANDROID) {
                        ReportService.getErrorsOfGroupByAndroidApp({appId: vm.selectedApp.appInfo.appId}, onSuccess, onError);
                    } else if (vm.selectedApp.osType==ApplicationConfig.osType.IOS) {
                        ReportService.getErrorsOfGroupByIosApp({appId: vm.selectedApp.appInfo.appId}, onSuccess, onError);
                    } else {
                        console.log("Un-expected OS type.");
                    }


                };
                vm.initData();
                vm.showErrors = function(errorGroup) {
                    var index = vm.listErrorGroups.indexOf(errorGroup);
                    vm.errorGroupSelected = vm.listErrorGroups[index];
                    vm.isMsgErrScc = false;
                    vm.isMsgErr = false;
                    var onSuccess = function(response) {
                        vm.listErrorGroups[index].errors = response;
                        vm.errorGroupSelected.errors = response;
                        vm.isShowDetailErrorGroup = true;
                        console.log("onSuccess get error details in a error group. response="+response);
                    };
                    var onError = function(response) {
                        console.log("onError get error details in a error group. response="+response);
                    };
                    var input = {
                        appId:vm.errorGroupSelected.appId,
                        STACK_TRACE: vm.errorGroupSelected.info,
                        status:vm.errorGroupSelected.status,
                        errorType:vm.errorGroupSelected.type
                    };
                    ReportService.getAndroidErrorsOfSelectedGroup(input, onSuccess, onError);


                    vm.changeStatusErr = function(error,newStatus) {

                        console.log("Request to change status to "+newStatus+" for errorIds: "+errorIds);
                        var errorIds = error.errorIds;
                        var input = {
                            errorIds: errorIds,
                            newStatus: newStatus
                        };
                        var onSuccess = function(response) {
                            console.log("onSuccess changeStatus. "+response);
                            if (response == "true") {
                                //vm.initData();
                                console.log("reload data.");
                                vm.initData();

                                Array.prototype.remove = function() {
                                    var what, a = arguments, L = a.length, ax;
                                    while (L && this.length) {
                                        what = a[--L];
                                        while ((ax = this.indexOf(what)) !== -1) {
                                            this.splice(ax, 1);
                                        }
                                    }
                                    return this;
                                };
                                vm.errorGroupSelected.errors.remove(error);
                                vm.isMsgErrScc = true;
                                vm.isMsgErr = false;
                            } else {
                                vm.isMsgErrScc = false;
                                vm.isMsgErr = true;
                            }
                        };
                        var onError = function(response) {
                            console.log("onError changeStatus. "+response);
                            vm.isMsgErr = true;
                            vm.isMsgErrScc = false;
                        };
                        ReportService.updateErrorStatus(input, onSuccess, onError);
                    }
                };
                vm.backListError = function () {
                    vm.isShowDetailErrorGroup = false;
                }
            };
            //Xu li update version
            // vm.versionModule = function () {
            //     $('#upVerApp')[0].reset();
            //     vm.showUpversion = false;
            //     vm.fileVersion = {};
            //     vm.isUpdateVersion = true;
            //     vm.closeUpdateVersion = function () {
            //         vm.isUpdateVersion = false;
            //         vm.showUpversion = false;
            //     };
            //     vm.closeMessageUpdateVersion = function () {
            //         vm.isErrorUpdateVersion = false;
            //         vm.isSuccesUpdateVersion = false;
            //         vm.messageUpdateVersion = "";
            //     };
            //     vm.closeMessageUpdateVersion();
            //
            //     vm.updateVersion = function () {
            //         var onSuccess = function (respon) {
            //             if(respon.code == "OK"){
            //                 vm.isErrorUpdateVersion = false;
            //                 vm.isSuccesUpdateVersion = true;
            //                 vm.messageUpdateVersion = "Update version thành công";
            //                 vm.selectedApp.appInfo.appVersionCode = vm.appUpdateVersion.versionCode ;
            //                 vm.selectedApp.appInfo.appVersionName = vm.appUpdateVersion.versionName;
            //                 vm.showUpversion = false;
            //             } else {
            //                 vm.isErrorUpdateVersion = true;
            //                 vm.isSuccesUpdateVersion = false;
            //                 vm.messageUpdateVersion = "Upload file thất bại: " + respon.message;
            //             }
            //         };
            //         var onError = function (respon) {
            //             vm.isErrorUpdateVersion = true;
            //             vm.isSuccesUpdateVersion = false;
            //             vm.messageUpdateVersion = "Upload file thất bại";
            //             console.log("respon error " + respon);
            //         };
            //         AppServices.updateVersion(onSuccess, onError, vm.appUpdateVersion);
            //     };
            //
            //     vm.isUpdatingVersion = false;
            //     $scope.uploadVersionApp = function (ele) {
            //         vm.isUpdatingVersion = true;
            //         vm.appUpdateVersion = {};
            //         vm.fileAppUpdate = ele;
            //         var a = this;
            //         a.ele2 = ele;
            //         if(ele.files[0] == undefined){
            //             vm.isUpdatingVersion = false;
            //             return;
            //         }
            //         var onSuccess = function(response){
            //             vm.isUpdatingVersion = false;
            //             console.log("on success. data="+response);
            //             if(response.processStatus == "OK"){
            //                 switch (response.os) {
            //                     case ApplicationConfig.osType.ANDROID :
            //                         if(response.packageName != vm.selectedApp.appInfo.versionInfo.packageName){
            //                             vm.isErrorUpdateVersion = true;
            //                             vm.isSuccesUpdateVersion = false;
            //                             vm.messageUpdateVersion = "File upload phải là cài đặt của ứng dụng.";
            //                             return;
            //                         }
            //                         vm.appUpdateVersion.packageName = response.packageName;
            //                         vm.appUpdateVersion.name = response.appName;
            //                         vm.appUpdateVersion.versionCode = response.versionCode;
            //                         vm.appUpdateVersion.versionName = response.versionName;
            //                         vm.appUpdateVersion.osType = response.os;
            //                         // vm.appInfo.minSdk = response.minSdk;
            //                         vm.appUpdateVersion.fileName = response.fileName;
            //                         // vm.appInfo.targetSdk = response.targetSdk;
            //                         break;
            //                     case ApplicationConfig.osType.IOS :
            //                         if(response.bundleId != vm.selectedApp.appInfo.versionInfo.bundleId){
            //                             vm.isErrorUpdateVersion = true;
            //                             vm.isSuccesUpdateVersion = false;
            //                             vm.messageUpdateVersion = "File upload phải là cài đặt của ứng dụng.";
            //                             return;
            //                         }
            //                         vm.appUpdateVersion.bundleId = response.bundleId;
            //                         vm.appUpdateVersion.name = response.appName;
            //                         vm.appUpdateVersion.bundleVersion = response.bundleVersion;
            //                         vm.appUpdateVersion.bundleVersionName = response.bundleVersionName;
            //                         vm.appUpdateVersion.osType = response.os;
            //                         // vm.appInfo.minSdk = response.isIphoneRequire;
            //                         // vm.appInfo.installFileName = response.minOsVersion;
            //                         // vm.appInfo.targetSdk = response.taggetPlatformVersion;
            //                         vm.appUpdateVersion.fileName = response.fileName;
            //                         break;
            //                     default :
            //                         break;
            //                 }
            //                 vm.fileAppUpdate = a.ele2;
            //                 vm.showUpversion = true;
            //             } else {
            //                 vm.isErrorUpdateVersion = true;
            //                 vm.isSuccesUpdateVersion = false;
            //                 vm.messageUpdateVersion = "Upload file thất bại";
            //             }
            //
            //         };
            //         var onError = function(response){
            //             vm.isUpdatingVersion = false;
            //             console.log("on error. data="+response);
            //
            //             //Thong bao loi
            //             vm.isErrorUpdateVersion = true;
            //             vm.isSuccesUpdateVersion = false;
            //             vm.messageUpdateVersion = "Upload file thất bại";
            //
            //         };
            //         UtilsService.uploadInstallFile(ele.files[0], onSuccess, onError);
            //     }
            // };

            vm.showDialogUpdateVersion = function(ev) {
                $mdDialog.show({
                    controller: UpdateVersionInfoController,
                    templateUrl: 'app/components/publish/detailApp/updateVersionInfo.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function UpdateVersionInfoController ($scope, $mdDialog, UserServices ) {
                $scope.getListGroup = function () {
                    var onSuccess = function (data){
                        if(data){
                         $scope.listGroupsUser = data;
                        } else {
                            console.log("Khong co thong tin groups...");
                        }
                    };
                    var onError = function (data) {
                        console.log("Khong co thong tin groups...");
                    };
                    UserServices.getGroups(onSuccess, onError);
                };
                $scope.initUpdateVersion = function () {
                    $scope.fileVersion = {};
                    $scope.isUpdatingVersion = false;
                    $scope.isErrorUpdateVersion = false;
                    $scope.messageUpdateVersion = "";
                    $scope.isSuccesUpdateVersion = false;
                    $scope.showUpversion = false;
                    $scope.isAvailable = false;
                    $scope.selectedAvailable = undefined;
                    $scope.searchAvailable = "";
                    $scope.listUserAvailable = [];
                    $scope.isUnAvailable = false;
                    $scope.selectedUnAvailable = undefined;
                    $scope.searchUnAvailable = "";
                    $scope.listUserUnAvailable = [];
                    $scope.listGroupsUser = [];
                    $scope.disableUpdate = false;
                    $scope.isUpdatingVersion = false;
                };
                $scope.initUpdateVersion();
                $scope.getListGroup();
                $scope.querySearchAvailable = function (searchText) {
                    var listResult = [];
                    for(var i = 0 ; i < vm.listAllUser.length; i++ ){
                        var j = vm.listAllUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: vm.listAllUser[i].id, name: vm.listAllUser[i].name, groups: false});
                            continue;
                        }
                        j = vm.listAllUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: vm.listAllUser[i].id, name: vm.listAllUser[i].name, groups: false});
                        }
                    }
                    for (var i=0; i < $scope.listGroupsUser.length; i++) {
                        var j = $scope.listGroupsUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: $scope.listGroupsUser[i].id, name: $scope.listGroupsUser[i].name, groups: true});
                            continue;
                        }
                        j = $scope.listGroupsUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: $scope.listGroupsUser[i].id, name: $scope.listGroupsUser[i].name, groups: true});
                        }
                    }
                    return listResult;
                };

                $scope.selectedItemAvailable = function (item) {
                    if(item != undefined){
                        var itemFilter =  function (obj) {
                            return (obj.id == item.id) && (obj.isGroups == item.isGroups);
                        };
                        var itemArr = $scope.listUserAvailable.filter(itemFilter);
                        if(itemArr.length == 0){
                            $scope.listUserAvailable.push(item);
                        }
                        $scope.searchAvailable = "";
                        $scope.selectedAvailable = "";
                    }
                };

                $scope.removeAvailable = function (item) {
                    var i = $scope.listUserAvailable.indexOf(item);
                    if(i >= 0){
                        $scope.listUserAvailable.splice(i, 1);
                    }
                };

                $scope.selectedItemUnAvailable = function (item) {
                    if(item != undefined){
                        var itemFilter =  function (obj) {
                            return (obj.id == item.id) && (obj.isGroups == item.isGroups);
                        };
                        var itemArr = $scope.listUserUnAvailable.filter(itemFilter);
                        if(itemArr.length == 0){
                            $scope.listUserUnAvailable.push(item);
                        }
                        $scope.searchUnAvailable = "";
                        $scope.selectedUnAvailable = "";
                    }
                };

                $scope.querySearchUnAvailable = function (searchText) {
                    var listResult = [];
                    for(var i = 0 ; i < vm.listAllUser.length; i++ ){
                        var j = vm.listAllUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: vm.listAllUser[i].id, name: vm.listAllUser[i].name, groups: false});
                            continue;
                        }
                        j = vm.listAllUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: vm.listAllUser[i].id, name: vm.listAllUser[i].name, groups: false});
                        }
                    }
                    for (var i=0; i < $scope.listGroupsUser.length; i++) {
                        var j = $scope.listGroupsUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: $scope.listGroupsUser[i].id, name: $scope.listGroupsUser[i].name, groups: true});
                            continue;
                        }
                        j = $scope.listGroupsUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if(j >= 0 ){
                            listResult.push({id: $scope.listGroupsUser[i].id, name: $scope.listGroupsUser[i].name, groups: true});
                        }
                    }
                    return listResult;
                };

                $scope.removeUnAvailable = function (item) {
                    var i = $scope.listUserUnAvailable.indexOf(item);
                    if(i >= 0){
                        $scope.listUserUnAvailable.splice(i, 1);
                    }
                };

                $scope.closeUpdateVersionInfo = function () {
                    $mdDialog.cancel();
                };

                $scope.uploadFileApp = function (ele) {
                    $scope.isUpdatingVersion = true;
                    vm.appUpdateVersion = {};
                    $scope.fileAppUpdate = ele;
                    var a = this;
                    a.ele2 = ele;
                    if(ele.files[0] == undefined){
                        $scope.initUpdateVersion();
                        return;
                    }
                    var onSuccess = function(response){
                        $scope.isUpdatingVersion = false;
                        console.log("on success. data="+response);
                        if(response.processStatus == "OK"){
                            switch (response.os) {
                                case ApplicationConfig.osType.ANDROID :
                                    if(response.packageName != vm.selectedApp.appInfo.versionInfo.packageName){
                                        $scope.isErrorUpdateVersion = true;
                                        $scope.isSuccesUpdateVersion = false;
                                        $scope.messageUpdateVersion = "File upload phải là cài đặt của ứng dụng.";
                                        return;
                                    }
                                    vm.appUpdateVersion.packageName = response.packageName;
                                    vm.appUpdateVersion.name = response.appName;
                                    vm.appUpdateVersion.versionCode = response.versionCode;
                                    vm.appUpdateVersion.versionName = response.versionName;
                                    vm.appUpdateVersion.osType = response.os;
                                    vm.appUpdateVersion.minSdk = response.minSdk;
                                    vm.appUpdateVersion.fileName = response.fileName;
                                    vm.appUpdateVersion.targetSdk = response.targetSdk;
                                    break;
                                case ApplicationConfig.osType.IOS :
                                    if(response.bundleId != vm.selectedApp.appInfo.versionInfo.bundleId){
                                        $scope.isErrorUpdateVersion = true;
                                        $scope.isSuccesUpdateVersion = false;
                                        $scope.messageUpdateVersion = "File upload phải là cài đặt của ứng dụng.";
                                        return;
                                    }
                                    vm.appUpdateVersion.bundleId = response.bundleId;
                                    vm.appUpdateVersion.name = response.appName;
                                    vm.appUpdateVersion.bundleVersion = response.bundleVersion;
                                    vm.appUpdateVersion.bundleVersionName = response.bundleVersionName;
                                    vm.appUpdateVersion.osType = response.os;
                                    // vm.appInfo.minSdk = response.isIphoneRequire;
                                    // vm.appInfo.installFileName = response.minOsVersion;
                                    // vm.appInfo.targetSdk = response.taggetPlatformVersion;
                                    vm.appUpdateVersion.fileName = response.fileName;
                                    break;
                                default :
                                    break;
                            }
                            $scope.fileAppUpdate = a.ele2;
                            $scope.showUpversion = true;
                        } else {
                            $scope.isErrorUpdateVersion = true;
                            $scope.isSuccesUpdateVersion = false;
                            $scope.messageUpdateVersion = "Upload file thất bại";
                        }

                    };
                    var onError = function(response){
                        $scope.isUpdatingVersion = false;
                        console.log("on error. data="+response);

                        //Thong bao loi
                        $scope.isErrorUpdateVersion = true;
                        $scope.isSuccesUpdateVersion = false;
                        $scope.messageUpdateVersion = "Upload file thất bại";

                    };
                    UtilsService.uploadInstallFile(ele.files[0], onSuccess, onError);
                };

                $scope.updateVersion = function () {
                    console.log("Len version roi nha");

                    var onSuccess = function (respon) {
                        if(respon.code == "OK"){
                            $scope.disableUpdate = true;
                            $scope.messageUpdateVersion = "Nâng cấp version thành công";
                            $scope.isSuccesUpdateVersion = true;
                            $scope.isErrorUpdateVersion = false;
                        } else {
                            $scope.disableUpdate = false;
                            $scope.messageUpdateVersion = "Nâng cấp version thất bại: " + respon.message;
                            $scope.isSuccesUpdateVersion = false;
                            $scope.isErrorUpdateVersion = true;
                        }
                    };
                    var onError = function (respon) {
                        $scope.disableUpdate = false;
                        $scope.messageUpdateVersion = "Nâng cấp version thất bại";
                        $scope.isSuccesUpdateVersion = false;
                        $scope.isErrorUpdateVersion = true;
                        console.log("respon error " + respon);
                    };
                    if($scope.isAvailable){
                        vm.appUpdateVersion.availableUsers = $scope.listUserAvailable;
                    }
                    if($scope.isUnAvailable){
                        vm.appUpdateVersion.unAvailableUsers = $scope.listUserUnAvailable;
                    }
                    AppServices.updateVersion(onSuccess, onError, vm.appUpdateVersion);
                };

                $scope.closeMessageUpdateVersion = function () {
                    $scope.isErrorUpdateVersion = false;
                    $scope.messageUpdateVersion = "";
                    $scope.isSuccesUpdateVersion = false;
                };

            }

            vm.showDialogUpdateIcon = function(ev) {
                $mdDialog.show({
                    controller: UpdateIconAppController,
                    templateUrl: 'app/components/publish/detailApp/updateIconApp.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function UpdateIconAppController ($scope, $mdDialog, UtilsService) {
                $scope.initUpdateIcon = function () {
                    $scope.disableUpdateIcon = false;
                    $scope.iconAppUpdate = {};
                    $scope.iconAppUpdate.reponseUrl = vm.urlIcon;
                    $scope.isErrorUpdateIcon = false;
                    $scope.messageUpdateIcon = "";
                    $scope.isSuccesUpdateIcon = false;
                    $scope.showUpdateIcon = false;
                };
                $scope.initUpdateIcon();

                $scope.closeUpdateIcon = function () {
                    $mdDialog.cancel();
                };

                $scope.closeMessageUpdateIcon = function () {
                    $scope.isErrorUpdateIcon = false;
                    $scope.messageUpdateIcon = "";
                    $scope.isSuccesUpdateIcon = false;
                };

                $scope.uploadIcon = function (ele) {
                    if(ele.files.length  == 0){
                        $scope.iconAppUpdate.reponseUrl = "";
                        return;
                    }
                    var onSuccess = function(response){
                        console.log("on success. data="+response);
                        if(response != undefined && response!=""){
                            $scope.iconAppUpdate.iconApp = response.fileName;
                            $scope.iconAppUpdate.reponseUrl = response.tmpUri;
                            $scope.showUpdateIcon = true;
                        } else {
                            $scope.isErrorUpdateIcon = true;
                            $scope.messageUpdateIcon = "Upload ảnh đại diện thất bại. Vui lòng thử lại.";
                            $scope.isSuccesUpdateIcon = false;
                            $scope.showUpdateIcon = false;
                        }

                    };
                    var onError = function(response){
                        console.log("on error. data="+response);
                        //Thong bao loi
                        $scope.isErrorUpdateIcon = true;
                        $scope.messageUpdateIcon = "Upload ảnh đại diện thất bại. Vui lòng thử lại.";
                        $scope.isSuccesUpdateIcon = false;
                        $scope.showUpdateIcon = false;
                    };
                    UtilsService.uploadImage(ele.files[0], onSuccess, onError);
                };

                $scope.updateIcon = function () {

                    var onSuccess = function (respon) {
                        if(respon.code == "OK"){
                            $scope.isErrorUpdateIcon = false;
                            $scope.messageUpdateIcon = "Thay đổi ảnh đại diện thành công.";
                            $scope.isSuccesUpdateIcon = true;
                            $scope.disableUpdateIcon = true;
                            vm.urlIcon = $scope.iconAppUpdate.reponseUrl;
                        } else {
                            $scope.isErrorUpdateIcon = true;
                            $scope.messageUpdateIcon = respon.message;
                            $scope.isSuccesUpdateIcon = false;
                            $scope.disableUpdateIcon = false;
                        }
                    };

                    var onError = function (respon){
                        $scope.isErrorUpdateIcon = true;
                        $scope.messageUpdateIcon = "Thay đổi ảnh đại diện thất bại. Vui lòng thử lại.";
                        $scope.isSuccesUpdateIcon = false;
                        $scope.disableUpdateIcon = false;
                    };

                    AppServices.updateIconImg(onSuccess, onError, {appId: vm.selectedApp.appInfo.appId, iconImg: $scope.iconAppUpdate.iconApp});

                }
            }

            vm.showDialogUpdateImgDemo = function(ev) {
                $mdDialog.show({
                    controller: UpdateImgDemoController,
                    templateUrl: 'app/components/publish/detailApp/updateImgDemo.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

            function UpdateImgDemoController($scope, $mdDialog, UtilsService) {
                var getNameImg = function (uri) {
                    var arr = uri.split('-');
                    return arr[arr.length-1];
                };

                $scope.initDemo = function() {
                    $scope.slides = [];
                    $scope.listUriImg = vm.images.slice();
                    for (var i=0; i < $scope.listUriImg.length; i++) {
                        var nameImg = getNameImg($scope.listUriImg[i]);
                        var img = {nameImg:nameImg, uriImg:$scope.listUriImg[i], fullName: vm.selectedApp.appInfo.demoImgs[i]};
                        $scope.slides.push(img)
                    }
                };
                $scope.initUpdateImgDemo = function () {
                    $scope.isErrorUpdateImgDemo = false;
                    $scope.messageUpdateImgDemo = "";
                    $scope.isSuccesUpdateImgDemo = false;
                    $scope.disableUpdateImgDemo = false;
                    $scope.imgFile = {};
                    $scope.initDemo();
                };
                $scope.initUpdateImgDemo();
                $scope.closeUpdateImgDemo = function () {
                    $mdDialog.cancel();
                };
                $scope.closeMessageUpdateImgDemo = function () {
                    $scope.isErrorUpdateImgDemo = false;
                    $scope.messageUpdateImgDemo = "";
                    $scope.isSuccesUpdateImgDemo = false;
                };
                $scope.updateImgDemo = function () {
                    var onSuccess = function (respon) {
                        if(respon.code == "OK"){
                            $scope.isErrorUpdateImgDemo = false;
                            $scope.messageUpdateImgDemo = "Cập nhật ảnh màn hình thành công.";
                            $scope.isSuccesUpdateImgDemo = true;
                            $scope.disableUpdateImgDemo = true;
                            vm.images = $scope.listUriImg.slice();
                        } else {
                            $scope.isErrorUpdateImgDemo = true;
                            $scope.messageUpdateImgDemo = respon.message;
                            $scope.isSuccesUpdateImgDemo = false;
                            $scope.disableUpdateImgDemo = false;
                        }
                    };

                    var onError = function (respon) {
                        $scope.isErrorUpdateImgDemo = true;
                        $scope.messageUpdateImgDemo = "Cập nhật ảnh màn hình thất bại.";
                        $scope.isSuccesUpdateImgDemo = false;
                        $scope.disableUpdateImgDemo = false;
                    };
                    var listImg=[];
                    for (var i=0 ; i< $scope.slides.length; i++) {
                        listImg[i] = $scope.slides[i].fullName;
                    }
                    var appInfo = {
                        appId:vm.selectedApp.appInfo.appId,
                        demoImgs: listImg
                    };
                    AppServices.updateImgDemo(onSuccess, onError, appInfo );
                };

                $scope.uploadImgDemo = function (ele) {
                    var a = this;
                    a.ele2 = ele;
                    if(ele.files.length  == 0){
                        $scope.loadImgDemo($scope.slides);
                        return;
                    }
                    var onSuccess = function(response){
                        console.log("on success. data="+response);
                        if(response != undefined && response!=""){
                            console.log("Thong bao up thanh cong");
                            $scope.slides.unshift({uriImg: response.tmpUri, nameImg: getNameImg(response.fileName), fullName: response.fileName });
                            $scope.loadImgDemo($scope.slides);
                            $('#ImageDemo')[0].reset();
                        } else {
                            $scope.isErrorUpdateImgDemo = true;
                            $scope.messageUpdateImgDemo = "Upload file thất bại. Vui lòng thử lại.";
                            $scope.isSuccesUpdateImgDemo = false;
                        }

                    };
                    var onError = function(response){
                        console.log("on success. data="+response);
                        //Thong bao loi
                        $scope.isErrorUpdateImgDemo = true;
                        $scope.messageUpdateImgDemo = "Upload file thất bại. Vui lòng thử lại.";
                        $scope.isSuccesUpdateImgDemo = false;
                    };
                    UtilsService.uploadImage(ele.files[0], onSuccess, onError);
                };

                $scope.loadImgDemo = function (slidesEdit) {
                    $scope.listUriImg = [];
                    for (var i=0; i < slidesEdit.length; i++) {
                        $scope.listUriImg[i] = slidesEdit[i].uriImg;
                    }
                };

                $scope.removeImgDemo = function (img) {
                    // $scope.slides.splice(index, 1);
                    var slidesEdit = $scope.slides.slice();
                    var index = $scope.slides.indexOf(img);
                    slidesEdit.splice(index, 1);
                    $scope.loadImgDemo(slidesEdit);
                };
            }



            //Xoa ung dung
            vm.showConfirm = function(ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Xóa ứng dụng')
                    .textContent('Bạn có chắc chắn muốn xóa ứng dụng không?')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function() {
                    vm.removeVersionApp();
                }, function() {
                });
            };

            vm.removeVersionApp = function () {
                var onSuccess = function (response) {
                    if (response.code == "OK") {
                        console.log("Xoa ung dung thanh cong");
                        vm.initDataListApp();
                    } else {
                        console.log("Xoa ung dung that bai");
                        vm.isErrorUpdateStatus = true;
                        vm.isSuccesUpdateStatus = false;
                        vm.messageUpdateStatus = response.message;
                    }
                };

                var onError = function (response) {
                    console.log("Xoa ung dung that bai");
                };
                var versionApp;
                switch (vm.selectedApp.appInfo.osType) {
                    case ApplicationConfig.osType.ANDROID:
                        versionApp = vm.selectedApp.appInfo.versionInfo.versionCode;
                        break;
                    case ApplicationConfig.osType.IOS:
                        versionApp = vm.selectedApp.appInfo.versionInfo.bundleVersion;
                        break;
                    default:
                        break;
                }
                AppServices.removeVersionApp(onSuccess, onError, {appId: vm.selectedApp.appInfo.appId, versionApp: versionApp});
            };

            //Update manage
            vm.initUpdateManage = function () {
                vm.selectedManage = undefined;
                vm.searchTextMana = "";
                vm.listAllUser = [];
                vm.isMsgManageSucss = false;
                vm.isMsgManageError = false;
                vm.msgManage = "";

                vm.closeMsgManage = function () {
                    vm.isMsgManageSucss = false;
                    vm.isMsgManageError = false;
                    vm.msgManage = "";
                };
                vm.querySearchMana = function (searchText) {
                    //Goi ham service tra ve list
                    var listResult = [];
                    for (var i = 0; i < vm.listAllUser.length; i++) {
                        var j = vm.listAllUser[i].id.toUpperCase().search(searchText.toUpperCase());
                        if (j >= 0) {
                            listResult.push({userId: vm.listAllUser[i].id, userName: vm.listAllUser[i].name});
                            continue;
                        }
                        j = vm.listAllUser[i].name.toUpperCase().search(searchText.toUpperCase());
                        if (j >= 0) {
                            listResult.push({userId: vm.listAllUser[i].id, userName: vm.listAllUser[i].name});
                            continue;
                        }
                    }
                    return listResult;
                };
                vm.selectedItemChangeMana = function (item) {
                    console.log("selectedItem " + vm.selectedManage);
                    if (item != undefined) {
                        var itemFilter =  function (obj) {
                            return obj.userId == item.userId;
                        };
                        var itemArr = vm.listCurrentManager.filter(itemFilter);
                        if(itemArr.length == 0 ){
                            vm.listCurrentManager.push({userId: item.userId, userName: item.userName});
                        }
                        vm.searchText = "";
                        vm.selectedManage = "";
                    }
                };
                vm.removeManage = function (item) {
                    var i = vm.listCurrentManager.indexOf(item);
                    if (i >= 0) {
                        vm.listCurrentManager.splice(i, 1);
                    }
                };
                vm.updateListManage = function () {
                    var onSuccess = function (data) {
                        console.log("Call WS update test success.");
                        if (data.code == "OK") {
                            //Thong bao thanh cong, update lai view trang thai status tuong ung
                            vm.selectedApp.listManager = vm.listCurrentManager;
                            vm.isMsgManageSucss = true;
                            vm.msgManage = "Cập nhật tester thành công."
                            vm.isMsgManageError = false;
                        } else {
                            //Thong bao loi tu ws ra ngoai man hinh ung dung
                            vm.isMsgManageSucss = false;
                            vm.msgManage = data.message;
                            vm.isMsgManageError = true;
                        }
                    };
                    var onError = function (data) {
                        console.log("Call WS update Test error.");
                        //Thong bao loi ra man hinh ung dung
                        vm.isMsgManageSucss = false;
                        vm.msgManage = "Cập nhật tester thất bại.";
                        vm.isMsgManageError = true;
                    };
                    var listId = [];
                    if (vm.listCurrentManager.length > 0) {
                        for (var i = 0; i < vm.listCurrentManager.length; i++) {
                            listId.push(vm.listCurrentManager[i].userId)
                        }
                    }

                    var param = {"appId": vm.selectedApp.appInfo.appId, "managers": listId}
                    AppServices.updateListManager(onSuccess, onError, param)
                };
            }
        };

        //Tao ung dung
        vm.initCreateApp = function () {
            $('#iconImage')[0].reset();
            $('#fileApp')[0].reset();
            vm.isCreating = true;
            vm.isListing = false;
            vm.isviewDetails = false;
            vm.step = 1;
            vm.fileApp = {};
            vm.isErrorStep1 = false;
            vm.messageStep1 = "";
            vm.appInfo = {};
            var listImg = [];
            vm.closeMessageStep1 = function () {
                vm.isErrorStep1 = false;
                vm.messageStep1 = "";
            };

            vm.isUploadingFile = false;
            vm.uploadFileApk = function () {
                vm.isUploadingFile = true;
                var onSuccess = function (response) {
                    vm.isUploadingFile = false;
                    console.log("on success. data="+response);
                    if(response.processStatus == "OK"){
                        switch (response.os) {
                            case ApplicationConfig.osType.ANDROID :
                                if(ApplicationConfig.isAppAndroidScope) {
                                    vm.appInfo.packageName = response.packageName;
                                    vm.appInfo.name = response.appName;
                                    vm.appInfo.versionCode = response.versionCode;
                                    vm.appInfo.versionName = response.versionName;
                                    vm.appInfo.osType = response.os;
                                    vm.appInfo.minSdk = response.minSdk;
                                    vm.appInfo.installFileName = response.fileName;
                                    vm.appInfo.targetSdk = response.targetSdk;
                                } else {
                                    vm.isErrorStep1 = true;
                                    vm.messageStep1 = "Upload file ứng dụng thất bại. Bạn chỉ được phép upload file cài đặt của IOS.";
                                    return;
                                }
                                break;
                            case ApplicationConfig.osType.IOS :
                                if(ApplicationConfig.isAppIosScope){
                                    vm.appInfo.bundleId = response.bundleId;
                                    vm.appInfo.name = response.appName;
                                    vm.appInfo.bundleVersion = response.bundleVersion;
                                    vm.appInfo.bundleVersionName = response.bundleVersionName;
                                    vm.appInfo.osType = response.os;
                                    // vm.appInfo.minSdk = response.isIphoneRequire;
                                    // vm.appInfo.minSdk = response.minOsVersion;
                                    // vm.appInfo.targetSdk = response.taggetPlatformVersion;
                                    vm.appInfo.installFileName = response.fileName;
                                } else {
                                    vm.isErrorStep1 = true;
                                    vm.messageStep1 = "Upload file ứng dụng thất bại. Bạn chỉ được phép upload file cài đặt của ANDROID.";
                                    return;
                                }
                                break;
                            default :
                                break;
                        }
                        vm.nextStep();
                    } else {
                        console.log("Thong bao loi");
                        vm.isErrorStep1 = true;
                        vm.messageStep1 = "Upload file ứng dụng thất bại. Vui lòng thử lại.";
                    }
                };
                var onError = function (response) {
                    vm.isUploadingFile = false;
                    console.log("on success. data="+response);
                    vm.isErrorStep1 = true;
                    vm.messageStep1 = "Upload file ứng dụng thất bại. Vui lòng thử lại.";
                };
                UtilsService.uploadInstallFile(vm.fileApp, onSuccess, onError);
            };
            vm.nextStep = function(){
                vm.isErrorStep1 = false;
                vm.messageStep1 = "";
                vm.isErrorIcon = false;
                vm.messageIcon = "";
                vm.step = vm.step + 1;
                vm.slides = [];
                listImg = [];
                vm.listUriImg = [];
                vm.isErrorImage = false;
                vm.messageImage = "";
                // vm.iconApp = {reponseUrl : "assets/img/default_app_icon.png"};
                vm.iconApp = {};
                vm.closeMessageImage = function () {
                    vm.isErrorImage = false;
                    vm.isSuccesImage = false;
                    vm.messageImage = "";
                }
            };
            $scope.uploadIconApp = function (ele) {
                vm.closeMessageIcon = function () {
                    vm.isErrorIcon = false;
                    vm.messageIcon = "";
                };
                if(ele.files.length  == 0){
                    vm.iconApp.reponseUrl = "";
                    return;
                }
                var onSuccess = function(response){
                    console.log("on success. data="+response);
                    if(response != undefined && response!=""){
                        vm.appInfo.iconApp = response.fileName;
                        vm.iconApp.reponseUrl = response.tmpUri;
                    } else {
                        vm.isErrorIcon = true;
                        vm.messageIcon = "Upload icon thất bại. Vui lòng thử lại.";
                    }

                };
                var onError = function(response){
                    console.log("on error. data="+response);
                    //Thong bao loi
                    vm.isErrorIcon = true;
                    vm.messageIcon = "Upload icon thất bại. Vui lòng thử lại.";
                };
                UtilsService.uploadImage(ele.files[0], onSuccess, onError);
            };
            vm.addDemoImg = function(){
                vm.slides.push({
                    img1:"",
                    img2:""
                });
            };
            vm.removeDemoImg = function(slide){
                var i =  vm.slides.indexOf(slide);
                console.log("thu tu" + i);
                vm.slides.splice(i,1);
                loadDemoImg();
            };
            var loadDemoImg = function(){
                listImg = [];
                vm.listUriImg = [];
                if(vm.slides.length <= 0){
                    return;
                }
                for(var i = 0; i < vm.slides.length; i++){
                    if(typeof vm.slides[i].img1 == 'object'){
                        listImg.push(
                            {
                                link: vm.slides[i].img1.responUrl,
                                nameFile: vm.slides[i].img1.responName
                            }
                        );
                        vm.listUriImg.push(vm.slides[i].img1.responUrl);
                    }
                    if(typeof vm.slides[i].img2 == 'object'){
                        listImg.push(
                            {
                                link: vm.slides[i].img2.responUrl,
                                nameFile: vm.slides[i].img2.responName
                            }
                        );
                        vm.listUriImg.push(vm.slides[i].img2.responUrl);
                    }
                }
            };
            $scope.uploadDemoImg = function (ele) {
                var a = this;
                a.ele2 = ele;
                if(ele.files.length  == 0){
                    loadDemoImg();
                    return;
                }
                var onSuccess = function(response){
                    console.log("on success. data="+response);
                    if(response != undefined && response!=""){
                        console.log("Thong bao up thanh cong");
                        a.ele2.files[0].responUrl = response.tmpUri;
                        a.ele2.files[0].responName = response.fileName;
                        loadDemoImg();
                    } else {
                        //Upload that bai can thong bao de uploa lai
                        vm.isErrorImage = true;
                        vm.messageImage = "Upload file thất bại. Vui lòng thử lại.";
                    }

                };
                var onError = function(response){
                    console.log("on success. data="+response);
                    //Thong bao loi
                    vm.isErrorImage = true;
                    vm.messageImage = "Upload file thất bại. Vui lòng thử lại.";
                };
                UtilsService.uploadImage(ele.files[0], onSuccess, onError);
            };
            vm.createApp = function () {
                var onSuccess = function(data){
                    if(data.code == "OK"){
                        console.log("Thanh cong");
                        vm.isSuccesImage = true;
                        vm.isErrorImage = false;
                        vm.messageImage = "Tạo mới ứng dụng thành công.";
                    } else {
                        console.log("That bai: " + data.message);
                        vm.isSuccesImage = false;
                        vm.isErrorImage = true;
                        vm.messageImage = data.message;
                    }
                };

                var onError = function(data){
                    console.log("That bai");
                    vm.isSuccesImage = false;
                    vm.isErrorImage = true;
                    vm.messageImage = "Tạo ứng dụng thất bại. Vui lòng thử lại.";
                };
                vm.appInfo.demoImg = [];
                if(listImg.length > 0){
                    for(var i = 0 ; i < listImg.length; i++){
                            vm.appInfo.demoImg.push(listImg[i].nameFile);
                    }
                }
                AppServices.createAppBasic(onSuccess, onError, vm.appInfo);
            }
        }

    }
})();