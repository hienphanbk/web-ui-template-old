function AddGroupDialogController($scope, $mdDialog) {
    $scope.userGroup = {
        id:undefined,
        name:undefined,
        desc:null
    };

    $scope.addUserGroup = function() {
        console.log("request to add user group "+$scope.userGroup);
        var response = {
            cmd:"ADD",
            data:$scope.userGroup
        };
        $scope.answer(response);
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(data) {
        $mdDialog.hide(data);
    };
}

