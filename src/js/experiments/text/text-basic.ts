import './styles.scss';
import Aladino from 'aladino';
import gsap from 'gsap';
import { baseExperiment } from '../base';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

function getPowerOfTwo(value: number, pow = 1) {
    let _pow = pow;

    while (_pow < value) {
        _pow *= 2;
    }

    return _pow;
}

function createMultilineText(ctx, textToWrite, maxWidth, text) {
    textToWrite = textToWrite.replace('\n', ' ');
    var currentText = textToWrite;
    var futureText;
    var subWidth = 0;
    var maxLineWidth = 0;

    var wordArray = textToWrite.split(' ');
    var wordsInCurrent, wordArrayLength;
    wordsInCurrent = wordArrayLength = wordArray.length;

    // Reduce currentText until it is less than maxWidth or is a single word
    // futureText var keeps track of text not yet written to a text line
    while (ctx.measureText(currentText).width > maxWidth && wordsInCurrent > 1) {
        console.log({ currentText, width: ctx.measureText(currentText).width });
        wordsInCurrent--;
        // let linebreak = false;

        currentText = futureText = '';
        for (let i = 0; i < wordArrayLength; i++) {
            if (i < wordsInCurrent) {
                currentText += wordArray[i];
                if (i + 1 < wordsInCurrent) {
                    currentText += ' ';
                }
            } else {
                futureText += wordArray[i];
                if (i + 1 < wordArrayLength) {
                    futureText += ' ';
                }
            }
        }
    }
    text.push(currentText); // Write this line of text to the array
    maxLineWidth = ctx.measureText(currentText).width;

    // If there is any text left to be written call the function again
    if (futureText) {
        subWidth = createMultilineText(ctx, futureText, maxWidth, text);
        if (subWidth > maxLineWidth) {
            maxLineWidth = subWidth;
        }
    }

    // Return the maximum line width
    return maxLineWidth;
}

function createTextCanvas(el: HTMLElement) {
    const text = el.textContent || '';
    const dpr = Math.min(2, window.devicePixelRatio);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const textMeasurement = ctx.measureText(text);
    const styles = getComputedStyle(el);
    const textArr: string[] = [];
    const fontSize = parseFloat(styles.fontSize) * dpr;
    const width = parseFloat(styles.width);
    // const width = getPowerOfTwo(textMeasurement.width);
    const height = parseFloat(styles.height);
    const lineHeight = parseFloat(styles.lineHeight);
    // const height = getPowerOfTwo(fontSize * 2);
    const maxWidth = createMultilineText(ctx, text, width, textArr);
    console.log({ maxWidth });

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.font = `${fontSize}px ${styles.fontFamily}`;
    ctx.textAlign = 'center';
    // ctx.textAlign = styles.textAlign;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = styles.color;

    // const canvasX = maxWidth;
    const canvasX = width;
    // const canvasX = canvas.width;
    const canvasY = lineHeight * textArr.length;
    // const textX = canvas.width / 2;
    // const textX = canvasX / 2;
    const textX = 0;
    let textY: number;
    const offset = (canvasY - lineHeight * (textArr.length + 1)) * 0.5;
    console.log(textArr);

    // for (let i = 0; i < textArr.length; i++) {
    //     textY = (i + 1) * lineHeight + offset;
    //     // textY = canvas.height / 2;
    //     ctx.fillText(textArr[i], textX, textY);
    //     // ctx.fillText(textArr[i], textX, textY + fontSize * 0.14);
    // }
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize * 0.14);

    return canvas;
}

export const createTextBasic = baseExperiment('text-basic', async ({ canvas, sizes, onRender, gui }) => {
    let rAF: number;

    const aladino = new Aladino({
        density: 1,
        dpr: Math.min(devicePixelRatio, 2),
        canvas,
    });

    Array.from(document.querySelectorAll<HTMLElement>('.js-gl-text')).forEach((textEl) => {
        const material = aladino.material({
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                pixelSize: 1,
            },
        });

        textEl.addEventListener('mouseenter', () => {
            gsap.to(material.uniforms, {
                duration: 0.6,
                pixelSize: 60,
                ease: 'steps(10)',
            });
        });

        textEl.addEventListener('mouseleave', () => {
            gsap.to(material.uniforms, {
                duration: 0.6,
                pixelSize: 1,
                ease: 'steps(10)',
            });
        });

        function generateTexture() {
            return new Promise((resolve) => {
                createTextCanvas(textEl).toBlob((blob) => {
                    const newImg = new Image();
                    newImg.hidden = true;
                    const url = URL.createObjectURL(blob);

                    newImg.onload = () => {
                        document.body.removeChild(newImg);
                        resolve(url);
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 0);
                    };

                    newImg.src = url;
                    document.body.appendChild(newImg);
                });
            });
        }

        let carpet;

        generateTexture().then((url) => {
            carpet = aladino.carpet(textEl, {
                material,
                uniforms: {
                    image: aladino.texture(url),
                },
            });
        });

        window.addEventListener('resize', () => {
            generateTexture().then((url) => {
                if (carpet) {
                    carpet.uniforms.image = aladino.texture(url);
                }
            });
        });
    });

    function render() {
        onRender();
    }

    function animate() {
        render();
        rAF = requestAnimationFrame(animate);
    }

    function destroy() {
        cancelAnimationFrame(rAF);
    }

    animate();

    module.hot?.addDisposeHandler(destroy);
});
