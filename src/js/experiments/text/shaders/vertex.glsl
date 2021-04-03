attribute vec2 position;
attribute vec2 uv;
uniform mat4 projection;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 pos = vec4(position, 0.0, 1.0);

  gl_Position = projection * pos;
}
