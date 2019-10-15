import { triggerEvent, triggerCustomEvent } from '../../js/utils/trigger-event';

export const clearInputs = (inputs = []) => {
    Array.from(inputs).forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
        triggerEvent(input, 'blur');
    });
};

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

export default (form, _options = defaultOptions) => {
    const options = { ...defaultOptions, ..._options };
    const { method } = options;
    const inputs = Array.from(form.querySelectorAll(options.inputSelector));
    let data;
    if (['post', 'put', 'delete'].includes(method)) {
        data = new FormData(form);
        if (options.data) {
            Object.entries(options.data).forEach((entry) => {
                data.append(...entry);
            });
        }
    }

    const send = async (url = form.action) => {
        if (!(url && typeof url === 'string')) {
            throw new Error('Form does not have "action" attibute and url has not been provided');
        }

        form.classList.add('js-ajax-form--loading');
        options.onBeforeSend();
        triggerCustomEvent(form, 'send');

        try {
            let response;

            if (method === 'get') {
                response = await fetch(url, { method }).then((res) => res.json());
            }

            if (['post', 'put', 'delete'].includes(method)) {
                response = await fetch(url, { method, data }).then((res) => res.json());
            }

            options.onSuccess(response.data);
            triggerCustomEvent(form, 'success', { data: response.data });
            form.classList.add('js-ajax-form--success');
            Array.from(form.querySelectorAll('.app-message')).forEach((messageElement) => {
                messageElement.textContent = '';
            });

            return response.data;
        } catch (err) {
            options.onError(err);
            triggerCustomEvent(form, 'error', { error: err });
            form.classList.remove('js-ajax-form--error');

            throw new Error(err.message || err);
        } finally {
            options.onComplete();
            form.classList.remove('js-ajax-form--loading');

            if (options.shouldClearInputs) {
                clearInputs(inputs);
            }
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        send();
    };

    const destroy = () => {
        form.removeEventListener('submit', onSubmit);
    };

    /**
     * Init
     */

    form.addEventListener('submit', onSubmit);

    return { send, destroy };
};
