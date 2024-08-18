let emojis = {};

chrome.runtime.sendMessage({action: "getEmojis"}, function(response) {
    emojis = response.emojis;
    document.addEventListener('input', handleInput);
});