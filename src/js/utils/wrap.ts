interface WrapOptions {
    class?: string;
}

export default (el: Element, wrapNodeType = 'div', options: WrapOptions = {}): Element => {
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
};
