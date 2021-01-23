import './Collapse.scss';
import { LitElement } from 'lit-element';
import { getCSSCustomProp } from '../../utils/css';

export interface Collapse {
    collapsed: boolean;
    toggler: HTMLElement | null;
    togglerText: HTMLElement | null;
    collapsedText?: string | null;
    expandedText?: string | null;
    content: HTMLElement | null;
    ro?: ResizeObserver;
    minVisibleHeight: number;
}

export class Collapse extends LitElement {
    constructor() {
        super();
        this.toggle = this.toggle.bind(this);
        this._onResize = this._onResize.bind(this);

        this.minVisibleHeight = 0;

        if ('ResizeObserver' in window) {
            this.ro = new ResizeObserver((entries, observer) => {
                entries.forEach((entry) => {
                    observer.unobserve(entry.target);
                    if (this.content) {
                        this.setUIState();
                    }
                });
            });
        }
    }

    static get properties() {
        return {
            id: {
                type: String,
            },
            collapsed: {
                type: Boolean,
                reflect: true,
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
        this.toggler = this.renderRoot.querySelector<HTMLElement>('[data-collapse-toggler]');
        this.togglerText = this.renderRoot.querySelector<HTMLElement>('[data-collapse-toggler-text]');
        this.content = this.renderRoot.querySelector<HTMLElement>('[data-collapse-content]');
        this.minVisibleHeight = getCSSCustomProp(this, '--min-visible-height', 'number') as number;

        if (this.toggler) {
            this.collapsedText = this.toggler.dataset.collapsedText;
            this.expandedText = this.toggler.dataset.expandedText;

            if (this.id && !this.toggler.getAttribute('aria-controls')) {
                this.toggler.setAttribute('aria-controls', `${this.id}`);
            }

            this.toggler.addEventListener('click', this.toggle);
        }

        if (this.content) {
            if (!this.content.id && this.id) {
                this.content.id = this.id;
            }

            if (this.ro) {
                const images = Array.from(this.content.querySelectorAll('img'));
                images.forEach((img) => this.ro?.observe(img));
            }
        }

        this.setUIState();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'collapsed') {
            this.setUIState();
            this.dispatchEvent(new Event(typeof newValue === 'string' ? 'collapse' : 'expand', { composed: true }));
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.content = null;

        if (this.toggler) {
            this.toggler.removeEventListener('click', this.toggle);
            this.toggler = null;
        }

        this.togglerText = null;
        this.ro?.disconnect();
    }

    setUIState() {
        if (this.content) {
            this.content.style.height = this.collapsed
                ? `${Math.min(this.minVisibleHeight, this.content.scrollHeight)}px`
                : `${this.content.scrollHeight}px`;
        }

        if (this.toggler) {
            this.toggler.setAttribute('aria-expanded', `${!this.collapsed}`);

            if (this.content) {
                if (this.minVisibleHeight >= this.content.scrollHeight) {
                    this.toggler.hidden = true;
                    if (this.content?.classList.contains('truncate-collapse-content')) {
                        this.content.classList.add('truncate-collapse-content--no-gradient');
                    }
                } else {
                    this.toggler.hidden = false;
                    if (this.content?.classList.contains('truncate-collapse-content')) {
                        this.content.classList.remove('truncate-collapse-content--no-gradient');
                    }
                }
            }
        }

        if (this.togglerText) {
            if (this.collapsedText && this.expandedText) {
                this.togglerText.textContent = this.collapsed ? this.collapsedText : this.expandedText;
            }
        }
    }

    toggle(event: any) {
        event.preventDefault();
        this.collapsed = !this.collapsed;
    }

    _onResize() {
        this.minVisibleHeight = getCSSCustomProp(this, '--min-visible-height', 'number') as number;
        this.setUIState();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'x-collapse': Collapse;
    }
}
