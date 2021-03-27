import './styles.scss';
import Flickity from 'flickity';
import Aladino from 'aladino';
import lerp from 'lerp';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import postprocessingShader from './shaders/postprocessing.glsl';

export const createSliders1 = baseExperiment('sliders-1', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const sliderAladino = new Aladino({
        density: 16,
        dpr: Math.min(devicePixelRatio, 2),
        canvas,
        post: {
            fragment: postprocessingShader,
            uniforms: {
                speed: 0.0,
            },
        },
    });

    const material = sliderAladino.material({
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
            speed: 0,
            speed2: 0,
        },
    });

    const cells = [...document.querySelectorAll('.slider-el')];
    const carpets = [];
    cells.forEach((cell) => {
        const carpet = sliderAladino.carpet(cell, {
            material,
            uniforms: {
                image: sliderAladino.texture(cell.currentSrc),
            },
        });

        carpets.push(carpet);
    });

    let oldProgress = 0;
    let speed = 0;
    const freeScroll = true;

    const slider = new Flickity(document.querySelector('.carousel')!, {
        accessibility: true,
        freeScroll,
        dragThreshold: freeScroll ? 0 : 30,
        // dragThreshold: 30,
        freeScrollFriction: 0.07,
        prevNextButtons: false,
        pageDots: false,
        // wrapAround: true,
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const exactCarpet = carpets.find((carpet) => entry.target === carpet.dom);
            if (exactCarpet) {
                exactCarpet.active = entry.isIntersecting;
            }
        });
    });

    cells.forEach((cell) => {
        observer.observe(cell);
    });

    slider.on('scroll', (progress) => {
        // The way flickity works doesn't allow an easy use of the position,
        // So it can be optimised, as here we're recalculating dom boundingbox each time
        carpets.forEach((carpet) => {
            carpet.resize();
        });

        speed = oldProgress - progress;
        oldProgress = progress;
    });

    function render() {
        material.uniforms.speed = lerp(material.uniforms.speed, speed, 0.6);
        material.uniforms.speed2 = lerp(material.uniforms.speed2, speed, 0.1);
        sliderAladino.post.uniforms.speed = lerp(sliderAladino.post.uniforms.speed, speed, 0.1);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        carpets.forEach((carpet) => {
            carpet.destroy();
        });
        carpets = [];
        sliderAladino.destroy();
        slider.destroy();
        gui.destroy();
    }

    animate();

    window.addEventListener('resize', () => {
        carpets.forEach((carpet) => {
            carpet.resize();
        });
    });

    module.hot?.addDisposeHandler(destroy);
});
