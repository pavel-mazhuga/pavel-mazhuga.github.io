/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';

import sw from './sw';
import { registerCustomElements } from './custom-elements';

import { createParticlesBasic } from './experiments/particles/particles-basic';
import { createParticlesPathTrailing } from './experiments/particles/path-trailing';

import { createPhysicsWorker } from './experiments/physics/physics-worker';

import { createShadersPatterns } from './experiments/shaders/patterns';
import { createShadersPixelated } from './experiments/shaders/pixelated';

import { createSliders1 } from './experiments/sliders/1';
import { createSlidersFullscreen } from './experiments/sliders/fullscreen';

registerCustomElements();

createParticlesBasic();
createParticlesPathTrailing();

createPhysicsWorker();

createShadersPatterns();
createShadersPixelated();
createSliders1();
createSlidersFullscreen();

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}

module.hot?.accept();
