mainApp.controller("albumDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();
    s.header = s.newHeader;

    s.isEdit = s.header.toLowerCase().indexOf("edit") > -1;

    s.album = {
        name: "",
        files: []
    }

    if (s.isEdit) {
        s.album = JSON.parse(JSON.stringify(s.selectedAlbum));
    }

    s.save = (isFormValid, ev) => {
        if (!isFormValid) return;


        if (isEdit) {
            $http({
                method: "PUT",
                url: "/api/filesystem/editAlbum",
                data: {
                    oldname: s.selectedAlbum.name,
                    newname: s.album.name,
                    storeId: s.gbl.selectedStore.Details.Id
                }
            }).then(function (res) {
                if (res.data.success) {
                    $mdDialog.hide(s.album);
                } else {
                    dialogSvc.showAlert("Information", "Album already exist", "Ok", true, "parent", ev);
                }
            }, function (err) {
                console.log(err);
                dialogSvc.showAlert("Information", "Album already exist", "Ok", true, "parent", ev);
            });
        } else {
            $http({
                method: "POST",
                url: "/api/filesystem/addAlbum",
                data: {
                    albumname: s.album.name,
                    storeId: s.gbl.selectedStore.Details.Id
                }
            }).then(function (res) {
                if (res.data.success) {
                    $mdDialog.hide(s.album);
                } else {
                    dialogSvc.showAlert("Information", "Album already exist", "Ok", true, "parent", ev);
                }
            }, function (err) {
                console.log(err);
                dialogSvc.showAlert("Information", "Album already exist", "Ok", true, "parent", ev);
            });
        }

    }


    s.delete = (ev) => {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to remove album: " + s.album.name + "?", "Yes", "No", false, "parent", ev).then((res) => {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/filesystem/deleteAlbum",
                    params: {
                        storeId: s.gbl.selectedStore.Details.Id,
                        albumname: s.album.name
                    }
                }).then((response) => {
                    if (response.data.success) {
                        $mdDialog.hide(true);
                    }
                }, (error) => {
                    console.log(error);
                })
            }
        });
    }
});