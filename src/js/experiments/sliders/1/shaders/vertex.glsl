uniform float uVelo;

varying vec2 vUv;

void main(){
  vec3 pos = position;
  pos.x = pos.x + ((sin(uv.y * PI) * uVelo) * 0.125);

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}