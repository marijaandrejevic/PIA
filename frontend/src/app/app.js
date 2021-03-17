console.log("ZDRAVOOOO")
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('frontend/src/ngsw-worker.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err))
}

const requestNotificationPermission = async()=> {
    const permission = await window.Notification.requestPermission();
    if(permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
    else {
        console.log("Permission is granted");
    }
}