import { atom } from 'recoil';
import { Group } from 'three';

export const rootGroupState = atom<Group | null>({
    key: 'rootGroupState',
    default: null,
});
