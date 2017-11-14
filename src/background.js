function logInfo(result) {
    console.info(result);
}

function logError(error) {
    console.error(error);
}

function cleanCookies(tab) {
    browser.cookies.getAll({
        url: tab.url
    }).then(function (cookies) {
        for (let cookie of cookies) {
            browser.cookies.remove({
                url: tab.url,
                name: cookie.name,
                storeId: cookie.storeId
            }).then(logInfo, logError);
        }
    }, logError);
}

function cleanStorage(tab) {
    browser.tabs.executeScript({
        code: 'localStorage.clear()'
    }).then(logInfo, logError);
}

function cleanTabs(tabs) {
    tabs.forEach(function (tab) {
        cleanCookies(tab);
        cleanStorage(tab);
    });
}

browser.browserAction.onClicked.addListener(function () {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(cleanTabs, logError);
});