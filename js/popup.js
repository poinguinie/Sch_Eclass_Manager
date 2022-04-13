getWindow.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log(tab);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getWindowInfo,
    });
});

function getWindowInfo() {
    console.log(document.head.title);
}