import './LitPopup.scss';
import { LitElement } from 'lit-element';
import LitPopup from 'lit-popup';
import { getCSSCustomProp } from '../../utils/css';

export interface LitPopupElement {
    instance: LitPopup;
    _wasBodyLocked: boolean;
    _leaveTimeout: NodeJS.Timeout;
}

const NO_SCROLL_CLASS = 'no-scroll';

export class LitPopupElement extends LitElement {
    constructor() {
        super();
        this._wasBodyLocked = false;
    }

    static get properties() {
        return {
            name: {
                type: Boolean,
            },
            opened: {
                type: String,
            },
        };
    }

    createRenderRoot() {
        /**
         * Render template without shadow DOM. Note that shadow DOM features like
         * encapsulated CSS and slots are unavailable.
         */
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        const name = this.getAttribute('data-lit-popup');
        const leaveDurationInSeconds = getCSSCustomProp(this, '--leave-duration', 'number') as number;

        if (!name) {
            throw new Error('[lit-popup] Name should be provided.');
        }

        this.instance = new LitPopup(name, {
            onOpen: () => {
                clearTimeout(this._leaveTimeout);
                this._lockBodyScroll();
            },
            onOpenComplete: () => {
                const focusableOnOpenElement = this.renderRoot.querySelector<HTMLElement>('[data-focus-on-popup-open]');
                setTimeout(() => focusableOnOpenElement?.focus({ preventScroll: true }), 50);
            },
            onClose: () => {
                this._leaveTimeout = setTimeout(() => {
                    this._unlockBodyScroll();
                }, leaveDurationInSeconds * 1000);
            },
        });
    }

    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
        super.attributeChangedCallback(name, oldVal, newVal);

        if (name === 'opened') {
            if (typeof newVal === 'string') {
                this.instance.open();
            } else {
                this.instance.close();
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this._leaveTimeout);

        if (this.instance) {
            this.instance.destroy();
        }
    }

    open() {
        this.instance?.open();
    }

    close() {
        this.instance?.close();
    }

    protected _lockBodyScroll() {
        this._wasBodyLocked = document.body.classList.contains(NO_SCROLL_CLASS);

        if (!this._wasBodyLocked) {
            document.body.classList.add(NO_SCROLL_CLASS);
        }
    }

    protected _unlockBodyScroll() {
        if (!this._wasBodyLocked) {
            document.body.classList.remove(NO_SCROLL_CLASS);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-popup': LitPopupElement;
    }
}
