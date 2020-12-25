import { clientsClaim } from 'workbox-core';

import { registerRoutes } from './register-routes';

clientsClaim();
global.skipWaiting();
registerRoutes();
