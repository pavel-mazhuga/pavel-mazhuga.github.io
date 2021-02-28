precision highp float;

attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uProgress; // ms({ value: 0, range: [0, 1], step: 0.1 })
uniform float uTime;

void main () {
    vUv = uv;
    vec3 newPosition = vec3(position.xy, position.z + uProgress * abs(sin(50.0 * uv.y + uTime * 0.8)) * 0.015);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
