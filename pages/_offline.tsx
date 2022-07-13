import DefaultLayout from 'components/layout/DefaultLayout';
import Sphere from 'components/sphere';

const OfflinePage = () => {
    return (
        <DefaultLayout>
            <h1>No internet connection</h1>
            <p>Looks like you are offline.</p>
        </DefaultLayout>
    );
};

const R3F = () => <Sphere />;

OfflinePage.R3F = R3F;

export default OfflinePage;
