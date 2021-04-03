/* eslint-disable max-lines */
import delegate from 'delegate';
// import createDispatcher from 'lit-dispatcher';
import gsap from 'gsap';
// import debounce from 'lodash.debounce';
import Hammer from 'hammerjs';

import type { MainSliderOptions } from './types';

const defaultOptions: MainSliderOptions = {
    duration: 1,
    autoplay: false,
    delay: 5000,
    paused: false,
};

export default class MainSlider {
    container: Element;

    options: MainSliderOptions;

    slides: Element[];

    slidesContainer: Element | null;

    navigationContainer: Element | null;

    paginationContainer: Element | null;

    prevSlideButton: HTMLButtonElement | null;

    nextSlideButton: HTMLButtonElement | null;

    _paginationDelegation: any;

    // _dispatcher: ReturnType<typeof createDispatcher>;

    paginationButtons: HTMLButtonElement[];

    images: HTMLImageElement[];

    total: number;

    activeIndex: number;

    nextIndex: number;

    isAnimating: boolean;

    _autoplayTimeout: NodeJS.Timeout | null;

    // _contentMap: WeakMap<Element, { content: Element; label: Element; name: Element; link: Element }>;

    _hammer: HammerManager;

    tl: gsap.core.Timeline | null;

    constructor(container: Element, options: Partial<MainSliderOptions> = defaultOptions) {
        this.navigateToNext = this.navigateToNext.bind(this);
        this.navigateToPrev = this.navigateToPrev.bind(this);
        this._onResize = this._onResize.bind(this);
        this._onSwipe = this._onSwipe.bind(this);

        this.options = { ...defaultOptions, ...options };
        // this._dispatcher = createDispatcher();
        this.isAnimating = false;
        this.container = container;
        this.slides = Array.from(container.querySelectorAll('.js-main-slide'));
        this.total = this.slides.length;
        this.slidesContainer = container.querySelector('.js-main-slides-container');
        this.navigationContainer = container.querySelector('.js-main-slide-nav-container');
        this.paginationContainer = container.querySelector('.js-main-slide-pagination-container');
        this.images = Array.from(container.querySelectorAll('img.js-main-slide-img'));
        this.activeIndex = 0;
        this.nextIndex = this._getNextIndex();
        this.prevSlideButton = null;
        this.nextSlideButton = null;
        this.paginationButtons = [];
        this._paginationDelegation = null;
        this._autoplayTimeout = null;
        this.tl = null;

        // this._contentMap = new WeakMap<Element, { content: Element; label: Element; name: Element; link: Element }>();
        // this.slides.forEach((slide) => {
        //     this._contentMap.set(slide, {
        //         content: slide.querySelector('.js-main-slide-content')!,
        //         label: slide.querySelector('.js-main-slide-label')!,
        //         name: slide.querySelector('.js-main-slide-name')!,
        //         link: slide.querySelector('.js-main-slide-link')!,
        //     });
        // });

        // this._generateNavigation();
        // this._generatePagination();

        this._hammer = new Hammer(container as HTMLElement);
        this._hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        this._hammer.on('swipe', this._onSwipe);

        this.slides[this.activeIndex].classList.add('is-active');
        this.slides[this.nextIndex].classList.add('is-next');
        // this.paginationButtons[this.activeIndex].classList.add('a-loader');

        if (this.options.autoplay && !this.options.paused) {
            this._autoplayTimeout = setTimeout(this.navigateToNext, this.options.delay);
        }

        window.addEventListener('resize', this._onResize);
    }

    on(eventName: string, fn: (data?: any) => void) {
        // this._dispatcher.on(eventName, fn);
    }

    once(eventName: string, fn: (data?: any) => void) {
        // this._dispatcher.once(eventName, fn);
    }

    off(eventName: string, fn: (data?: any) => void) {
        // this._dispatcher.off(eventName, fn);
    }

    resume() {
        this.options.paused = true;
        this._autoplayTimeout = setTimeout(this.navigateToNext, this.options.delay);
    }

