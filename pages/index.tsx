import type { NextPage } from 'next';
import Link from 'next/link';
import DefaultLayout from 'components/layout/DefaultLayout';
import { createPortal } from '@react-three/fiber';
import { useRecoilState } from 'recoil';
import { rootGroupState } from 'atoms/root-group';

const sitemap = [
    {
        title: 'Blur',
        pages: [
            {
                title: 'Cheap Blur',
                url: '/blur/cheap',
            },
            {
                title: 'Fast Gaussian Blur (5)',
                url: '/blur/fast-gaussian-5',
            },
            {
                title: 'Fast Gaussian Blur (9)',
                url: '/blur/fast-gaussian-9',
            },
            {
                title: 'Fast Gaussian Blur (13)',
                url: '/blur/fast-gaussian-13',
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
            {
                title: 'Model',
                url: '/particles/model',
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
    // {
    //     title: 'Reflections',
    //     pages: [
    //         {
    //             title: 'Reflector floor',
    //             url: '/reflections/reflector-floor',
    //         },
    //     ],
    // },
];

const HomePage: NextPage = () => {
    const [rootGroup] = useRecoilState(rootGroupState);

    return (
        <>
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
            {rootGroup &&
                createPortal(
                    <>
                        <mesh>
                            <sphereBufferGeometry args={[1, 32, 32]} />
                            <meshStandardMaterial color="red" />
                        </mesh>
                        <pointLight position={[1, 1, 1]} />
                    </>,
                    rootGroup,
                )}
        </>
    );
};

// const R3F = () => {
//     return (
//         <>
//             <mesh>
//                 <sphereBufferGeometry args={[1, 32, 32]} />
//                 <meshStandardMaterial color="red" />
//             </mesh>
//             <pointLight position={[1, 1, 1]} />
//         </>
//     );
// };

// HomePage.r3f = R3F;

export default HomePage;
