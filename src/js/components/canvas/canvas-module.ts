import { BaseEntity } from '../../offscreen-canvas-proxy';
import { CanvasData } from '.';

interface State {
    shouldRender: boolean;
    dpr: number;
    width: number;
    height: number;
    time: number;
}

export const randomId = `__offscreen-canvas-proxy__${Math.floor(Math.random())}`;

export default class Canvas extends BaseEntity {
    private state: State;

    constructor(readonly options: CanvasData) {
        super(options);

        this.state = {
            shouldRender: true,
            width: options.width,
            height: options.height,
            dpr: options.dpr,
            time: 0,
        };

        if (!this.canvas.style) {
            this.canvas.style = {};
            this.canvas.style.width = options.width;
            this.canvas.style.height = options.height;
        }

        this.canvas.width = options.width * options.dpr;
        this.canvas.height = options.height * options.dpr;

        this.animate = this.animate.bind(this);

        this.init();
    }

    async init() {
        this.ctx = this.canvas.getContext('2d');
        this.rAF = requestAnimationFrame(this.animate);
    }

    async destroy() {
        cancelAnimationFrame(this.rAF);
    }

    private drawLine() {
        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.state.time);
        this.ctx.lineTo(this.state.width, this.state.time);
        this.ctx.stroke();
    }

    async render() {
        this.state.time = this.state.time > 300 ? 0 : this.state.time + 1;
        this.drawLine();
    }

    async animate() {
        if (this.state.shouldRender) {
            this.render();
        }

        this.rAF = requestAnimationFrame(this.animate);
    }
}

if (typeof window !== 'undefined') {
    window[randomId] = Canvas;
}
