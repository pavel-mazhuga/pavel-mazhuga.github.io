precision highp float;
    
uniform float time;
uniform float speed;
uniform vec2 viewport;
uniform sampler2D image;

float parabola(float x, float k) {
    return pow(4.0 * x * (1.0 - x), k);
}

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / viewport;
    float spe = speed * 300.0;
    float p = parabola(uv.x, 1.4);

    float r = texture2D(image, uv + vec2(0.000 * spe, 0.0) * p).r;
    float g = texture2D(image, uv + vec2(0.01 * spe, 0.0) * p).g;
    float b = texture2D(image, uv + vec2(0.02 * spe, 0.0) * p).b;
    float a = texture2D(image, uv + vec2(0.000 * spe, 0.0) * p).w;

    gl_FragColor = vec4(r, g, b, a);
    
    // Film grain effect
    float n = random(uv + mod(time, 3.0));
    gl_FragColor.rgb *= 1.0 - (n * 0.2);
}