import './styles.scss';
import { baseExperiment } from '../../base';
// import postprocessingShader from './shaders/postprocessing.glsl';
import MainSlider from './main-slider';
import MainWebglSlider from './main-slider/webgl-slider';
import { isWebGLAvailable } from '../../../utils/webgl';

const _isWebGLAvailable = isWebGLAvailable();

export const createSlidersFullscreen = baseExperiment('sliders-fullscreen', ({ canvas, sizes, onRender, gui }) => {
    const mainSliderContainer = document.querySelector('.js-main-slider');
    let mainSlider: any;
    if (mainSliderContainer) {
        const MainSliderConstructor = _isWebGLAvailable ? MainWebglSlider : MainSlider;
        mainSlider = new MainSliderConstructor(mainSliderContainer, {
            duration: 2500,
            autoplay: true,
            delay: 5000,
            // paused: true,
            canvas,
        });
    }

    // function render() {
    //     console.log('render');
    //     // material.uniforms.speed = lerp(material.uniforms.speed, speed, 0.6);
    //     // material.uniforms.speed2 = lerp(material.uniforms.speed2, speed, 0.1);
    //     // sliderAladino.post.uniforms.speed = lerp(sliderAladino.post.uniforms.speed, speed, 0.1);
    // }

    // function animate() {
    //     render();
    //     this.rAF = requestAnimationFrame(animate);
    // }

    function destroy() {
        cancelAnimationFrame(this.rAF);

        if (mainSlider) {
            mainSlider.destroy();
            mainSlider = null;
        }

        gui.destroy();
    }

    // animate();

    module.hot?.addDisposeHandler(destroy);
});
