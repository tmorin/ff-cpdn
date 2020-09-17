import {getOptions, Options} from './storage';
import Tab = browser.tabs.Tab;

function getRootDomain(url: URL) {
    const parts = url.hostname.split('.');
    for (let i = parts.length; i > 2; i--) {
        parts.shift();
    }
    return parts.join('.');
}

async function cleanCookies(tab: Tab) {
    console.info('cleanCookies -', tab.url, tab.cookieStoreId);

    let cookieStoreId = tab.cookieStoreId;
    if (!cookieStoreId) {
        return;
    }

    try {
        const contextualIdentity = await browser.contextualIdentities.get(cookieStoreId);
        if (contextualIdentity) {
            cookieStoreId = contextualIdentity.cookieStoreId;
            console.info(contextualIdentity);
            console.info('cleanCookies - contextual identity available', contextualIdentity.cookieStoreId);
        }
    } catch (e) {
        console.debug('cleanCookies - no contextual identity available')
    }

    // get all cookie related to the tab's cookie store
    const allCookies = await browser.cookies.getAll({
        storeId: cookieStoreId
    });

    if (!tab.url) {
        return;
    }

    // get tab's URL info
    const url = new URL(tab.url);
    const domain = getRootDomain(url);

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

async function cleanHistory(tab: Tab) {
    // get tab's URL info
    const url = new URL(tab.url);
    const text = `${url.protocol}//${url.host}`;
    const domain = getRootDomain(url);
    const entries = await browser.history.search({text: domain});
    console.log('cleanHistory - discovered [%s] entries for domain [%s]', entries.length, text);
    for (const entry of entries) {
        console.log('cleanHistory - clean entry [%s]', entry.url);
        await browser.history.deleteUrl({url: entry.url});
    }
}

async function executeTabCleaner(tab: Tab, options: Options) {
    console.info('executeTabCleaner -', tab.url);
    await browser.tabs.executeScript(tab.id, {
        code: `window.CPDN_OPTIONS = ${JSON.stringify(options)};`
    });
    await browser.tabs.executeScript(tab.id, {
        file: 'tab-cleaner.js'
    });
}

export async function cleanTabs(tabs: Array<Tab>) {
    const options = await getOptions();
    await Promise.all(tabs.map((tab: Tab) => {
        const tasks = [];
        if (options.scopes.cookies) {
            tasks.push(cleanCookies(tab))
        }
        if (options.scopes.history) {
            tasks.push(cleanHistory(tab))
        }
        return Promise.all([
            ...tasks,
            executeTabCleaner(tab, options)
        ]);
    }));
}

