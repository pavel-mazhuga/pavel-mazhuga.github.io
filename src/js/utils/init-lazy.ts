export default function initLazy(fn: Function, selector: string): Promise<void> {
    return new Promise((resolve) => {
        const elements = typeof selector === 'string' ? Array.from(document.querySelectorAll(selector)) : null;

        if (!(elements && elements.length)) {
            fn().then(resolve);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    elements.forEach((element) => observer.unobserve(element));
                    resolve(await fn());
                }
            });
        });

        elements.forEach((element) => observer.observe(element));
    });
}
