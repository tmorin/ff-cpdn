import './mock-browser';
import {DEFAULT_SETTINGS, getData, setData} from '../src/storage';

describe('storage', () => {

    it('should get with sync', async () => {
        const result = await getData();
        expect(result).toHaveProperty('value', 'sync');
        expect(result).toHaveProperty('settings.browserActionMode', DEFAULT_SETTINGS.browserActionMode);
    });

    it('should get with local when sync failed', async () => {
        window.browser.storage.sync.get = jest.fn().mockReturnValue(Promise.reject(new Error()));
        const result = await getData();
        expect(result).toHaveProperty('value', 'local');
        expect(result).toHaveProperty('settings.browserActionMode', DEFAULT_SETTINGS.browserActionMode);
    });

    it('should set with sync', async () => {
        const data = {key : 'value'};
        await setData(data);
        expect(window.browser.storage.sync.set).toHaveBeenCalledWith(data);
        expect(window.browser.storage.local.set).not.toHaveBeenCalled();
    });

    it('should set with local when sync failed', async () => {
        window.browser.storage.sync.set = jest.fn().mockReturnValue(Promise.reject(new Error()));
        const data = {key : 'value'};
        await setData(data);
        expect(window.browser.storage.sync.set).toHaveBeenCalledWith(data);
        expect(window.browser.storage.local.set).toHaveBeenCalledWith(data);
    });

});