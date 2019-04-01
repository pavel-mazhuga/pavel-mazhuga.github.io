export const KEYCODES = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
};

export function lazyLoad(img) {
    return new Promise((resolve, reject) => {
        const src = img.getAttribute('data-src');

        if (!src) {
            console.error('[lazy load] No source provided.');
            reject(new Error('No source provided.'));
            return;
        }

        img.src = src;
        img.onload = () => {
            img.classList.add('lazy--success');
            resolve(img);
        };
        img.onerror = (err) => {
            img.classList.add('lazy--error');
            reject(err);
        };
    });
}

export function hasPageScrollbar() {
    return document.documentElement.clientWidth < window.innerWidth;
}

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
