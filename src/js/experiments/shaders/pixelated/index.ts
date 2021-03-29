import './styles.scss';
import Aladino from 'aladino';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import postprocessingShader from './shaders/postprocessing.glsl';

export const createShadersPixelated = baseExperiment('shaders-pixelated', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const sliderAladino = new Aladino({
        density: 1,
        dpr: Math.min(devicePixelRatio, 2),
        canvas,
        post: {
            fragment: postprocessingShader,
            uniforms: {
                pixelSize: 50,
            },
        },
    });

    const material = sliderAladino.material({
        vertex: vertexShader,
        fragment: fragmentShader,
    });

    const img = document.querySelector('img') as HTMLImageElement;

    const carpet = sliderAladino.carpet(img, {
        material,
        uniforms: {
            image: sliderAladino.texture(img.currentSrc),
        },
    });

    function render() {
        if (sliderAladino.post.uniforms.pixelSize > 1) {
            sliderAladino.post.uniforms.pixelSize -= 0.5;
        }
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        carpet.destroy();
        sliderAladino.destroy();
        gui.destroy();
    }

    animate();

    window.addEventListener('resize', () => {
        carpet.resize();
    });

    module.hot?.addDisposeHandler(destroy);
});
