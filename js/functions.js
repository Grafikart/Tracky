function fuzzy(value, search){
    var regexp = '\\b(.*)';
    for(var i in search){
        regexp += '('+search[i]+')(.*)';
    }
    regexp += '\\b';
    return value.match(new RegExp(regexp,'i'));
}