(async function () {

    if ('localStorage' in window) {
        console.info('clear localStorage');
        localStorage.clear();
    }

    if ('sessionStorage' in window) {
        console.info('clear sessionStorage');
        sessionStorage.clear();
    }

    if (!'indexedDB' in window) {
        window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    }
    if (!window.indexedDB) {
        console.info('clear indexedDB', Object.keys(window.indexedDB));
        // It is not yet possible to discover related IndexDB database.
    }

    if ('serviceWorker' in navigator) {
        console.info('clear serviceWorker');
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            console.log('clear serviceWorker -', 'registrations', registrations.length);

            await Promise.all(registrations.map(async registration => {
                console.log(registration.active, registration.scope);
                if (registration.unregister === 'function') {
                    console.log('clear serviceWorker -', 'unregister', registration);
                    try {
                        await registration.unregister();
                    } catch (e) {
                        console.warn('clear serviceWorker -', 'unable to unregister', e);
                    }
                }
            }));
        } catch (e) {
            console.warn('clear serviceWorker -', 'unable to clear serviceWorker', e);
        }
    }

    if ('caches' in window) {
        console.info('clear caches');
        try {
            const keys = await caches.keys();
            console.log('clear caches -', 'keys', keys.length);

            await Promise.all(keys.map(async key => {
                try {
                    console.log('clear caches -', 'clear', key);
                    await caches.delete(key);
                } catch (e) {
                    console.warn('clear caches -', 'unable to clear', key, e);
                }
            }));
        } catch (e) {
            console.warn('clear caches -', 'unable to clear cache', e);
        }
    }

}());
