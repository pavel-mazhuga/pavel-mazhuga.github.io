export default function initLazy(fn = () => new Promise(resolve => resolve()), selector) {
    return new Promise(async (resolve) => {
        const elements = typeof selector === 'string' ? Array.from(document.querySelectorAll(selector)) : null;

        if (!(elements && elements.length)) {
            resolve(await fn());
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    elements.forEach(element => observer.unobserve(element));
                    resolve(await fn());
                }
            });
        });

        elements.forEach(element => observer.observe(element));
    });
}
