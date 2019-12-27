export default (element: Element, eventName: string, fn: Function) => {
    element.addEventListener(eventName, function listener() {
        element.removeEventListener(eventName, listener);
        fn();
    });
};
