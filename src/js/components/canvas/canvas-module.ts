import { BaseEntity } from '../../offscreen-canvas-proxy';
import { CanvasData } from '.';

interface State {
    shouldRender: boolean;
}

export default class Canvas extends BaseEntity {
    private rAF: number;

    private state: State;

    constructor(readonly options: CanvasData) {
        super(options);

        this.state = {
            shouldRender: true,
        };

        this.animate = this.animate.bind(this);

        this.init();
    }

    async render() {
        console.log(typeof window);
    }

    async animate() {
        console.log(this.state);
        if (this.state.shouldRender) {
            this.render();
        }

        this.rAF = requestAnimationFrame(this.animate);
    }

    async init() {
        this.rAF = requestAnimationFrame(this.animate);
    }

    async destroy() {
        cancelAnimationFrame(this.rAF);
    }
}
