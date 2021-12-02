import { useState, useEffect, useCallback } from 'react';

const useMousePosition = (normalize = false) => {
    const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
    const updateMousePosition = useCallback(
        (event: MouseEvent) => {
            setMousePosition(
                normalize
                    ? [(event.clientX / window.innerWidth - 0.5) * 2, -(event.clientY / window.innerHeight - 0.5) * 2]
                    : [event.clientX, event.clientY],
            );
        },
        [normalize],
    );

    useEffect(() => {
        document.addEventListener('mousemove', updateMousePosition);
        return () => document.removeEventListener('mousemove', updateMousePosition);
    }, [updateMousePosition]);

    return mousePosition;
};

export default useMousePosition;
