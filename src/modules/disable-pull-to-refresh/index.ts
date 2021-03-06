export default () => {
    const isHtmlOverscrollBehaviorDisabled =
        window.getComputedStyle(document.documentElement).getPropertyValue('overscroll-behavior') !== 'auto';

    if (CSS && CSS.supports('overscroll-behavior', 'none')) {
        if (!isHtmlOverscrollBehaviorDisabled) {
            (document.documentElement.style as any).overscrollBehavior = 'none';
        }

        return () => {};
    }

    let _startY = 0;

    const onTouchStart = (event: TouchEvent) => {
        _startY = event.touches[0].pageY;
    };

    const onTouchMove = (event: TouchEvent) => {
        const y = event.touches[0].pageY;
        if (document.scrollingElement?.scrollTop === 0 && y > _startY) {
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
