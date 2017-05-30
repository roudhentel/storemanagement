var mainApp = angular.module("mainApp", ["ui.router", "ngMaterial"]);

mainApp.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

    $urlRouterProvider.otherwise("/home/overview");

    $stateProvider.state('home', {
        url: "/home",
        templateUrl: "contents/home/"
    })
    .state('home.overview', {
        url: "/overview",
        templateUrl: "contents/overview/"
    })
    .state('home.roles', {
        url: "/roles",
        templateUrl: "contents/roles/",
        controller: "rolesCtrl"
    })
    .state('login', {
        url: "/login",
        templateUrl: "contents/login/"
    })

    // $locationProvider.html5Mode(true);
});