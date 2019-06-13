export const DEFAULT_SETTINGS = {
    browserActionMode: 'clean'
};

export async function getData() {
    let data;
    try {
        data = await browser.storage.sync.get();
    } catch (e) {
        data = await browser.storage.local.get();
    }
    return Object.assign({
        settings: DEFAULT_SETTINGS
    }, data)
}

export async function setData(data) {
    try {
        await browser.storage.sync.set(data);
    } catch (e) {
        await browser.storage.local.set(data);
    }
}
