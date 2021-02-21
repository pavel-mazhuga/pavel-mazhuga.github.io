import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'three/examples/jsm/libs/dat.gui.module';

type Experiment = (data: {
    canvas: HTMLCanvasElement;
    onRender: () => void;
    gui: any;
    sizes: { width: number; height: number };
}) => void;

export function baseExperiment(name: string, fn: Experiment) {
    return () => {
        const canvas = document.querySelector<HTMLCanvasElement>(`.js-canvas[data-experiment="${name}"]`);

        if (!canvas) {
            return;
        }

        let canvasRect = canvas.getBoundingClientRect();

        const sizes = {
            width: canvasRect.width,
            height: canvasRect.height,
        };

        const stats = new Stats();
        document.body.appendChild(stats.domElement);

        const gui = new dat.GUI();

        function onRender() {
            stats.update();
        }

        fn({ sizes, gui, canvas, onRender });

        window.addEventListener('resize', () => {
            canvasRect = canvas.getBoundingClientRect();
            sizes.width = canvasRect.width;
            sizes.height = canvasRect.height;
        });
    };
}
