import axios from 'axios';
import serialize from 'form-serialize';
import { triggerCustomEvent } from '../../utils/index';

export default class AjaxFormSender {
    constructor(form, shouldClearInputs = false) {
        this.form = form;
        this.shouldClearInputs = shouldClearInputs;
        this.inputSelector = '[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])';
    }

    send(url = this.form.action) {
        return new Promise((resolve, reject) => {
            if (!(url && typeof url === 'string')) {
                const errorMessage = 'Form does not have "action" attibute and url has not been provided';
                console.error(errorMessage);
                reject(errorMessage);
            }

            triggerCustomEvent(this.form, 'send');
            this.form.classList.add('js-ajax-form--is-loading');

            const method = ['get', 'post'].includes(this.form.method.toLowerCase())
                ? this.form.method.toLowerCase()
                : 'post';

            const data = {
                formName: this.form.name,
                data: serialize(this.form, { hash: true }),
            };

            switch (method) {
            case 'get':
                axios.get(url).then((response) => {
                    this.form.classList.remove('js-ajax-form--is-loading');
                    resolve(response.data);
                });
                break;
            case 'post':
                axios.post(url, data).then((response) => {
                    this.form.classList.remove('js-ajax-form--is-loading');
                    resolve(response.data);
                });
                break;
            default:
                break;
            }
        });
    }
}