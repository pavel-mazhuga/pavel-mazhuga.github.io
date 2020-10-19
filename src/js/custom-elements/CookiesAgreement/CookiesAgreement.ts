import { LitElement, css, html, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import * as Cookies from 'js-cookie';

import _styles from './CookiesAgreement.ce.scss';

export interface CookiesAgreement {
    isVisible: boolean;
    revealTimeout: number;
    _timer: NodeJS.Timeout;
}

export class CookiesAgreement extends LitElement {
    constructor() {
        super();
        this.revealTimeout = this.getAttribute('reveal-timeout')
            ? parseFloat(this.getAttribute('reveal-timeout')!)
            : 5000;
        this.isVisible = false;
    }

    static get properties() {
        return {
            revealTimeout: {
                type: Number,
            },
            isVisible: {
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
            this.isVisible = true;
        }, this.revealTimeout);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this._timer);
    }

    close() {
        this.isVisible = false;
    }

    acceptCookiesUsage() {
        Cookies.set('COOKIES_USAGE_ACCEPTED', 'true', {
            expires: 365, // days
        });
        this.close();
    }

    render() {
        return html`
            <div class="${classMap({ banner: true, 'banner--visible': this.isVisible })}">
                <button
                    class="banner__close"
                    @click="${() => this.acceptCookiesUsage()}"
                    aria-label="Принять и закрыть"
                    title="Принять и закрыть"
                >
                    ОК
                </button>
                <div class="banner__text">
                    Продолжая пользоваться сайтом, вы даёте
                    <a
                        href="#"
                        class="link-underline"
                        target="_blank"
                        rel="noopener"
                        aria-label="Согласие на автоматический сбор и анализ ваших данных"
                        >Согласие</a
                    >
                    на автоматический сбор и анализ ваших данных, необходимых для работы сайта и его улучшения,
                    использование файлов cookie.
                </div>
            </div>
        `;
    }
}
