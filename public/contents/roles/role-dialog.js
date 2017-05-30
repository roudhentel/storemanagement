mainApp.controller("roleDialogCtrl", function ($scope) {
    // declare variables
    var s = $scope;
    s.header = s.newHeader;
    s.savingFlag = false;

    // blank role
    s.role = {
        Name: "",
        Stores: {
            View: false,
            Add: false,
            Edit: false,
            Delete: false
        },
        Users: {
            View: false,
            Add: false,
            Edit: false,
            Delete: false
        },
        Roles: {
            View: false,
            Add: false,
            Edit: false,
            Delete: false
        },
        Gallery: {
            View: false,
            Add: false,
            Edit: false,
            Delete: false
        },
        BranchPerformance: {
            Revenue: false,
            TransactionCount: false,
            Volume: false,
            ASP: false,
            PriceComparison: false,
            SalesMix: false
        }
    };

    s.save = (ev) => {
        s.savingFlag = true;
        setTimeout(() => { 
            s.savingFlag = false;
            s.$digest();
        }, 2000);
        console.log(s.role);
    }
});