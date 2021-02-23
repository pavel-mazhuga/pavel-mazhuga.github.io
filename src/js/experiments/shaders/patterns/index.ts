import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { disposeMesh } from '../../../utils';

export const createShadersPatterns = baseExperiment('shaders-patterns', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 10;

    const scene = new THREE.Scene();
    // const clock = new THREE.Clock();

    // const params = {
    //     mapColor: 0x7071a,
    //     // particlesColor: 0x040a14,
    //     particlesColor: 0x110800,
    //     // pointsAmountFactor: 0.4,
    //     pointsAmountFactor: 0.9,
    //     // maxPointsToRender: 50,
    //     maxPointsToRender: 200,
    //     // pointsToRenderFactor: 0.2,
    //     pointsToRenderFactor: 0.5,
    //     particlesSpeed: 1,
    //     // opacityFactor: 0.2,
    //     opacityFactor: 0.3,
    //     // particleSize: 30,
    //     particleSize: 20,
    // };

    const geometry = new THREE.PlaneBufferGeometry(6, 6, 1, 1);

    const material = new THREE.ShaderMaterial({
        defines: {
            PI: Math.PI,
        },
        uniforms: {
            uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.33;
    scene.add(mesh);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    function render() {
        onRender();

        controls.update();
        renderer.render(scene, camera);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        scene.remove(mesh);
        disposeMesh(mesh);
        renderer.dispose();
        gui.destroy();
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);
    });

    module.hot?.addDisposeHandler(destroy);
});
