const pdfBtn = document.getElementById("pdfBtn");
const videoBtn = document.getElementById("videoBtn");
const videoBtn2 = document.getElementById("videoBtn2");
const notContentBtn = document.getElementById("notContentBtn");


window.addEventListener("load", async () => {    

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: init
    }, (res) => {
        if(res === null || res === "") return;
        const result = res[0].result;
        console.log(res);
        if (result.isSchoolPage) {
            const icon = result.icon;
            fetch("../../data/icon.json")
            .then(response => {
                return response.json();
            })
            .then(jsondata => {
                if (jsondata["result"][0]["pdf"].includes(icon)) {
                    pdfBtn.classList.toggle("active");
                } else if (jsondata["result"][1]["video"].includes(icon)) {
                    videoBtn.classList.toggle("active");
                } else if (icon === "downloadVideo") {
                    videoBtn2.classList.toggle("active");
                } else {
                    notContentBtn.classList.toggle("active");
                }
            })
            .catch(e => console.log(e))          
        } else {
            const notHomepageBtn = document.getElementById("notHomepageBtn");
            notHomepageBtn.classList.toggle("active");
        }
    });
});

async function init() {
    const url = location.host;
    
    const crawling = (body, str1, str2) => {
        const str1Length = str1.length;
        const startIndex = body.indexOf(str1) + str1Length;
        const endIndex = str2 !== null ? body.indexOf(str2) : startIndex + 14;

        return body.substring(startIndex, endIndex);
    }

    if (url === null) {
        return {
            isSchoolPage: false,
            icon: null
        }
    }
    
    let result = new Promise((resolve, reject) => {
        chrome.storage.sync.get("page", ({page}) => {
            if (page.includes(url)) {
                resolve(url);
            } else {
                resolve(false);
            }
        });
    }).then(arg => {
        console.log(arg);
        if(arg === false) {
            return {
                isSchoolPage: false,
                icon: null
            }
        }
        let tool = document.getElementById("tool_content") ? document.getElementById("tool_content").contentWindow.document : null;
        if(tool !== null) {
            let icon = tool.getElementsByClassName("xnct-icon");
            res = icon.length !== 0 ? { isSchoolPage: true, icon: icon[0].classList[1] } : { isSchoolPage: true, icon: null }
        } else if (arg.indexOf('eclass') >= 0 || arg.indexOf('medlms') >= 0){
            res = {
                isSchoolPage: true,
                icon: 'null'
            }
        } else if (arg.indexOf('commons') >= 0) {
            res = {
                isSchoolPage: true,
                icon: 'downloadVideo'
            }
        } else {
            res = {
                isSchoolPage: false,
                icon: null
            }
        }
        return res;
    });


    result.then(result => {
        // (result.icon === "pdf" || result.icon === "mp4" || result.icon === "movie")
        if (result.isSchoolPage && result.icon !== null && result.icon !== "null" && result !== 'downloadVideo') {            
            let tool = document.getElementById("tool_content").contentWindow.document;
            let innerIframe_1 = tool.getElementsByTagName("iframe")[0].contentWindow.document;
            let innerIframe_2 = innerIframe_1.getElementsByTagName("iframe")[0];
    
            let url = innerIframe_2.src;
           
            chrome.storage.sync.set({icon: result.icon});
    
            fetch(url)
            .then((response) => response.text())
            .then((data) => {
                const url = crawling(data, "property=\"og:image\" content=\"", "/web_files/slides/thumbnails")
                const title = crawling(data, "<title>", "</title>");
                const date = crawling(data, "<meta name=\"regdate\" content=\"", null);
    
                chrome.storage.sync.set({url});
                chrome.storage.sync.set({title});
                chrome.storage.sync.set({date});
    
            })
            .catch((e) => {
                console.log(e);
            });
        }
    })    
    return result;
}