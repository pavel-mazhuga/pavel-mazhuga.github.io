export function triggerEvent(el, eventName) {
    let event;

    if (window.event) {
        try {
            event = new Event(eventName, { bubbles: true, cancelable: false });
        } catch (err) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, false);
        }
    } else {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, false);
    }

    el.dispatchEvent(event);
}

export function triggerCustomEvent(el, eventName, data = {}) {
    let event;

    if (window.CustomEvent) {
        try {
            event = new CustomEvent(eventName, { detail: data });
        } catch (err) {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
        }
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    el.dispatchEvent(event);
}
