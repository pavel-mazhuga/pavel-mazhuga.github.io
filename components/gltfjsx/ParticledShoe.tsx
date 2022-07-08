/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { shaderMaterial, useGLTF, Sampler, ComputedAttribute } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { BufferAttribute, Vector3, MathUtils, MeshBasicMaterial } from 'three';

const ParticleMaterial = shaderMaterial(
    {},
    `
    varying vec2 vUv;

    void main()	{
        vUv = uv;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_PointSize = 15. * (1. / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
  `,
    /* glsl */ `
    varying vec2 vUv;
  
    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float disc = smoothstep(0.5, 0.45, dist);

        if (disc < 0.1) {
            discard;
            return;
        }

        gl_FragColor = vec4(vec2(disc), 1., 1.);
    }
  `,
);

extend({ ParticleMaterial });

function remap(x: number, [low1, high1]: number[], [low2, high2]: number[]) {
    return low2 + ((x - low1) * (high2 - low2)) / (high1 - low1);
}

const transformInstances = ({ dummy, position }) => {
    dummy.position.copy(position);
    dummy.scale.setScalar(Math.random() * 0.75);
};

const computeUpness = (geometry) => {
    const { array, count } = geometry.attributes.normal;
    const arr = Float32Array.from({ length: count });

    const normalVector = new Vector3();
    const up = new Vector3(0, 1, 0);

    for (let i = 0; i < count; i++) {
        const n = array.slice(i * 3, i * 3 + 3);
        normalVector.set(n[0], n[1], n[2]);

        const dot = normalVector.dot(up);
        const value = dot > 0.4 ? remap(dot, [0.4, 1], [0, 1]) : 0;
        arr[i] = Number(value);
    }

    return new BufferAttribute(arr, 1);
};

const SampledGeometry = ({ geometry, material = new MeshBasicMaterial(), count = 3000 }: any) => {
    const attrName = 'upness';

    return (
        <Sampler weight={attrName} transform={transformInstances}>
            <mesh visible={false} material={material}>
                <bufferGeometry attach="geometry" {...geometry}>
                    <ComputedAttribute name={attrName} compute={computeUpness} />
                </bufferGeometry>
                {/* <meshBasicMaterial /> */}
            </mesh>
            <instancedMesh args={[null, null, count]} material={material}>
                <sphereGeometry args={[MathUtils.randFloat(0.0015, 0.0025), 8, 8]} />
                {/* <meshNormalMaterial /> */}
            </instancedMesh>
        </Sampler>
    );
};

export default function Shoe({ color, ...props }) {
    const { nodes, materials } = useGLTF('/gltf/shoe.gltf');
    const material = useMemo(() => new MeshBasicMaterial({ color: 'pink' }), []);

    // useFrame((state) => (material.uniforms.time.value = state.clock.elapsedTime / 4))

    return (
        <group {...props} dispose={null}>
            <SampledGeometry geometry={nodes.shoe.geometry} material={material} />
            <SampledGeometry geometry={nodes.shoe_1.geometry} material={material} count={4000} />
            <SampledGeometry geometry={nodes.shoe_2.geometry} material={material} count={1200} />
            <SampledGeometry geometry={nodes.shoe_3.geometry} material={material} />
            <SampledGeometry geometry={nodes.shoe_4.geometry} material={material} />
            <SampledGeometry geometry={nodes.shoe_5.geometry} material={material} />
            <SampledGeometry geometry={nodes.shoe_6.geometry} material={material} count={1200} />
            <SampledGeometry geometry={nodes.shoe_7.geometry} material={material} count={1200} />
        </group>
    );
}

useGLTF.preload('/gltf/shoe.gltf');
