import { Power0 } from 'gsap/all';
import CustomEase from '../../external/gsap-custom-ease';

// noop ease
export const LinearEase = Power0.easeNone;

// https://material.io/design/motion/speed.html#easing -- Standart easing
export const StandartEase = CustomEase.create('material-standart', 'M0,0 C0.4,0 0.2,1 1,1');

// https://material.io/design/motion/speed.html#easing -- Decelerate easing
export const DecelerateEase = CustomEase.create('material-decelerate', 'M0,0 C0,0 0.2,1 1,1');

// https://material.io/design/motion/speed.html#easing -- Accelerate easing
export const AccelerateEase = CustomEase.create('material-accelerate', 'M0,0 C0.4,0 1,1 1,1');

// https://material.io/design/motion/speed.html#duration -- Complexity level / Simple animations
export const SimpleDuration = 0.1;
export const SimpleFadeInDuration = 0.15;
export const SimpleFadeOutDuration = 0.075;

// https://material.io/design/motion/speed.html#duration -- Complexity level / Complex animations
export const ComplexDuration = 0.2;
export const ComplexDetailedDuration = 0.5;

// https://material.io/design/motion/speed.html#duration -- Exits and closing
export const OpenDuration = 0.25;
export const CloseDuration = 0.25;
export const ExpandDuration = 0.3;
export const CollapseDuration = 0.25;

// https://material.io/design/motion/speed.html#duration -- Area / Small
export const AreaSmallDuration = 0.1;

// https://material.io/design/motion/speed.html#duration -- Area / Medium
export const AreaMediumExpandDuration = 0.25;
export const AreaMediumCollapseDuration = 0.2;

// https://material.io/design/motion/speed.html#duration -- Area / Large
export const AreaLargeExpandDuration = 0.3;
export const AreaLargeCollapseDuration = 0.25;
