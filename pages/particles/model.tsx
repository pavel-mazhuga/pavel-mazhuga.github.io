import { Suspense } from 'react';
import { useControls } from 'leva';
import DefaultLayout from 'components/layout/DefaultLayout';
import ParticledShoe from 'components/gltfjsx/ParticledShoe';

// const DEBUG = process.env.NODE_ENV === 'development';

function Experience() {
    return (
        <Suspense fallback={null}>
            <ParticledShoe color="tomato" position={[0, 0, 0]} />
        </Suspense>
    );
}

function Page() {
    return <DefaultLayout documentTitle="Model in particles" />;
}

const R3F = () => {
    return <Experience />;
};

Page.R3F = R3F;

export default Page;
