/**
 * Слушает событие только до первого триггера.
 * Аналог метода "one" в jQuery.
 *
 * @param  {Element | Document | Window} element - DOM-элемент, который слушаем
 * @param  {string} eventName - название события
 * @param  {Function} callback
 */
export default (element: Element | Document | Window, eventName: string, callback: Function) => {
    element.addEventListener(eventName, function listener() {
        element.removeEventListener(eventName, listener);
        callback();
    });
};
