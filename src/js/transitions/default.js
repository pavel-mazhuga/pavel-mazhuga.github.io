/* eslint-disable */
import Barba from 'barba.js';

export default Barba.BaseTransition.extend({
    start() {
        this.newContainerReady.promise.then(() => {
            this.newContainer.style.display = 'none';
        });
        this.newContainerLoading.then(() => this.finish());
    },

    finish() {
        this.oldContainer.style.display = 'none';
        this.newContainer.style.display = '';
        this.newContainer.style.visibility = '';
        // window.scrollTo(0, 0);
        this.done();
    },
});
