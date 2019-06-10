import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';
import MESSAGES from './messages';
export { isEmail, equals };

const defaultInputSelector = '[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])';

const DEFAULT_OPTIONS = {
    inputSelector: defaultInputSelector,
    messages: MESSAGES,
};

export function isPhone(string) {
    return (/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{5,10}$/i).test(string);
}

export function validateInput(input, contextElement = document) {
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
        const options = Array.from(this.inputs.querySelectorAll('option'));
        const selectedOptions = options.filter((option) => option.selected
            && !option.hasAttribute('placeholder')
            && option.innerText !== input.getAttribute('placeholder'));
        return !!selectedOptions.length;
    }

    // Валидация равенства двух строк
    if (input.classList.contains('js-validate--equivalent')) {
        if (!input.hasAttribute('data-equivalent-name')) {
            throw new Error('[Validator] Please provide "data-equivalent-name" attribute for the input with a class "js-validate--equivalent".');
        }

        const fieldName = input.getAttribute('data-equivalent-name');
        const field = contextElement.querySelector(`[name="${fieldName}"]`);
        return equals(input.value, field.value);
    }

    // Кастомная валидация через регулярное выражение
    if (input.classList.contains('js-validate--custom')) {
        const regExp = input.getAttribute('data-custom-validation') || '.*';
        return (new RegExp(regExp, 'i')).test(input.value);
    }

    // Default
    return true;
}

export default (form, options = DEFAULT_OPTIONS) => {
    let isFormValid = true;
    const inputs = Array.from(form.querySelectorAll(inputSelector));

    inputs.forEach((input) => {
        const isValid = validateInput(input, form);

        if (isValid) {
            input.classList.remove('is-error');
        } else {
            isFormValid = false;
            const messageElement = input.nextElementSibling && input.nextElementSibling.classList.contains('app-message')
                ? input.nextElementSibling
                : null;

            input.classList.add('is-error');

            if (messageElement) {
                messageElement.textContent = '';

                switch (true) {
                case input.value.trim().length === 0 && input.hasAttribute('required'):
                    messageElement.textContent = options.messages.ru.EMPTY_FIELD;
                    break;
                case input.classList.contains('js-validate--custom')
                && input.hasAttribute('data-custom-validation-error-message'):
                    messageElement.textContent = input.getAttribute('data-custom-validation-error-message');
                    break;
                default:
                    break;
                }
            }
        }
    });

    return isFormValid;
};
