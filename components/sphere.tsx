import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { PointLight } from 'three';

const Sphere = () => {
    const light = useRef<PointLight>(null);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        if (light.current) {
            light.current.position.x = 1 + Math.sin(time);
        }
    });

    return (
        <>
            <mesh>
                <sphereBufferGeometry args={[2, 32, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <pointLight ref={light} position={[1, 1, 2]} />
        </>
    );
};

export default Sphere;
