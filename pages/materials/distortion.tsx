import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { NextPage } from 'next';
import { useMemo, useRef, useState } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import useMousePosition from 'hooks/useMousePosition';
import { GradientTexture, MeshDistortMaterial, useCursor } from '@react-three/drei';

function Flag() {
    const ref = useRef();
    const [hovered, hover] = useState(false);
    useCursor(hovered);
    useFrame(() => {
        ref.current.distort = THREE.MathUtils.lerp(ref.current.distort, hovered ? 0.4 : 0, hovered ? 0.05 : 0.01);
    });
    return (
        <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={[2, 4, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <MeshDistortMaterial ref={ref} speed={5}>
                <GradientTexture stops={[0, 0.8, 1]} colors={['#e63946', '#f1faee', '#a8dadc']} size={100} />
            </MeshDistortMaterial>
        </mesh>
    );
}

const DistortionMaterialPage = () => {
    return <DefaultLayout documentTitle="Distortion Material"></DefaultLayout>;
};

const R3F = () => {
    return <Flag />;
};

DistortionMaterialPage.R3F = R3F;

export default DistortionMaterialPage;
