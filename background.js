chrome.runtime.onInstalled.addListener(async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            // files: ['contentScript.js'],
            func: init,
        });
    })
});

function init() {
    console.log(location.href)
}