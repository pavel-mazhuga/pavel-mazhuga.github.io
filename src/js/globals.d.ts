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
    import { serialize } from 'form-serialize';
    export default serialize;
}