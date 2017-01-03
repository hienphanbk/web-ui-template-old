
/**
 * Created by HienPT9 on 9/13/2016.
 */
(function () {
    'use strict';
    angular.module('app').controller('ReportController', ReportController);

    ReportController.$inject = ['ReportService', '$location', 'ApplicationConfig'];

    function ReportController(ReportService, $location, ApplicationConfig) {
        var vm = this;

        /**
         * Ham dong bo trang thai android/ios context
         */
        vm.isAppAndroid =  ApplicationConfig.isAppAndroidScope;
        vm.isAppIos = ApplicationConfig.isAppIosScope;


        /**
         * Ham load du lieu tu server ve lan dau
         */
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
        vm.dataLoaded = false;

        /**
         * cac doi tuong du lieu phuc vu hien thi
         */
        // 1. Bieu do ti le loi
        vm.pieChart = {};
        vm.pieChart.type = "PieChart";

        // 2. Bieu do tong so loi theo he thong
        vm.barChart = {};
        vm.barChart.type="ColumnChart";

        // Du lieu cho pie chart
        vm.errorsPerStatus = [
            {status: undefined,
            number: undefined}
        ];

        vm.putDataToPieChart = function(listData){
            // PIE CHART DATA
            vm.pieChart.data = {"cols": [
                {id: "t", label: "Status", type: "string"},
                {id: "s", label: "Total", type: "number"}
            ], "rows": []};

            vm.pieChart.data.rows = [];
            for (var i=0; i<listData.length; i++){
                var tmpItem = listData[i];
                vm.pieChart.data.rows.push(
                    {c: [
                        {v: tmpItem.status},
                        {v: tmpItem.number}
                    ]}
                );
            }
            console.log("Data pushed to Pie chart. rows="+vm.pieChart.data.rows);
        };

        vm.loadPieChartData = function(errorGroups){
            vm.barChart.data= {"cols": [
                {id: "t", label: "Applications", type: "string"},
                {id: "s", label: "Errors", type: "number"}
            ], "rows": []};

            vm.errorsPerStatus = [];
            var statuses = [];

            for (var i=0; i<errorGroups.length; i++) {
                var errorGroup = errorGroups[i];

                // Neu type da ton tai --> tang so loi
                var index = statuses.indexOf(errorGroup.status);
                if (index >= 0) {
                    vm.errorsPerStatus[index].number = vm.errorsPerStatus[index].number + errorGroup.quantity;
                }
                // Neu type chua ton tai --> tao type, tang so loi
                else {
                    var newData = {
                        status:errorGroup.status,
                        number:errorGroup.quantity
                    };
                    statuses.push(errorGroup.status);
                    vm.errorsPerStatus.push(newData);
                }
            }

            console.log("Pie Chart data calculated. data="+vm.errorsPerStatus);
            // put to chart
            vm.putDataToPieChart(vm.errorsPerStatus);
        };

        // Du lieu cho bar chart
        vm.errorsPerApp = [
            {
                appId: undefined,
                number: undefined
            }
        ];

        vm.putDataToBarChart = function (listData) {
            vm.barChart.data.rows = [];
            for (var i=0; i<listData.length; i++){
                var tmpItem = listData[i];
                vm.barChart.data.rows.push(
                    {c: [
                        {v: tmpItem.appId},
                        {v: tmpItem.number}
                    ]}
                );
            }
            console.log("Data pushed to Pie chart. rows="+vm.pieChart.data.rows);
        };

        vm.loadBarChartData = function(errorGroups){
            vm.errorsPerApp = [];
            var appIds = [];

            for (var i=0; i<errorGroups.length; i++) {
                var errorGroup = errorGroups[i];

                // Neu appId da ton tai --> cong them so loi
                var index = appIds.indexOf(errorGroup.appId);
                if (index >=0) {
                    vm.errorsPerApp[index].number = vm.errorsPerApp[index].number + errorGroup.quantity;
                }
                // Neu appId chua ton tai --> tao moi va add vao
                else {
                    var newData = {
                        appId: errorGroup.appId,
                        number: errorGroup.quantity
                    }
                    appIds.push(errorGroup.appId);
                    vm.errorsPerApp.push(newData);
                }
            }

            console.log("Bar Chart data calculated. data="+vm.errorsPerApp);
            // put to chart
            vm.putDataToBarChart(vm.errorsPerApp);
        };

        vm.initData = function() {
            console.log("init data for reports...");
            // 1. Get all error group
            var onSuccess = function(response){
                console.log("Init data ok.");
                vm.dataLoaded = true;
                vm.listErrorGroups = response;
                vm.loadPieChartData(response);
                vm.loadBarChartData(response);
            };
            var onError = function(response){
                console.log("Init data error. response ="+response);
            };

            if (vm.isAppAndroid) {
                ReportService.getAllAndroidErrorGroups(onSuccess, onError);
            } else if (vm.isAppIos) {
                ReportService.getAllIosErrorGroups(onSuccess, onError);
            } else {
                console.log("Unknown mobile application context.");
            }
        };
        vm.updateAppView = function () {
            vm.isAppAndroid =  ApplicationConfig.isAppAndroidScope;
            vm.isAppIos = ApplicationConfig.isAppIosScope;
            vm.initData();
        };
        ApplicationConfig.registerObserverCallback(vm.updateAppView);
        vm.updateAppView();
        //vm.initData();

        vm.isShowDetailErrorGroup = false;
        vm.errorGroupSelected = {};
        vm.showErrors = function(errorGroup) {
            var index = vm.listErrorGroups.indexOf(errorGroup);
            vm.errorGroupSelected = vm.listErrorGroups[index];
            vm.isShowDetailErrorGroup = true;
            vm.isAfterUpdateStatus = false;

            var onSuccess = function(response) {
                vm.listErrorGroups[index].errors = response;
                vm.errorGroupSelected.errors = response;
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
            if (vm.isAppAndroid) {
                ReportService.getAndroidErrorsOfSelectedGroup(input, onSuccess, onError);
            } else if (vm.isAppIos) {
                ReportService.getIosErrorsOfSelectedGroup(input, onSuccess, onError);
            } else {
                console.log("Un-expected mobile application context.");
            }
        };

        vm.isShowDashboard = true;
        vm.showDashboard = function() {
            vm.isShowDashboard = !vm.isShowDashboard;
        };

        vm.showErrorsOfGroup = function() {
            vm.isShowDetailErrorGroup = false;
            $location.path("/authenticated/reports");
        };

        vm.isUpdateStatusSucess = false;
        vm.isAfterUpdateStatus = false;
        vm.changeStatus = function(error,newStatus) {

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
                    vm.isUpdateStatusSucess = true;
                    vm.isAfterUpdateStatus = true;
                } else {
                    vm.isUpdateStatusSucess = false;
                    vm.isAfterUpdateStatus = true;
                }
            };
            var onError = function(response) {
                console.log("onError changeStatus. "+response);
                vm.isUpdateStatusSucess = false;
            };
            ReportService.updateErrorStatus(input, onSuccess, onError);
        }
    }
})();