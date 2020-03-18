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

export function validateInput(input: HTMLInputElement): boolean {
    // Валидация заполненности поля
    if (input.hasAttribute('required') && input.value.trim().length === 0) {
        return false;
    }

    // Валидация электронной почты
    if (input.classList.contains('js-validate--email')) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isEmail(input.value) : true;
    }

    // Валидация телефона
    if (input.classList.contains('js-validate--phone')) {
        return input.hasAttribute('required') || input.value.trim().length > 0 ? isPhone(input.value) : true;
    }

    // Валидация чекбокса
    if (input.classList.contains('js-validate--checkbox')) {
        return input.checked;
    }

    // Валидация селекта
    if (input.classList.contains('js-validate--select')) {
        const options = Array.from(input.querySelectorAll('option'));
        const selectedOptions = options.filter(
            (option) =>
                option.selected &&
                !option.hasAttribute('placeholder') &&
                option.innerText !== input.getAttribute('placeholder'),
        );
        return !!selectedOptions.length;
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

    // Кастомная валидация через регулярное выражение
    if (input.classList.contains('js-validate--custom')) {
        const regExp = input.getAttribute('data-custom-validation') || '.*';
        return new RegExp(regExp, 'i').test(input.value);
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
    form.setAttribute('novalidate', 'true');
    const inputs = Array.from(form.querySelectorAll(options.inputSelector)) as HTMLInputElement[];

    function validate() {
        let isFormValid = true;
        const lang = getLang();
        clearMessages(form);

        inputs.forEach((input) => {
            const isValid = validateInput(input);
            const messageElement =
                input.parentElement && input.parentElement.querySelector('.app-message')
                    ? input.parentElement.querySelector('.app-message')
                    : null;

            if (isValid) {
                input.classList.remove('is-error');
            } else {
                isFormValid = false;
                input.classList.add('is-error');

                if (messageElement) {
                    messageElement.textContent = '';

                    switch (true) {
                        case input.value.trim().length === 0 && input.hasAttribute('required'):
                            messageElement.textContent = options.messages[lang].EMPTY_FIELD;
                            break;
                        case input.classList.contains('js-validate--email'):
                            messageElement.textContent = options.messages[lang].INVALIDATED_EMAIL;
                            break;
                        case input.classList.contains('js-validate--phone'):
                            messageElement.textContent = options.messages[lang].INVALIDATED_PHONE;
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
