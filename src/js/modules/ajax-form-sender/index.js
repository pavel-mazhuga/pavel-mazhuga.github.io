const defaultInputSelector = '[name]:not([type="submit"]):not([type="reset"])';

export function clearInputs(form, inputSelector = defaultInputSelector) {
    $(form).find(inputSelector).each((index, input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }

        $(input).trigger('blur');
    });
}

export default class AjaxFormSender {
    constructor(form, options = {}) {
        this.$form = $(form);
        this.shouldClearInputs = options.shouldClearInputs || true;
        this.inputSelector = options.inputSelector || defaultInputSelector;
        this.inputs = this.$form.find(this.inputSelector);

        if (options.accepts) {
            this.accepts = options.accepts;
        }

        if (options.converters) {
            this.converters = options.converters;
        }

        if (options.dataType) {
            this.dataType = options.dataType;
        }

        if (options.cache) {
            this.cache = options.cache;
        }

        if (options.contents) {
            this.contents = options.contents;
        }

        if (options.contentType) {
            this.contentType = options.contentType;
        }

        if (options.data) {
            this.data = options.data;
        }

        this.headers = options.headers || {};
        this.beforeSendCallback = options.beforeSend || (() => {});
        this.successCallback = options.success || (() => {});
        this.errorCallback = options.error || (() => {});
        this.completeCallback = options.complete || (() => {});
    }

    send(url = this.$form[0].action) {
        return new Promise((resolve, reject) => {
            if (!(url && typeof url === 'string')) {
                const errorMessage = 'Form does not have "action" attibute and url has not been provided';
                console.error(errorMessage);
                reject(errorMessage);
                return;
            }

            $.ajax({
                url,
                ...(this.accepts ? { accepts: this.accepts } : {}),
                ...(this.converters ? { converters: this.converters } : {}),
                ...(this.dataType ? { dataType: this.dataType } : {}),
                ...(this.cache ? { cache: this.cache } : {}),
                ...(this.contents ? { contents: this.contents } : {}),
                ...(this.headers ? { headers: this.headers } : {}),
                method: this.$form.attr('method').toUpperCase() || 'GET',
                ...(this.data ? { data: this.data } : {}),
                beforeSend: () => {
                    this.beforeSendCallback();
                    this.$form.trigger('send');
                    this.$form.addClass('js-ajax-form--loading');
                },
                success: (response) => {
                    this.successCallback();
                    this.$form.trigger('success');
                    this.$form.addClass('js-ajax-form--success');
                    this.$form.find('.app-message').each((index, messageElement) => {
                        $(messageElement).text('');
                    });

                    resolve(response.data);
                },
                error: (err) => {
                    this.errorCallback();
                    this.$form.trigger('error');
                    this.$form.removeClass('js-ajax-form--error');
                    reject(new Error(err));
                },
                complete: () => {
                    this.completeCallback();
                    this.$form.removeClass('js-ajax-form--loading');

                    if (this.shouldClearInputs) {
                        clearInputs(this.$form[0]);
                    }
                },
            });
        });
    }
}
