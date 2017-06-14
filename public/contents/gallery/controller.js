mainApp.directive("imgShowLoading", function () {
    return {
        restrict: "A",
        link: function (scope, el, attr) {
            if (el[0]) {
                el[0].style.display = 'none';

                el[0].onload = function () {
                    this.style.display = "block";
                    this.nextElementSibling.style.display = 'none';
                }
            }
        }
    }
});

mainApp.controller("galleryCtrl", function ($scope, $http, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();

    s.listAlbum = [];

    s.getAll = () => {
        if (s.gbl.selectedStore) {
            $http({
                method: "GET",
                url: "/api/filesystem/getAll",
                params: {
                    storeId: s.gbl.selectedStore.Details.Id
                }
            }).then(function (response) {
                if (response.data.success) {
                    s.listAlbum = response.data.rows;
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    s.viewImage = (img, ev) => {
        s.selectedImage = img;
        dialogSvc.showDialog("viewImageCtrl", s, "contents/gallery/view-image.html", true, "parent", ev);
    }

    s.deleteImage = (album, idx, ev) => {
        dialogSvc.showConfirm("Confirmation", "Are you sure you want to delete this image?", "Ok", "Cancel", false, "parent", ev).then((res) => {
            if (res) {
                $http({
                    method: "DELETE",
                    url: "/api/filesystem/deleteImage",
                    params: {
                        image: album.files[idx].path
                    }
                }).then(function (response) {
                    if (response.data.success) {
                        album.files.splice(idx, 1);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        });
    }

    s.addNewAlbum = (ev) => {
        s.newHeader = "Add New Album";
        dialogSvc.showDialog("albumDialogCtrl", s, "contents/gallery/album-dialog.html", true, "parent", ev).then((res) => {
            if (res) {
                s.listAlbum.push(res);
            }
        });
    }

    s.editAlbum = (alb, ev) => {
        s.newHeader = "Edit Album";
        s.selectedAlbum = alb;
        var idx = s.listAlbum.indexOf(alb);
        dialogSvc.showDialog("albumDialogCtrl", s, "contents/gallery/album-dialog.html", true, "parent", ev).then((res) => {
            if (res instanceof Object) {
                s.listAlbum[idx] = res;
            } else if (res) {
                s.listAlbum.splice(idx, 1);
            }
        });
    }

    s.getAll();
});