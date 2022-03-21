import type { NextPage } from 'next';
import Link from 'next/link';
import DefaultLayout from 'components/layout/DefaultLayout';

const sitemap = [
    {
        title: 'Blur',
        pages: [
            {
                title: 'Cheap Blur',
                url: '/blur/cheap',
            },
            {
                title: 'Fast Gaussian Blur',
                url: '/blur/fast-gaussian',
            },
        ],
    },
    {
        title: 'Configurators',
        pages: [
            {
                title: 'Props',
                url: '/configurators/props',
            },
        ],
    },
    {
        title: 'Materials',
        pages: [
            {
                title: 'Distortion Material',
                url: '/materials/distortion',
            },
        ],
    },
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
        title: 'Postprocessing',
        pages: [
            {
                title: 'Depth of Field',
                url: '/postprocessing/dof',
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
                        <div>{section.title}</div>
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
