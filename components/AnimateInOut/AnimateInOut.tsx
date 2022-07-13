import React, { useRef, cloneElement, JSXElementConstructor, ReactElement } from 'react';
import gsap from 'gsap';
import { useTransitionContext } from 'contexts/page-transition';
import useIsomorphicLayoutEffect from 'hooks/use-isomorphic-layout-effect';
import { useRecoilState } from 'recoil';
import { preloaderReadyState } from 'atoms/preloader-ready';

interface Props {
    children: ReactElement<any, string | JSXElementConstructor<any>>;
    set?: gsap.TweenVars;
    from: gsap.TweenVars;
    to: gsap.TweenVars;
    durationIn?: number;
    durationOut?: number;
    delay?: number;
    delayOut?: number;
    skipOutro?: boolean;
}

const AnimateInOut = ({
    children,
    from,
    to,
    durationIn = 1,
    durationOut = 1,
    delay = 0,
    delayOut = 0,
    set,
    skipOutro = false,
}: Props) => {
    const { timeline } = useTransitionContext();
    const [preloderReady] = useRecoilState(preloaderReadyState);
    const el = useRef<Element>(null);

    useIsomorphicLayoutEffect(() => {
        if (typeof window !== 'undefined' && preloderReady) {
            // intro animation
            if (set) {
                gsap.set(el.current, { ...set });
            }

            requestAnimationFrame(() => {
                gsap.to(el.current, {
                    ...to,
                    delay,
                    duration: durationIn,
                });
            });
        }
    }, [preloderReady]);

    useIsomorphicLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            // outro animation
            if (!skipOutro) {
                timeline.add(
                    gsap.to(el.current, {
                        ...from,
                        delay: delayOut,
                        duration: durationOut,
                    }),
                    0,
                );
            }
        }
    }, []);

    return cloneElement(children, {
        style: { ...from, transform: `translate3d(${from.x || 0}px, ${from.y || 0}px, ${from.z || 0}px)` },
        ref: el,
    });
};

export default React.memo(AnimateInOut);
