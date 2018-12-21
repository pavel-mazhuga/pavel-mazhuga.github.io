declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (
        paths: string[],
        callback: (require: <T>(path: string) => T) => void
    ) => void;
};

declare var NODE_ENV: string;

declare module 'form-serialize' {
    import serialize = require('form-serialize');
    export { serialize };
    export default serialize;
}

declare module 'gsap/all' {
    import { TimelineMax, TweenMax, TimelineLite, TweenLite } from 'gsap';
    export { TimelineMax, TweenMax, TimelineLite, TweenLite };
}

declare module 'barba.js' {
    export interface IBarbaCache {
        data: {};
        extend: Function;
        get: Function;
        reset: Function;
        set: (key: any, val: any) => any;
    }

    export interface IBarbaHistory {
        add: (url: string, namespace: string) => void;
        history: any[];
        currentStatus: Function;
        prevStatus: Function;
    }

    export interface IBarbaTransition {
        done: Function;
        extend: (obj: any) => IBarbaTransition;
        init: (oldContainer: HTMLElement, newContainer: HTMLElement) => any;
        newContainer: HTMLElement | undefined;
        newContainerLoading: Promise<HTMLElement> | undefined;
        newContainerReady: Promise<void> | undefined;
        oldContainer: HTMLElement | undefined;
        start: Function;
        [key: string]: any;
    }

    export interface IBarbaView {
        extend: (obj: Object) => any;
        init: Function;
        namespace: string | null;
        onEnter: Function;
        onEnterCompleted: Function;
        onLeave: Function;
        onLeaveComplated: Function;
    }

    const Barba: {
        version: string;
        BaseCache: IBarbaCache;
        BaseTransition: IBarbaTransition;
        BaseView: IBarbaView;
        Dispatcher: {
            events: Object;
            off: (event: string, f: any) => void;
            on: (event: string, f: any) => void;
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
            init: Function;
            load: (url: string) => any;
            onLinkClick: (event: string) => void;
            onNewContainerLoaded: (container: HTMLElement) => void;
            onStateChange: Function;
            onTransitionEnd: () => void;
            preventCheck: (event: string, element: HTMLElement) => boolean;
            start: () => void;
            transitionProgress: boolean;
        };
        Prefetch: {
            ignoreClassLink: string;
            init: Function;
            onLinkEnter: Function;
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