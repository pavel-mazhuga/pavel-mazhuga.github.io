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
    uniform float blur;
    uniform float gamma;
    varying vec2 vUv;
  
    float weight(float t, float log2radius, float gamma)
    {
        return exp(-gamma * pow(log2radius-t,2.));
    }
  
    vec4 sample_blured(sampler2D u_map, vec2 uv, float radius, float gamma)
    {
        vec4 pix = vec4(0.);
        float norm = 0.;
  
        float log2radius = log2(radius);
  
        //weighted integration over mipmap levels
        for(float i = 0.; i < 10.; i += 0.5)
        {
            float k = weight(i, log2radius, gamma);
            pix += k * texture(u_map, uv, i); 
            norm += k;
        }
  
        //nomalize, and a bit of brigtness hacking 
        return pix*pow(norm,-0.95);
    }
  
    void main() {
      vec3 color = sample_blured(u_map, vUv, blur, gamma).rgb;
      gl_FragColor = vec4(color, 1.);
    }
  `,
);

extend({ MyMaterial });

function Experience() {
    const map = useTexture('/interior.jpeg');

    const props = useControls({
        blur: {
            value: 1,
            min: 0.01,
            max: 100,
        },
        gamma: {
            value: 0.5,
            min: 0.01,
            max: 1,
        },
    });

    return (
        <mesh>
            <planeGeometry args={[6, 8]} />
            <myMaterial u_map={map} {...props} />
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
