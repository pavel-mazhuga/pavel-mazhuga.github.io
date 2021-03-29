precision highp float;
    
// uniform float time;
// uniform float speed;
// uniform vec2 viewport;
// uniform sampler2D image;

// float parabola(float x, float k) {
//     return pow(4.0 * x * (1.0 - x), k);
// }

// float random(vec2 co) {
//     return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
// }

// void main() {
//     vec2 uv = gl_FragCoord.xy / viewport;
//     float spe = speed * 300.0;
//     float p = parabola(uv.x, 1.4);

//     float r = texture2D(image, uv + vec2(0.000 * spe, 0.0) * p).r;
//     float g = texture2D(image, uv + vec2(0.01 * spe, 0.0) * p).g;
//     float b = texture2D(image, uv + vec2(0.02 * spe, 0.0) * p).b;
//     float a = texture2D(image, uv + vec2(0.000 * spe, 0.0) * p).w;

//     gl_FragColor = vec4(r, g, b, a);
    
//     // Film grain effect
//     float n = random(uv + mod(time, 3.0));
//     gl_FragColor.rgb *= 1.0 - (n * 0.2);
// }

uniform sampler2D image;
uniform vec2 viewport;
uniform vec2 resolution;
uniform float pixelSize;

// varying vec2 vUv;

// vec3 bg(vec2 uv) {
//    return texture2D(image, uv).rgb;
// }

// vec3 effect(vec2 uv, vec3 col) {
//    float granularity = floor(intensity*20.+10.);

//    if (mod(granularity,2.) > 0.) {
//        granularity += 1.0;
//    };

//    if (granularity > 0.0) {
//        float dx = granularity / viewport.x;
//        float dy = granularity / viewport.y;
//        uv = vec2(dx*(floor(uv.x/dx) + 0.5),dy*(floor(uv.y/dy) + 0.5));
//        return bg(uv);
//    };

//    return col;
// }

void main() {
    vec2 uv = gl_FragCoord.xy / viewport;
    // vec3 tex = bg(uv);
    // vec3 col = effect(uv,tex);
    // gl_FragColor = vec4( col, 1. );

    vec2 dxy = pixelSize / viewport;
    vec2 coord = dxy * floor( uv / dxy );
    gl_FragColor = texture2D(image, coord);
}
