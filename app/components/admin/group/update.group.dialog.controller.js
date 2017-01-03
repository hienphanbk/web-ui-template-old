function UpdateGroupDialogController($scope, $mdDialog) {
    $scope.group = $scope.vm.selectedUserGroup;
    $scope.usersOfGroup = [];

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(data) {
        $mdDialog.hide(data);
    };

    $scope.updateGroup = function(group) {

        var data = {
            id:group.id,
            name:group.name,
            desc:group.desc
        };
        var onUpdateGroupInfoSuccess = function(response) {
            console.log("onUpdateGroupInfoSuccess response = "+response);
        };
        var onUpdateGroupInfoError = function(response) {
            console.log("onUpdateGroupInfoError error. "+response);
        };

        //$scope.vm.searchUser(data, onUpdateGroupInfoSuccess, onUpdateGroupInfoError);

        $scope.vm.updateGroupInfo(data,onUpdateGroupInfoSuccess, onUpdateGroupInfoError);
    };


    /**
     * get list users of groups
     */

    $scope.onGetListUserSuccess = function(response) {
        console.log("onGetListUserSuccess. users size:"+response.length);
        $scope.usersOfGroup = response;
    };

    $scope.onGetListUserError = function(response) {
        console.log("onGetListUserError");
    };

    $scope.getListUser = function(){
        var id = $scope.group.id;
        var data = {
            groupIds:[id]
        };
        $scope.vm.getListUserOfGroup(data, $scope.onGetListUserSuccess, $scope.onGetListUserError);
    };

    $scope.getListUser();


    /**
     * Get list group of groups
     */
    $scope.groupOfGroup = [];
    $scope.onGetListGroupSuccess = function(response) {
        console.log("onGetListGroupSuccess. group size:"+response.length);
        $scope.groupOfGroup = response;
    };

    $scope.onGetListGroupError = function(response) {
        console.log("onGetListUserError");
    };
    $scope.getListGroup = function() {
        var id = $scope.group.id;
        var data = {
            groupIds:[id]
        };
        $scope.vm.getListGroupOfGroup(data, $scope.onGetListGroupSuccess, $scope.onGetListGroupError);
    };
    $scope.getListGroup();


    /**
     * Add user to group
     */
    $scope.listUsersNeedToAdd = [];
    $scope.listUsersNeedToRemove = [];
    //$scope.selectedUser = null;
    $scope.userSearchText="";
    $scope.usersReturn = [
    ];

    $scope.userSearchTextChange = function(userSearchText) {
        console.log("userSearchTextChange to "+userSearchText);
        if (userSearchText.length == 2) {
            var data = {searchText:userSearchText};
            var onSearchUserSuccess = function(response) {
                console.log("onSearchUserSuccess response = "+response);
                $scope.usersReturn = response.users;
            };
            var onSearchUserError = function(response) {
                console.log("onSearchUserSuccess error. "+response);
            };

            $scope.vm.searchUser(data, onSearchUserSuccess, onSearchUserError);
        }
    };

    $scope.queryUsers = function(userSearchText) {
        var listUsers = [];
        var isNotBelongsToThisGroup = function(user) {
            for (var index=0; index<$scope.usersOfGroup.length; index++) {
                var tmpUser = $scope.usersOfGroup[index];
                if (tmpUser.id == user.id) return false;
            }
            return true;
        };

        for (var i= 0; i<$scope.usersReturn.length; i++) {
            var tmpUser = $scope.usersReturn[i];
            if (
                (tmpUser.id && (tmpUser.id.indexOf(userSearchText) >= 0))
                || (tmpUser.name && (tmpUser.name.indexOf(userSearchText) >=0))
                || (tmpUser.email && (tmpUser.email.indexOf(userSearchText)>=0))
            ) {
                if (isNotBelongsToThisGroup(tmpUser)) {
                    listUsers.push(tmpUser);
                }
            }
        }
        return listUsers;
    };

    $scope.selectedUserChange = function(user) {
        if (user) {
            console.log("selectedUserChange to "+user.name);
            // TODO: add user
            //$scope.usersOfGroup.push(user);
            //$scope.listUsersNeedToAdd.push(user);
            var onSuccess = function(resp) {
                // TODO: Kiểm tra xem có thực sự thành công
                console.log("add user to group success.");
                $scope.usersOfGroup.push(user);
            };
            var onError = function(resp) {
                console.log("add user to group error.");
            };
            var data = {
                groupId:$scope.group.id,
                userIds:[user.id]
            };

            $scope.vm.addUsersToGroup(data, onSuccess, onError);

        }
    };

    /**
     * Remove user from group
     */
    $scope.removeUser = function(user) {
        var onSuccess = function(resp) {
            // TODO: Kiểm tra xem có thực sự thành công
            console.log("remove user from group success.");
            for (var i=0; i<$scope.usersOfGroup.length; i++){
                var tmpUser = $scope.usersOfGroup[i];
                if (tmpUser.id == user.id) {
                    $scope.usersOfGroup.splice(i, 1);
                }
            }
        };
        var onError = function(resp) {
            console.log("remove user from group error.");
        };
        var data = {
            groupId:$scope.group.id,
            userIds:[user.id]
        };
        $scope.vm.removeUsersFromGroup(data, onSuccess, onError);
    };

    /**
     * Remove group from group
     */
    $scope.removeGroup = function(group) {
        var onSuccess = function(resp) {
            // TODO: Kiểm tra xem có thực sự thành công
            console.log("remove group from group success.");
            for (var i=0; i<$scope.groupOfGroup.length; i++){
                var tmpGroup = $scope.groupOfGroup[i];
                if (tmpGroup.id == group.id) {
                    $scope.groupOfGroup.splice(i, 1);
                }
            }
        };
        var onError = function(resp) {
            console.log("remove group from group error.");
        };
        var data = {
            groupId:$scope.group.id,
            childGroupIds:[group.id]
        };
        $scope.vm.removeGroupsFromGroup(data, onSuccess, onError);
    };

    /**
     * Add group to group
     */
    $scope.groupsReturn =[];
    $scope.listGroupsNeedToAdd = [];
    $scope.groupSearchText ="";

    $scope.groupSearchTextChange = function(groupSearchText) {
        console.log("groupSearchTextChange to "+groupSearchText);
        if (groupSearchText.length == 2) {
            var data = {searchText:groupSearchText};
            var onSearchGroupSuccess = function(response) {
                console.log("onSearchGroupSuccess. groups size = "+response.groups.length);
                $scope.groupsReturn = response.groups;
            };
            var onSearchGroupError = function(response) {
                console.log("onSearchGroupError error. "+response);
            };

            $scope.vm.searchGroup(data, onSearchGroupSuccess, onSearchGroupError);
        }
    };

    $scope.queryGroups = function(groupSearchText) {
        var listGroups = [];
        var isNotBelongsToThisGroup = function(group) {
            for (var index=0; index<$scope.usersOfGroup.length; index++) {
                var tmpGroup = $scope.usersOfGroup[index];
                if (tmpGroup.id == group.id) return false;
            }
            return true;
        };

        for (var i= 0; i<$scope.groupsReturn.length; i++) {
            var tmpGroup = $scope.groupsReturn[i];
            if ((tmpGroup.id && (tmpGroup.id.indexOf(groupSearchText) >= 0))
                || (tmpGroup.name && (tmpGroup.name.indexOf(groupSearchText) >=0))) {
                if (isNotBelongsToThisGroup(tmpGroup)) {
                    listGroups.push(tmpGroup);
                }
            }
        }
        return listGroups;
    };

    $scope.selectedGroupChange = function(group) {
        if (group) {
            console.log("selectedGroupChange to "+group.name);
            var onSuccess = function(resp) {
                // TODO: Kiểm tra xem có thực sự thành công
                console.log("add user to group success.");
                $scope.groupOfGroup.push(group);
            };
            var onError = function(resp) {
                console.log("add user to group error.");
            };
            var data = {
                groupId:$scope.group.id,
                childGroupIds:[group.id]
            };

            $scope.vm.addGroupsToGroup(data, onSuccess, onError);

            //$scope.listGroupsNeedToAdd.push(group);
        }
    };
}

