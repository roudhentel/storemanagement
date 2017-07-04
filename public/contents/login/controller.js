mainApp.controller("loginCtrl", function ($scope, $http, $state, Dialog) {
    var s = $scope;
    var dialogSvc = new Dialog();
    s.login = {
        username: "",
        password: ""
    }
    s.loadingFlag = false;

    s.login = (ev, isFormValid) => {
        if (!isFormValid) return;

        s.loadingFlag = true;
        $http({
            method: "POST",
            url: "/api/user/authenticate",
            data: {
                Username: s.login.username,
                Password: s.login.password
            }
        }).then((res) => {
            if (res.data.success) {
                $state.go('home.overview');
            } else {
                dialogSvc.showAlert("Information", "Invalid username or password", "Ok", true, "parent", ev);
            }
            s.loadingFlag = false;
        }, (err) => {
            console.log(err);
            s.loadingFlag = false;
        });
    };
});