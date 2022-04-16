window.addEventListener("load", async () => {    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: init
    }, (res) => {
        const result = res!== null ? res[0].result : null;
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

async function init() {
    const url = location.host;
    let result = new Promise((resolve, reject) => {
        chrome.storage.sync.get("page", ({page}) => {
            if (page.includes(url)) {
                resolve(url);
            } else {
                resolve(false);
            }
        });
    }).then(arg => {
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
        if (result.isSchoolPage && (result.icon === "pdf" || result.icon === "mp4" || result.icon === "movie")) {            
            let tool = document.getElementById("tool_content").contentWindow.document;
            let innerIframe_1 = tool.getElementsByTagName("iframe")[0].contentWindow.document;
            let innerIframe_2 = innerIframe_1.getElementsByTagName("iframe")[0];
    
            let url = innerIframe_2.src;
    
            fetch(url)
            .then((response) => response.text())
            .then((data) => {
                const str1 = "property=\"og:image\" content=";
                const str2 = "/web_files/slides/thumbnails";
                const str1Length = str1.length + 1;
                const startIndex = data.indexOf(str1) + str1Length;
                const endIndex = data.indexOf(str2);
    
                const url = data.substring(startIndex, endIndex);

                const findTitle1 = "<title>";
                const findTitle2 = "</title>";
                const findTitle1Length = findTitle1.length;
                const titleStartIndex = data.indexOf(findTitle1) + findTitle1Length;;
                const titleEndIndex = data.indexOf(findTitle2);

                const title = data.substring(titleStartIndex, titleEndIndex);

                const findDate = "<meta name=\"regdate\" content=\"";
                const findDateLength = findDate.length;
                const dateStartIndex = data.indexOf(findDate) + findDateLength;
                
                const date = data.substring(dateStartIndex, dateStartIndex + 14);
    
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