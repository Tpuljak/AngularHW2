﻿var app = angular.module("App", [
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
        })
        .state("details", {
            url: "/details",
            params: { selectedStudentName: null },
            controller: "DetailsController",
            templateUrl: "details.html"
        })
        .state("addStudent", {
            url: "addStudent",
            controller: "AddStudentController",
            templateUrl: "studentAdd.html"
        });
});

app.controller("HomeController", function($scope, $state) {
    $scope.goToListOfStudents = function() {
        $state.go("students");
    }
});

app.controller("StudentController", function($scope, $state, localStorageService) {
    $scope.students = angular.fromJson(localStorageService.get("students"));
    $scope.goToStudentDetails = function (studentName) {
        $state.go("details", { selectedStudentName:  studentName });
    }
    $scope.deleteStudent = function (studentName) {
        _.remove($scope.students, function (o) { return o.name == studentName });
        localStorageService.set("students", angular.toJson($scope.students));
    }
    $scope.addStudent = function () {
        $state.go("addStudent");
    }
});

app.controller("DetailsController", function ($scope, $state, localStorageService, $stateParams) {
    $scope.student = _.find(angular.fromJson(localStorageService.get("students")), function (o) { return o.name == $stateParams.selectedStudentName });
    $scope.back = function () {
        $state.go("students");
    }
});

app.controller("AddStudentController", function ($scope, $state, localStorageService) {
    $scope.students = angular.fromJson(localStorageService.get("students"));
    $scope.confirm = function () {
        if (!$scope.name) {
            alert("Name is required!");
            return;
        }
        if (!$scope.gender) {
            alert("Gender is required!");
            return;
        }
        var student = {
            name: $scope.name,
            gender: $scope.gender,
            dateOfAddition: new Date(Math.random() * new Date())
        }
        $scope.students.push(student);
        localStorageService.set("students", angular.toJson($scope.students));
        $scope.name = "";
        $scope.gender = null;
    }
    $scope.back = function () {
        $state.go("students");
    }
});

