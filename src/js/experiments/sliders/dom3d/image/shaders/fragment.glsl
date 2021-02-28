precision highp float;

varying vec2 vUv;
uniform float uProgress;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uvRate;

void main() {
    vec2 uv = (vUv - vec2(0.5)) * uvRate + vec2(0.5);

    gl_FragColor = texture2D(uTexture, uv);
}
