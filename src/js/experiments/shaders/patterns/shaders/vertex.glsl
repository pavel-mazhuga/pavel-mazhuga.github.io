#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += cnoise3(modelPosition.xyz * abs(sin(uTime))) * 0.7;

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}

// varying vec2 vUv;

// void main() {
//     vUv = uv;
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
//     gl_Position = projectionMatrix * mvPosition;
// }