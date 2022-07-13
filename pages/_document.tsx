import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <div id="portal-root"></div>
                <NextScript />
            </body>
        </Html>
    );
}
