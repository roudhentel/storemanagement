mainApp.controller("storesCtrl", function ($scope, $http, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

    s.listStore = [];

    s.showStoreDialog = (ev, transaction) => {
        s.newHeader = transaction === 'add' ? "Add Store" : "Edit Store";
        return dialogSvc.showDialog("storeDialogCtrl", s, "contents/stores/store-dialog.html", true, "parent", ev)
            .then((res) => {
                return res;
            });
    };

    s.addStore = (ev) => {
        s.showStoreDialog(ev, "add")
            .then((res) => {
                if (res) {
                    s.listStore.push.apply(s.listStore, res);
                }
            })
    }

    s.editStore = (ev, item, itemIdx) => {
        s.selectedStore = item;
        s.showStoreDialog(ev, "edit")
            .then((res) => {
                if (res) {
                    s.listStore[itemIdx] = res;
                }
            });
    }

    s.deleteStore = (ev, item, itemIdx) => {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete store: " + item.Storename, "Yes", "No", false, "parent", ev).then((res) => {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/store/delete",
                    params: {
                        id: item["_id"]
                    }
                }).then((res) => {
                    if (res.data.success) {
                        s.listStore.splice(itemIdx, 1);
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

    s.getRoleDesc = (store) => {
        var role = s.listRole.find(obj => obj["_id"] == store.RoleId);
        return role ? role.Name : "";
    }

    s.getAllStores = () => {
        $http({
            method: "GET",
            url: "/api/store/getAll"
        }).then(function (res) {
            if (res.status === 200) {
                s.listStore = res.data;
            } else {
                console.log(res);
            }
        }, function (err) {
            console.log(err);
        });
    }

    var init = () => {
        s.getAllStores();
    }


    init();
});