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
    export interface IBarbaCache {
        data: {};
        extend: (obj: Object) => Object;
        get: (key: string) => any;
        reset: () => void;
        set: (key: string, val: any) => any;
    }

    export interface IBarbaHistory {
        add: (url: string, namespace: string) => void;
        history: any[];
        currentStatus: () => Object;
        prevStatus: () => Object;
    }

    export interface IBarbaTransition {
        done: () => void;
        extend: (obj: Object) => IBarbaTransition;
        init: (oldContainer: HTMLElement, newContainer: Promise<HTMLElement>) => Promise<any>;
        newContainer: HTMLElement | undefined;
        newContainerLoading: Promise<HTMLElement> | undefined;
        newContainerReady: Promise<void> | undefined;
        oldContainer: HTMLElement | undefined;
        start: () => void;
        [key: string]: any;
    }

    export interface IBarbaView {
        extend: (obj: Object) => IBarbaView;
        init: () => void;
        namespace: string | null;
        onEnter: () => void;
        onEnterCompleted: () => void;
        onLeave: () => void;
        onLeaveComplated: () => void;
    }

    const Barba: {
        version: string;
        BaseCache: IBarbaCache;
        BaseTransition: IBarbaTransition;
        BaseView: IBarbaView;
        Dispatcher: {
            events: Object;
            off: (event: string, f: Function) => void;
            on: (event: string, f: Function) => void;
            trigger: (event: string) => void;
        };
        HistoryManager: IBarbaHistory;
        Pjax: {
            Cache: IBarbaCache;
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
            History: IBarbaHistory;
            bindEvents: () => void;
            cacheEnabled: boolean;
            forceGoTo: (url: string) => void;
            getCurrentUrl: () => string;
            getHref: (element: HTMLElement) => string | undefined;
            getTransition: () => IBarbaTransition;
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
            onLinkEnter: (event: Object) => void;
        };
        Utils: {
            cleanLink: (url: string) => string;
            deferred: () => Function;
            extend: (obj: Object, props: Object) => Object;
            getCurrentUrl: () => string;
            getPort: (p?: number) => number;
            xhr: (url: string) => any;
            xhrTimeout: number;
        };
    };
    export default Barba;
}