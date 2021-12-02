import type { NextPage } from 'next';
import Link from 'next/link';
import DefaultLayout from 'components/layout/DefaultLayout';

const sitemap = [
    {
        title: 'Particles',
        pages: [
            {
                title: 'Basic',
                url: '/particles/basic',
            },
        ],
    },
    {
        title: 'Reflections',
        pages: [
            {
                title: 'Reflector floor',
                url: '/reflections/reflector-floor',
            },
            // {
            //     title: 'Mirrors',
            //     url: '/reflections/mirrors',
            // },
        ],
    },
];

const HomePage: NextPage = () => {
    return (
        <DefaultLayout>
            <h1>WebGL Sandbox</h1>
            <ul>
                {sitemap.map((section) => (
                    <li key={section.title}>
                        <div>Particles</div>
                        <ul>
                            {section.pages.map((page) => (
                                <li key={page.url}>
                                    <Link href={page.url}>{page.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
};

export default HomePage;
