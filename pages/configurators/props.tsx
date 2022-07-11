import { Suspense, useEffect } from 'react';
import { BakeShadows, Stage } from '@react-three/drei';
import DefaultLayout from 'components/layout/DefaultLayout';
import Shoe from 'components/gltfjsx/Shoe';
import { useSetRecoilState } from 'recoil';
import { canvasPropsState } from 'atoms/canvas-props';

// const DEBUG = process.env.NODE_ENV === 'development';

function Page() {
    const setCanvasProps = useSetRecoilState(canvasPropsState);

    useEffect(() => {
        setCanvasProps({ shadows: true });

        return () => void setCanvasProps({});
    }, [setCanvasProps]);

    return <DefaultLayout documentTitle="Configurator"></DefaultLayout>;
}

const R3F = () => {
    return (
        <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.7, blur: 2 }}>
                <Shoe color="tomato" position={[0, 0, 0]} />
                <Shoe color="orange" scale={-1} rotation={[0, 0.5, Math.PI]} position={[0, 0, -2]} />
            </Stage>
            <BakeShadows />
        </Suspense>
    );
};

Page.R3F = R3F;

export default Page;
