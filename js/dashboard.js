var app = angular.module('tracky', ['Storage']);

app.controller('AppCtrl', function ($scope, Storage) {

    $scope.projects = {};
    $scope.price = 40;

    Storage.get('projects').then(function (projects) {
        $scope.projects = projects;
    });

    $scope.deleteItem = function (object, idx) {
        delete object[idx];
        Storage.set('projects', $scope.projects);
    };

    $scope.sum = function (tasks) {
        var sum = 0;
        angular.forEach(tasks, function (value) {
            sum += value / 3600;
        });
        return Math.floor(sum * 100) / 100;
    }


});

app.filter('time', function () {
    return function (input) {
        return (Math.floor(100 * input / 3600) / 100) + " h";
    }
});
