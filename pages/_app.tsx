import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Canvas from 'components/layout/Canvas';
import { RecoilRoot } from 'recoil';
import Dom from 'components/layout/Dom';
// import dynamic from 'next/dynamic';

// const Canvas = dynamic(() => import('components/layout/Canvas'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
    const R3F = (Component as any).R3F as (() => JSX.Element) | undefined;

    return (
        <RecoilRoot>
            {R3F && (
                <Canvas>
                    <R3F {...pageProps} />
                </Canvas>
            )}
            <Dom>
                <Component {...pageProps} />
            </Dom>
        </RecoilRoot>
    );
}

export default MyApp;
