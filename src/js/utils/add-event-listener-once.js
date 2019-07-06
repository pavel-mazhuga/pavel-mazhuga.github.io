export default function once(element, eventName, fn) {
    element.addEventListener(eventName, function listener() {
        element.removeEventListener(eventName, listener);
        fn();
    });
}
