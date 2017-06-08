mainApp.controller("overviewCtrl", function ($scope, $http) {
    var s = $scope;
    s.search = {
        storeno: "",
        storename: ""
    }
    s.listStore = [];
    
    s.updateSearch = () => {
        s.gbl.selectedStore = s.listStore.find(obj => obj.Details.Name.toLowerCase().indexOf(s.search.storename.toLowerCase()) > -1 &&
            obj.Details.Id.toLowerCase().indexOf(s.search.storeno.toLowerCase()) > -1);

        s.search = {
            storeno: s.gbl.selectedStore.Details.Id,
            storename: s.gbl.selectedStore.Details.Name
        }    
    };

    s.clearSearch = () => {
        s.search = {
            storeno: "",
            storename: ""
        }

        $('#txtStoreNo').focus();
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

    let init = () => {
        s.getAllStores();
    };

    init();

    // fix display
    $.AdminLTE.layout.fix();
    // close right side bar
    $.AdminLTE.controlSidebar.close();
});