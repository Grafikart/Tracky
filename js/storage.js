angular.module('Storage', []).factory('Storage', function ($q) {

    var prefix = 'tracky-';
    var projects_key = prefix + 'projects';

    var factory = {

        projects: false,

        get: function (key) {
            var key = prefix + key;
            var deferred = $q.defer();
            if (chrome.storage) {
                chrome.storage.sync.get(key, function (results) {
                    result = results[key] == undefined ? null : results[key];
                    deferred.resolve(result);
                });
            } else {
                var results = JSON.parse(localStorage.getItem(key));
                deferred.resolve(results);
            }
            return deferred.promise;
        },

        set: function (key, value) {
            var key = prefix + key;
            var deferred = $q.defer();
            if (chrome.storage) {
                var obj = {};
                obj[key] = value;
                chrome.storage.sync.set(obj, function () {
                    deferred.resolve(value);
                });
            } else {
                localStorage.setItem(key, JSON.stringify(value));
                deferred.resolve(value);
            }
            return deferred.promise;
        },

        appendTo: function (key, path, value) {
            var deferred = $q.defer();
            factory.get(key).then(function (results) {
                if (!results) {
                    results = {};
                }
                var tmp = results
                for (var i in path) {
                    if (i < path.length - 1) {
                        if (!tmp[path[i]]) {
                            tmp[path[i]] = {}
                        }
                        tmp = tmp[path[i]];
                    } else {
                        if (!tmp[path[i]]) {
                            tmp[path[i]] = value
                        } else {
                            tmp[path[i]] += value;
                        }
                    }
                }
                return factory.set(key, results);
            });
            return deferred.promise;
        }
    }
    return factory;

});
