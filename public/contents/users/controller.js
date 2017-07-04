mainApp.controller("usersCtrl", function ($scope, $http, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

    s.listUser = [];
    s.listRole = [];

    s.showUserDialog = (ev, transaction) => {
        s.newHeader = transaction === 'add' ? "Add User" : "Edit User";
        return dialogSvc.showDialog("userDialogCtrl", s, "contents/users/user-dialog.html", true, "parent", ev)
            .then((res) => {
                return res;
            });
    };

    s.addUser = (ev) => {
        s.showUserDialog(ev, "add")
            .then((res) => {
                if (res) {
                    s.listUser.push(res);
                }
            })
    }

    s.editUser = (ev, item, itemIdx) => {
        s.selectedUser = item;
        s.showUserDialog(ev, "edit")
            .then((res) => {
                if (res) {
                    s.listUser[itemIdx] = res;
                }
            });
    }

    s.deleteUser = (ev, item, itemIdx) => {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete user: " + item.Username, "Yes", "No", false, "parent", ev).then((res) => {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/user/delete",
                    params: {
                        id: item["_id"]
                    }
                }).then((res) => {
                    if (res.data.success) {
                        s.listUser.splice(itemIdx, 1);
                        dialogSvc.showAlert("Information", "Successfully deleted.", "Ok", true, "parent", ev);
                    } else {
                        console.log(res);
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        });
    }

    s.getRoleDesc = (user) => {
        var role = s.listRole.find(obj => obj["_id"] == user.RoleId);
        return role ? role.Name : "";
    }

    s.getAllUsers = () => {
        $http({
            method: "GET",
            url: "/api/user/getAll"
        }).then(function (res) {
            if (res.status === 200) {
                s.listUser = res.data;
            } else {
                console.log(res);
            }
        }, function (err) {
            console.log(err);
        });
    }

    s.getAllRoles = () => {
        $http({
            method: "GET",
            url: "/api/role/getAll"
        }).then(function (res) {
            if (res.status === 200) {
                s.listRole = res.data;
            } else {
                console.log(res);
            }
        }, function (err) {
            console.log(err);
        });
    }

    var init = () => {
        s.getAllRoles();
        s.getAllUsers();
    }


    init();
});