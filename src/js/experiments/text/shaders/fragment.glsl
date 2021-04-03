precision highp float;

// uniform vec2 size;
// uniform vec2 sizeImage;
uniform vec2 viewport;
uniform float pixelSize;
uniform sampler2D image;
uniform float time;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  // uv.x += sin(uv.y * 40.0 + time * 0.01) * 0.005;

  // gl_FragColor = texture2D(image, uv);

  vec2 dxy = pixelSize / viewport;
  vec2 coord = dxy * floor(uv / dxy);

  gl_FragColor = texture2D(image, coord);
}
