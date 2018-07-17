function logInfo(result) {
    console.info(result);
}

function logError(error) {
    console.error(error);
}

function cleanCookies(tab) {
    console.info('cleanCookies', tab.url);
    return browser.cookies.getAll({
        url: tab.url
    }).then(function (cookies) {
        console.log('cookies', cookies.length);
        return cookies.map(function (cookie) {
            console.log('cookie', cookie);
            return browser.cookies.remove({
                name: cookie.name,
                url: tab.url
            }).then(logInfo, logError)
        });
    }, logError);
}

function executeTabCleaner(tab) {
    console.info('executeTabCleaner', tab.url);
    return browser.tabs.executeScript({
        file: 'tab-cleaner.js'
    }).then(logInfo, logError);
}

function cleanTabs(tabs) {
    return Promise.all(
        tabs.map(function (tab) {
            return Promise.all([
                cleanCookies(tab),
                executeTabCleaner(tab)
            ]);
        })
    );
}

browser.browserAction.onClicked.addListener(function () {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(cleanTabs, logError);
});
