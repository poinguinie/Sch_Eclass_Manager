let page = ["eclass.sch.ac.kr", "medlms.sch.ac.kr", "commons.sch.ac.kr"]

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({page});
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.status === "init") {
            let getDocument = request.document;
            console.log(getDocument);
            /*let tool = getDocument.getElementById("tool_content").contentWindow.document;
            let icon = tool.getElementsByClass("xnct-icon");
            console.log(icon);*/
            sendResponse({status: "success"});
        }
    }
)