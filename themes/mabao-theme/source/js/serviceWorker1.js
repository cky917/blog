if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/test.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}
console.log('serviceWorker')