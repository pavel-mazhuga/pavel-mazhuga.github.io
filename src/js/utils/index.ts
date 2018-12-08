export function triggerEvent (el: HTMLElement|Document|Window, eventName: string): void {
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
  
export function triggerCustomEvent (el: HTMLElement|Document|Window, eventName: string, data: Object = {}) {
    let event;

    if ((window as any).CustomEvent) {
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

interface wrapOptions {
    class?: string
}

export function wrap (
    el: HTMLElement,
    wrapNodeType: string = 'div',
    options: wrapOptions = {},
): HTMLElement {
    let parent = el.parentNode as HTMLElement;
    let wrap = document.createElement(wrapNodeType);

    if (options.class) {
        wrap.classList.add(options.class);
    }
  
    if (parent instanceof HTMLElement) {
        parent.insertBefore(wrap, el);
        wrap.appendChild(el);
        return wrap;
    }
  
    return el;
}

export function randomInt (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}