var app = angular.module('timr', ['Storage', 'AutocompleteDirective', 'TimerDirective']);

app.controller('AppCtrl', function ($scope, Storage) {

    var background = chrome.extension ? chrome.extension.getBackgroundPage() : {};
    $scope.project = background.project ? background.project : {};
    $scope.projects = {};
    $scope.loaded = false;

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
        $scope.projects = projects;
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
            Storage.appendTo('projects', [$scope.project.name, $scope.project.task], s).then(function(projects){
                $scope.projects = projects;
            });
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
            angular.forEach($scope.projects, function (v, k) {
                if(fuzzy(k, request.term)){
                    array.push({label: k, value: k});
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
            if($scope.projects[$scope.project.name]){
                console.log($scope.projects[$scope.project.name]);
                angular.forEach($scope.projects[$scope.project.name], function (v, k) {
                    if(fuzzy(k, request.term)){
                        array.push({label: k, value: k});
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