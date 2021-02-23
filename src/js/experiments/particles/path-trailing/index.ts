import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { baseExperiment } from '../../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { disposeMesh } from '../../../utils';
import texture from './russia.png';

export const createParticlesPathTrailing = baseExperiment(
    'particles-path-trailing',
    ({ canvas, sizes, onRender, gui }) => {
        let rAF: number;
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(sizes.width, sizes.height);

        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
        camera.position.z = 10;

        const scene = new THREE.Scene();
        // const clock = new THREE.Clock();

        const svg = document.querySelector<SVGElement>('svg.js-russia-svg');

        if (!svg) {
            throw new Error('svg not found');
        }

        const svgBBox = svg.getBBox();
        svg.style.display = 'none';
        const svgTexture = new THREE.TextureLoader().load(texture);
        //
        const params = {
            mapColor: 0x7071a,
            // particlesColor: 0x040a14,
            particlesColor: 0x110800,
            // pointsAmountFactor: 0.4,
            pointsAmountFactor: 0.9,
            // maxPointsToRender: 50,
            maxPointsToRender: 200,
            // pointsToRenderFactor: 0.2,
            pointsToRenderFactor: 0.5,
            particlesSpeed: 1,
            // opacityFactor: 0.2,
            opacityFactor: 0.3,
            // particleSize: 30,
            particleSize: 20,
        };
        gui?.add(params, 'particlesSpeed').min(0).max(10).step(1);
        gui?.add(params, 'opacityFactor').min(0).max(1).step(0.001);

        let pathsData: any[] = [];
        let maxPoints = 0;
        let positions: Float32Array | null;
        let opacity: Float32Array | null;

        const particlesGeometry = new THREE.BufferGeometry();

        function initScene() {
            pathsData = Array.from(svg!.querySelectorAll<SVGPathElement>('.land')).map((path) => {
                const pathLength = path.getTotalLength();
                const pointsAmount = Math.floor(pathLength * params.pointsAmountFactor);
                const points: THREE.Vector3[] = [];

                for (let i = 0; i < pointsAmount; i++) {
                    const pointAt = (pathLength / pointsAmount) * i;
                    const point = path.getPointAtLength(pointAt);
                    const normalizedPoint = {
                        x: (point.x - svgBBox.width / 2) * 0.01 + Math.random() * 0.02,
                        y: (point.y - svgBBox.height / 2) * 0.01 + Math.random() * 0.02,
                        z: 0,
                    };
                    points.push(new THREE.Vector3(normalizedPoint.x, normalizedPoint.y, normalizedPoint.z));
                }

                return {
                    length: pathLength,
                    points,
                    pointsToRender: Math.min(
                        params.maxPointsToRender,
                        Math.floor(pointsAmount * params.pointsToRenderFactor),
                    ),
                    currentPosition: 0,
                };
            });
            maxPoints = pathsData.reduce((acc, pathData) => acc + pathData.pointsToRender, 0);

            positions = new Float32Array(maxPoints * 3);
            opacity = new Float32Array(maxPoints);

            for (let i = 0; i < maxPoints * 3; i++) {
                positions[i] = 0;
            }

            for (let i = 0; i < maxPoints; i++) {
                opacity[i] = Math.random() * params.opacityFactor;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));
        }

        initScene();
        gui?.add(params, 'pointsToRenderFactor').min(0).max(1).step(0.01).onFinishChange(initScene);
        gui?.add(params, 'pointsAmountFactor').min(0).max(3).step(0.01).onFinishChange(initScene);
        gui?.add(params, 'maxPointsToRender').min(0).max(500).step(1).onFinishChange(initScene);

        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uParticleSize: { value: params.particleSize },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(params.particlesColor) },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        gui?.addColor(params, 'particlesColor').onChange(() => {
            particlesMaterial.uniforms.uColor.value = new THREE.Color(params.particlesColor);
        });
        gui?.add(params, 'particleSize')
            .min(0)
            .max(100)
            .step(0.01)
            .onChange(() => {
                particlesMaterial.uniforms.uParticleSize.value = params.particleSize;
            });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        particles.position.y = 0.33;
        scene.add(particles);

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(svgBBox.width * 0.01, svgBBox.height * 0.01, 1, 1),
            new THREE.MeshBasicMaterial({
                color: params.mapColor,
                map: svgTexture,
            }),
        );
        scene.add(plane);
        gui?.addColor(params, 'mapColor').onChange(() => {
            plane.material.color = new THREE.Color(params.mapColor);
        });

        const dummyMat4 = new THREE.Matrix4();

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        function render() {
            // const elapsedTime = clock.getElapsedTime();

            onRender();
            // particlesMaterial.uniforms.uTime.value = elapsedTime;
            let k = 0;

            for (let i = 0; i < pathsData.length; i++) {
                pathsData[i].currentPosition =
                    (pathsData[i].currentPosition + params.particlesSpeed) % pathsData[i].points.length;

                for (let j = 0; j < pathsData[i].pointsToRender; j++) {
                    const point = pathsData[i].points[(j + pathsData[i].currentPosition) % pathsData[i].points.length];
                    positions?.set([point.x, point.y, point.z], k * 3);

                    if (opacity) {
                        opacity[k] = j / (pathsData[i].pointsToRender / params.opacityFactor);
                    }

                    k++;
                }
            }

            particlesGeometry.attributes.position.array = positions;
            particlesGeometry.applyMatrix4(dummyMat4.makeScale(1, -1, 1));
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
            if (svg) {
                svg.style.display = 'block';
            }

            cancelAnimationFrame(rAF);
            scene.remove(particles);
            disposeMesh(particles);
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
    },
);
