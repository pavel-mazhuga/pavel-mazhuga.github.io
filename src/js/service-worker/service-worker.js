import { clientsClaim, skipWaiting } from 'workbox-core';

import { registerRoutes } from './register-routes';

clientsClaim();
skipWaiting();
registerRoutes();
