import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { NextPage } from 'next';
import { useMemo, useRef } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import useMousePosition from 'hooks/useMousePosition';

function Particles({ count, mouse }: { count: number; mouse: [number, number] }) {
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const light = useRef<THREE.PointLight>(null!);
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate some random positions, speed factors and timings
    const particles = useMemo(() => {
        const temp = [];

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }

        return temp;
    }, [count]);

    // The innards of this hook will run every frame
    useFrame(() => {
        // Makes the light follow the mouse
        light.current.position.set((mouse[0] * 5000) / aspect, (mouse[1] * 5000) / aspect, 0);

        // Run through the randomized data to calculate some movement
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            // There is no sense or reason to any of this, just messing around with trigonometric functions
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            particle.mx += (mouse[0] - particle.mx) * 0.01;
            particle.my += (mouse[1] * -1 - particle.my) * 0.01;
            // Update the dummy object
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10,
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
            <instancedMesh ref={mesh} args={[null!, null!, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhongMaterial color="#050505" />
            </instancedMesh>
        </>
    );
}

const ParticlesBasicPage: NextPage = () => {
    const mouse = useMousePosition(true);

    return (
        <DefaultLayout documentTitle="Basic Particles">
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: false, alpha: false }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color('#020207'));
                }}
            >
                <Particles count={10000} mouse={mouse} />
            </Canvas>
        </DefaultLayout>
    );
};

export default ParticlesBasicPage;
