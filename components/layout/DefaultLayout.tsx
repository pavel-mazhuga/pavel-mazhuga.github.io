import type { NextPage } from 'next';
import Head from 'next/head';

type Props = {
    documentTitle?: string;
};

const DefaultLayout: NextPage<Props> = ({ children, documentTitle }) => {
    return (
        <>
            <Head>
                <title>{documentTitle ? `${documentTitle} - ` : ''}WebGL Sandbox</title>
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
