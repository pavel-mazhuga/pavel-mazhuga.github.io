import Barba from 'barba.js';

function hideOutline() {
    this.style.outline = '0';
}

function restoreOutline() {
    this.style.outline = '';
}

function blur() {
    this.blur();
}

export default Barba.BaseView.extend({
    onEnter() {
        $('.js-blur')
            .on('mouseenter.blur', hideOutline)
            .on('mouseleave.blur', restoreOutline)
            .on('click.blur touch.blur', blur);
    },

    onEnterCompleted() {
        //
    },

    onLeave() {
        $('.js-blur')
            .off('mouseenter.blur')
            .off('mouseleave.blur')
            .off('click.blur touch.blur');
    },

    onLeaveCompleted() {
        //
    },
});
