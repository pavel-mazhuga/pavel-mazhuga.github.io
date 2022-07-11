import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { ReactNode, useEffect, useRef } from 'react';
import { Color } from 'three';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { elementsState } from 'atoms/elements';
import { OrbitControls as RealOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useRouter } from 'next/router';
import { canvasPropsState } from 'atoms/canvas-props';

const LCanvas = ({ children }: { children: ReactNode }) => {
    const { dom } = useRecoilValue(elementsState);
    const canvasProps = useRecoilValue(canvasPropsState);
    const setElements = useSetRecoilState(elementsState);
    const controls = useRef<RealOrbitControls>(null);
    const router = useRouter();
    const canvas = useRef(null);

    useEffect(() => {
        if (canvas.current) {
            setElements((prevElements) => ({ ...prevElements, canvas: canvas.current }));
        }
    }, [setElements]);

    useEffect(() => {
        const onRouteChangeStart = () => {
            if (controls.current) {
                controls.current.enabled = false;
            }
        };

        const onRouteChangeComplete = () => {
            if (controls.current) {
                controls.current.reset();
                controls.current.enabled = true;
            }
        };

        router.events.on('routeChangeStart', onRouteChangeStart);
        router.events.on('routeChangeComplete', onRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart);
            router.events.off('routeChangeComplete', onRouteChangeComplete);
        };
    }, [router.events]);

    return (
        <div className="canvas">
            <Canvas
                ref={canvas}
                dpr={[1, 2]}
                gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
                {...canvasProps}
                style={{
                    position: 'absolute',
                    top: 0,
                }}
                onCreated={({ gl, events }) => {
                    gl.setClearColor(new Color('#020207'));

                    if (dom?.current) {
                        events.connect?.(dom.current);
                    }
                }}
            >
                <OrbitControls ref={controls} />
                {/* <Preload all /> */}
                {children}
            </Canvas>
        </div>
    );
};

export default LCanvas;
