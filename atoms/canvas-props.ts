import { atom } from 'recoil';

export const canvasPropsState = atom<Record<string, any>>({
    key: 'canvasPropsState',
    default: {},
});
