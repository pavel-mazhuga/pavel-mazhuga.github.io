import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import DefaultLayout from '../components/layout/DefaultLayout';

const HomePage: NextPage = () => {
    return (
        <DefaultLayout>
            <Head>
                <title>WebGL Sandbox</title>
            </Head>
            <div>
                <div>Particles</div>
                <ul>
                    <li>
                        <Link href="/particles/basic">Basic</Link>
                    </li>
                </ul>
            </div>
        </DefaultLayout>
    );
};

export default HomePage;
