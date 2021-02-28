import './styles.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import KeenSlider from 'keen-slider';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { disposeMesh } from '../../../utils';
import { Plane } from './plane';

export const createSliders1 = baseExperiment('sliders-1', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor(0xffffff, 0);

    const camera = new THREE.OrthographicCamera(
        sizes.width / -2,
        sizes.width / 2,
        sizes.height / 2,
        sizes.height / -2,
        1,
        10,
    );
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    const material = new THREE.ShaderMaterial({
        defines: {
            PI: Math.PI,
        },
        uniforms: {
            uScale: { value: 0.75 },
            uVelo: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
    });

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const elements = document.querySelectorAll('.fader__slide');
    const planes = [];

    const slider = new KeenSlider('#my-keen-slider', {
        slides: elements.length,
        loop: true,
        duration: 3000,
        move: (s) => {
            console.log(s.details());
            // const opacities = s.details().positions.map((slide) => slide.portion);
            elements.forEach((element, idx) => {
                // element.style.opacity = opacities[idx];
                planes[idx]?.updateX(s.details().position);
            });
        },
    });

    elements.forEach((el) => {
        const plane = new Plane();
        planes.push(plane);
        plane.init(el, sizes, { geometry, material, scene });
    });

    function render() {
        const elapsedTime = clock.getElapsedTime();

        onRender();
        material.uniforms.uTime.value = elapsedTime;

        controls.update();
        renderer.render(scene, camera);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        // scene.remove(mesh);
        // disposeMesh(mesh);
        renderer.dispose();
        gui.destroy();
    }

    animate();

    window.addEventListener('resize', () => {
        // camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);
    });

    module.hot?.addDisposeHandler(destroy);
});
