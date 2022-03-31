(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[431],{9137:function(n,e,r){"use strict";r.d(e,{g:function(){return a}});var t=r(9477);function a(n,e,r,a){return class extends t.ShaderMaterial{constructor(){const i=Object.entries(n);super({uniforms:i.reduce(((n,[e,r])=>({...n,...t.UniformsUtils.clone({[e]:{value:r}})})),{}),vertexShader:e,fragmentShader:r}),i.forEach((([n])=>Object.defineProperty(this,n,{get:()=>this.uniforms[n].value,set:e=>this.uniforms[n].value=e}))),a&&a(this)}}}},5769:function(n,e,r){"use strict";r.d(e,{m:function(){return u}});var t=r(9477),a=r(9698),i=r(7294);const o=n=>n===Object(n)&&!Array.isArray(n)&&"function"!==typeof n;function u(n){const e=(0,a.x)((n=>n.gl)),r=(0,a.A)(t.TextureLoader,o(n)?Object.values(n):n);if((0,i.useEffect)((()=>{(Array.isArray(r)?r:[r]).forEach(e.initTexture)}),[e,r]),o(n)){const e=Object.keys(n),t={};return e.forEach((n=>Object.assign(t,{[n]:r[e.indexOf(n)]}))),t}return r}u.preload=n=>a.A.preload(t.TextureLoader,n),u.clear=n=>a.A.clear(t.TextureLoader,n)},8182:function(n,e,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blur/cheap",function(){return r(3421)}])},2703:function(n,e,r){"use strict";var t=r(5893),a=r(9008);e.Z=function(n){var e=n.children,r=n.documentTitle;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(a.default,{children:[(0,t.jsxs)("title",{children:[r?"".concat(r," - "):"","WebGL Sandbox"]}),(0,t.jsx)("meta",{name:"description",content:"WebGL sandbox"}),(0,t.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,t.jsx)("main",{className:"main",children:(0,t.jsx)("div",{className:"canvas",suppressHydrationWarning:!0,children:e})})]})}},3421:function(n,e,r){"use strict";r.r(e),r.d(e,{default:function(){return p}});var t=r(5893),a=r(7294),i=r(9698),o=r(6135),u=r(9137),c=r(5769),l=r(3264),s=r(2703);function f(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function m(n){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},t=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(t=t.concat(Object.getOwnPropertySymbols(r).filter((function(n){return Object.getOwnPropertyDescriptor(r,n).enumerable})))),t.forEach((function(e){f(n,e,r[e])}))}return n}var d=(0,u.g)({u_map:null,blur:0,gamma:.5},"\n    varying vec2 vUv;\n    void main()\t{\n      vUv = uv;\n      \n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n    }\n  ","\n    uniform sampler2D u_map;\n    uniform float blur;\n    uniform float gamma;\n    varying vec2 vUv;\n  \n    float weight(float t, float log2radius, float gamma)\n    {\n        return exp(-gamma * pow(log2radius-t,2.));\n    }\n  \n    vec4 sample_blured(sampler2D u_map, vec2 uv, float radius, float gamma)\n    {\n        vec4 pix = vec4(0.);\n        float norm = 0.;\n  \n        float log2radius = log2(radius);\n  \n        //weighted integration over mipmap levels\n        for(float i = 0.; i < 10.; i += 0.5)\n        {\n            float k = weight(i, log2radius, gamma);\n            pix += k * texture(u_map, uv, i); \n            norm += k;\n        }\n  \n        //nomalize, and a bit of brigtness hacking \n        return pix*pow(norm,-0.95);\n    }\n  \n    void main() {\n      vec3 color = sample_blured(u_map, vUv, blur, gamma).rgb;\n      gl_FragColor = vec4(color, 1.);\n    }\n  ");function v(){var n=(0,c.m)("/interior.jpeg"),e=(0,l.M4)({blur:{value:1,min:.01,max:100},gamma:{value:.5,min:.01,max:1}});return(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[6,8]}),(0,t.jsx)("myMaterial",m({u_map:n},e))]})}function p(){return(0,t.jsx)(s.Z,{documentTitle:"Blur",children:(0,t.jsx)(o.Xz,{dpr:[1,2],gl:{alpha:!1,powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1},children:(0,t.jsx)(a.Suspense,{fallback:null,children:(0,t.jsx)(v,{})})})})}(0,i.e)({MyMaterial:d})}},function(n){n.O(0,[737,309,264,774,888,179],(function(){return e=8182,n(n.s=e);var e}));var e=n.O();_N_E=e}]);