import axios from 'axios';
import { triggerEvent, triggerCustomEvent } from '../../utils';

const defaultInputSelector = '[name]:not([type="submit"]):not([type="reset"])';

export function clearInputs(form, inputSelector = defaultInputSelector) {
    Array.from(form.querySelectorAll(inputSelector)).forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
        triggerEvent(input, 'blur');
    });
}

export default class AjaxFormSender {
    constructor(form, options = {}) {
        this.beforeSendCallback = options.beforeSend || (() => { });
        this.successCallback = options.success || (() => { });
        this.errorCallback = options.error || (() => { });
        this.completeCallback = options.complete || (() => { });
        this.form = form;
        this.data = new FormData(form);
        this.shouldClearInputs = options.shouldClearInputs || true;
        this.inputSelector = options.inputSelector || defaultInputSelector;
        this.inputs = Array.from(form.querySelectorAll(this.inputSelector));

        if (options.data) {
            Object.entries(options.data).forEach((entry) => {
                this.data.append(...entry);
            });
        }
    }

    send(url = this.form.action) {
        return new Promise(async (resolve, reject) => {
            if (!(url && typeof url === 'string')) {
                const errorMessage = 'Form does not have "action" attibute and url has not been provided';
                console.error(errorMessage);
                reject(errorMessage);
                return;
            }

            let response = null;

            try {
                this.beforeSendCallback();
                triggerCustomEvent(this.form, 'send');
                this.form.classList.add('js-ajax-form--loading');

                if (this.form.method.toLowerCase() === 'get') {
                    response = await axios.get(url);
                }

                if (this.form.method.toLowerCase() === 'post') {
                    response = await axios.post(url, this.data);
                }

                this.successCallback();
                triggerCustomEvent(this.form, 'success');
                this.form.classList.add('js-ajax-form--success');
                Array.from(this.form.querySelectorAll('.app-message')).forEach((messageElement) => {
                    messageElement.textContent = '';
                });
                resolve(response.data);
            } catch (err) {
                this.errorCallback();
                triggerCustomEvent(this.form, 'error');
                this.form.classList.remove('js-ajax-form--error');
                reject(new Error(err.message || err));
            } finally {
                this.completeCallback();
                this.form.classList.remove('js-ajax-form--loading');

                if (this.shouldClearInputs) {
                    clearInputs(this.form);
                }
            }
        });
    }
}
