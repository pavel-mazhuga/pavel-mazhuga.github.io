import { Object3D } from 'three';

import { camera } from '../camera';
import { viewport } from '../../viewport';
import { scroll } from '../../scroll';

export interface Dom3D {
    element: HTMLElement;
    bounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    camUnit: {
        width: number;
        height: number;
    };
}

export class Dom3D extends Object3D {
    constructor(element: HTMLElement) {
        super();

        if (!element) {
            throw new Error('[Dom3D] HTML Element is not provided.');
        }

        this.element = element;
        this.bounds = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };
        this.camUnit = {
            width: 0,
            height: 0,
        };
    }

    updateSize() {
        this.camUnit = camera.calculateUnitSize(camera.position.z - this.position.z);

        // Set size
        const x = this.bounds.width / viewport.width;
        const y = this.bounds.height / viewport.height;

        if (!x || !y) {
            return;
        }

        this.scale.x = this.camUnit.width * x;
        this.scale.y = this.camUnit.height * y;
    }

    updatePosition(pos = scroll.y) {
        // Set origin to top left
        this.position.x = -(this.camUnit.width / 2) + this.scale.x / 2;
        this.position.y = this.camUnit.height / 2 - this.scale.y / 2;

        // Set position
        this.position.x += (this.bounds.left / viewport.width) * this.camUnit.width;
        this.position.y -= ((this.bounds.top - pos) / viewport.height) * this.camUnit.height;
    }

    protected _onResize() {
        const rect = this.element.getBoundingClientRect();
        this.bounds.left = rect.left;
        this.bounds.top = rect.top;
        this.bounds.width = rect.width;
        this.bounds.height = rect.height;

        this.updateSize();
        this.updatePosition();
    }

    protected _onRender() {
        this.updatePosition(/* scroll.easeY */);
        // this._onResize();
    }

    destroy() {
        if (this.parent) {
            this.parent.remove(this);
        }

        this.visible = false;
    }
}
