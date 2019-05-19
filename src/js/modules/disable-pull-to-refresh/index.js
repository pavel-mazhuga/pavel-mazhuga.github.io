export default () => {
    const isHtmlOverscrollBehaviorDisabled = window.getComputedStyle(document.documentElement)
        .getPropertyValue('overscroll-behavior') !== 'auto';

    if (CSS && CSS.supports('overscroll-behaviour', 'none')) {
        if (!isHtmlOverscrollBehaviorDisabled) {
            document.documentElement.style.overscrollBehavior = 'none';
        }

        return () => {};
    }

    let _startY;

    const onTouchStart = (event) => {
        _startY = event.touches[0].pageY;
    };

    const onTouchMove = (event) => {
        const y = event.touches[0].pageY;
        if (document.scrollingElement.scrollTop === 0 && y > _startY) {
            event.preventDefault();
        }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchmove', onTouchMove);
    };
};
