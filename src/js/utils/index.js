export const KEYCODES = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
};

export { default as initLazy } from './init-lazy';
export { default as lazyLoad } from './lazy-load';
export { default as hasPageScrollbar } from './has-page-scrollbar';
export { default as wrap } from './wrap';
export { default as once } from './add-event-listener-once';
export { triggerEvent, triggerCustomEvent } from './trigger-event';
export { randomInt, randomFloat } from './math';
