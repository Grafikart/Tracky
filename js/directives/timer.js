angular.module('TimerDirective', []).directive('timer', function ($interval) {
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
