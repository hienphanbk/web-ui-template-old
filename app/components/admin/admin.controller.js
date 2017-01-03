/**
 * Created by HienPT9 on 9/13/2016.
 */
(function () {
    'use strict';
    angular.module("app").controller('AdminController', AdminController);

    AdminController.$inject = ['UserServices', 'ApplicationConfig', '$mdDialog', 'HttpService','AdminService','$scope', '$filter'];

    function AdminController(UserServices, ApplicationConfig, $mdDialog, HttpService, AdminService, $scope, $filter) {
        var vm = this;
        console.log("Entering Admin page ...");

        vm.users = [];
        vm.filter;

        /**
         * For create user
         */
        vm.createdUserMsisdn = "";
        vm.createdUserName = "";
        vm.isCreatingUser = false;
        vm.createdUserIsAdmin = false;
        vm.createdUserIsPublisher = false;
        vm.createdUserIsNormal = true;
        vm.createUserSuccess = false;
        vm.createUserErrorMessage = "";
        vm.afterCreateUser = false;

        /**
         * For update user
         */
        vm.isUpdatingUser = false;
        vm.selectedUser = {};
        vm.updateUserIsAdmin = false;
        vm.updateUserIsPublisher = false;
        vm.updateUserIsNormal = true;

        vm.updateUsernameSuccess = false;
        vm.updateRolesSuccess = false;
        vm.updateUserSuccess = false;

        vm.afterUpdatingUsername = false;
        vm.afterUpdatingRoles = false;
        vm.afterUpdatingUser = false;
        vm.updateUserErrorMessage = "";

        /**
         * For manage groups
         */
        vm.groups = [];
        //vm.group = {
        //  id:undefined, name:undefined, desc:undefined
        //};
        vm.loadGroups = function() {
            vm.groups = [];
            var onSuccess = function(data) {
                console.log("on success loading groups. groups size = "+data.length);
                for(var i=0; i< data.length; i++){
                    var group = {};
                    group.id = data[i].id;
                    group.name = data[i].name;
                    group.desc = data[i].desc;
                    vm.groups.push(group);
                }
            };

            var onError = function(data) {
                console.log("onErro when loading groups."+data);
            };

            // Call services to get data
            AdminService.getAllGroups(onSuccess, onError);
        };
        vm.loadGroups();
        vm.removeGroup = function(index) {

            var confirm = $mdDialog.confirm()
                .title('Bạn muốn xóa nhóm "' + vm.groups[index].name + '"?')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                var groupId = vm.groups[index].id;
                var data = {id:groupId};
                var onRemoveGroupSuccess = function(response) {
                    console.log("onRemoveGroupSuccess");
                    if (index > -1) {
                        vm.groups.splice(index, 1);
                    }
                };
                var onRemoveGroupError = function(response) {
                    console.log("onRemoveGroupError");
                };
                AdminService.removeGroup(data, onRemoveGroupSuccess, onRemoveGroupError);
            }, function () {
                console.log("cancel remove group.");
            });
        };

        vm.tmpGroup = {};
        vm.onAddGroupSuccess = function(response) {
            console.log("onAddGroupSuccess");
            vm.groups.push(vm.tmpGroup);
        };
        vm.onAddGroupError = function(response) {
            console.log("onAddGroupError");
        };

        vm.showAddGroupDialog = function(event) {
            console.log("Show add group dialog. "+event);
            $mdDialog.show({
                controller: AddGroupDialogController,
                templateUrl: 'app/components/admin/group/add.group.dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true
            })
                .then(function(answer) {
                    console.log("Answer = "+answer);
                    if (answer.cmd == "ADD") {
                        AdminService.addGroup(answer.data, vm.onAddGroupSuccess, vm.onAddGroupError);
                        vm.tmpGroup = answer.data;
                    }
                }, function() {
                    console.log("Dialog closed.");
                });
        };

        vm.getListUserOfGroup = function(data, onSuccess, onError) {
            AdminService.getUsersOfGroups(data, onSuccess, onError);
        };

        vm.getListGroupOfGroup = function(data, onSuccess, onError) {
            AdminService.getGroupsOfGroups(data, onSuccess, onError);
        };

        //vm.callUpdateGroupService = function(groupData) {
        //    console.log("on callUpdateGroupService.");
        //
        //};

        vm.searchUser = function(data, onSuccess, onError) {
            AdminService.searchUser(data, onSuccess, onError);
        };

        vm.searchGroup = function(data, onSuccess, onError) {
            AdminService.searchGroup(data, onSuccess, onError);
        };

        vm.addUsersToGroup = function(data, onSuccess, onError) {
            AdminService.addUsersToGroup(data, onSuccess, onError);
        };

        vm.addGroupsToGroup = function(data, onSuccess, onError) {
            AdminService.addGroupsToGroup(data, onSuccess, onError);
        };

        vm.removeUsersFromGroup = function(data, onSuccess, onError) {
            AdminService.removeUsersFromGroup(data, onSuccess, onError);
        };

        vm.removeGroupsFromGroup = function(data, onSuccess, onError) {
            AdminService.removeGroupsFromGroup(data, onSuccess, onError);
        };

        vm.updateGroupInfo = function(data, onSuccess, onError) {
            AdminService.updateGroupInfo(data, onSuccess, onError);
        };

        vm.updateGroup = function(index, event) {
            console.log("Open view details of group: "+vm.groups[index].name);
            vm.selectedUserGroup = vm.groups[index];
            $mdDialog.show({
                controller: UpdateGroupDialogController,
                templateUrl: 'app/components/admin/group/update.group.dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                scope:$scope,
                preserveScope:true
            })
                .then(function(answer) {
                    //console.log("Answer = "+answer);
                    //if (answer.cmd == "ADD") {
                    //    AdminService.addGroup(answer.data, vm.onAddGroupSuccess, vm.onAddGroupError);
                    //    vm.tmpGroup = answer.data;
                    //}
                }, function() {
                    console.log("Dialog closed.");
                });
        };

        vm.refreshUpdatingView = function() {
            vm.filter = vm.selectedUser.id;
            vm.afterUpdatingUsername = false;
            vm.afterUpdatingRoles = false;
            vm.afterUpdatingUser = false;
            vm.updateUserErrorMessage = "";
        };

        vm.showUserDetails = function (user, event) {
            console.log("show user detail area.");
            // reset all status of update user
            vm.selectedUser = user;
            vm.refreshUpdatingView();
            // end reset

            vm.isUpdatingUser = true;
            vm.updateUserIsAdmin = (user.roles.indexOf("ADMIN")>=0);
            vm.updateUserIsPublisher = (user.roles.indexOf("PUBLISHER")>=0);
            vm.updateUserIsNormal = (user.roles.indexOf("NORMAL")>=0);
        };

        vm.closeUpdateUserArea = function(){
            vm.selectedUser = {};
            vm.isUpdatingUser = false;
            vm.refreshUpdatingView();
            vm.filter = "";
        };

        function updateUserName(id, name) {
            // Call service to update user name
            var url = ApplicationConfig.serviceUrls.user.updateName;
            var onSuccess = function(data){
                console.log("Call update user name service success.");
                // todo: update ui
                if (data == "true"){
                    vm.updateUsernameSuccess = true;
                    (vm.users[vm.users.indexOf(vm.selectedUser)]).name = name;
                } else {
                    vm.updateUsernameSuccess = false;
                }
                vm.afterUpdatingUsername = true;
                vm.afterUpdatingUser = vm.afterUpdatingUsername && vm.afterUpdatingRoles;
                vm.updateUserSuccess = vm.updateUsernameSuccess && vm.updateRolesSuccess;
            };

            var onError = function(data) {
                console.log("Call update user name service failure.");
                // todo: update ui
                vm.updateUsernameSuccess = false;
                vm.updateUserSuccess = vm.updateUsernameSuccess && vm.updateRolesSuccess;

                vm.afterUpdatingUsername = true;
                vm.afterUpdatingUser = vm.afterUpdatingUsername && vm.afterUpdatingRoles;
            };

            var data = {
                //{"msisdn":"841646078688","name":"Phan Thanh Hi?n"}
                "msisdn":id,
                "name":name
            };
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        }

        function updateUserRoles(id, roles) {
            // Call service to update user roles
            var url = ApplicationConfig.serviceUrls.user.updateRoles;
            var onSuccess = function(data){
                console.log("Call update user roles service success.");
                // todo: update ui
                if (data == "true"){
                    vm.updateRolesSuccess = true;
                    (vm.users[vm.users.indexOf(vm.selectedUser)]).roles = roles;
                } else {
                    vm.updateRolesSuccess = false;
                }

                vm.afterUpdatingRoles = true;
                vm.afterUpdatingUser = vm.afterUpdatingUsername && vm.afterUpdatingRoles;
                vm.updateUserSuccess = vm.updateUsernameSuccess && vm.updateRolesSuccess;
            };

            var onError = function(data) {
                console.log("Call update user roles service failure.");
                // todo: update ui
                vm.updateRolesSuccess = false;
                vm.updateUserSuccess = vm.updateUsernameSuccess && vm.updateRolesSuccess;

                vm.afterUpdatingRoles = true;
                vm.afterUpdatingUser = vm.afterUpdatingUsername && vm.afterUpdatingRoles;
            };

            var data = {
                //{"msisdn":"841646078688","name":"Phan Thanh Hi?n"}
                "msisdn":id,
                "roles":roles
            };
            HttpService.callServiceWithSessionHeader(url, data, onSuccess, onError);
        }

        vm.updateUser = function(){
            // update name
            updateUserName(vm.selectedUser.id, vm.selectedUser.name);

            // update roles
            var roles = [];
            if (vm.updateUserIsAdmin) {
                roles.push(ApplicationConfig.roles.ADMIN);
            }
            if (vm.updateUserIsPublisher) {
                roles.push(ApplicationConfig.roles.PUBLISHER);
            }
            if (vm.updateUserIsNormal) {
                roles.push(ApplicationConfig.roles.NORMAL);
            }
            updateUserRoles(vm.selectedUser.id, roles);
        };


        vm.showCreateUserArea = function () {
            vm.isCreatingUser = true;
            vm.isUpdatingUser = false;
        };

        vm.closeCreateUserArea = function () {
            vm.isCreatingUser = false;
            vm.afterCreateUser = false;
        };


        vm.checkValidUserData = function (msisdn, name, roles) {
            var notNullValue = function(input) {
                if (input != null && input != undefined && input != "") {
                    return true;
                } else {
                    return false;
                }
            }

            var notEmptyArray = function(input){
                if (input.length >= 1) {
                    return true;
                } else {
                    return false;
                }
            }

            if (notNullValue(msisdn) && notNullValue(name) && notEmptyArray(roles)) {
                return true;
            } else {
                return false;
            }
        };
        vm.createUser = function () {
            console.log("Trying to create user.");
            vm.afterCreateUser = false;
            var msisdn = vm.createdUserMsisdn;
            var name = vm.createdUserName;
            var roles = [];
            if (vm.createdUserIsAdmin) {
                roles.push(ApplicationConfig.roles.ADMIN);
            }
            if (vm.createdUserIsPublisher) {
                roles.push(ApplicationConfig.roles.PUBLISHER);
            }
            if (vm.createdUserIsNormal) {
                roles.push(ApplicationConfig.roles.NORMAL);
            }

            var roleString = "";

            for (var i = 0; i < roles.length; i++) {
                if (i == (roles.length - 1)) {
                    roleString = roleString + roles[i];
                } else {
                    roleString = roleString + roles[i] + ",";
                }
            }

            var isValidUserData = vm.checkValidUserData(msisdn, name, roles);

            if (isValidUserData) {
                var onCreateUserSuccess = function(data){
                    console.log("onCreateUserSuccess, data="+data);
                    if (data == "true") {
                        vm.createUserSuccess = true;
                        vm.users.push({"id":msisdn, "name":name, "roles":roles, "active":true});
                    } else {
                        vm.createUserErrorMessage="server errors.";
                        vm.createUserSuccess = false;
                    }
                    vm.afterCreateUser = true;
                };

                var onCreateUserFailure = function(data){
                    console.log("onCreateUserFailure, data="+data);
                    vm.createUserErrorMessage="server errors.";
                    vm.createUserSuccess = false;
                    vm.afterCreateUser = true;
                };
                // call services
                var url = ApplicationConfig.serviceUrls.user.create;
                HttpService.callServiceWithSessionHeader(url, {"msisdn":msisdn, "name":name,"roles":roleString}, onCreateUserSuccess, onCreateUserFailure);
            } else {
                vm.createUserErrorMessage="invalid user data.";
                vm.afterCreateUser = true;
            }
        };

        vm.changeUserStatus = function (user, event) {
            var actionName;
            var currentActive = user.active;
            console.log("user before: " + vm.users[vm.users.indexOf(user)].active);

            console.log("user is active = " + currentActive);
            if (currentActive) {
                actionName = "in-active";
            } else {
                actionName = "active";
            }
            var confirm = $mdDialog.confirm()
                .title('Are you sure to ' + actionName + ' user ' + user.name)
                //.textContent('Record will be deleted permanently.')
                //.ariaLabel('change user status')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                vm.users[vm.users.indexOf(user)].active = !currentActive;
                console.log("user after: " + vm.users[vm.users.indexOf(user)].active);
                // Call inactive/active user
                var url = ApplicationConfig.serviceUrls.user.updateStatus;
                var onChangeStatusSuccess = function (data) {
                    console.log("onChangeStatusSuccess. data=" + data);
                    if (data == "false") {
                        console.log("update status failure.");
                        vm.users[vm.users.indexOf(user)].active = currentActive;
                    } else {
                        console.log("update status ok.");
                    }
                };

                var onChangeStatusError = function (data) {
                    console.log("onChangeStatusError. data=" + data);
                    vm.users[vm.users.indexOf(user)].active = currentActive;
                };

                HttpService.callServiceWithSessionHeader(url, {
                    "msisdn": user.id,
                    "active": user.active
                }, onChangeStatusSuccess, onChangeStatusError);
            }, function () {
                vm.users[vm.users.indexOf(user)].active = currentActive;
                console.log("user after: " + vm.users[vm.users.indexOf(user)].active);
            });
        };

        //vm.users = [{"active":true,"errorsReported":[],"id":"841646078688","name":"Phan Thanh Hi?n","ownedApps":[],"ownedDevices":[],"ownedReviews":[],"roles":["ADMIN","PUBLISHER","NORMAL"]},{"active":true,"errorsReported":[],"id":"841659835452","name":"Unknow name","ownedApps":[],"ownedDevices":[],"ownedReviews":[],"roles":["NORMAL"]}];

        // Goi service de lay du lieu
        var onGetListUserSuccess = function (data) {
            console.log("users: " + data);
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    vm.users.push(data[i]);
                }
            }
        };

        var onGetListUserError = function (data) {
            console.log("Error when trying to get users from server.");
            //$state.go(ApplicationConfig.states.LOGIN);
        };

        UserServices.getListUser(onGetListUserSuccess, onGetListUserError);
    }
})();
