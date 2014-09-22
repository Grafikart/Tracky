function fuzzy(value, search){
    var regexp = '\\b(.*)';
    for(var i in search){
        regexp += '('+search[i]+')(.*)';
    }
    regexp += '\\b';
    console.log(regexp);
    return value.match(new RegExp(regexp,'i'));
}