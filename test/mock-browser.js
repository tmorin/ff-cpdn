window.browser = {
    storage: {
        sync: {
            get: jest.fn().mockReturnValue(Promise.resolve({value: 'sync'})),
            set: jest.fn().mockReturnValue(Promise.resolve())
        },
        local: {
            get: jest.fn().mockReturnValue(Promise.resolve({value: 'local'})),
            set: jest.fn().mockReturnValue(Promise.resolve())
        }
    }
};