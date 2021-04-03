attribute vec2 position;
attribute vec2 uv;

uniform mat4 projection;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projection * vec4(position, 0.0, 1.0);
}
