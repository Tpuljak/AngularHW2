var app = angular.module("App", [
        "ui.router",
        "LocalStorageModule"
]);

app.run(function(localStorageService) {
    var students = [
        {
            name: "Toma Puljak",
            gender: "M",
            dateOfAddition: new Date(Math.random() * new Date())
        },
        {
            name: "Mario Čerpnja",
            gender: "Ž",
            dateOfAddition: new Date(Math.random() * new Date())
        }
    ];

    localStorageService.set("students", angular.toJson(students));
});

app.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("home", {
        url: "/",
        controller: "HomeController",
        template: `
            <h1>DOBRO DOŠLI U IMENIK</h1>
            <button ng-click="goToListOfStudents()">Pogledaj učenike</button>
        `
    })
    .state("students", {
        url: "/students",
        controller: "StudentController",
        templateUrl: "students.html"
    });
});

app.controller("HomeController", function($scope, $state) {
    $scope.goToListOfStudents = function() {
        $state.go("students");
    }
});

app.controller("StudentController", function($scope, $state, localStorageService) {
    $scope.students = angular.fromJson(localStorageService.get("students"));
});