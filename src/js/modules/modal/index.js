import { KEYCODES, triggerCustomEvent } from '../../utils';
import { withPrefix } from './utils';

const EVENTS = {
    BEFORE_OPEN: 'before-open',
    AFTER_OPEN: 'after-open',
    AFTER_CLOSE: 'after-close',
    BEFORE_CLOSE: 'before-close',
};

const CLASSES = {
    IS_OPENING: 'app-modal--is-opening',
    IS_CLOSING: 'app-modal--is-closing',
    OPENED: 'app-modal--opened',
};

const SELECTORS = {
    CONTAINER: '.app-modal-container',
};

const defaultOptions = {
    beforeOpen: () => {},
    openAnimation: () => new Promise(resolve => resolve()),
    afterOpen: () => {},
    beforeClose: () => {},
    closeAnimation: () => new Promise(resolve => resolve()),
    afterClose: () => {},
};

export default class Modal {
    constructor(name, options = {}) {
        if (!name) {
            throw new Error(withPrefix('Expected a name as a first argument.'));
        }

        this.isOpen = false;
        this.options = { ...defaultOptions, ...options };
        this.element = document.querySelector(`[data-modal="${name}"]`);

        if (!this.element) {
            throw new Error(withPrefix('Element not found.'));
        }

        this.elementContent = this.element.querySelector(SELECTORS.CONTAINER);
        this.openButtons = Array.from(document.querySelectorAll(`[data-modal-open="${name}"]`));
        this.closeButtons = Array.from(document.querySelectorAll(`[data-modal-close="${name}"]`));
        this.previousActiveElement = null;
        this.hooksArgs = {
            element: this.element,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onDocumentKeydown = this.onDocumentKeydown.bind(this);

        this.init();
    }

    static beforeOpen() {}

    static afterOpen() {}

    static beforeClose() {}

    static afterClose() {}

    init() {
        this.openButtons.forEach((btn) => btn.addEventListener('click', this.open));
        this.closeButtons.forEach((btn) => btn.addEventListener('click', this.close));
    }

    destroy() {
        this.openButtons.forEach((btn) => btn.removeEventListener('click', this.open));
        this.closeButtons.forEach((btn) => btn.removeEventListener('click', this.close));
        this.destroyActiveModalListeners();
        this.isOpen = false;
        this.element = null;
        this.openButtons = null;
        this.closeButtons = null;
        this.previousActiveElement = null;
    }

    beforeOpen() {
        const firstFocusableElement = this.element.querySelector(':not([disabled])');
        this.previousActiveElement = document.activeElement;

        Array.from(this.element.parentElement.children).forEach((child) => {
            if (child !== this.element) {
                // Inert polyfill: https://github.com/WICG/inert
                child.inert = true;
            }
        });

        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }

        this.isOpen = true;
        Modal.isOpen = true;
        this.element.classList.add(CLASSES.OPENED, CLASSES.IS_OPENING);
        this.initActiveModalListeners();
        Modal.beforeOpen();
        this.options.beforeOpen(this.hooksArgs);
        triggerCustomEvent(this.element, EVENTS.BEFORE_OPEN);
    }

    afterOpen() {
        this.element.classList.remove(CLASSES.IS_OPENING);
        Modal.afterOpen();
        this.options.afterOpen(this.hooksArgs);
        triggerCustomEvent(this.element, EVENTS.AFTER_OPEN);
    }

    beforeClose() {
        this.destroyActiveModalListeners();
        this.element.classList.add(CLASSES.IS_CLOSING);
        Modal.beforeClose();
        this.options.beforeClose(this.hooksArgs);
        triggerCustomEvent(this.element, EVENTS.BEFORE_CLOSE);
    }

    afterClose() {
        this.isOpen = false;
        this.element.classList.remove(CLASSES.IS_CLOSING, CLASSES.OPENED);

        if (this.elementContent && this.elementContent.scrollTo) {
            this.elementContent.scrollTo(0, 0);
        }

        Array.from(this.element.parentElement.children).forEach((child) => {
            if (child !== this.element) {
                child.inert = false;
            }
        });

        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }

        Modal.afterClose();
        this.options.afterClose(this.hooksArgs);
        triggerCustomEvent(this.element, EVENTS.AFTER_CLOSE);
    }

    async open() {
        this.beforeOpen();
        await this.options.openAnimation(this.hooksArgs);
        this.afterOpen();
    }

    async close() {
        this.beforeClose();
        await this.options.closeAnimation(this.hooksArgs);
        this.afterClose();
    }

    initActiveModalListeners() {
        document.addEventListener('keydown', this.onDocumentKeydown);
    }

    destroyActiveModalListeners() {
        document.removeEventListener('keydown', this.onDocumentKeydown);
    }

    onDocumentKeydown(event) {
        if (event.keyCode === KEYCODES.ESC) {
            event.preventDefault();
            if (this.isOpen) this.close();
        }
    }
}
