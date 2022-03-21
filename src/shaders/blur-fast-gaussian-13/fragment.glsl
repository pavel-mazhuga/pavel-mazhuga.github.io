#pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
uniform sampler2D u_map;
uniform vec2 uDirection;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    gl_FragColor = blur(u_map, vUv, uResolution.xy, uDirection);
}
