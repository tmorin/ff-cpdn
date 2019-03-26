async function cleanCookies(tab) {
    console.info('cleanCookies -', tab.url, tab.cookieStoreId);

    let cookieStoreId = tab.cookieStoreId;
    try {
        const contextualIdentity = await browser.contextualIdentities.get(tab.cookieStoreId);
        cookieStoreId = contextualIdentity.cookieStoreId;
        console.info(contextualIdentity);
        console.info('cleanCookies - contextual identity available', contextualIdentity.cookieStoreId);
    } catch (e) {
        console.debug("cleanCookies - no contextual identity available")
    }

    const cookies = await browser.cookies.getAll({
        url: tab.url,
        storeId: cookieStoreId
    });

    console.log('cleanCookies -', 'discovered cookies', cookies.length);

    await Promise.all(cookies.map(async cookie => {
        console.debug('cleanCookies -', 'clean cookie', cookie);
        await browser.cookies.remove({
            name: cookie.name,
            storeId: cookieStoreId,
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
    console.clear();
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(cleanTabs).catch(error => console.error(error.message, error));
});
