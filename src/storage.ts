export const DEFAULT_OPTIONS = {
    scopes: {
        localStorage: true,
        sessionStorage: true,
        indexedDB: true,
        serviceWorker: true,
        caches: true,
        cookies: true,
        history: false
    }
}

export async function getData<V = any>(key: string, defaultValue?: V): Promise<V> {
    let data;
    try {
        data = await browser.storage.sync.get();
    } catch (e) {
        data = await browser.storage.local.get();
    }
    return data[key] || defaultValue;
}

export async function setData<V = any>(key: string, value: V) {
    let data;
    try {
        data = await browser.storage.sync.get();
    } catch (e) {
        data = await browser.storage.local.get();
    }
    const newData = {...data};
    newData[key] = value;
    try {
        await browser.storage.sync.set(newData);
    } catch (e) {
        await browser.storage.local.set(newData);
    }
}

export async function clearData(): Promise<void> {
    try {
        await browser.storage.sync.clear;
    } catch (e) {
        await browser.storage.local.clear;
    }
}

export async function getOptions(): Promise<Options> {
    return await getData<Options>('options', DEFAULT_OPTIONS);
}

export async function setOptions(options: Options): Promise<void> {
    await setData<Options>('options', options);
}

export type Options = {
    scopes: {
        localStorage: boolean
        sessionStorage: boolean
        indexedDB: boolean
        serviceWorker: boolean
        caches: boolean
        cookies: boolean
        history: boolean
    }
}
