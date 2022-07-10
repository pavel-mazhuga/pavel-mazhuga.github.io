import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { EffectComposer, DepthOfField, Noise } from '@react-three/postprocessing';
import { useControls } from 'leva';
import DefaultLayout from 'components/layout/DefaultLayout';
import Shoe from 'components/gltfjsx/Shoe';

// const DEBUG = process.env.NODE_ENV === 'development';

function Experience() {
    const { bokehScale, focalLength, focusDistance, noiseOpacity } = useControls({
        focalLength: {
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.0001,
        },
        focusDistance: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.0001,
        },
        bokehScale: {
            value: 1,
            min: 0,
            max: 5,
            step: 0.001,
        },
        noiseOpacity: {
            value: 0.25,
            min: 0,
            max: 1,
            step: 0.0001,
        },
    });

    return (
        <>
            <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5}>
                    <Shoe color="tomato" position={[0, 0, 0]} />
                    <Shoe color="orange" scale={-1} rotation={[0, 0.5, Math.PI]} position={[0, 0, -2]} />
                </Stage>
            </Suspense>
            <EffectComposer multisampling={4} disableNormalPass={true}>
                <DepthOfField
                    focusDistance={focusDistance}
                    focalLength={focalLength}
                    bokehScale={bokehScale}
                    height={480}
                />
                {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={3} /> */}
                <Noise opacity={noiseOpacity} />
            </EffectComposer>
            <OrbitControls />
        </>
    );
}

export default function Page() {
    return (
        <DefaultLayout documentTitle="Depth of field">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 150], fov: 45 }}
                gl={{
                    powerPreference: 'high-performance',
                    alpha: false,
                    antialias: false,
                    stencil: false,
                    depth: false,
                }}
            >
                <Experience />
            </Canvas>
        </DefaultLayout>
    );
}
