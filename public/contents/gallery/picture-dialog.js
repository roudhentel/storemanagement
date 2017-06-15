mainApp.controller("pictureDialogCtrl", function ($scope, $http, $mdDialog, Dialog) {
    // declare variables
    var s = $scope;
    var dialogSvc = new Dialog();
    s.header = s.newHeader;
    s.albumName = s.selectedAlbum;
    s.savingFlag = false;

    s.loadExcelFile = (ev) => {
        var data = new FormData();
        $('#pictureFormDialog input[type="file"]').each(function () {
            $.each(this.files, function (i, file) {
                data.append('myFile', file);
            });
        });

        s.savingFlag = true;
        $.ajax({
            url: "/api/filesystem/addPictures?storeId=" + s.gbl.selectedStore.Details.Id + "&albumName=" + s.albumName,
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                    dialogSvc.showAlert("Information", "Successfully added.", "Ok", true, "parent", ev).then(() => {
                        $mdDialog.hide(res.files);
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
});