var app = angular.module('tracky', ['Storage', 'ngAnimate']);

app.controller('AppCtrl', function ($scope, Storage) {

    $scope.projects = {};
    $scope.price = 40;

    // Extracting data from Storage
    Storage.get('projects').then(function (projects) {
        $scope.projects = projects;
    });

    Storage.get('price').then(function(price){
        $scope.price = price ? price : 40;
    });

    // Auto update price when changed
    $scope.$watch('price', function(price){
        Storage.set('price', price);
    });

    $scope.deleteTask = function (tasks, idx) {
        tasks.splice(idx, 1);
        // We remove empty projects (without task)
        for(var i in $scope.projects){
            var project = $scope.projects[i];
            if(project.tasks.length == 0){
               $scope.projects.splice(i, 1);
            }
        }
        $scope.sync();
    };

    $scope.sync = function(){
        Storage.set('projects', $scope.projects);
    };

    $scope.sum = function (tasks) {
        var sum = 0;
        angular.forEach(tasks, function (task) {
            sum += parseInt(task.time);
        });
        return sum;
    };

    $scope.toggleHeader = function(){
        $('.header').slideToggle();
    }

});

// Auto focus field
app.directive('autofocus', function(){
    return {
        scope: {
            autofocus: '='
        },
        link: function (scope, element) {
            scope.$watch('autofocus', function(value){
                if(value){
                    element[0].focus();
                }
            })
        }
    };
});

// Convert X seconds into 0h40
app.filter('time', function () {
    return function (time) {
        time = parseInt(time);
        var h = Math.floor(time / 3600);
        var m = Math.floor((time % 3600) / 60);
        return h + "h" + (m > 10 ? m : '0' + m);
    }
});

// Convert X seconds into 0h40
app.filter('round', function () {
    return function (value) {
        return Math.round(value);
    }
});
