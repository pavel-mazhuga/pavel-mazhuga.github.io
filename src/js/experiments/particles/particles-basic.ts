import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { baseExperiment } from '../base';

export const createParticlesBasic = baseExperiment('particles-basic', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 3;

    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();

    const particleTexture = textureLoader.load(`${PUBLIC_PATH}img/particles/8.png`);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 20000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 4;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const sphere = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({
            color: 0xffffff,
            map: particleTexture,
            size: 0.05,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        }),
    );
    scene.add(sphere);

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
        renderer.dispose();
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
