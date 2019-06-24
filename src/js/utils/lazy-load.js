export default function lazyLoad(img) {
    return new Promise((resolve, reject) => {
        const src = img.getAttribute('data-src');

        if (!src) {
            console.error('[lazy load] No source provided.');
            reject(new Error('No source provided.'));
            return;
        }

        img.src = src;
        img.onload = () => {
            img.classList.add('lazy--success');
            resolve(img);
        };
        img.onerror = (err) => {
            img.classList.add('lazy--error');
            reject(err);
        };
    });
}
