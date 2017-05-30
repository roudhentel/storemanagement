mainApp.controller("rolesCtrl", function ($scope, $http, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

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

            })
    }

    s.editRole = (ev) => {
        s.showRoleDialog(ev, "edit")
            .then((res) => {

            });
    }


});