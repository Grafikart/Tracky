// TODO : We could use this page to "cache" some data to avoid hitting the Sotrage
var key = "tracky-state";
var project = {
    name: '',
    task: ''
};

chrome.storage.sync.get(key, function () {
    chrome.storage.sync.get(key, function(result){
        var state = result[key] == undefined ? {} : result[key];
        if(state.recording){
            chrome.browserAction.setIcon({path:"icon-on.png"});
        }
    });
});
