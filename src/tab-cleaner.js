(function () {
    if ('localStorage' in window) {
        console.info('clear localStorage');
        localStorage.clear();
    }

    if ('sessionStorage' in window) {
        console.info('clear sessionStorage');
        sessionStorage.clear();
    }

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
        console.info('clear indexedDB');
        // It is not yet possible to discover related IndexDB database.
    }

    if ('serviceWorker' in navigator) {
        console.info('clear serviceWorker');
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            console.log('registrations', registrations);
            return Promise.all(
                registrations.map(function (registration) {
                    console.log('unregister', registration);
                    return registration.unregister()
                        .then(function () {
                            console.log('unregistered');
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                })
            );
        });

    }
}());
