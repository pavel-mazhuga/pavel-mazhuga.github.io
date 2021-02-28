import { PlaneBufferGeometry, ShaderMaterial, Mesh, RawShaderMaterial, TextureLoader, Vector2 } from 'three';
import gsap from 'gsap';
// import MagicShader from 'magicshader';

import { scene } from '../../scene';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { dispatcher } from '../../../dispatcher';
import { Dom3D } from '../dom-3d';
import { DispatcherRenderData } from '../..';
import { camera } from '../../camera';

export interface Image {
    geometry: PlaneBufferGeometry;
    material: ShaderMaterial;
    mesh: Mesh;
    imageAspect: number;
}

const INITIALIZED_CLASS = 'component--initialized';
const geometry = new PlaneBufferGeometry(1, 1, 16, 9);
const material = new RawShaderMaterial({ vertexShader, fragmentShader });
// const material = new MagicShader({ vertexShader, fragmentShader });
const textureLoader = new TextureLoader();

export class Image extends Dom3D {
    constructor(element: HTMLImageElement) {
        super(element);
        this.name = 'Image';
        this.onMouseenter = this.onMouseenter.bind(this);
        this.onMouseleave = this.onMouseleave.bind(this);
        this.onRender = this.onRender.bind(this);
        this.onResize = this.onResize.bind(this);

        this.imageAspect = 1;
        this.geometry = geometry;
        this.material = material.clone();
        this.material.uniforms = {
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uTexture: { value: textureLoader.load(element.currentSrc) },
            uvRate: { value: new Vector2(1, 1) },
        };
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = 'Image Mesh';

        this.init();
    }

    protected objectFitCover() {
        const imageElement = this.element as HTMLImageElement;
        this.imageAspect = imageElement.naturalHeight / imageElement.naturalWidth;
        let uvRateX;
        let uvRateY;

        if (this.bounds.height / this.bounds.width > this.imageAspect) {
            // Horizontally-oriented image
            uvRateX = (this.bounds.width / this.bounds.height) * this.imageAspect;
            uvRateY = 1;
        } else {
            // Vertically-oriented image
            uvRateX = 1;
            uvRateY = this.bounds.height / this.bounds.width / this.imageAspect;
        }

        this.material.uniforms.uvRate.value.x = uvRateX;
        this.material.uniforms.uvRate.value.y = uvRateY;

        const height = 1;
        camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * camera.position.z));
    }

    protected onResize() {
        super._onResize();
        this.objectFitCover();
    }

    protected onMouseenter() {
        gsap.to(this.material.uniforms.uProgress, {
            duration: 0.5,
            value: 1,
            ease: 'Power2.easeOut',
        });
    }

    protected onMouseleave() {
        gsap.to(this.material.uniforms.uProgress, {
            duration: 0.4,
            value: 0,
        });
    }

    onRender({ time }: DispatcherRenderData) {
        super._onRender();
        this.material.uniforms.uTime.value = time;
    }

    protected init() {
        this.onResize();
        this.add(this.mesh);
        scene.add(this);
        this.element.addEventListener('mouseenter', this.onMouseenter);
        this.element.addEventListener('mouseleave', this.onMouseleave);
        dispatcher.on('resize', this.onResize);
        dispatcher.on('render', this.onRender);
        this.element.classList.add(INITIALIZED_CLASS);
    }

    destroy() {
        super.destroy();
        this.element.removeEventListener('mouseenter', this.onMouseenter);
        this.element.removeEventListener('mouseleave', this.onMouseleave);
        dispatcher.off('resize', this.onResize);
        dispatcher.off('render', this.onRender);
        scene.remove(this.mesh);
        this.material.dispose();
        this.element.classList.remove(INITIALIZED_CLASS);
    }
}
