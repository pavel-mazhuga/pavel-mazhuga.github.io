import '../../src/css/app.scss';
import 'focus-visible';

import { registerCustomElements } from '../../src/js/custom-elements';

registerCustomElements();

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};
