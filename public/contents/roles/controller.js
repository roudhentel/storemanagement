mainApp.controller("rolesCtrl", function ($scope, $http, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

    s.listRole = [];

    s.showRoleDialog = (ev, transaction) => {
        s.newHeader = transaction === 'add' ? "Add Role" : "Edit Role";
        return dialogSvc.showDialog("roleDialogCtrl", s, "contents/roles/role-dialog.html", true, "parent", ev)
            .then((res) => {
                return res;
            });
    };

    s.addRole = (ev) => {
        s.showRoleDialog(ev, "add")
            .then((res) => {
                if (res) {
                    s.listRole.push(res);
                }
            })
    }

    s.editRole = (ev, item, itemIdx) => {
        s.selectedRole = item;
        s.showRoleDialog(ev, "edit")
            .then((res) => {
                if (res) {
                    s.listRole[itemIdx] = res;
                }
            });
    }

    s.deleteRole = (ev, item, itemIdx) => {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete role: " + item.Name, "Yes", "No", false, "parent", ev).then((res) => {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/role/delete",
                    params: {
                        id: item["_id"]
                    }
                }).then((res) => {
                    if (res.data.success) {
                        s.listRole.splice(itemIdx, 1);
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

    s.parsePermission = (role) => {
        var _ret = "";
        if (role.Stores.View || role.Stores.Add || role.Stores.Edit || role.Stores.Delete) {
            _ret += "Stores: " + (role.Stores.View ? 'V, ' : '') + (role.Stores.Add ? 'A, ' : '') + (role.Stores.Edit ? 'E, ' : '') + (role.Stores.Delete ? 'D' : '');
            _ret = _ret.substr(_ret.length - 2, 2) === ', ' ? _ret.substr(0, _ret.length - 2) : _ret;
        }

        if (role.Users.View || role.Users.Add || role.Users.Edit || role.Users.Delete) {
            _ret += " | Users: " + (role.Users.View ? 'V, ' : '') + (role.Users.Add ? 'A, ' : '') + (role.Users.Edit ? 'E, ' : '') + (role.Users.Delete ? 'D' : '');
            _ret = _ret.substr(_ret.length - 2, 2) === ', ' ? _ret.substr(0, _ret.length - 2) : _ret;
        }

        if (role.Roles.View || role.Roles.Add || role.Roles.Edit || role.Roles.Delete) {
            _ret += " | Roles: " + (role.Roles.View ? 'V, ' : '') + (role.Roles.Add ? 'A, ' : '') + (role.Roles.Edit ? 'E, ' : '') + (role.Roles.Delete ? 'D' : '');
            _ret = _ret.substr(_ret.length - 2, 2) === ', ' ? _ret.substr(0, _ret.length - 2) : _ret;
        }

        if (role.Gallery.View || role.Gallery.Add || role.Gallery.Edit || role.Gallery.Delete) {
            _ret += " | Gallery: " + (role.Gallery.View ? 'V, ' : '') + (role.Gallery.Add ? 'A, ' : '') + (role.Gallery.Edit ? 'E, ' : '') + (role.Gallery.Delete ? 'D' : '');
            _ret = _ret.substr(_ret.length - 2, 2) === ', ' ? _ret.substr(0, _ret.length - 2) : _ret;
        }

        if (role.BranchPerformance.Revenue || role.BranchPerformance.TransactionCount ||
            role.BranchPerformance.Volume || role.BranchPerformance.ASP || role.BranchPerformance.PriceComparison ||
            role.BranchPerformance.SalesMix) {
            _ret += " | Branch Performance: " + (role.BranchPerformance.Revenue ? 'Rev, ' : '')
                + (role.BranchPerformance.TransactionCount ? 'TC, ' : '') + (role.BranchPerformance.Volume ? 'Vol, ' : '')
                + (role.BranchPerformance.ASP ? 'ASP, ' : '') + (role.BranchPerformance.PriceComparison ? 'PC, ' : '')
                + (role.BranchPerformance.SalesMix ? 'SM, ' : '');
            _ret = _ret.substr(_ret.length - 2, 2) === ', ' ? _ret.substr(0, _ret.length - 2) : _ret;
        }
        return _ret.substr(0, 3) === " | " ? _ret.substr(3, _ret.length) : _ret;
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
    }


    init();
});