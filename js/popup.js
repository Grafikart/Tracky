var app = angular.module('timr', ['Storage']);

app.controller('AppCtrl', function ($scope, Storage) {

    var background = chrome.extension.getBackgroundPage();
    $scope.recording = false;
    $scope.start = 0;
    $scope.project = background.project;
    $scope.loaded = false;

    $scope.$watch('recording', function(value){
        chrome.browserAction.setIcon({path:"icon" + (value ? "-on" : "") + ".png"});
    });

    $scope.$watch('project', function(value){
        background.project = value;
    });

    Storage.getState().then(function(state){
        $scope.loaded = true;
        $scope.recording = state.recording;
        $scope.start = state.start;
    });

    var sync = function(){
        Storage.setState($scope.recording, $scope.start);
    };

    // Start the timer
    $scope.record = function(){
        $scope.recording = true;
        $scope.start = Date.now();
        $scope.project = {};
        sync();
    };

    $scope.reset = function(){
        $scope.recording = false;
        $scope.project = {};
        sync();
    };

    $scope.save = function(){
        if($scope.project.name == '' || $scope.project.task == ''){
            alert('You have to select a task and a project');
        } else {
            var s = Math.floor((Date.now() - $scope.start) / 1000);
            Storage.addTask($scope.project.name, $scope.project.task, s);
            $scope.recording = false;
            $scope.start = 0;
            sync();
        }
    };

    $scope.dashboard = function(){
        chrome.tabs.create({ url: chrome.extension.getURL('dashboard.html') });
    };

    Storage.getProjects().then(function(projects){

        $scope.projectsAutoComplete = {
            source: function (request, response) {
                var array = [];
                angular.forEach(projects, function (v, k) {
                    if(fuzzy(k, request.term)){
                        array.push({label: k, value: k});
                    }
                });
                response(array);
            },
            minLength: 0,
            select: function (event, ui) {
                this.value = ui.item.label;
                return false;
            }
        };

        $scope.tasksAutoComplete = {
            source: function (request, response) {
                var array = [];
                if($scope.projects[$scope.project.name]){
                    angular.forEach($scope.projects[project.name], function (v, k) {
                        if(fuzzy(k, request.term)){
                            array.push({label: k, value: k});
                        }
                    });
                }
                response(array);
            },
            minLength: 0,
            select: function (event, ui) {
                this.value = ui.item.label;
                return false;
            }
        }

    });

});

app.directive('timer', function ($interval) {
    return {
        restrict: 'E',
        template: '<div class="timer">{{time}}</div>',
        link: function (scope, element) {
            var convert = function(s){
                var h = Math.floor(s / 3600);
                var m = Math.floor(s % 3600 / 60);
                var s = Math.floor(s) - h * 3600 - m * 60;
                return witho(h) + ":" + witho(m) + ":" + witho(s);
            };

            var witho = function(n){
                if( n < 10 ){
                    return '0' + n;
                }
                return n;
            };

            var updateTime = function(){
                if(scope.start == 0){
                    scope.time = convert(0);
                } else {
                    scope.time = convert((Date.now() - scope.start) / 1000);
                }
            };
            var interval = $interval(updateTime, 1000);
            updateTime();

            element.on('$destroy', function(){
                $interval.cancel(interval);
            });
        }
    }
});

app.directive('autocomplete', function () {
    return {
        restrict: 'A',
        scope: {
            autocompleteconfig: '='
        },
        link: function (scope, elem) {
            scope.$watch('autocompleteconfig', function (value) {
                elem.autocomplete(value);
            });
        }
    };
});
