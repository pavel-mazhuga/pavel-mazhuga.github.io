import Vue from 'vue';
import vueCustomElement from 'vue-custom-element';
import * as Cookies from 'js-cookie';

Vue.use(vueCustomElement);

export function registerCustomElements() {
    if (Cookies.get('COOKIES_USAGE_ACCEPTED') !== 'true') {
        Vue.customElement('cookies-agreement', () =>
            import(
                /* webpackChunkName: "CookiesAgreement" */ './components/vue/CookiesAgreement/CookiesAgreement.vue'
            ).then((m) => m.default),
        );
    }
}
