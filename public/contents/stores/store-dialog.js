mainApp.controller("storeDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    // declare variables
    var s = $scope;
    var dialogSvc = new Dialog();
    s.header = s.newHeader;
    s.savingFlag = false;

    // blank store
    s.store = {};

    s.isEdit = s.header.toLowerCase().indexOf('edit') > -1;

    if (s.isEdit) {
        s.store = JSON.parse(JSON.stringify(s.selectedStore));
    }

    s.loadExcelFile = (ev) => {
        var data = new FormData();
        $('#storeFormDialog input[type="file"]').each(function () {
            $.each(this.files, function (i, file) {
                data.append('myFile', file);
            });
        });

        s.savingFlag = true;
        $.ajax({
            url: "/api/import/upload",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                    dialogSvc.showAlert("Information", "Successfully added.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.listStore);
                    });
                } else {
                    console.log(res);
                }
                s.savingFlag = false;
                s.$digest();
            },
            error: function (err) {
                console.log(err);
                s.savingFlag = false;
                s.$digest();
            }
        });
    }

    s.save = (ev, isFormValid, confirmPassword) => {
        if (!isFormValid) return;

        if (s.store.Password !== confirmPassword && !s.isEdit) {
            dialogSvc.showAlert("Information", "Password did not match.", "Ok", true, "parent", ev);
            return;
        }

        s.savingFlag = true;

        if (s.isEdit) {
            // update the store
            $http({
                method: "PUT",
                url: "/api/store/edit",
                data: s.store
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully updated.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.store);
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
            // add new store
            $http({
                method: "POST",
                url: "/api/store/save",
                data: s.store
            }).then((res) => {
                if (res.status === 200) {
                    dialogSvc.showAlert("Information", "Successfully saved.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.data.store);
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