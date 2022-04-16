// import {download} from './download-master/download';

pdfBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: downloadPdf,
    }, (url) => {
        console.log(url);
    });
});

videoBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: downloadVideo,
    }, (url) => {
        console.log(url);
    });
});

videoBtn2.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: downloadVideoSecond,
    }, (url) => {
        console.log(url);
    });
});


function downloadPdf() {

    chrome.runtime.sendMessage({download:"PDF",document: document}, (res) => {
        console.log(res);
    });
    
    let tool = document.getElementById("tool_content").contentWindow.document;
    let innerIframe_1 = tool.getElementsByTagName("iframe")[0].contentWindow.document;
    let innerIframe_2 = innerIframe_1.getElementsByTagName("iframe")[0];

    let url = innerIframe_2.src;

    fetch(url)
    .then((response) => response.text())
    .then((data) => {
        const str1 = "property=\"og:image\" content=";
        const str2 = "contents/web_files";
        const str1Length = str1.length + 1;
        const str2Length = str2.length;
        const startIndex = data.indexOf(str1) + str1Length;
        const endIndex = data.indexOf(str2) + str2Length;

        const url = data.substring(startIndex, endIndex) + "/original.pdf";

        const titleStart = "<title>";
        const titleEnd = "</title>";
        const titleIndex = data.indexOf(titleStart) + 7;
        const titleEndIndex = data.indexOf(titleEnd);

        const title = data.substring(titleIndex, titleEndIndex) + ".pdf";

        const returnData = {url: url, title: title};

        return returnData;
    })
    .then((data) => {
        // return data;
        fetch(data.url)
        .then((res) => res.blob())
        .then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = data.title;
            link.innerHTML = 'download';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
        })
        .catch((e) => console.log(e))
    })
    .catch((e) => {
        console.log(e);
    })
}

function downloadVideo() {
    let tool = document.getElementById("tool_content").contentWindow.document;
    let innerIframe_1 = tool.getElementsByTagName("iframe")[0].contentWindow.document;
    let innerIframe_2 = innerIframe_1.getElementsByTagName("iframe")[0];

    let url = innerIframe_2.src;

    window.open(url)
}

async function downloadVideoSecond() {
    let playBtn;
    let video = document.getElementsByTagName("video")[0];
    // console.log(video.currentSrc);
    if (video.currentSrc === "https://commons.sch.ac.kr/viewer/uniplayer/preloader.mp4") {
        playBtn = document.getElementsByClassName("vc-front-screen-play-btn")[0];
        playBtn.click();
        
        let muteBtn = document.getElementsByClassName("vc-pctrl-volume-btn")[0];
        if (muteBtn.title === "음소거")
            muteBtn.click();

    }
    await setTimeout(() => {
        playBtn.click();
    }, 1500);
    await setTimeout(() => {
        video = document.getElementsByTagName("video")[0];
        console.log(video.src);
        chrome.downloads.download({url: video.src});
        // window.open(video.src);
    }, 500);
}