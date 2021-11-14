import type { NextPage } from 'next';
import Head from 'next/head';

const DefaultLayout: NextPage = ({ children }) => {
    return (
        <>
            <Head>
                <meta name="description" content="WebGL sandbox" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="main">
                <div className="canvas" suppressHydrationWarning={true}>
                    {children}
                </div>
            </main>
        </>
    );
};

export default DefaultLayout;
