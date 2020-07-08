import { triggerEvent, triggerCustomEvent } from '@chipsadesign/frontend-utils';

import type { BaseResponse } from '../../js/types';

type AjaxFormSenderOptions = {
    onBeforeSend: () => void;
    onSuccess: (response: BaseResponse) => any;
    onError: (err: Error) => any;
    onComplete: () => void;
    data: Record<string, any>;
    shouldClearInputs?: boolean;
    inputSelector: string;
    method: string;
};

type Send = (url?: string) => Promise<BaseResponse>;

type AppendData = (...data: [string, string | Blob, string?]) => void;

export type AjaxFormSender = {
    send: Send;
    appendData: AppendData;
    clearInputs: () => void;
};

export const clearInputs = (inputs: HTMLInputElement[] = []) => {
    Array.from(inputs).forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type !== 'hidden') {
            input.value = '';
        }
        triggerEvent(input, 'blur');
    });
};

const defaultOptions: AjaxFormSenderOptions = {
    onBeforeSend: () => {},
    onSuccess: () => {},
    onError: () => {},
    onComplete: () => {},
    data: {},
    shouldClearInputs: true,
    inputSelector: '[name]:not([type="submit"]):not([type="reset"])',
    method: 'get',
};

export default (form: HTMLFormElement, _options: Partial<AjaxFormSenderOptions> = defaultOptions): AjaxFormSender => {
    const options: AjaxFormSenderOptions = { ...defaultOptions, ..._options };
    const method = (form.method || options.method).toLowerCase();
    const inputs = Array.from(form.querySelectorAll(options.inputSelector)) as HTMLInputElement[];
    let data: FormData | null;
    const preData: Record<string, any> = {};

    const appendData: AppendData = (..._data) => {
        const [key, value] = _data;
        preData[key] = value;
    };

    const send: Send = async (url = form.action) => {
        if (!(url && typeof url === 'string')) {
            throw new Error('Form does not have "action" attibute and url has not been provided');
        }

        if (['post', 'put', 'delete'].includes(method)) {
            data = new FormData(form);

            if (options.data) {
                Object.entries(options.data).forEach((entry) => {
                    data!.append(...entry);
                });
            }

            Object.entries(preData).forEach((entry) => {
                data!.append(...entry);
            });
        }

        form.classList.add('js-ajax-form--loading');
        options.onBeforeSend();
        triggerCustomEvent(form, 'send');

        try {
            let response: BaseResponse;

            if (method === 'get') {
                response = await fetch(url, { method }).then((res) => res.json());
            } else {
                response = await fetch(url, { method, body: data }).then((res) => res.json());
            }

            options.onSuccess(response);
            triggerCustomEvent(form, 'success', { data: response });
            form.classList.add('js-ajax-form--success');
            Array.from(form.querySelectorAll('.app-message')).forEach((messageElement) => {
                messageElement.textContent = '';
            });

            return response;
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

    return { appendData, send, clearInputs: () => clearInputs(inputs) };
};
