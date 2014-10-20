var app = angular.module('tracky', ['Storage', 'ngAnimate']);

app.controller('AppCtrl', function ($scope, Storage) {

    $scope.projects = {};
    $scope.new_task = {};
    $scope.price = 40;
    $scope.adding = false;

    /* Loading datas from storage */
    Storage.get('projects').then(function (projects) {
        $scope.projects = projects;
    });

    Storage.get('price').then(function(price){
        $scope.price = price ? price : 40;
    });

    /* Update rates in storage */
    $scope.$watch('price', function(price){
        Storage.set('price', price);
    });

    /* Delete a task */
    $scope.deleteTask = function (tasks, idx) {
        tasks.splice(idx, 1);
        // We remove empty projects (without tasks)
        for(var i in $scope.projects){
            var project = $scope.projects[i];
            if(project.tasks.length == 0){
               $scope.projects.splice(i, 1);
            }
        }
        $scope.syncProjects();
    };

	/* Add a new Task inside aproject */
    $scope.newTask = function (project) {
        project.tasks.push({
            time: 0,
            name: 'Task name'
        });
    }

    /* Update time used on a task */
    $scope.updateTaskTime = function(task, time){
        task.time = time * 60;
        $scope.syncProjects();
    }

    /* Get time used on a project */
    $scope.projectTime = function (project) {
        var sum = 0;
        angular.forEach(project.tasks, function (task) {
            sum += parseInt(task.time, 10);
        });
        return sum;
    };

	/* Sync projects using Storage */
    $scope.syncProjects = function(){
        Storage.set('projects', $scope.projects);
    };

    /* Toggle header */
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
        time = parseInt(time, 10);
        var h = Math.floor(time / 3600);
        var m = Math.floor((time % 3600) / 60);
        return h + "h" + (m >= 10 ? m : '0' + m);
    }
});

// Convert seconds to min (rounding)
app.filter('to_min', function(){
    return function (time) {
        return Math.round(time / 60);
    }
})

// Convert X seconds into 0h40
app.filter('round', function () {
    return function (value) {
        return Math.round(value);
    }
});
