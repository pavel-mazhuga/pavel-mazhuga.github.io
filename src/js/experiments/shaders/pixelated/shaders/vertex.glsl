attribute vec2 position;
attribute vec2 uv;

uniform mat4 projection;

varying vec2 vUv;

float parabola(float x, float k) {
  return pow(4.0 * x * (1.0 - x), k);
}

void main() {
  vUv = uv;

  vec4 pos = vec4(position, 0.0, 1.0);
//   float spee = speed * 2.0;
//   pos.x += parabola(uv.y, 1.0) * spee;
//   vec4 pp = projection * vec4(position, 0.0, 1.0);
//   float yy = ((pp / pp.w).x + 1.0) / 2.0;
//   pos.z = parabola(clamp(yy, 0.0, 1.0), 2.4) * speed2 * 160.0;
//   pos.z = clamp(pos.z, -6.0, 6.0);

  gl_Position = projection * pos;
}