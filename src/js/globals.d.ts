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
    export default serialize;
}

declare module 'gsap/all' {
    import { TimelineMax, TweenMax, TimelineLite, TweenLite } from 'gsap';
    export { TimelineMax, TweenMax, TimelineLite, TweenLite };
}