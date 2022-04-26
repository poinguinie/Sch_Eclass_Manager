var circleProgressBar = "<div class=\"circle_progress_wrap\">\
<svg class=\"circle_progress\" width=\"120\" height=\"120\" viewBox=\"0 0 120 120\">\
  <circle class=\"frame\" cx=\"60\" cy=\"60\" r=\"54\" stroke-width=\"12\" />\
  <circle class=\"bar\" cx=\"60\" cy=\"60\" r=\"54\" stroke-width=\"12\" />\
</svg>\
<strong class=\"value\"></strong>\
</div>"



pdfBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: downloadPdf,
    });
});

videoBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: downloadVideo,
    }, (res) => {
        var fetchFun = (url, title) => {
            var blob;
            var bar;
            var value;
            var RADIUS = 32;
            var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
            
            bar = document.querySelector('.bar');
            value = document.querySelector('.value');
            
            bar.style.strokeDasharray = CIRCUMFERENCE;

            function progress(per) {
                var progress = per / 100;
                var dashoffset = CIRCUMFERENCE * (1 - progress);

                bar.style.strokeDashoffset = dashoffset;
                
                value.innerHTML=per +'%';
            }
            var xmlHTTP = new XMLHttpRequest();
            xmlHTTP.open('GET', url, true);
            xmlHTTP.responseType = 'blob';
            xmlHTTP.onload = function(e) {
                blob = new Blob([this.response]);   
            };
            xmlHTTP.onprogress = function(pr) {
                per = parseInt((pr.loaded/pr.total)*100);
                // progress.value = per;
                progress(per)
                console.log(per + " %");
                if (per === 100) {
                    videoBtn.classList.toggle("active");
                    downloadingBtn.classList.toggle("active");
                    videoBtn.innerHTML = "다운로드가 완료되었습니다."
                }
                //pr.loaded - current state
                //pr.total  - max
            };
            xmlHTTP.onloadend = function(e){
                var fileName = title;
                var link = document.createElement("a");
                document.body.appendChild(link);
                link.style = "display: none";
                url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = fileName + ".mp4";
                link.click();
                window.URL.revokeObjectURL(url);

                
            }
            xmlHTTP.send();
        }
        
        let items = res[0].result;
        if(items.date.substring(0, 4) === "2022") {
            fetchFun(items.url + items.videoUrl[0], items.title);
            // videoBtn.innerHTML = "다운로드중입니다.<br>잠시 기다리십시오.<br><progress id=\"progress\" max=\"100\" value=\"0\"</progress>"
            videoBtn.classList.toggle("active");
            downloadingBtn.classList.toggle("active");
        } else {
            fetchFun(items.url + items.videoUrl[1], items.title);
            // videoBtn.innerHTML = "다운로드중입니다.<br>잠시 기다리십시오.<br><progress id=\"progress\" max=\"100\" value=\"0\"</progress>"
            // videoBtn.innerHTML = circleProgressBar;
            videoBtn.classList.toggle("active");
            downloadingBtn.classList.toggle("active");
        }
        /*if(res) {

        } else {
            videoBtn.innerHTML = "<p stlye='color:red'>에러가 발생했습니다.</p><br>개발자에게 문의해주세요."
        }*/
    });
});


async function downloadPdf() {
    await chrome.storage.sync.get(null, (items) => {
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
    var _promise = new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
            resolve(items);
        })
    }).then((items) => {
        return items;
    });

    return _promise;
}