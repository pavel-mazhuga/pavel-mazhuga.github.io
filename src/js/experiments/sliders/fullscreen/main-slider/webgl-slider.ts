import Aladino from 'aladino';
import lerp from 'lerp';
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import MainSlider from './index';
import type { MainSliderOptions } from './types';

export default class WebglMainSlider extends MainSlider {
    isWebglInitialized: boolean;

    // width: number;

    // height: number;

    isAnimating: boolean;

    // containerRect: DOMRect;

    constructor(container: Element, options: Partial<MainSliderOptions>) {
        super(container, options);
        this._onVisibilityChange = this._onVisibilityChange.bind(this);
        // this.animate = this.animate.bind(this);

        this.isAnimating = false;
        // this.containerRect = this.container.getBoundingClientRect();
        // this.width = this.containerRect.width;
        // this.height = this.containerRect.height;
        this.isWebglInitialized = false;

        this._init();
    }

    protected _init() {
        this.aladino = new Aladino({
            density: 1,
            dpr: Math.min(devicePixelRatio, 2),
            canvas: this.options.canvas,
            // post: {
            //     fragment: postprocessingShader,
            //     uniforms: {
            //         speed: 0.0,
            //     },
            // },
        });

        this.displacementTexture = this.aladino.texture(`${PUBLIC_PATH}img/sliders/displacement-map.png`);
        this.textures = this.images.map((img) => this.aladino.texture(img.currentSrc));

        this.material = this.aladino.material({
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                currentImage: this.textures[this.activeIndex],
                nextImage: this.textures[this.nextIndex],
                disp: this.displacementTexture,
                dispPower: 0,
                intensity: 0.5,
                textureFactor: { x: 1, y: 1 },
            },
        });

        this.carpet = this.aladino.carpet(this.images[0], {
            material: this.material,
            uniforms: {
                image: this.textures[this.activeIndex],
            },
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                this.carpet.active = entry.isIntersecting;
            });
        });

        observer.observe(this.container);

        document.addEventListener('visibilitychange', this._onVisibilityChange);

        // this.animate();

        this.container.classList.add('webgl-initialized');
        this.isWebglInitialized = true;
    }

    protected setTextureFactor(index: number) {
        const { image } = this.textures[index];
        const factor = { x: 1, y: 1 };
        const rect = this.container.getBoundingClientRect();
        const rectRatio = rect.width / rect.height;
        const imageRatio = image.width / image.height;

        if (rectRatio > imageRatio) {
            factor.x = 1;
            factor.y = (1 / rectRatio) * imageRatio;
        } else {
            factor.x = (1 * rectRatio) / imageRatio;
            factor.y = 1;
        }

        return factor;
    }

    // render() {
    //     // material.uniforms.speed = lerp(material.uniforms.speed, speed, 0.6);
    //     // material.uniforms.speed2 = lerp(material.uniforms.speed2, speed, 0.1);
    //     // sliderAladino.post.uniforms.speed = lerp(sliderAladino.post.uniforms.speed, speed, 0.1);
    // }

    // animate() {
    //     this.render();
    //     this.rAF = requestAnimationFrame(this.animate);
    // }

    async destroy() {
        super.destroy();

        cancelAnimationFrame(this.rAF);
        document.removeEventListener('visibilitychange', this._onVisibilityChange);

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        this.carpet.destroy();
        this.aladino.destroy();
        this.container.classList.remove('webgl-initialized');
        this.isWebglInitialized = false;
    }

    async navigateTo(index: number) {
        super.navigateTo(index);

        if (!this.isAnimating) return;

        this.isAnimating = true;
        console.log(this);

        if (this.nextIndex !== index) {
            this.material.uniforms.nextImage = this.textures[index];
        }

        const factor = this.setTextureFactor(index);

        gsap.to(this.material.uniforms.dispPower, {
            duration: this.duration / 1000,
            value: 1,
            ease: 'expo.inOut',
            onComplete: () => {
                this.material.uniforms.dispPower = 0;
                this.material.uniforms.currentImage = this.textures[index];
                this.material.uniforms.nextImage = this.textures[this.nextIndex];
                this.isAnimating = false;
                // this.activeIndex = index;
            },
        });

        gsap.to(this.material.uniforms.textureFactor, {
            duration: this.duration / 1000,
            x: factor.x,
            y: factor.y,
            ease: 'expo.inOut',
        });
    }

    protected async _onResize() {
        super._onResize();
        this.carpet.resize();
    }

    protected async _onVisibilityChange() {
        // if (this.offscreen) {
        //     await this.offscreen.setState({ documentVisible: document.visibilityState === 'visible' });
        // }
    }
}
