import * as THREE from 'three';
import { GlObject } from './gl-object';

const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';

export class Plane extends GlObject {
    init(el, sizes, { geometry, material, scene }) {
        super.init(el, sizes);

        this.geo = geometry;
        this.mat = material.clone();

        this.mat.uniforms.uTime = { value: 0 };
        this.mat.uniforms.uTexture = { value: 0 };
        this.mat.uniforms.uMeshSize = { value: new THREE.Vector2(this.rect.width, this.rect.height) };
        this.mat.uniforms.uImageSize = { value: new THREE.Vector2(0, 0) };

        this.img = this.el.querySelector('img');
        this.texture = loader.load(this.img.src, (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;

            this.mat.uniforms.uTexture.value = texture;
            // this.mat.uniforms.uImageSize.value = [this.img.naturalWidth, this.img.naturalHeight];
            this.mat.uniforms.uImageSize.value = new THREE.Vector2(this.img.naturalWidth, this.img.naturalHeight);
        });

        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mesh.scale.set(this.rect.width, this.rect.height, 1);
        this.add(this.mesh);
        scene.add(this);
    }

    updateProgress(value: number) {
        this.mat.uniforms.uProgress.value = value;
    }
}
