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

                <meta name="application-name" content="WebGL Sandbox" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="WebGL Sandbox" />
                <meta name="description" content="WebGL demos and showcases powered by React-three-fiber." />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#020507" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#020507" />

                <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/favicon.ico" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://pavel-mazhuga.github.io" />
                <meta name="twitter:title" content="WebGL Sandbox" />
                <meta name="twitter:description" content="WebGL demos and showcases powered by React-three-fiber." />
                <meta name="twitter:image" content="https://pavel-mazhuga.github.io/icons/android-chrome-192x192.png" />
                <meta name="twitter:creator" content="@DavidWShadow" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="WebGL Sandbox" />
                <meta property="og:description" content="Best WebGL Sandbox in the world" />
                <meta property="og:site_name" content="WebGL Sandbox" />
                <meta property="og:url" content="https://pavel-mazhuga.github.io" />
                <meta property="og:image" content="https://pavel-mazhuga.github.io/icons/apple-touch-icon.png" />
            </Head>

            {children}
        </>
    );
};

export default DefaultLayout;
