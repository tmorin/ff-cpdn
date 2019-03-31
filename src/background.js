async function cleanCookies(tab) {
    console.info('cleanCookies -', tab.url, tab.cookieStoreId);
    console.info(tab);

    let cookieStoreId = tab.cookieStoreId;
    try {
        const contextualIdentity = await browser.contextualIdentities.get(tab.cookieStoreId);
        cookieStoreId = contextualIdentity.cookieStoreId;
        console.info(contextualIdentity);
        console.info('cleanCookies - contextual identity available', contextualIdentity.cookieStoreId);
    } catch (e) {
        console.debug('cleanCookies - no contextual identity available')
    }

    // get all cookie related to the tab's cookie store
    const allCookies = await browser.cookies.getAll({
        storeId: cookieStoreId
    });

    // get tab's URL info
    const url = new URL(tab.url);
    const parts = url.hostname.split('.');
    for (let i = parts.length; i > 2; i--) {
        parts.shift();
    }
    const domain = parts.join('.');

    // keep only cookies related to tab's domain
    const cookies = allCookies.filter(c => c.domain.endsWith(domain));

    console.log('cleanCookies - discovered [%s] cookies for domain [%s]', cookies.length, domain);

    await Promise.all(cookies.map(async cookie => {
        // forge cookie's URL from tab's origin and cookie's path
        const cookieUrl = `${url.origin}${cookie.path}`;
        console.debug('cleanCookies - clean cookie [%s|%s|%s] with url [%s]', cookie.name, cookie.domain, cookie.path, cookieUrl);
        await browser.cookies.remove({
            name: cookie.name,
            storeId: cookieStoreId,
            url: cookieUrl
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
