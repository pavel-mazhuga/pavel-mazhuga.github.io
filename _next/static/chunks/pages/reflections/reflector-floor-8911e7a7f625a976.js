(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[729],{8557:function(e,n,r){"use strict";var t=r(9008),s=r(5893);n.Z=function(e){var n=e.children,r=e.documentTitle;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.default,{children:[(0,s.jsxs)("title",{children:[r?"".concat(r," - "):"","WebGL Sandbox"]}),(0,s.jsx)("meta",{name:"description",content:"WebGL sandbox"}),(0,s.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,s.jsx)("main",{className:"main",children:(0,s.jsx)("div",{className:"canvas",suppressHydrationWarning:!0,children:n})})]})}},6158:function(e,n,r){"use strict";r.r(n),r.d(n,{default:function(){return _}});var t=r(4942),s=r(7625),i=r(2212),o=r(7294),a=r(9251),c=r(5769),l=r(6935),u=r(7831),f=r(3277),h=r(2248),p=r(8557),d=r(5893);function m(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function j(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?m(Object(r),!0).forEach((function(n){(0,t.Z)(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function g(e){var n=(0,c.m)(["/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_roughness.jpg","/Surface_Imperfections_Stains_001_SD/Surface_Imperfections_Stains_001_normal.jpg"]),r=(0,s.Z)(n,2),t=r[0],i=r[1];return(0,d.jsx)(l.r,j(j({resolution:1024,args:[20,15],mirror:.3,mixBlur:5,mixStrength:1,rotation:[-Math.PI/2,0,Math.PI/2]},e),{},{children:function(e,n){return(0,d.jsx)(e,j({metalness:.3,color:"#888",roughnessMap:t,normalMap:i},n))}}))}function x(e){var n=e.lights,r=void 0===n?[]:n,t=e.meshes,s=void 0===t?[]:t,i=(0,o.useRef)(),c=(0,o.useRef)();return(0,a.xQ)((function(e){var n=Math.abs(Math.sin(2*e.clock.elapsedTime));i.current.intensity=.3+n,c.current.intensity=.35+n})),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(f.WW,{ref:i,lights:r,selection:s,selectionLayer:10,intensity:.65,blurPass:void 0,width:h.w_.AUTO_SIZE,height:h.w_.AUTO_SIZE,kernelSize:h.DD.HUGE,luminanceThreshold:0,luminanceSmoothing:0}),(0,d.jsx)(f.WW,{ref:c,lights:r,selection:s,selectionLayer:10,intensity:.6,blurPass:void 0,width:h.w_.AUTO_SIZE,height:h.w_.AUTO_SIZE,kernelSize:3,luminanceThreshold:0,luminanceSmoothing:.4})]})}function _(){var e=(0,o.useRef)(),n=(0,o.useRef)(),r=(0,o.useRef)();return(0,d.jsx)(p.Z,{documentTitle:"Reflector floor",children:(0,d.jsxs)(a.Xz,{dpr:[1,2],gl:{alpha:!1,powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1},camera:{position:[0,0,10],fov:30},children:[(0,d.jsx)("color",{attach:"background",args:["black"]}),(0,d.jsx)("fog",{attach:"fog",args:["black",12,20]}),(0,d.jsx)("ambientLight",{ref:e,intensity:1}),(0,d.jsx)("spotLight",{ref:n,position:[0,10,0],intensity:.35}),(0,d.jsxs)(o.Suspense,{fallback:null,children:[(0,d.jsxs)("mesh",{ref:r,position:[0,.001,-3],children:[(0,d.jsx)("planeBufferGeometry",{args:[5,5,1,1]}),(0,d.jsx)("meshStandardMaterial",{metalness:0,color:"orange"})]}),(0,d.jsxs)("mesh",{position:[1,.001,5],children:[(0,d.jsx)("planeBufferGeometry",{args:[1,1,1,1]}),(0,d.jsx)("meshStandardMaterial",{metalness:0,color:"red"})]}),(0,d.jsx)(g,{"position-y":-.8}),(0,d.jsxs)(f.xC,{frameBufferType:i.HalfFloatType,children:[(0,d.jsx)(f.k,{}),(0,d.jsx)(x,{lights:[e,n],meshes:[r]})]})]}),(0,d.jsx)(u.i,{yawFrequency:.2,pitchFrequency:.2,rollFrequency:.2,intensity:.5})]})})}},6547:function(e,n,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/reflections/reflector-floor",function(){return r(6158)}])}},function(e){e.O(0,[737,444,870,445,774,888,179],(function(){return n=6547,e(e.s=n);var n}));var n=e.O();_N_E=n}]);