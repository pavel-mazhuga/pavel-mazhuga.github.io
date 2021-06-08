import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
    const gltfLoader = new GLTFLoader();
    const dummy = new THREE.Object3D();

    let instancedShelf: THREE.InstancedMesh | null;
    const shelfCount = 4;

    let instancedTable: THREE.InstancedMesh | null;
    const tableCount = 10;

    gltfLoader.load(`${PUBLIC_PATH}gltf/room.glb`, (gltf) => {
        console.log(gltf.scene);
        gltf.scene.position.y = -2;
        gltf.scene.rotation.y = 7.2;
        const scale = 0.00153;
        dummy.scale.set(scale, scale, scale);

        const shelf = gltf.scene.getObjectByName('Other_Environment002') as THREE.Mesh;
        const table = gltf.scene.getObjectByName('Other_Environment003') as THREE.Mesh;

        if (shelf) {
            instancedShelf = new THREE.InstancedMesh(shelf.geometry, shelf.material, shelfCount);

            instancedShelf.name = 'Instanced Shelf';
            gltf.scene.add(instancedShelf);

            let i = 0;

            for (let x = 0; x < shelfCount; x++) {
                const posObj = gltf.scene.getObjectByName(x === 0 ? `Sphere` : `Sphere00${x}`);

                if (posObj) {
                    dummy.position.copy(posObj.position);
                    dummy.rotation.set(0, -Math.PI / 2, 0);
                    dummy.updateMatrix();
                    instancedShelf.setMatrixAt(i++, dummy.matrix);
                }
            }
        }

        if (table) {
            instancedTable = new THREE.InstancedMesh(table.geometry, table.material, tableCount);
            instancedTable.name = 'Instanced Table';
            gltf.scene.add(instancedTable);

            let i = 0;

            for (let x = 0; x < tableCount; x++) {
                const posObj = gltf.scene.getObjectByName(`Sphere00${x + 5}`);

                if (posObj) {
                    dummy.position.copy(posObj.position);
                    dummy.updateMatrix();
                    instancedTable.setMatrixAt(i++, dummy.matrix);
                }
            }
        }

        scene.add(gltf.scene);
    });

    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    function render() {
        onRender();
        controls.update();

        // const time = Date.now() * 0.001;

        // if (instancedShelf) {
        //     // let i = 0;
        //     // const offset = (shelfCount - 1) / 2;

        //     // for (let x = 0; x < shelfCount; x++) {
        //     //     for (let y = 0; y < shelfCount; y++) {
        //     //         for (let z = 0; z < shelfCount; z++) {
        //     //             dummy.position.set(offset - x, offset - y, offset - z);
        //     //             dummy.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time);
        //     //             dummy.rotation.z = dummy.rotation.y * 2;

        //     //             dummy.updateMatrix();
        //     //             instancedShelf.setMatrixAt(i++, dummy.matrix);
        //     //         }
        //     //     }
        //     // }

        //     instancedShelf.instanceMatrix.needsUpdate = true;
        // }

        renderer.render(scene, camera);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);

        if (instancedShelf) {
            instancedShelf.dispose();
            instancedShelf = null;
        }

        if (instancedTable) {
            instancedTable.dispose();
            instancedTable = null;
        }

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
