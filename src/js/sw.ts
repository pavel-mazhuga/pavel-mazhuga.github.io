/* global PUBLIC_PATH */
async function register() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register(`${PUBLIC_PATH}service-worker.js`);
        } catch (err) {
            console.log('SW registration failed: ', err);
        }
    }
}

async function unregister() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        registrations.forEach((registration) => {
            registration.unregister();
        });
    }
}

const _module = { register, unregister };

export default _module;
