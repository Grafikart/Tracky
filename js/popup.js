var app = angular.module('tracky', ['Storage', 'AutocompleteDirective', 'TimerDirective']);

app.controller('AppCtrl', function ($scope, Storage) {

    var background = chrome.extension ? chrome.extension.getBackgroundPage() : {};
    $scope.project = background.project ? background.project : {};
    $scope.projects = {};
    $scope.loaded = false;

    function getByName(arr, name){
        for (var i in arr) {
            var obj = arr[i];
            if (obj.name == name) {
                return obj;
            }
        }
        return false;
    }

    // Change icon when timer is started
    $scope.$watch('start', function(start){
        Storage.set('start', start);
        if(chrome.browserAction){
            chrome.browserAction.setIcon({path:"icon" + (start ? "-on" : "") + ".png"});
        }
    });

    // We keep project information using background (to avoid having to type it every time)
    $scope.$watch('project', function(value){
        background.project = value;
    });

    // Get infos from storage (Chrome.sync or localstorage)
    Storage.get('start').then(function(start){
        $scope.loaded = true;
        $scope.start = start;
    });
    Storage.get('projects').then(function(projects){
        $scope.projects = projects ? projects : [];
    })

    // Start timer
    $scope.record = function(){
        $scope.start = Date.now();
        $scope.project = {};
    };

    // Cancel timer
    $scope.reset = function(){
        $scope.start = false;
        $scope.project = {};
    };

    // Save a project + task
    $scope.save = function(){
        if($scope.project.name == '' || $scope.project.task == ''){
            alert('You have to select a task and a project');
        } else {
            var s = Math.floor((Date.now() - $scope.start) / 1000);
            var project = getByName($scope.projects, $scope.project.name);
            if(project === false){
                project = {
                    name: $scope.project.name,
                    tasks: []
                };
                $scope.projects.push(project);
            }
            var task = getByName(project.tasks, $scope.project.task);
            if(task === false){
                task = {
                    name: $scope.project.task,
                    time: 0
                };
                project.tasks.push(task);
            }
            task.time += s;
            Storage.set('projects', $scope.projects);
            $scope.start = 0;
        }
    };

    // Link to dashboard
    $scope.dashboard = function(){
        if(chrome.tabs){
            chrome.tabs.create({ url: chrome.extension.getURL('dashboard.html') });
        }else{
            window.location = "dashboard.html";
        }
    };

    // Custom autocomplete for projcts name and task name
    $scope.projectsAutoComplete = {
        source: function (request, response) {
            var array = [];
            angular.forEach($scope.projects, function (project) {
                var name = project.name;
                if(fuzzy(name, request.term)){
                    array.push({label: name, value: name});
                }
            });
            response(array);
        },
        minLength: 0,
        select: function (event, ui) {
            $scope.project.name = ui.item.label;
            $scope.$apply();
            return false;
        }
    };

    $scope.tasksAutoComplete = {
        source: function (request, response) {
            var array = [];
            var project = getByName($scope.projects, $scope.project.name);
            if(project !== false){
                angular.forEach(project.tasks, function (task) {
                    var name = task.name
                    if(fuzzy(name, request.term)){
                        array.push({label: name, value: name});
                    }
                });
            }
            response(array);
        },
        minLength: 0,
        select: function (event, ui) {
            $scope.project.task = ui.item.label;
            $scope.$apply();
            return false;
        }
    }


});