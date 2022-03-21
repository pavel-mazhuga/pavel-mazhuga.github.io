import { Suspense } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import DefaultLayout from 'components/layout/DefaultLayout';

// const DEBUG = process.env.NODE_ENV === 'development';

// Fast blur using texture mipmaps
// from https://www.shadertoy.com/view/WsVGWV
// more https://www.shadertoy.com/view/4slGWn
//      https://www.shadertoy.com/view/ltScRG
//      https://gkjohnson.github.io/threejs-sandbox/bicubic-filtering/
const MyMaterial = shaderMaterial(
    {
        u_map: null,
        blur: 0,
        gamma: 0.5,
    },
    `
    varying vec2 vUv;
    void main()	{
      vUv = uv;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `,
    /* glsl */ `
    uniform sampler2D u_map;
    varying vec2 vUv;
  
    void main() {
        float offset[3] = float[](0.0, 1.3846153846, 3.2307692308);
        float weight[3] = float[](0.2270270270, 0.3162162162, 0.0702702703);
        // gl_FragColor = texture2D(u_map, vUv);
        gl_FragColor = texture2D(u_map, vec2(gl_FragCoord) / 1024.0) * weight[0];
        for (int i=1; i<3; i++) {
            gl_FragColor +=
                texture2D(u_map, (vec2(gl_FragCoord) + vec2(0.0, offset[i])) / 1024.0)
                    * weight[i];
            gl_FragColor +=
                texture2D(u_map, (vec2(gl_FragCoord) - vec2(0.0, offset[i])) / 1024.0)
                    * weight[i];
        }
    }
  `,
);

extend({ MyMaterial });

function Experience() {
    const map = useTexture('/interior.jpeg');

    // const props = useControls({
    //     blur: {
    //         value: 1,
    //         min: 0.01,
    //         max: 100,
    //     },
    //     gamma: {
    //         value: 0.5,
    //         min: 0.01,
    //         max: 1,
    //     },
    // });

    return (
        <mesh>
            <planeGeometry args={[6, 8]} />
            <myMaterial u_map={map} />
            {/* <meshBasicMaterial map={map} /> */}
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
