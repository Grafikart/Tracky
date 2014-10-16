angular.module('Storage', []).factory('Storage', function ($q) {

    var prefix = 'tracky-';

    var factory = {

        projects: false,

        get: function (key) {
            key = prefix + key;
            var deferred = $q.defer();
            if (chrome.storage) {
                chrome.storage.sync.get(key, function (results) {
                    var result = results[key] == undefined ? null : results[key];
                    deferred.resolve(result);
                });
            } else {
                var results = JSON.parse(localStorage.getItem(key));
                deferred.resolve(results);
            }
            return deferred.promise;
        },

        set: function (key, value) {
            key = prefix + key;
            var deferred = $q.defer();
            if (chrome.storage) {
                var obj = {};
                obj[key] = value;
                obj = JSON.parse(angular.toJson(obj)); // Clean the angular object to avoid $$hakey
                chrome.storage.sync.set(obj, function () {
                    deferred.resolve(value);
                });
            } else {
                localStorage.setItem(key, angular.toJson(value));
                deferred.resolve(value);
            }
            return deferred.promise;
        }

    };
    return factory;

});
