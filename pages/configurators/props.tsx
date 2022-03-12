import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BakeShadows, OrbitControls, Stage } from '@react-three/drei';
import DefaultLayout from 'components/layout/DefaultLayout';
import Shoe from 'components/gltfjsx/Shoe';

const DEBUG = process.env.NODE_ENV === 'development';

export default function Page() {
    return (
        <DefaultLayout documentTitle="Configurator">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 150], fov: 40 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.7, blur: 2 }}>
                        <Shoe color="tomato" position={[0, 0, 0]} />
                        <Shoe color="orange" scale={-1} rotation={[0, 0.5, Math.PI]} position={[0, 0, -2]} />
                    </Stage>
                    <BakeShadows />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </DefaultLayout>
    );
}
