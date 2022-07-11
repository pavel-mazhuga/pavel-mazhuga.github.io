import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
// import useStore from '@/helpers/store';
import { useEffect, useRef } from 'react';
import { Color } from 'three';

// const LControl = () => {
//     // const dom = useStore((state) => state.dom);
//     const control = useRef(null);

//     useEffect(() => {
//         if (control.current) {
//             const domElement = dom.current;
//             const originalTouchAction = domElement.style['touch-action'];
//             domElement.style['touch-action'] = 'none';

//             return () => {
//                 domElement.style['touch-action'] = originalTouchAction;
//             };
//         }
//     }, [/* dom,  */ control]);

//     return <OrbitControls ref={control} domElement={dom.current} />;
// };

const LCanvas = ({ children }) => {
    // const dom = useStore((state) => state.dom);

    return (
        <Canvas
            style={{
                position: 'absolute',
                top: 0,
            }}
            dpr={[1, 2]}
            gl={{ antialias: false, alpha: false }}
            onCreated={({ gl }) => {
                gl.setClearColor(new Color('#020207'));
            }}
            // onCreated={(state) => state.events.connect(dom.current)}
        >
            {/* <LControl /> */}
            <OrbitControls />
            <Preload all />
            {children}
        </Canvas>
    );
};

export default LCanvas;
