(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[906],{9137:function(e,n,r){"use strict";r.d(n,{g:function(){return i}});var t=r(9477);function i(e,n,r,i){return class extends t.ShaderMaterial{constructor(){const o=Object.entries(e);super({uniforms:o.reduce(((e,[n,r])=>({...e,...t.UniformsUtils.clone({[n]:{value:r}})})),{}),vertexShader:n,fragmentShader:r}),o.forEach((([e])=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:n=>this.uniforms[e].value=n}))),i&&i(this)}}}},5769:function(e,n,r){"use strict";r.d(n,{m:function(){return c}});var t=r(9477),i=r(4232),o=r(7294);const u=e=>e===Object(e)&&!Array.isArray(e)&&"function"!==typeof e;function c(e){const n=(0,i.Ky)((e=>e.gl)),r=(0,i.U2)(t.TextureLoader,u(e)?Object.values(e):e);if((0,o.useEffect)((()=>{(Array.isArray(r)?r:[r]).forEach(n.initTexture)}),[n,r]),u(e)){const n=Object.keys(e),t={};return n.forEach((e=>Object.assign(t,{[e]:r[n.indexOf(e)]}))),t}return r}c.preload=e=>i.U2.preload(t.TextureLoader,e),c.clear=e=>i.U2.clear(t.TextureLoader,e)},5680:function(e,n,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blur/fast-gaussian-13",function(){return r(7590)}])},4797:function(e,n,r){"use strict";var t=r(5893),i=r(9008);n.Z=function(e){var n=e.children,r=e.documentTitle;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(i.default,{children:[(0,t.jsxs)("title",{children:[r?"".concat(r," - "):"","WebGL Sandbox"]}),(0,t.jsx)("meta",{name:"description",content:"WebGL sandbox"}),(0,t.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,t.jsx)("main",{className:"main",children:(0,t.jsx)("div",{className:"canvas",suppressHydrationWarning:!0,children:n})})]})}},7590:function(e,n,r){"use strict";r.r(n),r.d(n,{default:function(){return x}});var t=r(5893),i=r(7294),o=r(9477),u=r(4232),c=r(9137),a=r(5769),s=r(8690),l=r(4797);function f(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function v(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{},t=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(t=t.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),t.forEach((function(n){f(e,n,r[n])}))}return e}var d=(0,c.g)({u_map:null,uDirection:new o.Vector2,uResolution:new o.Vector2},"#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main()\t{\n    vUv = uv;\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n","#define GLSLIFY 1\nvec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.411764705882353) * direction;\n  vec2 off2 = vec2(3.2941176470588234) * direction;\n  vec2 off3 = vec2(5.176470588235294) * direction;\n  color += texture2D(image, uv) * 0.1964825501511404;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;\n  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;\n  return color;\n}\n\nuniform sampler2D u_map;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\nvarying vec2 vUv;\n\nvoid main() {\n    gl_FragColor = blur13(u_map, vUv, uResolution.xy, uDirection);\n}\n");function m(){var e=(0,a.m)("/interior.jpeg"),n=(0,s.M4)({uDirectionX:{value:1,min:0,max:5},uDirectionY:{value:0,min:0,max:5}});return(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[6,8]}),(0,t.jsx)("blurMaterial",v({},n,{u_map:e,uResolution:[window.innerWidth,window.innerHeight],uDirection:[n.uDirectionX,n.uDirectionY]}))]})}function x(){return(0,t.jsx)(l.Z,{documentTitle:"Blur",children:(0,t.jsx)(u.Xz,{dpr:[1,2],gl:{alpha:!1,powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1},children:(0,t.jsx)(i.Suspense,{fallback:null,children:(0,t.jsx)(m,{})})})})}(0,u.l7)({BlurMaterial:d})}},function(e){e.O(0,[737,652,690,774,888,179],(function(){return n=5680,e(e.s=n);var n}));var n=e.O();_N_E=n}]);