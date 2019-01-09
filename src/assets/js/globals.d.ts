declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (
        paths: string[],
        callback: (require: <T>(path: string) => T) => void
    ) => void;
};

declare const NODE_ENV: string;

declare module 'form-serialize' {
    import serialize = require('form-serialize');
    export { serialize };
    export default serialize;
}

declare module 'gsap/all' {
    import {
        TimelineMax,
        TweenMax,
        TimelineLite,
        TweenLite,
        Ease,
        Power0,
        Power1,
        Power2,
        Power3,
        Power4,
        Linear,
    } from 'gsap';
    export {
        TimelineMax,
        TweenMax,
        TimelineLite,
        TweenLite,
        Ease,
        Power0,
        Power1,
        Power2,
        Power3,
        Power4,
        Linear,
    };
}

declare module 'barba.js' {
    export interface BarbaCache {
        data: {};
        extend: (obj: { [key: string]: any }) => { [key: string]: any };
        get: (key: string) => any;
        reset: () => void;
        set: (key: string, val: any) => any;
    }

    export interface BarbaHistory {
        add: (url: string, namespace: string) => void;
        history: any[];
        currentStatus: () => { [key: string]: any };
        prevStatus: () => { [key: string]: any };
    }

    export interface BarbaTransition {
        done: () => void;
        extend: (obj: { [key: string]: any }) => BarbaTransition;
        init: (oldContainer: HTMLElement, newContainer: Promise<HTMLElement>) => Promise<any>;
        newContainer: HTMLElement | undefined;
        newContainerLoading: Promise<HTMLElement> | undefined;
        newContainerReady: Promise<void> | undefined;
        oldContainer: HTMLElement | undefined;
        start: () => void;
    }

    export interface BarbaView {
        extend: (obj: { [key: string]: any }) => BarbaView;
        init: () => void;
        namespace: string | null;
        onEnter: () => void;
        onEnterCompleted: () => void;
        onLeave: () => void;
        onLeaveComplated: () => void;
    }

    const Barba: {
        version: string;
        BaseCache: BarbaCache;
        BaseTransition: BarbaTransition;
        BaseView: BarbaView;
        Dispatcher: {
            events: { [key: string]: any };
            off: (event: string, f: Function) => void;
            on: (event: string, f: Function) => void;
            trigger: (event: string) => void;
        };
        HistoryManager: BarbaHistory;
        Pjax: {
            Cache: BarbaCache;
            Dom: {
                containerClass: string;
                currentHTML: string;
                dataNamespace: string;
                getContainer: (element: HTMLElement) => HTMLElement;
                getNamespace: (element: HTMLElement) => string;
                getWrapper: () => HTMLElement;
                parseContainer: (element: HTMLElement) => HTMLElement;
                parseResponse: (responseText: string) => HTMLElement;
                putContainer: (element: HTMLElement) => void;
                wrapperId: string;
            };
            History: BarbaHistory;
            bindEvents: () => void;
            cacheEnabled: boolean;
            forceGoTo: (url: string) => void;
            getCurrentUrl: () => string;
            getHref: (element: HTMLElement) => string | undefined;
            getTransition: () => BarbaTransition;
            goTo: (url: string) => void;
            ignoreClassLink: string;
            init: () => void;
            load: (url: string) => any;
            onLinkClick: (event: string) => void;
            onNewContainerLoaded: (container: HTMLElement) => void;
            onStateChange: () => void;
            onTransitionEnd: () => void;
            preventCheck: (event: string, element: HTMLElement) => boolean;
            start: () => void;
            transitionProgress: boolean;
        };
        Prefetch: {
            ignoreClassLink: string;
            init: () => void;
            onLinkEnter: (event: { [key: string]: any }) => void;
        };
        Utils: {
            cleanLink: (url: string) => string;
            deferred: () => Function;
            extend: (obj: { [key: string]: any }, props: { [key: string]: any }) => { [key: string]: any };
            getCurrentUrl: () => string;
            getPort: (p?: number) => number;
            xhr: (url: string) => any;
            xhrTimeout: number;
        };
    };
    export default Barba;
}