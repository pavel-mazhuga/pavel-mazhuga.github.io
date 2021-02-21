import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'three/examples/jsm/libs/dat.gui.module';
import * as CANNON from 'cannon-es';

export function createPhysicsWorker() {
    const canvas = document.querySelector<HTMLCanvasElement>('.js-canvas[data-experiment="physics-worker"]');
    let rAF: number;

    if (!canvas) return;

    let canvasRect = canvas.getBoundingClientRect();

    const sizes = {
        width: canvasRect.width,
        height: canvasRect.height,
    };

    const gui = new dat.GUI();
    gui.addFolder('');

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(sizes.width, sizes.height);

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(-5, 7, 12);
    const scene = new THREE.Scene();

    const objects: any[] = [];
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 0.1,
        restitution: 0.7,
    });

    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(25, 25, 25), new THREE.MeshStandardMaterial());
    plane.receiveShadow = true;
    // plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ material: defaultMaterial });
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    world.addBody(floorBody);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0.3, 0.5, 0.5);
    directionalLight.target = plane;
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001);
    gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001);
    gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001);

    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0.45,
    });

    function createBox(size = 1, position: { x: number; y: number; z: number }) {
        const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.castShadow = true;
        mesh.scale.set(size, size, size);
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;
        scene.add(mesh);

        const shape = new CANNON.Box(new CANNON.Vec3(position.x, position.y, position.z));
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape,
        });

        world.addBody(body);
        objects.push({ mesh, body });
        // body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));
    }

    createBox(1, { x: 0, y: 3, z: 0 });

    const clock = new THREE.Clock();
    let oldElapsedTime = 0;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const stats = new Stats();
    document.body.appendChild(stats.domElement);

    function render() {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        // Update physics world
        world.step(1 / 60, deltaTime, 3);

        for (let i = 0; i < objects.length; i++) {
            objects[i].mesh.position.copy(objects[i].body.position);
        }

        controls.update();
        stats.update();

        renderer.render(scene, camera);
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
        gui.destroy();
        boxGeometry.dispose();
        boxMaterial.dispose();
        renderer.dispose();
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

    module.hot?.addDisposeHandler(destroy);
}
