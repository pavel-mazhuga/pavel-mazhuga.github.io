import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useControls } from 'leva';
import DefaultLayout from 'components/layout/DefaultLayout';
import ParticledShoe from 'components/gltfjsx/ParticledShoe';

// const DEBUG = process.env.NODE_ENV === 'development';

function Experience() {
    return (
        <>
            <Suspense fallback={null}>
                <ParticledShoe color="tomato" position={[0, 0, 0]} />
            </Suspense>

            <OrbitControls />
        </>
    );
}

export default function Page() {
    return (
        <DefaultLayout documentTitle="Model in particles">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    powerPreference: 'high-performance',
                    alpha: false,
                    antialias: false,
                }}
            >
                <Experience />
            </Canvas>
        </DefaultLayout>
    );
}