    navigateTo(index: number) {
        console.log('adf');
        if (this.activeIndex === index || this.isAnimating) return;

        if (this._autoplayTimeout) {
            clearTimeout(this._autoplayTimeout);
        }

        this.isAnimating = true;
        // this._dispatcher.dispatch('change', { currentIndex: this.activeIndex, nextIndex: index });

        // const activePaginationBtn = this.paginationButtons.find(
        //     (btn) => this.paginationButtons.indexOf(btn) === this.activeIndex,
        // );

        // if (activePaginationBtn) {
        //     activePaginationBtn.classList.remove('a-loader');
        //     activePaginationBtn.classList.remove('is-active');
        // }

        // this.paginationButtons.find((btn) => this.paginationButtons.indexOf(btn) === index)?.classList.add('is-active');

        const nextIndex = this._getNextIndex(this._getPrevIndex(index));
        const nextAfterNextIndex = this._getNextIndex(nextIndex);

        if (this.nextIndex !== nextIndex) {
            this.slides[this.nextIndex].classList.remove('is-next');
            this.slides[nextIndex].classList.add('is-next');
            this.nextIndex = nextIndex;
        }

        // const currentContent = this._contentMap.get(this.slides[this.activeIndex]);
        // const nextContent = this._contentMap.get(this.slides[index]);
        // const nextAfterNextContent = this._contentMap.get(this.slides[nextAfterNextIndex]);
        const duration = (this.options.duration / 1000) * 0.9;

        // const cloneSlide = this.slides[nextAfterNextIndex].cloneNode(true) as Element;
        // cloneSlide.classList.add('main-slide--clone');
        // cloneSlide.classList.remove('is-active');
        // cloneSlide.classList.remove('is-next');
        // this.slidesContainer?.appendChild(cloneSlide);

        this.tl = gsap.timeline({
            defaults: { duration },
            onComplete: () => {
                // this.slidesContainer?.removeChild(cloneSlide);

                // this.paginationButtons
                //     .find((btn) => this.paginationButtons.indexOf(btn) === index)
                //     ?.classList.add('a-loader');

                this.slides[this.activeIndex].classList.remove('is-active');
                this.slides[this.nextIndex].classList.remove('is-next');

                this.activeIndex = index;
                this.nextIndex = this._getNextIndex();

                this.slides[this.activeIndex].classList.add('is-active');
                this.slides[this.nextIndex].classList.add('is-next');

                gsap.set(
                    [
                        this.slides[index],
                        // currentContent!.link,
                        // currentContent!.name,
                        // currentContent!.label,
                        // nextContent!.content,
                        // nextContent!.name,
                        // nextContent!.label,
                        // nextContent!.link,
                        // nextAfterNextContent!.name,
                    ],
                    { clearProps: 'all' },
                );

                this.isAnimating = false;
                // this._dispatcher.dispatch('change-complete', {
                //     currentIndex: this.activeIndex,
                //     nextIndex: this.nextIndex,
                // });

                if (this.options.autoplay) {
                    this._autoplayTimeout = setTimeout(this.navigateToNext, this.options.delay);
                }
            },
        });

        this.tl
            .to(this.images[this.activeIndex], {
                autoAlpha: 0,
                ease: 'power4.inOut',
            })
            .fromTo(
                this.images[nextIndex],
                {
                    autoAlpha: 0,
                },
                {
                    x: 0,
                    autoAlpha: 1,
                    ease: 'expo.inOut',
                },
                `-=${duration}`,
            )
            .fromTo(
                // this.slides[index],
                nextContent!.content,
                {
                    x: 0,
                },
                {
                    x: window.matchMedia('(max-width: 1024px)').matches ? '-100vw' : '-50vw',
                    ease: 'power4.inOut',
                },
                `-=${duration - 0.05}`,
            )
            .to(
                nextContent!.name,
                {
                    opacity: 1,
                    ease: 'expo.inOut',
                },
                `-=${duration}`,
            )
            .fromTo(
                nextContent!.label,
                {
                    x: '15vw',
                    autoAlpha: 0,
                },
                {
                    x: 0,
                    autoAlpha: 1,
                    ease: 'expo.inOut',
                },
                `-=${duration - 0.05}`,
            )
            .fromTo(
                cloneSlide,
                {
                    x: '50vw',
                },
                {
                    x: 0,
                    ease: 'power4.inOut',
                },
                `-=${duration - 0.05}`,
            );
    }

