mainApp.controller("editSalesRevCtrl", function ($scope, $http, $mdDialog) {
    var s = $scope;
    s.currdata = JSON.parse(JSON.stringify(s.selData));

    s.save = () => {
        $http({
            method: "PUT",
            url: "/api/store/updateRevenue",
            data: {
                Id: s.gbl.selectedStore["_id"],
                Year: s.currdata.Year,
                Data: s.currdata.Data
            }
        }).then(function (response) {
            console.log(response);
            $mdDialog.hide(s.currdata);
        }, function (error) {
            console.log(error);
        });
    }
});