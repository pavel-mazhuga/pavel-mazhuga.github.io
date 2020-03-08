import { wrap } from 'comlink';

interface ProxyData {
    canvas: HTMLCanvasElement;
    workerUrl: string;
    // name: string;
}

export interface OffscreenBaseData {
    canvas: HTMLCanvasElement;
    isWorker: boolean;
}

/**
 * @param  {} canvas - HTMLCanvasElement
 * @param  {} workerUrl - path to the worker file
 * @param  {} name - unique name for accessing module from 'window' object
 * (if 'transferControlToOffscreen' is not supported)
 */
export function createOffscreenCanvas<T>({ canvas, workerUrl }: ProxyData, data: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
        if (canvas.transferControlToOffscreen) {
            try {
                const worker = new Worker(workerUrl);
                const offscreen = canvas.transferControlToOffscreen();

                worker.addEventListener('message', (event) => {
                    if (event.data === 'ready') {
                        const proxy = wrap<T>(worker);
                        resolve(proxy);
                    }
                });

                worker.postMessage(
                    {
                        message: 'init',
                        options: {
                            canvas: offscreen,
                            isWorker: true,
                            ...data,
                        },
                    },
                    [offscreen],
                );
            } catch (err) {
                reject(err);
            }
        } else {
            const script = document.createElement('script');
            script.src = workerUrl;
            script.async = true;
            script.onload = () => {
                const randomId = `__offscreen-canvas-proxy__${Math.floor(Math.random())}`;
                resolve(
                    (window as any)[randomId]({
                        canvas,
                        isWorker: false,
                        ...data,
                    }),
                );
                (window as any)[randomId] = null;
            };

            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        }
    });
}

export class BaseEntity {
    constructor() {
        this.rAF = 0;
        this.state = {};
    }

    async getState() {
        return this.state;
    }

    async setState(newState = {}) {
        this.state = { ...this.state, ...newState };
    }
}
