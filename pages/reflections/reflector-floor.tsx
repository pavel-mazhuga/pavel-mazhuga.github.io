import * as THREE from 'three';
import { useRef, Suspense, useMemo, MutableRefObject, useEffect } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { Reflector, CameraShake, OrbitControls, useTexture } from '@react-three/drei';
import { EffectComposer, SMAA, SelectiveBloom, Bloom } from '@react-three/postprocessing';
import { BlurPass, Resizer, KernelSize } from 'postprocessing';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import DefaultLayout from 'components/layout/DefaultLayout';

function ChipsaLogo({ color, ...props }) {
    const { paths: [path] } = useLoader(SVGLoader, '/chipsa-logo.svg') // prettier-ignore
    const geom = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style), []);
    return (
        <group>
            <mesh geometry={geom} {...props}>
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
        </group>
    );
}

function Rig({ children }) {
    const ref = useRef();
    const vec = new THREE.Vector3();
    const { camera, mouse } = useThree();

    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 2, 0, 10.5), 0.05);
        ref.current.position.lerp(vec.set(mouse.x, mouse.y * 0.1, 0), 0.1);
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 20, 0.1);
    });

    return <group ref={ref}>{children}</group>;
}

function Ground(props) {
    // const [roughnessMap, normalMap] = useTexture([
    //     '/SurfaceImperfections003_1K_var1.jpg',
    //     '/SurfaceImperfections003_1K_Normal.jpg',
    // ]);
    const [roughnessMap, normalMap] = useTexture([
        '/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_roughness.jpg',
        '/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_normal.jpg',
    ]);

    return (
        <Reflector
            resolution={1024}
            args={[20, 15]}
            mirror={0.3}
            mixBlur={5}
            mixStrength={1}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            {...props}
        >
            {(Material, props) => (
                <Material
                    metalness={0.3}
                    // map={map}
                    color="#888"
                    roughnessMap={roughnessMap}
                    normalMap={normalMap}
                    // normalScale={[1, 1]}
                    // displacementMap={displacementMap}

                    {...props}
                />
            )}
        </Reflector>
    );
}

function AnimatedBloom({
    lights = [],
    meshes = [],
}: {
    lights?: MutableRefObject<THREE.Light>[];
    meshes?: MutableRefObject<THREE.Mesh>[];
}) {
    const bloom1 = useRef();
    const bloom2 = useRef();

    useFrame((_) => {
        const value = Math.abs(Math.sin(_.clock.elapsedTime * 2));
        bloom1.current.intensity = 0.3 + value;
        bloom2.current.intensity = 0.35 + value;
    });

    return (
        <>
            <SelectiveBloom
                ref={bloom1}
                lights={lights}
                selection={meshes}
                selectionLayer={10}
                intensity={0.65}
                blurPass={undefined}
                width={Resizer.AUTO_SIZE}
                height={Resizer.AUTO_SIZE}
                kernelSize={KernelSize.HUGE}
                luminanceThreshold={0}
                luminanceSmoothing={0}
            />
            <SelectiveBloom
                ref={bloom2}
                lights={lights}
                selection={meshes}
                selectionLayer={10}
                intensity={0.6}
                blurPass={undefined}
                width={Resizer.AUTO_SIZE}
                height={Resizer.AUTO_SIZE}
                kernelSize={3}
                luminanceThreshold={0}
                luminanceSmoothing={0.4}
            />
        </>
    );
}

export default function ReflectorFloorPage() {
    const ambientLight = useRef<THREE.AmbientLight>();
    const spotLight = useRef<THREE.SpotLight>();
    const wall = useRef<THREE.Mesh>();

    return (
        <DefaultLayout documentTitle="Reflector floor">
            <Canvas
                dpr={[1, 2]}
                gl={{
                    alpha: false,
                    powerPreference: 'high-performance',
                    antialias: false,
                    stencil: false,
                    depth: false,
                }}
                camera={{ position: [0, 0, 10], fov: 30 }}
            >
                <color attach="background" args={['black']} />
                <fog attach="fog" args={['black', 12, 20]} />
                <ambientLight ref={ambientLight} intensity={1} />
                <spotLight ref={spotLight} position={[0, 10, 0]} intensity={0.35} />
                {/* <directionalLight position={[-20, 0, -10]} intensity={0.7} /> */}
                {/* <pointLight intensity={0.35} position={[2, 10, 5]} /> */}
                {/* <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} /> */}
                <Suspense fallback={null}>
                    {/* <Rig> */}
                    {/* <ChipsaLogo color="orange" scale={0.1} position={[-1.5, 0, -1]} /> */}
                    <mesh ref={wall} position={[0, 0.001, -3]}>
                        <planeBufferGeometry args={[5, 5, 1, 1]} />
                        <meshStandardMaterial metalness={0} color="orange" />
                    </mesh>
                    <mesh position={[1, 0.001, 5]}>
                        <planeBufferGeometry args={[1, 1, 1, 1]} />
                        <meshStandardMaterial metalness={0} color="red" />
                    </mesh>
                    <Ground position-y={-0.8} />
                    <EffectComposer frameBufferType={THREE.HalfFloatType}>
                        <SMAA />
                        <AnimatedBloom lights={[ambientLight, spotLight]} meshes={[wall]} />
                    </EffectComposer>
                </Suspense>
                <CameraShake yawFrequency={0.2} pitchFrequency={0.2} rollFrequency={0.2} intensity={0.5} />
            </Canvas>
        </DefaultLayout>
    );
}
