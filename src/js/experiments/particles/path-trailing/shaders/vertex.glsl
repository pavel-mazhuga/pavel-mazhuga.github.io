uniform float uParticleSize;

attribute float opacity;

varying float vOpacity;

void main() {
    vOpacity = opacity;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);

    gl_PointSize = uParticleSize * (-1. / mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}