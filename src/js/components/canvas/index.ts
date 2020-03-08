/* global PUBLIC_PATH */
import { createOffscreenCanvas } from '../../offscreen-canvas-proxy';
import Canvas, { randomId } from './canvas-module';

interface MainThreadData {
    dpr: number;
    width: number;
    height: number;
}

export type CanvasData = OffscreenBaseData & MainThreadData;

export default async () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const instance = await createOffscreenCanvas<Canvas>(
        {
            canvas,
            workerUrl: `${PUBLIC_PATH}js/canvas.named-worker.js`,
            id: randomId,
        },
        {
            dpr: window.devicePixelRatio,
            width: window.innerWidth,
            height: window.innerHeight,
        },
    );

    const init = () => {
        document.body.addEventListener('click', async () => {
            const { shouldRender } = await instance.getState();
            await instance.setState({ shouldRender: !shouldRender });
        });
    };

    const destroy = async () => {
        await instance.destroy();
        await instance.releaseProxy();
    };

    init();

    return { destroy };
};