    navigateToPrev() {
        this.navigateTo(this._getPrevIndex());
    }

    navigateToNext() {
        this.navigateTo(this._getNextIndex());
    }

    destroy() {
        if (this.tl) {
            this.tl.kill();
            this.tl = null;
        }
        this._hammer.destroy();
        window.removeEventListener('resize', this._onResize);
        this.prevSlideButton?.removeEventListener('click', this.navigateToPrev);
        this.nextSlideButton?.removeEventListener('click', this.navigateToNext);
        // this.slides.forEach((slide) => {
        //     this._contentMap.delete(slide);
        // });

        if (this._paginationDelegation) {
            this._paginationDelegation.destroy();
        }

        if (this._autoplayTimeout) {
            clearTimeout(this._autoplayTimeout);
        }
    }

    protected _onResize() {
        //
    }

    protected _onSwipe(event: any) {
        console.log('swipe');
        if (event.deltaX < 0) {
            this.navigateToNext();
        } else {
            this.navigateToPrev();
        }
    }

    protected _generateNavigation() {
        if (!this.navigationContainer) return;

        const arrowTemplate = `
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2 1.348a.59.59 0 00-.834-.832L8.08 6.802 2.014.516a.59.59 0 00-.833.832l6.9 7.01 7.118-7.01z" fill="#fff"/>
            </svg>
        `;
        this.prevSlideButton = document.createElement('button');
        this.prevSlideButton.className = 'main-slider-navigation-arrow main-slider-navigation-arrow--prev';
        const prevSlideLabel = 'Предыдущий слайд';
        this.prevSlideButton.setAttribute('aria-label', prevSlideLabel);
        this.prevSlideButton.setAttribute('title', prevSlideLabel);
        this.prevSlideButton.innerHTML = arrowTemplate;
        this.prevSlideButton.addEventListener('click', this.navigateToPrev);

        this.nextSlideButton = document.createElement('button');
        this.nextSlideButton.className = 'main-slider-navigation-arrow main-slider-navigation-arrow--next';
        const nextSlideLabel = 'Следующий слайд';
        this.nextSlideButton.setAttribute('aria-label', nextSlideLabel);
        this.nextSlideButton.setAttribute('title', nextSlideLabel);
        this.nextSlideButton.innerHTML = arrowTemplate;
        this.nextSlideButton.addEventListener('click', this.navigateToNext);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.prevSlideButton);
        fragment.appendChild(this.nextSlideButton);

        this.navigationContainer.appendChild(fragment);
    }

    protected _generatePagination() {
        if (!this.paginationContainer) return;

        const loaderTemplate = `
            <svg viewBox="0 0 37 37" class="main-slider-pagination__loading-svg" preserveAspectRatio="none">
                <circle class="main-slider-pagination__loading-path" cx="19" cy="19" r="18.5" style="--path-length:115.49px;"></circle>
            </svg>
        `;

        this.paginationButtons = [];
        const ul = document.createElement('ul');
        ul.className = 'list-unstyled main-slider-pagination-list';

        for (let i = 0; i < this.total; i++) {
            const li = document.createElement('li');
            li.className = 'main-slider-pagination-list__item';
            ul.appendChild(li);
            const button = document.createElement('button');
            button.className = 'main-slider-pagination-btn js-main-slider-pagination-btn';
            const buttonLabel = `Перейти на слайд ${i + 1}`;
            button.setAttribute('aria-label', buttonLabel);
            button.setAttribute('title', buttonLabel);
            button.setAttribute('data-slide-index', `${i}`);
            if (this.activeIndex === i) {
                button.classList.add('is-active');
            }
            this.paginationButtons.push(button);
            li.appendChild(button);
            button.innerHTML += loaderTemplate;
        }

        this.paginationContainer.appendChild(ul);

        this._paginationDelegation = delegate(
            this.paginationContainer,
            '.js-main-slider-pagination-btn',
            'click',
            (event: any) => {
                this.navigateTo(parseInt(event.delegateTarget.dataset.slideIndex, 10));
            },
        );
    }

    protected _getPrevIndex(index = this.activeIndex) {
        return (index - 1 + this.total) % this.total;
    }

    protected _getNextIndex(index = this.activeIndex) {
        return (index + 1) % this.total;
    }
}
