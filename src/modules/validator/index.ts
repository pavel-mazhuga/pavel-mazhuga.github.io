import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';

import messages from './messages';

export { isEmail, equals };

function getLang() {
    switch (true) {
        case /en/.test(document.documentElement.lang):
            return 'en';
        default:
            return 'ru';
    }
}

export function clearMessages(form: Element) {
    const messageElements = Array.from(form.querySelectorAll('.app-message'));
    messageElements.forEach((messageElement) => {
        messageElement.textContent = '';
    });
}

export function isPhone(string: string): boolean {
    return /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{5,10}$/i.test(string);
}

function isPhoneInput(input: HTMLInputElement) {
    return input.type === 'tel' || input.classList.contains('js-validate--phone');
}

function isEmailInput(input: HTMLInputElement) {
    return input.type === 'email' || input.classList.contains('js-validate--email');
}

function isCheckboxInput(input: HTMLInputElement) {
    return input.type === 'checkbox';
}

function isSelectInput(input: HTMLInputElement) {
    return input.tagName === 'select' || input.classList.contains('js-validate--select');
}

function isEmptyInput(input: HTMLInputElement) {
    return input.value.trim().length === 0;
}

export function validateInput(input: HTMLInputElement): boolean {
    // Кастомная валидация через регулярное выражение
    if (input.classList.contains('js-validate--custom')) {
        const regExp = input.getAttribute('data-custom-validation') || '.*';
        return new RegExp(regExp, 'i').test(input.value);
    }

    // Валидация электронной почты
    if (isEmailInput(input)) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isEmail(input.value) : true;
    }

    // Валидация телефона
    if (isPhoneInput(input)) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isPhone(input.value) : true;
    }

    // Валидация чекбокса
    if (isCheckboxInput(input)) {
        return input.hasAttribute('required') ? input.checked : true;
    }

    // Валидация селекта
    if (isSelectInput(input)) {
        const options = Array.from(input.querySelectorAll('option'));
        const selectedOptions = options.filter(
            (option) =>
                option.selected &&
                !option.hasAttribute('placeholder') &&
                option.innerText !== input.getAttribute('placeholder'),
        );
        return input.hasAttribute('required') ? !!selectedOptions.length : true;
    }

    // Валидация равенства двух строк
    if (input.classList.contains('js-validate--equivalent')) {
        if (!input.hasAttribute('data-equivalent-name')) {
            return false;
        }
        const fieldName = input.getAttribute('data-equivalent-name');
        const field = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | null;
        return field ? equals(input.value, field.value) : false;
    }

    // Валидация заполненности поля
    if (input.hasAttribute('required') && isEmptyInput(input)) {
        return false;
    }

    // Default
    return true;
}

const DEFAULT_OPTIONS = {
    inputSelector: '[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])',
    messages,
    onValidationSuccess: () => {},
    onValidationError: () => {},
    onValidationComplete: () => {},
};

export default (form: HTMLFormElement, options = DEFAULT_OPTIONS) => {
    form.setAttribute('novalidate', 'novalidate');
    const inputs = Array.from(form.querySelectorAll(options.inputSelector)) as HTMLInputElement[];

    function validate() {
        let isFormValid = true;
        const lang = getLang();
        clearMessages(form);

        inputs.forEach((input) => {
            const isValid = validateInput(input);
            const choicesDiv = input.closest('div.choices');
            const messageElement = (choicesDiv || input).parentElement?.querySelector('.app-message');

            if (isValid) {
                input.classList.remove('is-error');

                if (choicesDiv) {
                    choicesDiv.classList.remove('is-error');
                }
            } else {
                isFormValid = false;
                input.classList.add('is-error');

                if (choicesDiv) {
                    choicesDiv.classList.add('is-error');
                }

                if (messageElement) {
                    messageElement.textContent = '';

                    switch (true) {
                        case isEmptyInput(input) && input.hasAttribute('required'):
                            messageElement.textContent = options.messages[lang].EMPTY_FIELD;
                            break;
                        case isEmailInput(input):
                            messageElement.textContent = options.messages[lang].INVALIDATED_EMAIL;
                            break;
                        case isPhoneInput(input):
                            messageElement.textContent = options.messages[lang].INVALIDATED_PHONE;
                            break;
                        case isSelectInput(input):
                            messageElement.textContent = options.messages[lang].INVALIDATED_SELECT;
                            break;
                        case input.classList.contains('js-validate--equivalent'):
                            messageElement.textContent = options.messages[lang].INVALIDATED_EQUALS;
                            break;
                        case input.classList.contains('js-validate--custom') &&
                            input.hasAttribute('data-custom-validation-error-message'):
                            messageElement.textContent = input.getAttribute('data-custom-validation-error-message');
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        if (isFormValid) {
            options.onValidationSuccess();
        } else {
            options.onValidationError();
        }

        options.onValidationComplete();

        return isFormValid;
    }

    function clearFormMessages() {
        clearMessages(form);
    }

    return Object.freeze({
        validate,
        clearFormMessages,
        form,
        inputSelector: options.inputSelector,
        inputs,
    });
};
