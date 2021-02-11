import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createParticlesBasic() {
    const canvas = document.querySelector<HTMLCanvasElement>('.js-canvas[data-experiment="particles-basic"]');
    let rAF: number;

    if (!canvas) return;

    let canvasRect = canvas.getBoundingClientRect();

    const sizes = {
        width: canvasRect.width,
        height: canvasRect.height,
    };

    const renderer = new THREE.WebGLRenderer({ canvas });
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 3;

    const scene = new THREE.Scene();

    const sphere = new THREE.Points(
        new THREE.SphereBufferGeometry(1, 64, 64),
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, sizeAttenuation: true }),
    );
    scene.add(sphere);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    function render() {
        controls.update();
        renderer.render(scene, camera);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvasRect = canvas.getBoundingClientRect();
        sizes.width = canvasRect.width;
        sizes.height = canvasRect.height;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);
    });

    module.hot?.addDisposeHandler(() => {
        cancelAnimationFrame(rAF);
    });
}
