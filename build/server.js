(()=>{"use strict";var t={n:e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},d:(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};const e=require("dxt-js");var r=t.n(e);const n=require("image-pixels");var o=t.n(n);const i=require("buffer"),a=require("@citizenfx/http-wrapper"),s=require("koa");var c=t.n(s);const l=require("fs");var u=t.n(l);const f=require("path");var w=t.n(f);const d=new(c());d.use((async t=>{const e=t.request.query.path||"http://media.istockphoto.com/photos/seamless-texture-surface-of-the-moon-picture-id108604226";t.set("Content-disposition","attachment; filename=myfile.dds"),t.set("Content-type","image/vnd-ms.dds");const n=await(async t=>{const{data:e,width:n,height:a}=await o()(t),s=Math.floor((n*a*4+7)/8);let c=0;const l=i.Buffer.alloc(128);l.write("DDS ",4*c++,"ascii"),l.writeUInt32LE(124,4*c++),l.writeUInt32LE(528391,4*c++),l.writeUInt32LE(a,4*c++),l.writeUInt32LE(n,4*c++),l.writeUInt32LE(s,4*c++),l.writeUInt32LE(0,4*c++),l.writeUInt32LE(1,4*c++);for(let t=0;t<11;t++)l.writeUInt32LE(0,4*c++);l.writeUInt32LE(32,4*c++),l.writeUInt32LE(5,4*c++),l.write("DXT1",4*c++,"ascii"),l.writeUInt32LE(32,4*c++),l.writeUInt32LE(4278190080,4*c++),l.writeUInt32LE(16711680,4*c++),l.writeUInt32LE(65280,4*c++),l.writeUInt32LE(255,4*c++),l.writeUInt32LE(4096,4*c++);const u=r().flags.DXT1|r().flags.ColourIterativeClusterFit|r().flags.ColourMetricPerceptual,f=r().compress(e,n,a,u);return i.Buffer.concat([l,i.Buffer.from(f)])})(e);t.body=await(async t=>{const e=Buffer.alloc(1e4,0,"binary"),r=GetResourcePath(GetCurrentResourceName()),n=u().readFileSync(w().join(r,"samples/created-with-texturetoolkit.ytd"));console.log("here2");for(let t=0;t<100;t++)console.log(`${Math.floor(t/4)}: ${n[t]} ${e[t]}`);return t})(n)})),(0,a.setHttpCallback)(d.callback())})();