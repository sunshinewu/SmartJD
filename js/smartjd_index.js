$(function () {
    if (window.location.host.indexOf("item.jd.com") > -1 || window.location.host.indexOf("item.jd.hk") > -1 || window.location.host.indexOf("re.jd.com") > -1 || window.location.host.indexOf("re.jd.hk") > -1 || window.location.host.indexOf("item.yiyaojd.com") > -1) {
        loadJsCss(chrome.extension.getURL("/js/smartjd_impl.js"), 'js');
        loadJsCss(chrome.extension.getURL("/css/smartjd.css"), 'css');
    }
});


function loadJsCss(fileName, fileType) {
    var fileRef;
    if (fileType == "js") {
        fileRef = document.createElement('script');
        fileRef.setAttribute("type", "text/javascript");
        fileRef.setAttribute("src", fileName);
    } else if (fileType == "css") {
        fileRef = document.createElement("link");
        fileRef.setAttribute("rel", "stylesheet");
        fileRef.setAttribute("type", "text/css");
        fileRef.setAttribute("href", fileName);
    }
    if (typeof fileRef != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileRef);
    }
}