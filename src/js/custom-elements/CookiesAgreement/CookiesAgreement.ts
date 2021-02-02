import { LitElement, css, html, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import * as Cookies from 'js-cookie';

import _styles from './CookiesAgreement.ce.scss';

export interface CookiesAgreement {
    revealTimeout: number;
    _isVisible: boolean;
    _timer: NodeJS.Timeout;
}

export class CookiesAgreement extends LitElement {
    constructor() {
        super();
        this._acceptCookiesUsage = this._acceptCookiesUsage.bind(this);

        this.revealTimeout = this.getAttribute('reveal-timeout')
            ? parseFloat(this.getAttribute('reveal-timeout') as string)
            : 5000;
        this._isVisible = false;
    }

    static get properties() {
        return {
            revealTimeout: {
                type: Number,
                attribute: 'reveal-timeout',
            },
            _isVisible: {
                type: Boolean,
                attribute: false,
            },
        };
    }

    static get styles() {
        return css`
            ${unsafeCSS(_styles)}
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this._timer = setTimeout(() => {
            this._isVisible = true;
        }, this.revealTimeout);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this._timer);
    }

    close() {
        this._isVisible = false;
    }

    protected _acceptCookiesUsage() {
        Cookies.set('COOKIES_USAGE_ACCEPTED', 'true', {
            expires: 365, // days
        });
        this.close();
    }

    render() {
        return html`
            <div class="${classMap({ banner: true, 'banner--visible': this._isVisible })}">
                <button
                    class="banner__close"
                    @click="${this._acceptCookiesUsage}"
                    aria-label="Принять и закрыть"
                    title="Принять и закрыть"
                >
                    ОК
                </button>
                <div class="banner__text">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'x-cookies-agreement': CookiesAgreement;
    }
}
