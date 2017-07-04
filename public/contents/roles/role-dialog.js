mainApp.controller("roleDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    // declare variables
    var s = $scope;
    var dialogSvc = new Dialog();
    s.header = s.newHeader;
    s.savingFlag = false;

    // blank role
    s.role = {
        Name: "",
        Stores: { View: false, Add: false, Edit: false, Delete: false },
        Users: { View: false, Add: false, Edit: false, Delete: false },
        Roles: { View: false, Add: false, Edit: false, Delete: false },
        Gallery: { View: false, Add: false, Edit: false, Delete: false },
        BranchPerformance: {
            Revenue: false,
            TransactionCount: false,
            Volume: false,
            ASP: false,
            PriceComparison: false,
            SalesMix: false
        }
    };

    if (s.header.toLowerCase().indexOf('edit') > -1) {
        s.role = JSON.parse(JSON.stringify(s.selectedRole));
    }

    s.save = (ev, isFormValid) => {
        if (!isFormValid) return;

        s.savingFlag = true;

        if (s.header.toLowerCase().indexOf('edit') > -1) {
            // update the role
            $http({
                method: "PUT",
                url: "/api/role/edit",
                data: s.role
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully updated.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.role);
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
            // add new role
            $http({
                method: "POST",
                url: "/api/role/save",
                data: s.role
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully saved.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.role);
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