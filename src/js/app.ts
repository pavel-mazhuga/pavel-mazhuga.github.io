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

import { createSliders1 } from './experiments/sliders/1';

registerCustomElements();

createParticlesBasic();
createParticlesPathTrailing();
createPhysicsWorker();
createShadersPatterns();
createSliders1();

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}

module.hot?.accept();
