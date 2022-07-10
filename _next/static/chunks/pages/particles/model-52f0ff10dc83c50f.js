(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[721],{9137:function(e,t,n){"use strict";n.d(t,{g:function(){return o}});var r=n(9477);function o(e,t,n,o){const i=class extends r.ShaderMaterial{constructor(){const i=Object.entries(e);super({uniforms:i.reduce(((e,[t,n])=>({...e,...r.UniformsUtils.clone({[t]:{value:n}})})),{}),vertexShader:t,fragmentShader:n}),this.key="",i.forEach((([e])=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))),o&&o(this)}};return i.key=r.MathUtils.generateUUID(),i}},682:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/particles/model",function(){return n(2917)}])},4797:function(e,t,n){"use strict";var r=n(5893),o=n(9008),i=n.n(o);t.Z=function(e){var t=e.children,n=e.documentTitle;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(i(),{children:[(0,r.jsxs)("title",{children:[n?"".concat(n," - "):"","WebGL Sandbox"]}),(0,r.jsx)("meta",{name:"description",content:"WebGL sandbox"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)("main",{className:"main",children:(0,r.jsx)("div",{className:"canvas",suppressHydrationWarning:!0,children:t})})]})}},2917:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return P}});var r=n(5893),o=n(7294),i=n(6135),a=n(6665),s=n(4797),c=n(1799),u=n(9396),l=n(9534);function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"===typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var d=n(9137),f=n(7462),h=n(9477),x=function(){var e=new h.Triangle,t=new h.Vector3;function n(e){var t=e.geometry;if(!t.isBufferGeometry||3!==t.attributes.position.itemSize)throw new Error("THREE.MeshSurfaceSampler: Requires BufferGeometry triangle mesh.");t.index&&(console.warn("THREE.MeshSurfaceSampler: Converting geometry to non-indexed BufferGeometry."),t=t.toNonIndexed()),this.geometry=t,this.randomFunction=Math.random,this.positionAttribute=this.geometry.getAttribute("position"),this.colorAttribute=this.geometry.getAttribute("color"),this.weightAttribute=null,this.distribution=null}return n.prototype={constructor:n,setWeightAttribute:function(e){return this.weightAttribute=e?this.geometry.getAttribute(e):null,this},build:function(){var t=this.positionAttribute,n=this.weightAttribute,r=new Float32Array(t.count/3);for(let a=0;a<t.count;a+=3){var o=1;n&&(o=n.getX(a)+n.getX(a+1)+n.getX(a+2)),e.a.fromBufferAttribute(t,a),e.b.fromBufferAttribute(t,a+1),e.c.fromBufferAttribute(t,a+2),o*=e.getArea(),r[a/3]=o}this.distribution=new Float32Array(t.count/3);var i=0;for(let e=0;e<r.length;e++)i+=r[e],this.distribution[e]=i;return this},setRandomGenerator:function(e){return this.randomFunction=e,this},sample:function(e,t,n){var r=this.distribution[this.distribution.length-1],o=this.binarySearch(this.randomFunction()*r);return this.sampleFace(o,e,t,n)},binarySearch:function(e){for(var t=this.distribution,n=0,r=t.length-1,o=-1;n<=r;){var i=Math.ceil((n+r)/2);if(0===i||t[i-1]<=e&&t[i]>e){o=i;break}e<t[i]?r=i-1:n=i+1}return o},sampleFace:function(n,r,o,i){var a=this.randomFunction(),s=this.randomFunction();return a+s>1&&(a=1-a,s=1-s),e.a.fromBufferAttribute(this.positionAttribute,3*n),e.b.fromBufferAttribute(this.positionAttribute,3*n+1),e.c.fromBufferAttribute(this.positionAttribute,3*n+2),r.set(0,0,0).addScaledVector(e.a,a).addScaledVector(e.b,s).addScaledVector(e.c,1-(a+s)),void 0!==o&&e.getNormal(o),void 0!==i&&void 0!==this.colorAttribute&&(e.a.fromBufferAttribute(this.colorAttribute,3*n),e.b.fromBufferAttribute(this.colorAttribute,3*n+1),e.c.fromBufferAttribute(this.colorAttribute,3*n+2),t.set(0,0,0).addScaledVector(e.a,a).addScaledVector(e.b,s).addScaledVector(e.c,1-(a+s)),i.r=t.x,i.g=t.y,i.b=t.z),this}},n}();const y=({children:e,weight:t,transform:n,instances:r,mesh:i,...a})=>{const s=o.useRef(null),c=o.useRef(null),u=o.useRef(null);return o.useEffect((()=>{var e,t;c.current=null!==(e=null==r?void 0:r.current)&&void 0!==e?e:s.current.children.find((e=>e.hasOwnProperty("instanceMatrix"))),u.current=null!==(t=null==i?void 0:i.current)&&void 0!==t?t:s.current.children.find((e=>"Mesh"===e.type))}),[e,null==i?void 0:i.current,null==r?void 0:r.current]),o.useEffect((()=>{if("undefined"===typeof u.current)return;if("undefined"===typeof c.current)return;const e=new x(u.current);t&&e.setWeightAttribute(t),e.build();const r=new h.Vector3,o=new h.Vector3,i=new h.Color,a=new h.Object3D;u.current.updateMatrixWorld(!0);for(let t=0;t<c.current.count;t++)e.sample(r,o,i),"function"===typeof n?n({dummy:a,sampledMesh:u.current,position:r,normal:o,color:i},t):a.position.copy(r),a.updateMatrix(),c.current.setMatrixAt(t,a.matrix);c.current.instanceMatrix.needsUpdate=!0}),[e,null==i?void 0:i.current,null==r?void 0:r.current]),o.createElement("group",(0,f.Z)({ref:s},a),e)},p=({compute:e,name:t,...n})=>{const[r]=o.useState((()=>new h.BufferAttribute(new Float32Array(0),1))),i=o.useRef(null);return o.useLayoutEffect((()=>{if(i.current){var t;const n=null!==(t=i.current.parent)&&void 0!==t?t:i.current.__r3f.parent,r=e(n);i.current.copy(r)}}),[e]),o.createElement("primitive",(0,f.Z)({ref:i,object:r,attach:`attributes-${t}`},n))};var g=n(8626),b=n(9259),w=(0,d.g)({},"\n    varying vec2 vUv;\n\n    void main()\t{\n        vUv = uv;\n        \n        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);\n        gl_PointSize = 15. * (1. / -mvPosition.z);\n        gl_Position = projectionMatrix * mvPosition;\n    }\n  ","\n    varying vec2 vUv;\n  \n    void main() {\n        float dist = length(gl_PointCoord - vec2(0.5));\n        float disc = smoothstep(0.5, 0.45, dist);\n\n        if (disc < 0.1) {\n            discard;\n            return;\n        }\n\n        gl_FragColor = vec4(vec2(disc), 1., 1.);\n    }\n  ");function A(e,t,n){var r=v(t,2),o=r[0],i=r[1],a=v(n,2),s=a[0];return s+(e-o)*(a[1]-s)/(i-o)}(0,b.e)({ParticleMaterial:w});var j=function(e){var t=e.dummy,n=e.position;t.position.copy(n),t.scale.setScalar(.75*Math.random())},M=function(e){for(var t=e.attributes.normal,n=t.array,r=t.count,o=Float32Array.from({length:r}),i=new h.Vector3,a=new h.Vector3(0,1,0),s=0;s<r;s++){var c=n.slice(3*s,3*s+3);i.set(c[0],c[1],c[2]);var u=i.dot(a),l=u>.4?A(u,[.4,1],[0,1]):0;o[s]=Number(l)}return new h.BufferAttribute(o,1)},_=function(e){var t=e.geometry,n=e.material,o=void 0===n?new h.MeshBasicMaterial:n,i=e.count,a=void 0===i?3e3:i,s="upness",l=Math.min(devicePixelRatio,2);return(0,r.jsxs)(y,{weight:s,transform:j,children:[(0,r.jsx)("mesh",{visible:!1,material:o,children:(0,r.jsx)("bufferGeometry",(0,u.Z)((0,c.Z)({attach:"geometry"},t),{children:(0,r.jsx)(p,{name:s,compute:M})}))}),(0,r.jsx)("instancedMesh",{args:[null,null,a],material:o,children:(0,r.jsx)("sphereGeometry",{args:[h.MathUtils.randFloat(.003,.005)/l,8,8]})})]})};function z(e){e.color;var t=(0,l.Z)(e,["color"]),n=(0,g.L)("/gltf/shoe.gltf"),i=n.nodes,a=(n.materials,(0,o.useMemo)((function(){return new h.ShaderMaterial({uniforms:{uTime:{value:0},uMouse:{value:new h.Vector2(0,0)}},vertexShader:"#define GLSLIFY 1\nuniform float uTime;\nuniform vec2 uMouse;\nvarying vec2 vUv;\n\n//\tSimplex 3D Noise \n//\tby Ian McEwan, Ashima Arts\n//\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n\nfloat snoise(vec3 v){ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //  x0 = x0 - 0. + 0.0 * C \n  vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n  vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n  vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n// Permutations\n  i = mod(i, 289.0 ); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients\n// ( N*N points uniformly over a square, mapped onto an octahedron.)\n  float n_ = 1.0/7.0; // N=7\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n\nvoid main()\t{\n    vUv = uv;\n    \n    vec3 newPosition = position;\n    // newPosition.x = sin(uTime);\n    float noise = snoise(vec3(instanceMatrix[3].x, instanceMatrix[3].y ,uTime )) * 0.2 * sin(uTime * 0.2);\n    // newPosition.z += noise;\n\n    // if (length(newPosition.xy - uMouse) < 0.1) {\n    //     newPosition += vec3(1., 0., 0.);\n    // }\n\n    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(newPosition, 1.);\n}\n",fragmentShader:"\n                    varying vec2 vUv;\n                \n                    void main() {\n                        vec3 color = vec3(1., 0., 0.);\n                \n                        gl_FragColor = vec4(color, 1.);\n                    }\n                "})}),[]));return(0,b.x)((function(e){var t=e.clock,n=e.mouse;a.uniforms.uTime.value=t.elapsedTime,a.uniforms.uMouse.value.x=n.x,a.uniforms.uMouse.value.y=n.y})),(0,r.jsxs)("group",(0,u.Z)((0,c.Z)({},t),{dispose:null,children:[(0,r.jsx)(_,{geometry:i.shoe.geometry,material:a}),(0,r.jsx)(_,{geometry:i.shoe_1.geometry,material:a,count:4e3}),(0,r.jsx)(_,{geometry:i.shoe_2.geometry,material:a,count:1200}),(0,r.jsx)(_,{geometry:i.shoe_3.geometry,material:a}),(0,r.jsx)(_,{geometry:i.shoe_4.geometry,material:a}),(0,r.jsx)(_,{geometry:i.shoe_5.geometry,material:a}),(0,r.jsx)(_,{geometry:i.shoe_6.geometry,material:a,count:1200}),(0,r.jsx)(_,{geometry:i.shoe_7.geometry,material:a,count:1200})]}))}function S(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.Suspense,{fallback:null,children:(0,r.jsx)(z,{color:"tomato",position:[0,0,0]})}),(0,r.jsx)(a.z,{})]})}function P(){return(0,r.jsx)(s.Z,{documentTitle:"Model in particles",children:(0,r.jsx)(i.Xz,{dpr:[1,2],camera:{position:[0,0,5],fov:45},gl:{powerPreference:"high-performance",alpha:!1,antialias:!1},children:(0,r.jsx)(S,{})})})}g.L.preload("/gltf/shoe.gltf")}},function(e){e.O(0,[737,309,390,774,888,179],(function(){return t=682,e(e.s=t);var t}));var t=e.O();_N_E=t}]);