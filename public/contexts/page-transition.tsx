import { useState, createContext, ReactNode, useContext, Dispatch, SetStateAction } from 'react';
import gsap from 'gsap';

const TransitionContext = createContext<{
    timeline: gsap.core.Timeline;
    setTimeline: Dispatch<SetStateAction<gsap.core.Timeline>>;
}>({
    timeline: gsap.timeline(),
    setTimeline: () => {},
});

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
    const [timeline, setTimeline] = useState(() => gsap.timeline({ paused: true }));

    return (
        <TransitionContext.Provider
            value={{
                timeline,
                setTimeline,
            }}
        >
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransitionContext = () => useContext(TransitionContext);
