varying float vOpacity;

vec3 originalColor = vec3(4. / 255., 10. / 255., 20. / 255.);

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
    vec2 centerUv = uv - 0.5;
    vec4 color = vec4(0.08 / length(centerUv));
    color.rgb = min(vec3(10.), color.rgb);
    color.rgb *= originalColor * 100.;
    color *= vOpacity;
    color.a = min(1., color.a) * 10.;

    gl_FragColor = vec4(color.rgb, 1.);
}