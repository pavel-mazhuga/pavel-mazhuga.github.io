import { RefObject } from 'react';
import { atom } from 'recoil';

export const elementsState = atom<{
    dom: RefObject<HTMLDivElement> | null;
    canvas: RefObject<HTMLCanvasElement> | null;
}>({
    key: 'elementsState',
    default: {
        dom: null,
        canvas: null,
    },
});
