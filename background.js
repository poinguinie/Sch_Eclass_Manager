let page = ["eclass.sch.ac.kr", "medlms.sch.ac.kr", "commons.sch.ac.kr"]

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({page});
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request === "pdf") {
            let result = new Promise((resolve, reject) => {
                chrome.storage.sync.get('url', ({url}) => {
                    downloadURL = url + "/web_files/original.pdf";
                    resolve(downloadURL);
                });
            }).then(res => {
                return res;
            });
            console.log(result);
            sendResponse(result);
        }
        /*if (request.download === "video") {
            chrome.storage.sync.get("downloadInfo", ({url}) => {
                downloadURL = url + "/media_files/screen.mp4";
                downloadFun(downloadURL)
            });
            // return "success";
        }*/
        
        /*const downloadFun = (url) => {
            fetch(url)
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
            .catch((e) => console.log(e));
        }*/
    }
)