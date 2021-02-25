uniform float uTime;

varying vec2 vUv;

void main() {
    vec3 color = vec3(distance(vUv, vec2(0.5)));
    
    gl_FragColor = vec4(color, 1.0);
}
