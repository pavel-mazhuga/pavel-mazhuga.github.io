import { Suspense } from 'react';
import { Vector2 } from 'three';
import { Canvas, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import DefaultLayout from 'components/layout/DefaultLayout';
import vertexShader from '../../src/shaders/blur-fast-gaussian-13/vertex.glsl';
import fragmentShader from '../../src/shaders/blur-fast-gaussian-13/fragment.glsl';

// const DEBUG = process.env.NODE_ENV === 'development';

const BlurMaterial = shaderMaterial(
    {
        u_map: null,
        uDirection: new Vector2(),
        uResolution: new Vector2(),
    },
    vertexShader,
    fragmentShader,
);

extend({ BlurMaterial });

function Experience() {
    const map = useTexture('/interior.jpeg');

    const props = useControls({
        uDirectionX: {
            value: 1,
            min: 0,
            max: 5,
        },
        uDirectionY: {
            value: 0,
            min: 0,
            max: 5,
        },
    });

    return (
        <mesh>
            <planeGeometry args={[6, 8]} />
            <blurMaterial
                {...props}
                u_map={map}
                uResolution={[window.innerWidth, window.innerHeight]}
                uDirection={[props.uDirectionX, props.uDirectionY]}
            />
        </mesh>
    );
}

export default function Page() {
    return (
        <DefaultLayout documentTitle="Blur">
            <Canvas
                dpr={[1, 2]}
                gl={{
                    alpha: false,
                    powerPreference: 'high-performance',
                    antialias: false,
                    stencil: false,
                    depth: false,
                }}
            >
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
            </Canvas>
        </DefaultLayout>
    );
}
