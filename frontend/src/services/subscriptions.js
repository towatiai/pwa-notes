const baseUrl = '/api/subscriptions';
const publicVapidKey = 'BKg--YK7EoOKiNweaiRgbJwstL7zpxYhpuXdjXl1LHLNWT9QM-zxbOWrsE4GNSmDywq7qDIM3Yjs8qLzB2EWvbs';

// Copied from the web-push documentation
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    return subscription;
};


const createSubscription = async () => {
    const subscription = await subscribe();

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    });
    if (response && response.ok) {
        return response.json();
    }
}

export default { createSubscription };
