let page = ["eclass.sch.ac.kr", "medlms.sch.ac.kr", "commons.sch.ac.kr"];
let videoUrl = ["/media_files/screen.mp4", "/media_files/mobile/ssmovie.mp4", "/media_files/mixed.mp4"];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({page});
    chrome.storage.sync.set({videoUrl});
});