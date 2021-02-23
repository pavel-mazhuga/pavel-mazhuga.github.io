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

registerCustomElements();

createParticlesBasic();
createParticlesPathTrailing();
createPhysicsWorker();
createShadersPatterns();

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}

module.hot?.accept();
