mainApp.controller("addSalesRevCtrl", function ($scope, $http) {
    var s = $scope;
    s.salesRev = undefined;

    s.header = s.newHeader;

    s.readExcelFile = () => {

        var data = new FormData();
        $('#addSaleRevFormDialog input[type="file"]').each(function () {
            $.each(this.files, function (i, file) {
                data.append('myFile', file);
            });
        });


        s.savingFlag = true;
        $.ajax({
            url: "/api/import/salesRevenue",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                    s.salesRev = res.row;
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

    s.loadExcelFile = () => {
        s.salesRev = undefined;
    }

    s.saveSalesRev = () => {
        $http({
            method: "PUT",
            url: "/api/store/addRevenue",
            data: {
                id: s.gbl.selectedStore["_id"],
                salesRev: s.salesRev
            }
        }).then(function (res) {
            console.log(res);
        }, function (err) {
            console.log(err);
        });
    }
});