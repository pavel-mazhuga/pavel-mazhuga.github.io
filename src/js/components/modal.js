/* global $document $body */
import keyCodes from '../utils';

export default class Modal {
    constructor(name) {
        this.isOpen = false;
        this.name = name;
        this.$element = $(`.js-modal[data-modal="${name}"]`);
        this.$openButtons = $(`.js-modal-open[data-modal="${name}"]`);
        this.$closeButtons = $(`.js-modal-close[data-modal="${name}"]`);
        this.previousActiveElement = null;
    }

    init() {
        this.$openButtons.on(`click.modal-${this.name}`, () => this.open());
        this.$closeButtons.on(`click.modal-${this.name}`, () => this.close());
    }

    destroy() {
        this.$openButtons.off(`click.modal-${this.name}`);
        this.$closeButtons.off(`click.modal-${this.name}`);
        this.destroyActiveModalListeners();
        this.isOpen = false;
        this.$element = null;
        this.$openButtons = null;
        this.$closeButtons = null;
        this.$previousActiveElement = null;
    }

    open() {
        return new Promise((resolve) => {
            this.$previousActiveElement = $(document.activeElement);

            $body.children().each((index, child) => {
                if (child !== this.$element[0]) {
                    // Inert polyfill: https://github.com/WICG/inert
                    child.inert = true;
                }
            });

            this.$element
                .find('button')
                .first()
                .focus();

            this.isOpen = true;
            this.$element.addClass('is-open');
            this.initActiveModalListeners();
            $body.addClass('no-scroll');
            resolve();
        });
    }

    initActiveModalListeners() {
        $document.on(`touchmove.modal-${this.name}`, (event) => event.preventDefault());
        $document.on(`keydown.modal-${this.name}`, (event) => {
            if (event.target && $(event.target).is(':input')) return;
            if (event.keyCode === keyCodes.ESC) {
                event.preventDefault();
                if (this.isOpen) this.close();
            }
        });
    }

    destroyActiveModalListeners() {
        $document.off(`keydown.modal-${this.name}`);
        $document.off(`touchmove.modal-${this.name}`);
    }

    close() {
        return new Promise((resolve) => {
            this.destroyActiveModalListeners();
            this.isOpen = false;
            this.$element.removeClass('is-open');
            $body.removeClass('no-scroll');
            this.$element.scrollTop(0);
            resolve();

            $body.children().each((index, child) => {
                if (child !== this.$element[0]) {
                    // Inert polyfill: https://github.com/WICG/inert
                    child.inert = false;
                }
            });

            this.$previousActiveElement.focus();
        });
    }
}
