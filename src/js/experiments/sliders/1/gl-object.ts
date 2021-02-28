import * as THREE from 'three';

export class GlObject extends THREE.Object3D {
    init(el: HTMLElement, sizes) {
        this.el = el;
        this.sizes = sizes;

        this.resize();
    }

    resize() {
        this.rect = this.el.getBoundingClientRect();
        const { left, top, width, height } = this.rect;

        this.pos = {
            x: left + width / 2 - this.sizes.width / 2,
            y: top + height / 2 - this.sizes.height / 2,
        };

        this.position.y = this.pos.y;
        this.position.x = this.pos.x;

        this.updateX();
    }

    updateX(current) {
        if (current) {
            this.position.x = current + this.pos.x;
        }
    }
}
