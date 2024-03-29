import * as THREE from 'three';
import { useRef, Suspense, useMemo, MutableRefObject, forwardRef } from 'react';
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { Reflector, CameraShake, OrbitControls, useTexture, Stats } from '@react-three/drei';
import { EffectComposer, SMAA, SelectiveBloom, Bloom } from '@react-three/postprocessing';
import { Resizer, KernelSize } from 'postprocessing';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import DefaultLayout from 'components/layout/DefaultLayout';

const DEBUG = process.env.NODE_ENV === 'development';

const ChipsaLogo = forwardRef<THREE.Mesh>(({ color, ...props }, ref) => {
    const { paths: [path] } = useLoader(SVGLoader, '/chipsa-logo.svg') // prettier-ignore
    const geom = useMemo(
        () => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(), path.userData.style),
        [path.subPaths, path.userData.style],
    );

    return (
        <mesh ref={ref} geometry={geom} {...props}>
            <meshStandardMaterial color={color} />
        </mesh>
    );
});
ChipsaLogo.displayName = 'ChipsaLogo';

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
    const [roughnessMap, normalMap] = useTexture([
        '/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_roughness.jpg',
        '/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_normal.jpg',
    ]);

    return (
        <Reflector
            blur={[400, 100]}
            resolution={1024}
            args={[20, 15]}
            mirror={0.2}
            mixBlur={4}
            mixStrength={1.5}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            {...props}
        >
            {(Material, props) => (
                <Material
                    metalness={0.1}
                    color="#888"
                    roughnessMap={roughnessMap}
                    normalMap={normalMap}
                    // normalScale={[2, 2]}
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
    // const bloom2 = useRef();

    useFrame((_) => {
        const value = Math.abs(Math.sin(_.clock.elapsedTime * 2)) * 0.5;
        bloom1.current.intensity = 0.3 + value;
        // bloom2.current.intensity = 0.35 + value;
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
        </>
    );
}

export default function ReflectorFloorPage() {
    const ambientLight = useRef<THREE.AmbientLight>();
    const spotLight = useRef<THREE.SpotLight>();
    const wall = useRef<THREE.Mesh>();
    const chipsa = useRef<THREE.Mesh>();

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
                camera={{ position: [0, 0, 10], fov: 30, far: 100 }}
                mode="concurrent"
            >
                <color attach="background" args={['black']} />
                <fog attach="fog" args={['black', 12, 20]} />
                <ambientLight ref={ambientLight} intensity={0.65} />
                <spotLight ref={spotLight} position={[0, 10, 0]} intensity={0.35} />
                {/* <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} /> */}
                <Suspense fallback={null}>
                    <Rig>
                        <group position={[0, 0.6, -3]}>
                            <mesh ref={wall}>
                                <planeBufferGeometry args={[5, 3, 1, 1]} />
                                <meshStandardMaterial metalness={0} color="#FCCF69" />
                            </mesh>
                            <ChipsaLogo ref={chipsa} color="black" scale={0.1} position={[-1.5, -0.5, 0.002]} />
                        </group>
                        <Ground position-y={-0.8} />
                    </Rig>
                    <EffectComposer frameBufferType={THREE.HalfFloatType} multisampling={0}>
                        <SMAA />
                        {/* <AnimatedBloom lights={[ambientLight, spotLight]} meshes={[wall]} /> */}
                    </EffectComposer>
                </Suspense>
                <CameraShake yawFrequency={0.2} pitchFrequency={0.2} rollFrequency={0.2} intensity={0.5} />
                {DEBUG && <Stats />}
            </Canvas>
        </DefaultLayout>
    );
}
