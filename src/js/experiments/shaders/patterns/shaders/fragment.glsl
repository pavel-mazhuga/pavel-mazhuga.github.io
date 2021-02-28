uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec3 color = vec3(distance(vUv, vec2(0.5)));
    
    gl_FragColor = vec4(mix(vec3(0.2), color, clamp(vElevation, 0., 1.)), 1.0);
}
