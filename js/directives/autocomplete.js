angular.module('AutocompleteDirective', []).directive('autocomplete', function () {
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