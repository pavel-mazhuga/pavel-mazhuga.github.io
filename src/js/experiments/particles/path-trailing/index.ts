import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import texture from './russia.png';

export const createParticlesPathTrailing = baseExperiment(
    'particles-path-trailing',
    ({ canvas, sizes, onRender, gui }) => {
        let rAF: number;
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);

        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
        camera.position.z = 10;

        const scene = new THREE.Scene();
        const clock = new THREE.Clock();

        const svg = document.querySelector<SVGElement>('svg.js-russia-svg');

        if (!svg) {
            throw new Error('svg not found');
        }

        const svgTexture = new THREE.TextureLoader().load(texture);
        // svgTexture.flipY = false;

        const pathsData = Array.from(svg.querySelectorAll<SVGPathElement>('.land')).map((path) => {
            const pathLength = path.getTotalLength();
            const pointsAmount = Math.floor(pathLength * 0.4);
            const points: THREE.Vector3[] = [];

            for (let i = 0; i < pointsAmount; i++) {
                const pointAt = (pathLength / pointsAmount) * i;
                const point = path.getPointAtLength(pointAt);
                const normalizedPoint = {
                    x: (point.x - 500) * 0.01 + Math.random() * 0.03,
                    y: (point.y - 400) * 0.01 + Math.random() * 0.03,
                    z: 0,
                };
                points.push(new THREE.Vector3(normalizedPoint.x, normalizedPoint.y, normalizedPoint.z));
            }

            return {
                length: pathLength,
                points,
                pointsToRender: Math.max(10, Math.floor(pointsAmount * 0.25)),
                currentPosition: 0,
                speed: 1,
            };
        });
        const maxPoints = pathsData.reduce((acc, pathData) => acc + pathData.pointsToRender, 0);

        const particlesGeometry = new THREE.BufferGeometry();

        const positions = new Float32Array(maxPoints * 3);
        const opacity = new Float32Array(maxPoints);
        const opacityFactor = 0.2;

        for (let i = 0; i < maxPoints * 3; i++) {
            positions[i] = 0;
        }

        for (let i = 0; i < maxPoints; i++) {
            opacity[i] = Math.random() * opacityFactor;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));

        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10, 8, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 0x0000ff,
                map: svgTexture,
            }),
        );
        scene.add(plane);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        function render() {
            // const elapsedTime = clock.getElapsedTime();

            onRender();
            // particlesMaterial.uniforms.uTime.value = elapsedTime;
            let k = 0;

            for (let i = 0; i < pathsData.length; i++) {
                pathsData[i].currentPosition =
                    (pathsData[i].currentPosition + pathsData[i].speed) % pathsData[i].points.length;
                for (let j = 0; j < pathsData[i].pointsToRender; j++) {
                    const point = pathsData[i].points[(j + pathsData[i].currentPosition) % pathsData[i].points.length];
                    positions.set([point.x, point.y, point.z], k * 3);
                    opacity[k] = j / (pathsData[i].pointsToRender / opacityFactor);
                    k++;
                }
            }

            particlesGeometry.attributes.position.array = positions;
            particlesGeometry.attributes.opacity.array = opacity;
            particlesGeometry.attributes.position.needsUpdate = true;
            particlesGeometry.attributes.opacity.needsUpdate = true;

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
    },
);
