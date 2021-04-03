precision highp float;

uniform vec2 size;
uniform vec2 sizeImage;
uniform sampler2D image;
uniform sampler2D currentImage;
uniform sampler2D nextImage;
uniform sampler2D disp;
uniform float dispPower;
uniform float intensity;

varying vec2 vUv;

vec4 coverTexture(sampler2D tex, vec2 imgSize, vec2 ouv) {
  vec2 s = size;
  vec2 i = imgSize;
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = ouv * s / new + offset;

  return texture2D(tex, uv);
}

void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(disp, uv);
    vec2 dispVec = vec2(disp.x, disp.y);
    
    vec2 distPos1 = uv + (dispVec * intensity * dispPower);
    vec2 distPos2 = uv + (dispVec * -(intensity * (1. - dispPower)));
    
    vec4 currentImage = texture2D(currentImage, distPos1);
    vec4 nextImage = texture2D(nextImage, distPos2);
    
    gl_FragColor = mix(currentImage, nextImage, dispPower);
//   gl_FragColor = coverTexture(currentImage, sizeImage, vUv);
}
