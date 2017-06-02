mainApp.controller("userDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    // declare variables
    var s = $scope;
    var dialogSvc = new Dialog();
    s.header = s.newHeader;
    s.savingFlag = false;

    // blank user
    s.user = {
        Fullname: "",
        Username: "",
        Password: "",
        RoleId: ""
    };

    s.isEdit = s.header.toLowerCase().indexOf('edit') > -1;

    if (s.isEdit) {
        s.user = JSON.parse(JSON.stringify(s.selectedUser));
    }

    s.save = (ev, isFormValid, confirmPassword) => {
        if (!isFormValid) return;

        if (s.user.Password !== confirmPassword && !s.isEdit) {
            dialogSvc.showAlert("Information", "Password did not match.", "Ok", true, "parent", ev);
            return;
        }

        s.savingFlag = true;

        if (s.isEdit) {
            // update the user
            $http({
                method: "PUT",
                url: "/api/user/edit",
                data: s.user
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully updated.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.user);
                    });
                } else {
                    console.log(res);
                }
                s.savingFlag = false;
            }, (err) => {
                console.log(res);
                s.savingFlag = false;
            });
        } else {
            // add new user
            $http({
                method: "POST",
                url: "/api/user/save",
                data: s.user
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully saved.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.user);
                    });
                } else {
                    console.log(res);
                }
                s.savingFlag = false;
            }, (err) => {
                console.log(res);
                s.savingFlag = false;
            });
        }
    }
});