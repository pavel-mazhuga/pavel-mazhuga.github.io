#pragma glslify: rotate = require(../../../../utils/shaders/transformations.glsl)
varying vec2 vUv;

void main() {
    // vec2 rotatedUv = rotate(vUv, PI / 4., vec2(0.5));

    vec3 color = vec3(distance(vUv, vec2(0.5)));

    // gl_FragColor = vec4(rotatedUv, 0., 1.);
    gl_FragColor = vec4(color, 1.);
}