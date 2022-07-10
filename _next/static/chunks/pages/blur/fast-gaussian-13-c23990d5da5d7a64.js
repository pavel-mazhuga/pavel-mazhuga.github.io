(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[906],{7675:function(e,n,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blur/fast-gaussian-13",function(){return r(7590)}])},4797:function(e,n,r){"use strict";var i=r(5893),t=r(9008),o=r.n(t);n.Z=function(e){var n=e.children,r=e.documentTitle;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(o(),{children:[(0,i.jsxs)("title",{children:[r?"".concat(r," - "):"","WebGL Sandbox"]}),(0,i.jsx)("meta",{name:"description",content:"WebGL sandbox"}),(0,i.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,i.jsx)("main",{className:"main",children:(0,i.jsx)("div",{className:"canvas",suppressHydrationWarning:!0,children:n})})]})}},7590:function(e,n,r){"use strict";r.r(n),r.d(n,{default:function(){return g}});var i=r(1799),t=r(9396),o=r(5893),c=r(7294),u=r(9477),l=r(6135),s=r(9259),a=r(9137),f=r(5769),v=r(4351),m=r(4797),d=(0,a.g)({u_map:null,uDirection:new u.Vector2,uResolution:new u.Vector2},"#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main()\t{\n    vUv = uv;\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n","#define GLSLIFY 1\nvec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.411764705882353) * direction;\n  vec2 off2 = vec2(3.2941176470588234) * direction;\n  vec2 off3 = vec2(5.176470588235294) * direction;\n  color += texture2D(image, uv) * 0.1964825501511404;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;\n  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;\n  return color;\n}\n\nuniform sampler2D u_map;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\nvarying vec2 vUv;\n\nvoid main() {\n    gl_FragColor = blur13(u_map, vUv, uResolution.xy, uDirection);\n}\n");function p(){var e=(0,f.m)("/interior.jpeg"),n=(0,v.M4)({uDirectionX:{value:1,min:0,max:5},uDirectionY:{value:0,min:0,max:5}});return(0,o.jsxs)("mesh",{children:[(0,o.jsx)("planeGeometry",{args:[6,8]}),(0,o.jsx)("blurMaterial",(0,t.Z)((0,i.Z)({},n),{u_map:e,uResolution:[window.innerWidth,window.innerHeight],uDirection:[n.uDirectionX,n.uDirectionY]}))]})}function g(){return(0,o.jsx)(m.Z,{documentTitle:"Blur",children:(0,o.jsx)(l.Xz,{dpr:[1,2],gl:{alpha:!1,powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1},children:(0,o.jsx)(c.Suspense,{fallback:null,children:(0,o.jsx)(p,{})})})})}(0,s.e)({BlurMaterial:d})},9396:function(e,n,r){"use strict";function i(e,n){return n=null!=n?n:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):function(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,i)}return r}(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})),e}r.d(n,{Z:function(){return i}})}},function(e){e.O(0,[737,309,575,774,888,179],(function(){return n=7675,e(e.s=n);var n}));var n=e.O();_N_E=n}]);