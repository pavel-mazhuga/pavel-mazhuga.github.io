import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';

const defaultInputSelector = '[name]:not([type="submit"]):not([type="reset"]):not([type="hidden"])';

function validateInput(input) {
    // Валидация электронной почты
    if (input.classList.contains('js-validate--email')) {
        return isEmail(input.value);
    }

    // Валидация телефона
    if (input.classList.contains('js-validate--phone')) {
        return (/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{5,10}$/i).test(input.value);
    }

    // Валидация чекбокса
    if (input.classList.contains('js-validate--checkbox')) {
        return input.checked;
    }

    // Валидация селекта
    if (input.classList.contains('js-validate--select')) {
        const options = Array.from(this.inputs.querySelectorAll('option'));
        const selectedOption = options.filter((option) => option.selected
            && !option.hasAttribute('placeholder')
            && option.innerText !== input.getAttribute('placeholder'));
        return !!selectedOption.length;
    }

    // Валидация равенства двух строк
    if (input.classList.contains('js-validate--equivalent')) {
        if (!input.hasAttribute('data-equivalent-name')) {
            return false;
        }

        const fieldName = input.getAttribute('data-equivalent-name');
        const field = document.querySelector(`[name="${fieldName}"]`);

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

export default (form, inputSelector = defaultInputSelector) => {
    let isFormValid = true;

    $(form).find(inputSelector).each((index, input) => {
        const isValid = validateInput(input);
        const $input = $(input);

        if (isValid) {
            $input.removeClass('is-error');
        } else {
            isFormValid = false;
            const $messageElement = $input.next('.app-message');

            $input.addClass('is-error');
            $messageElement.val('');

            switch (true) {
            case input.value.length === 0 && input.hasAttribute('required'):
            case !$input.hasClass('js-validate--custom') && input.hasAttribute('data-validation-error-message'):
                $messageElement.text($input.data('validation-error-message'));
                break;

            case $input.hasClass('js-validate--custom') && input.hasAttribute('data-custom-validation-error-message'):
                $messageElement.text($input.data('custom-validation-error-message'));
                break;

            default:
                break;
            }
        }
    });

    return isFormValid;
};
