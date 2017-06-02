var mainApp = angular.module("mainApp", ["ui.router", "ngMaterial"]);

mainApp.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

    $urlRouterProvider.otherwise("/home/overview");

    $stateProvider.state('home', {
        url: "/home",
        templateUrl: "contents/home/"
    })
    .state('home.overview', {
        url: "/overview",
        templateUrl: "contents/overview/",
        controller: "overviewCtrl"
    })
    .state('home.roles', {
        url: "/roles",
        templateUrl: "contents/roles/",
        controller: "rolesCtrl"
    })
    .state('home.users', {
        url: "/users",
        templateUrl: "contents/users/",
        controller: "usersCtrl"
    })
    .state('home.stores', {
        url: "/stores",
        templateUrl: "contents/stores/",
        controller: "storesCtrl"
    })
    .state('login', {
        url: "/login",
        templateUrl: "contents/login/",
        controller: "loginCtrl"
    })

    // $locationProvider.html5Mode(true);
});