import type { NextPage } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import DefaultLayout from './DefaultLayout';

type Props = {
    children?: ReactNode;
    documentTitle?: string;
};

const InnerPageLayout: NextPage<Props> = ({ children, documentTitle }) => {
    return (
        <DefaultLayout documentTitle={documentTitle}>
            <Link href="/">To main page</Link>
            {children}
        </DefaultLayout>
    );
};

export default InnerPageLayout;
