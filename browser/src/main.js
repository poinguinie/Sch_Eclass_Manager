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
    }, (res) => {
        if(res) {
            videoBtn.innerHTML = "다운로드중입니다.<br>잠시 기다리십시오."
        }
    });
});


async function downloadPdf() {
    await chrome.storage.sync.get(null, (items) => {
        console.log(items.url+"/web_files/original.pdf");
        fetch(items.url+"/web_files/original.pdf")
        .then((res) => res.blob())
        .then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = items.title+".pdf";
            link.innerHTML = 'download';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
        })
        .catch((e) => console.log(e))
    });
}

async function downloadVideo() {
    await chrome.storage.sync.get(null, (items) => {
        console.log(items.url+"/web_files/original.pdf");
        fetch(items.url+"/media_files/screen.mp4")
        .then((res) => res.blob())
        .then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = items.title+".mp4";
            link.innerHTML = 'download';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
        })
        .catch((e) => console.log(e))
    });

    return true;
}