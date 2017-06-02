mainApp.controller("mainCtrl", ($scope, $state, $mdDialog) => {
    // $scope.state = $state;

    // console.log($scope.state);

    $scope.toggleRightSidebar = function () {
        if ($('body').hasClass('control-sidebar-open')) {
            $.AdminLTE.controlSidebar.close();
        } else {
            $.AdminLTE.controlSidebar.open();
        }
    }


    $scope.getCurrentState = function () {
        var _ret = "";
        if ($state.current.name === "login") {
            return "login-page"
        } else {
            return "skin-black"
        }
    }

    $scope.cancel = function () {
        $mdDialog.hide();
    }
});