async function cleanCookies(tab) {
    console.info('cleanCookies -', tab.url);

    const cookies = await browser.cookies.getAll({
        url: tab.url
    });

    console.log('cleanCookies -', 'discovered cookies', cookies.length);

    await Promise.all(cookies.map(async cookie => {
        console.log('cleanCookies -', 'clean cookie', cookie);
        await browser.cookies.remove({
            name: cookie.name,
            url: tab.url
        });
    }));
}

async function executeTabCleaner(tab) {
    console.info('executeTabCleaner -', tab.url);
    await browser.tabs.executeScript(tab.id, {
        file: 'tab-cleaner.js'
    });
}

async function cleanTabs(tabs) {
    await Promise.all(tabs.map(tab => {
        return Promise.all([
            cleanCookies(tab),
            executeTabCleaner(tab)
        ]);
    }));
}

browser.browserAction.onClicked.addListener(function () {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(cleanTabs).catch(error => console.error(error.message, error));
});
