var app = angular.module('timr', ['Storage']);

app.controller('AppCtrl', function ($scope, Storage) {
    $scope.projects = {};
    $scope.price = 40;

    Storage.getProjects().then(function (projects) {
        $scope.projects = projects;
    });

    // Get the data from Google Storage
    if (chrome.storage) {
        chrome.storage.sync.get('timr', function (val) {
            val = val.timr;
            $scope.projects = val.projects == undefined ? {} : val.projects;
            $scope.$apply();
        });
    } else {
        $scope.loaded = true;
    }

    $scope.deleteItem = function (object, idx) {
        delete object[idx];
        Storage.saveProjects($scope.projects);
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
