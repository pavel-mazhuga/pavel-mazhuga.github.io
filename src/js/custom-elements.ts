import * as Cookies from 'js-cookie';

export function registerCustomElements() {
    if (Cookies.get('COOKIES_USAGE_ACCEPTED') !== 'true') {
        //     import(/* webpackChunkName: "CookiesAgreement" */ './custom-elements/CookiesAgreement/CookiesAgreement').then(
        //         ({ CookiesAgreement }) => {
        //             window.customElements.define('app-cookies-agreement', CookiesAgreement);
        //         },
        //     );
    }
}
