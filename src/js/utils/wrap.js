export default function wrap(el, wrapNodeType = 'div', options = {}) {
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
