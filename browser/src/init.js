window.addEventListener("load", async () => {    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: init
    }, (res) => {
        const result = res[0].result;
        // console.log(isSchoolPage);
        if (result.isSchoolPage) {
            const icon = result.icon;
            const pdfBtn = document.getElementById("pdfBtn");
            const videoBtn = document.getElementById("videoBtn");
            const videoBtn2 = document.getElementById("videoBtn2");
            const notContentBtn = document.getElementById("notContentBtn");
            if (icon === "pdf") {
                pdfBtn.classList.toggle("active");
            } else if (icon === "mp4" || icon === "movie") {
                videoBtn.classList.toggle("active");
            } else if (icon === "downloadVideo") {
                videoBtn2.classList.toggle("active");
            } else {
                notContentBtn.classList.toggle("active");
            }
        } else {
            const notHomepageBtn = document.getElementById("notHomepageBtn");
            notHomepageBtn.classList.toggle("active");
        }
    });
});

function init() {
    const url = location.host;
    let isSchoolPage = new Promise((resolve, reject) => {
        chrome.storage.sync.get("page", ({page}) => {
            if (page.includes(url)) {
                resolve(url);
            } else {
                resolve(false);
            }
        });
    }).then(arg => {
        let res;
        if(arg) {
            if(arg.indexOf('medlms') >= 0) {
                let tool = document.getElementById("tool_content").contentWindow.document;
                let icon = tool.getElementsByClassName("xnct-icon");
                res = icon.length !== 0 ? { isSchoolPage: true, icon: icon[0].classList[1] } : { isSchoolPage: true, icon: null }
            } else {
                res = {
                    isSchoolPage: true,
                    icon: 'downloadVideo'
                }
            }
        } else {
            res = {
                isSchoolPage: false,
                icon: null
            }
        }
        return res;
    }).then(res => {
        return res;
    });
    return isSchoolPage;
}