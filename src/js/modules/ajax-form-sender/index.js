import axios from 'axios';
import serialize from 'form-serialize';
import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';
import { triggerEvent, triggerCustomEvent } from '../../utils/index';

export default class AjaxFormSender {
    constructor(form, shouldClearInputs = false) {
        this.form = form;
        this.isValid = true;
        this.shouldClearInputs = shouldClearInputs;
        this.inputSelector = '[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])';
        this.inputs = this.form.querySelectorAll(this.inputSelector);
    }

    send(url = this.form.action) {
        return new Promise((resolve, reject) => {
            if (!(url && typeof url === 'string')) {
                const errorMessage = 'Form does not have "action" attibute and url has not been provided';
                console.error(errorMessage);
                reject(errorMessage);
            }

            this.validate();

            if (!this.isValid) {
                reject(new Error('Validation failed'));
                return;
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

            const onSuccess = (response) => {
                triggerCustomEvent(this.form, 'success');
                this.form.classList.add('js-ajax-form--success');
                resolve(response.data);
            };

            const onFail = (err) => {
                triggerCustomEvent(this.form, 'failure');
                this.form.classList.remove('js-ajax-form--failure');
                reject(err);
                console.error(err);
                throw new Error(`Failed to send the form ${this.formName}`);
            };

            const afterSend = () => {
                this.form.classList.remove('js-ajax-form--is-loading');
                if (this.shouldClearInputs) {
                    this.clearInputs();
                }
            };

            switch (method) {
            case 'get':
                axios.get(url)
                    .then(onSuccess)
                    .catch(onFail)
                    .finally(afterSend);
                break;
            case 'post':
                axios.post(url, data)
                    .then(onSuccess)
                    .catch(onFail)
                    .finally(afterSend);
                break;
            default:
                break;
            }
        });
    }

    clearInputs() {
        Array.from(this.inputs).forEach((input) => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }

            triggerEvent('blur', input);
        });
    }

    validate() {
        Array.from(this.inputs).forEach((input) => {
            const isValid = AjaxFormSender.validateInput(input);

            if (isValid) {
                input.classList.remove('is-error');
            } else {
                this.isValid = false;
                input.classList.add('is-error');
                // show error message?
            }
        });
    }

    static validateInput(input) {
        if (input.classList.contains('js-validate--email')) {
            return isEmail(input.value);
        }

        if (input.classList.contains('js-validate--phone')) {
            return /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{5,10}$/i.test(input.value);
        }

        if (input.classList.contains('js-validate--checkbox')) {
            return input.checked;
        }

        if (input.classList.contains('js-validate--select')) {
            const options = Array.from(this.inputs.querySelectorAll('option'));
            const selectedOption = options.filter(option => option.selected
                && !option.hasAttribute('placeholder')
                && option.innerText !== input.getAttribute('placeholder'));
            return !!selectedOption.length;
        }

        if (input.classList.contains('js-validate--equivalent')) {
            if (!input.hasAttribute('data-equivalent-name')) {
                return false;
            }

            const fieldName = input.getAttribute('data-equivalent-name');
            const field = document.querySelector(`[name="${fieldName}"]`);

            return equals(input.value, field.value);
        }

        if (input.classList.contains('js-validate--custom')) {
            const regExp = input.getAttribute('data-custom-validation') || '.*';
            return (new RegExp(regExp, 'i')).test(input.value);
        }

        return true;
    }
}
