import { ReactNode, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { elementsState } from 'atoms/elements';

const Dom = ({ children }: { children: ReactNode }) => {
    const domRef = useRef<HTMLDivElement>(null);
    const [_, setElements] = useRecoilState(elementsState);

    useEffect(() => {
        setElements((prevElements) => ({ ...prevElements, dom: domRef }));
    }, [setElements]);

    return (
        <main ref={domRef} className="main">
            {children}
        </main>
    );
};

export default Dom;
