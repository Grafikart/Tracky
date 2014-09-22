angular.module('Storage', []).factory('Storage', function($q){
    var prefix = 'tracky-';
    var projects_key = prefix + 'projects';

    var factory = {
        projects : false,
        getState: function(){
            var key = prefix + "state";
            var deferred = $q.defer();
            if(chrome.storage){
                chrome.storage.sync.get(key, function(result){
                    state = result[key] == undefined ? {} : result[key];
                    if(!state.start){
                        state.start = 0;
                    }
                    if(!state.recording){
                        state.recording = false;
                    }
                    deferred.resolve(state);
                });
            } else {
                var state = localStorage.getItem(key);
                if(state == null){
                    state = {};
                }
                if(!state.start){
                    state.start = 0;
                }
                if(!state.recording){
                    state.recording = false;
                }
                deferred.resolve(state);
            }
            return deferred.promise;
        },

        setState: function(recording, start){
            var key = prefix + "state";
            if(chrome.storage){
                var obj = {};
                obj[key] = {
                    start: start,
                    recording: recording
                };
                chrome.storage.sync.set(obj);
            }else{
                // TODO : Proposer une alternative en utilisant le localStorage
            }
        },

        getProjects : function(){
            var deferred = $q.defer();
            if(factory.projects){
                deferred.resolve(factory.projects);
            }else if(chrome.storage){
                chrome.storage.sync.get(projects_key, function(result){
                    factory.projects = result[projects_key] == undefined ? {} : result[projects_key];
                    deferred.resolve(factory.projects);
                });
            } else {
                // TODO : Proposer une alternative en utilisant le localStorage
            }
            return deferred.promise;
        },

        saveProjects: function(projects) {
            var deferred = $q.defer();
            factory.projects = factory.projects ? $.extend(factory.projects, projects) : projects;
            if(chrome.storage){
                var obj = {};
                obj[projects_key] = factory.projects;
                chrome.storage.sync.set(obj, function(){
                    deferred.resolve();
                });
            } else {
                // TODO : Prévoir une alternative LocalStorage
            }
            return deferred.promise;
        },

        addTask: function(project, task, time){
            var deferred = $q.defer();
            factory.getProjects().then(function(projects){
                if(projects[project] == undefined){
                    projects[project] = {};
                }
                if(projects[project][task] == undefined){
                    projects[project][task] = time;
                } else {
                    projects[project][task] += time;
                }
                factory.saveProjects(projects).then(function(){
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }
    }
    return factory;

});
