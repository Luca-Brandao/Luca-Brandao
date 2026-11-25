// Pixel typing header. Original bitmap glyphs, no network or font dependencies.
// From the repository root: node scripts/render_intro.cjs
const fs=require('node:fs'),zlib=require('node:zlib');
const W=400,H=66,S=2,FPS=10,FRAMES=120;
const colors=['0d1117','e6edfa','a8bed8','9bd3d8',...Array(60).fill('0d1117')];
const pal=colors.flatMap(h=>[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)));
const glyphs={
 A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'11111/00100/00100/00100/00100/00100/11111',J:'00111/00010/00010/00010/10010/10010/01100',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',P:'11110/10001/10001/11110/10000/10000/10000',Q:'01110/10001/10001/10001/10101/10010/01101',R:'11110/10001/10001/11110/10100/10010/10001',S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',V:'10001/10001/10001/10001/10001/01010/00100',W:'10001/10001/10001/10101/10101/10101/01010',X:'10001/10001/01010/00100/01010/10001/10001',Y:'10001/10001/01010/00100/00100/00100/00100',Z:'11111/00001/00010/00100/01000/10000/11111','-':'00000/00000/00000/11111/00000/00000/00000',' ':'00000/00000/00000/00000/00000/00000/00000'};
const title='LUCA BRANDAO',subtitle='FINAL-YEAR BUSINESS INFORMATION SYSTEMS STUDENT AT STADIO';
for(const c of title+subtitle)if(!glyphs[c])throw Error('Missing glyph '+c);
function rect(p,x,y,w,h,c){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<W&&j>=0&&j<H)p[j*W+i]=c;}
function text(p,s,x,y,scale,color){for(const c of s){glyphs[c].split('/').forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(p,x+i*scale,y+j*scale,scale,scale,color);}));x+=6*scale;}}
function frame(n,still=false){
 const p=Buffer.alloc(W*H),t=n/FPS;
 let a=still?title.length:Math.max(0,Math.min(title.length,Math.floor((t-.3)*10)));
 let b=still?subtitle.length:Math.max(0,Math.min(subtitle.length,Math.floor((t-1.8)*18)));
 // A long readable hold; quick backspace at the end makes a clean loop.
 if(!still&&t>10.2){b=Math.max(0,subtitle.length-Math.floor((t-10.2)*50));if(t>11.35)a=Math.max(0,title.length-Math.floor((t-11.35)*25));}
 const x1=Math.floor((W-(title.length*18-3))/2),x2=Math.floor((W-(subtitle.length*6-1))/2);
 text(p,title.slice(0,a),x1,10,3,1);text(p,subtitle.slice(0,b),x2,43,1,2);
 if(!still&&Math.floor(t*2)%2===0){if(t<1.8||t>11.35)rect(p,x1+a*18,10,2,21,3);else rect(p,x2+b*6,43,1,7,3);}
 return p;
}
function scale(p){const q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=p[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(p){const w=W*S,h=H*S,raw=Buffer.alloc((w+1)*h),ih=Buffer.alloc(13);for(let y=0;y<h;y++)p.copy(raw,y*(w+1)+1,y*w,(y+1)*w);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal)),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){const c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);const b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){
 fs.mkdirSync('assets',{recursive:true});const head=Buffer.alloc(13);head.write('GIF89a');head.writeUInt16LE(W*S,6);head.writeUInt16LE(H*S,8);head[10]=0xd5;
 const parts=[head,Buffer.from(pal),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];let previous;
 for(let n=0;n<FRAMES;n++){
  const a=scale(frame(n));let x0=0,y0=0,x1=W*S-1,y1=H*S-1;
  if(previous){x0=W*S;y0=H*S;x1=0;y1=0;for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)if(a[y*W*S+x]!==previous[y*W*S+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x0>x1)x0=y0=x1=y1=0;}
  const ww=x1-x0+1,hh=y1-y0+1,crop=Buffer.alloc(ww*hh);for(let y=0;y<hh;y++)a.copy(crop,y*ww,(y+y0)*W*S+x0,(y+y0)*W*S+x0+ww);
  const desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(x0,1);desc.writeUInt16LE(y0,3);desc.writeUInt16LE(ww,5);desc.writeUInt16LE(hh,7);
  parts.push(Buffer.from([0x21,0xf9,4,4,10,0,0,0]),desc,lzw(crop));previous=a;
 }
 parts.push(Buffer.from([0x3b]));const gif=Buffer.concat(parts);
 fs.writeFileSync('assets/pixel-intro-v1.gif',gif);fs.writeFileSync('assets/pixel-intro-v1-still.png',png(scale(frame(60,true))));
 console.log(JSON.stringify({width:W*S,height:H*S,frames:FRAMES,seconds:FRAMES/FPS,bytes:gif.length,title,subtitle}));
}
main();
