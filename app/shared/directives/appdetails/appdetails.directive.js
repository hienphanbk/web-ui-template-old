(function () {
    'use strict';
    angular.module('app').directive('appDetailsView', ['ApplicationConfig','UtilsService', 'AppServices', 'ReviewServices', 'Cookies', function (ApplicationConfig, UtilsService, AppServices, ReviewServices, Cookies) {
        var returnData = {
            restrict: 'A',
            scope: {
                app:'=data',
                'onDownloadClick':'&onDownloadClick',
                'onUsernameClick':'&onUsernameClick',
                'onImageClick':'&onImageClick'
            },
            templateUrl: 'app/shared/directives/appdetails/appdetails.template.html',
            link: function(scope){
                scope.closeMessageDetail = function () {
                    scope.messageDetail = "";
                    scope.isErrorDetail = false;
                };
                if (scope.app) {
                    scope.closeMessageDetail();
                    console.log("Initial app details.");

                    scope.myReview = {};
                    scope.oldRating ;
                    scope.images = [];
                    scope.isReviewed = true;

                    scope.onUsername = function(){
                        scope.onUsernameClick();
                    };
                    scope.onDownload = function(){
                        //scope.onDownloadClick();
                        console.log("Trying to download file from server.");
                        scope.isDownloading = true;
                        var fileName = scope.app.versionInfo.installFileName;
                        console.log("fileName = "+fileName);
                        if (fileName == undefined || fileName == "" || fileName == null) {
                            console.log("File name không hợp lệ.");
                        } else {
                            var onSuccess = function(response) {
                                console.log("onSuccess download file from server.");
                                scope.isDownloading = false;
                            };

                            var onError = function(response) {
                                console.log("onError when trying to download file from server.");
                                scope.isDownloading = false;
                            };
                            UtilsService.downloadInstallFile(fileName, onSuccess, onError);
                        }
                    };
                    scope.onImage = function(){
                        scope.onImageClick();
                    };

                    var calAvgRating = function() {
                        scope.avgRating = 0;
                        if (scope.app.totalReview > 0) {
                            scope.avgRating = Math.round((scope.app.totalRating/scope.app.totalReview) * 100)/100;
                            console.log(scope.avgRating);
                        }
                    };

                    /**
                     * Load icon image
                     */
                    var loadImage = function(){
                        scope.iconUri = "assets/img/loading.gif";
                        var fileName = scope.app.iconApp;
                        if (fileName == undefined || fileName == "") {
                            scope.iconUri = "assets/img/default_app_icon.png";
                        } else {
                            var onSuccess = function(response) {
                                console.log("onSuccess load icon image.");
                                scope.iconUri = response;
                            };
                            var onError = function(response) {
                                console.log("onError load image. default icon will be used.");
                                scope.iconUri = "assets/img/default_app_icon.png";
                            };
                            UtilsService.downloadImage(fileName, onSuccess, onError);
                        }
                    };

                    var loadScreenShotImages = function() {
                        if (scope.appDetails) {
                            scope.images = [];
                            var screenShortFilenames = scope.appDetails.demoImgs;
                            for (var i=0; i<screenShortFilenames.length; i++) {
                                var fileName = screenShortFilenames[i];
                                if (fileName == undefined || fileName == "") {
                                    console.log("Screen shot file name invalid -> do nothing.")
                                } else {
                                    var onSuccess = function(response) {
                                        console.log("onSuccess load screen shot image: "+response);
                                        var url = response;
                                        scope.images.push(url);
                                    };
                                    var onError = function(response) {
                                        console.log("onError when load screen shot image.");
                                    };
                                    UtilsService.downloadImage(fileName, onSuccess, onError);
                                }
                            }
                        }
                    };

                    /**
                     * Lấy thông tin chi tiết ve ứng dụng
                     */
                    var loadAppDetails = function() {
                        if (scope.app.appId) {
                            var onSuccess = function(response) {
                                if (response.code=="OK") {
                                    console.log("onSuccess when load app details.");
                                    scope.appDetails = response.applicationModel;
                                    scope.appReviews = response.reviewsModel;
                                    scope.isReviewed = response.reviewed;
                                    loadScreenShotImages();
                                    buildReviewPanel();
                                } else {
                                    console.log("Error when load app details.");
                                    //Lam sao de khong hien thi chi tiet bao ve data nhi
                                        scope.messageDetail = response.message;
                                        scope.isErrorDetail = true;
                                }
                            };

                            var onError = function(response) {
                                console.log("onError when load app details.");
                                //Lam sao de khong hien thi chi tiet bao ve data nhi
                                scope.messageDetail = response.message;
                                scope.isErrorDetail = true;
                            };
                            AppServices.getAppById(onSuccess, onError, scope.app);
                        }
                    };

                    var buildReviewPanel = function(){
                        if(scope.isReviewed){
                            scope.myReview = scope.appReviews[0];
                            scope.oldRating = scope.myReview.rating;
                            scope.appReviews.splice(0,1);
                        } else {
                            scope.myReview = {};
                            scope.myReview.rating = 3;
                            scope.myReview.content = undefined;
                            scope.oldRating = 0;
                        }
                    };

                    var buildDownloadButton = function(){
                        if (scope.app.osType=="I-OS") {
                            scope.isShowIosDownload = true;
                            scope.manifestUrl="itms-services://?action=download-manifest&amp;url="+encodeURI(ApplicationConfig.serviceUrls.utils.getManifest+"?name="+scope.app.versionInfo.installFileName);
                        } else {
                            scope.isShowIosDownload = false;
                        }
                    };

                    scope.$watch("app",function(newValue,oldValue) {
                        console.log("Refresh data.");
                        calAvgRating();
                        loadImage();
                        loadAppDetails();
                        buildReviewPanel();
                        buildDownloadButton();
                    });

                    scope.closeMsg = function () {
                        scope.isMsg = false;
                        scope.message = "";
                        scope.isMsgSucc = false;
                    };

                    scope.addReview = function () {
                        scope.closeMsg();
                        var onSuccess = function (response) {
                            if(response.code == "OK"){
                                console.log("Thành công");
                                scope.app.totalReview = scope.app.totalReview + 1;
                                scope.app.totalRating = scope.app.totalRating + scope.reviewAdd.rating;
                                calAvgRating();
                                scope.isReviewed = true;
                                scope.myReview.reviewId = scope.reviewAdd.appId+"-"+Cookies.get(ApplicationConfig.currentUserIdKey)+"-"+scope.reviewAdd.versionApp;
                                scope.message = "Thêm mới thành công.";
                                scope.isMsgSucc = true;
                                scope.isMsg = false;
                                scope.oldRating = scope.myReview.rating;
                            } else {
                                console.log("Ws trả v�? không thành công.");
                                scope.isMsg = true;
                                scope.isMsgSucc = false;
                                scope.message = response.message;
                            }
                        };
                        var onError = function (response) {
                            console.log("Goi Ws that bai. Chi tiết " + response);
                            scope.isMsg = true;
                            scope.isMsgSucc = false;
                            scope.message = "G�?i Ws thất bại.";                            scope.isMsgSucc = false;

                        };
                        var versionApp ;
                        switch (scope.app.osType) {
                            case ApplicationConfig.osType.ANDROID:
                                versionApp = scope.app.versionInfo.versionCode;
                                break;
                            case ApplicationConfig.osType.IOS:
                                versionApp = scope.app.versionInfo.bundleVersion;
                                break;
                            default:
                                break;
                        }
                        scope.reviewAdd = {
                            appId: scope.app.appId,
                            rating: scope.myReview.rating,
                            content: scope.myReview.content,
                            versionApp: versionApp
                        };

                        ReviewServices.addNewReview(onSuccess, onError, scope.reviewAdd);

                    };

                    scope.updateReview = function () {
                        var onSuccess = function (respon) {
                            if(respon.code == "OK"){
                                scope.message = "Cập nhật thành công.";
                                scope.isMsgSucc = true;
                                scope.isMsg = false;
                                scope.app.totalRating = scope.app.totalRating - scope.oldRating + scope.myReview.rating;
                                calAvgRating();
                                scope.oldRating = scope.myReview.rating;
                            } else {
                                scope.isMsg = true;
                                scope.isMsgSucc = false;
                                scope.message = respon.message;
                            }
                        };
                        var onError = function (respon) {
                            scope.isMsg = true;
                            scope.isMsgSucc = false;
                            scope.message = "G�?i Ws thất bại.";
                        };
                        scope.reviewUpdate = {
                            reviewId: scope.myReview.reviewId,
                            rating: scope.myReview.rating,
                            content: scope.myReview.content
                        };
                        ReviewServices.updateReview(onSuccess, onError, scope.reviewUpdate);

                    };

                    scope.removeReview = function () {
                        var onSuccess = function (respon) {
                            if(respon.code == "OK"){
                                scope.app.totalReview = scope.app.totalReview - 1;
                                scope.app.totalRating = scope.app.totalRating - scope.myReview.rating;
                                calAvgRating();
                                scope.isReviewed = false;
                                buildReviewPanel();
                                scope.message = "Xóa thành công.";
                                scope.isMsgSucc = true;
                                scope.isMsg = false;
                            } else {
                                scope.isMsgSucc = false;
                                scope.isMsg = true;
                                scope.message = respon.message;
                            }
                        };
                        var onError = function (respon) {
                            scope.isMsgSucc = false;
                            scope.isMsg = true;
                            scope.message = "G�?i Ws thất bại.";
                        };

                        scope.removeReviewUpdate = {
                            reviewId: scope.myReview.reviewId
                        };
                        ReviewServices.removeReview(onSuccess, onError, scope.removeReviewUpdate);
                    };
                }  else {
                    scope.messageDetail = "Không lấy được thông tin app";
                    scope.isErrorDetail = true;
                }
            }
        };

        return returnData;
    }]);
})();