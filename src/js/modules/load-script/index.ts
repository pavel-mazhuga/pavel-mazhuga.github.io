import { IAppWindow } from '../../types';

declare const window: IAppWindow;

export default function loadScript(url: string): Promise<HTMLScriptElement | string | Event> {
    return new Promise((resolve, reject) => {
        if (!window.loadedScripts) {
            window.loadedScripts = [];
        }

        if (window.loadedScripts[url]) {
            resolve(window.loadedScripts[url]);
        }

        const script = document.createElement('script');
    
        script.onerror = (err) => {
            window.loadedScripts[url] = false;
            reject(err);
        };
    
        script.onload = () => {
            window.loadedScripts[url] = true;
            resolve(script);
        };
    
        script.async = true;
        script.src = url;
    
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(script);
    });
};
