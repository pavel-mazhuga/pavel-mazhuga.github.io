import type { NextPage } from 'next';
import Head from 'next/head';
import { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
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

            {children}
        </>
    );
};

export default DefaultLayout;
