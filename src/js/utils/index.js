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

export function wrap(el, wrapNodeType = 'div', options = {}) {
    const parent = el.parentNode;
    const wrapper = document.createElement(wrapNodeType);

    if (options.class) {
        wrapper.classList.add(options.class);
    }

    if (parent) {
        parent.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        return wrapper;
    }

    return el;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
    return min + (Math.random() * (max - min));
}
