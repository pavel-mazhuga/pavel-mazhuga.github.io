import debounce from 'lodash.debounce';

export default () => {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') === -1) {
        // В Google Chrome все норм, нет нужды в этом скрипте
        return () => {};
    }

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const calculateVhOnResize = debounce(() => {
        if (!window.matchMedia('(max-width: 1024px)').matches) {
            return;
        }

        const newVh = window.innerHeight * 0.01;

        if (newVh > vh) {
            document.documentElement.style.setProperty('--vh', `${newVh}px`);
        }
    }, 40);

    const calculateVhOnOrientationChange = debounce(() => {
        if (!window.matchMedia('(max-width: 1024px)').matches) {
            return;
        }

        const newVh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${newVh}px`);
    }, 50);

    window.addEventListener('resize', calculateVhOnResize);
    window.addEventListener('orientationchange', calculateVhOnOrientationChange);

    return () => {
        window.removeEventListener('resize', calculateVhOnResize);
        window.removeEventListener('orientationchange', calculateVhOnOrientationChange);
    };
};
