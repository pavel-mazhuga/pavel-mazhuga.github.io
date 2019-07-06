import axios from 'axios';
import { triggerEvent, triggerCustomEvent } from '../../js/utils';

export function clearInputs(inputs = []) {
    Array.from(inputs).forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
        triggerEvent(input, 'blur');
    });
}

const defaultOptions = {
    onBeforeSend: () => {},
    onSuccess: () => {},
    onError: () => {},
    onComplete: () => {},
    data: {},
    shouldClearInputs: true,
    inputSelector: '[name]:not([type="submit"]):not([type="reset"])',
    method: 'get',
};

export default class AjaxFormSender {
    constructor(form, options = defaultOptions) {
        this.form = form;
        this.options = options;
        this.method = (options.method || this.form.method).toLowerCase();
        this.inputs = Array.from(form.querySelectorAll(options.inputSelector));

        if (['post', 'put', 'delete'].includes(this.method)) {
            this.data = new FormData(form);
            if (options.data) {
                Object.entries(options.data).forEach((entry) => {
                    this.data.append(...entry);
                });
            }
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

            let response;

            this.form.classList.add('js-ajax-form--loading');
            this.options.onBeforeSend();
            triggerCustomEvent(this.form, 'send');

            try {
                if (this.method === 'get') {
                    response = await axios.get(url);
                }

                if (this.method === 'post') {
                    response = await axios.post(url, this.data);
                }

                if (this.method === 'put') {
                    response = await axios.put(url, this.data);
                }

                if (this.method === 'delete') {
                    response = await axios.delete(url, this.data);
                }

                this.options.onSuccess();
                triggerCustomEvent(this.form, 'success');
                this.form.classList.add('js-ajax-form--success');
                Array.from(this.form.querySelectorAll('.app-message')).forEach((messageElement) => {
                    messageElement.textContent = '';
                });
                resolve(response.data);
            } catch (err) {
                this.options.onError();
                triggerCustomEvent(this.form, 'error');
                this.form.classList.remove('js-ajax-form--error');
                reject(new Error(err.message || err));
            } finally {
                this.options.onComplete();
                this.form.classList.remove('js-ajax-form--loading');

                if (this.options.shouldClearInputs) {
                    clearInputs(this.inputs);
                }
            }
        });
    }
}
