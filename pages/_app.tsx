import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Canvas from 'components/layout/Canvas';
import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { RecoilRoot, useRecoilState } from 'recoil';
import { rootGroupState } from 'atoms/root-group';

function MyApp({ Component, pageProps }: AppProps) {
    const group = useRef<Group>(null);
    const [_, setRootGroup] = useRecoilState(rootGroupState);

    useEffect(() => {
        if (group.current) {
            setRootGroup(group.current);
        }
    }, [setRootGroup]);

    return (
        <RecoilRoot>
            <div className="canvas">
                {/* {Component.r3f && ( */}
                <Canvas>
                    <group ref={group}>{/* {Component.r3f(pageProps)} */}</group>
                </Canvas>
                {/* )} */}
            </div>
            <main className="main">
                <Component {...pageProps} />
            </main>
        </RecoilRoot>
    );
}

export default MyApp;
