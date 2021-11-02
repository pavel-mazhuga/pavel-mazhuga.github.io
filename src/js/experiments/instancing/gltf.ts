import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { baseExperiment } from '../base';

export const createInstancingGltf = baseExperiment('instancing-gltf', ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 3;

    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${PUBLIC_PATH}draco/`);
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setPath(`${PUBLIC_PATH}gltf/`);

    const colorTexture = textureLoader.load(`${PUBLIC_PATH}img/color.jpg`);
    colorTexture.flipY = false;
    colorTexture.encoding = THREE.sRGBEncoding;

    const bakedTexture = textureLoader.load(`${PUBLIC_PATH}img/Atlas.jpg`);
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;

    const bakedMaterial = new THREE.MeshBasicMaterial({ map: colorTexture, aoMap: bakedTexture, aoMapIntensity: 1 });

    gltfLoader.load('S1_1.glb', (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = bakedMaterial;
                child.geometry.setAttribute(
                    'uv2',
                    new THREE.Float32BufferAttribute(child.geometry.attributes.uv.array, 2),
                );
            }
        });

        scene.add(gltf.scene);
    });

    // const ambientLight = new THREE.AmbientLight('#fff', 1);
    // scene.add(ambientLight);

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
