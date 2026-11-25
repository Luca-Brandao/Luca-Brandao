// Original pixel-art profile loop. No external dependencies. Node.js 18+.
// Run from the repository root: node scripts/render_pixel.cjs
const fs=require('node:fs'),zlib=require('node:zlib'),path=require('node:path');
const W=400,H=208,S=2,FPS=50,FRAMES=400;
const hex=['202c42','283952','344b62','416479','597887','79939a','9cadad','ccd3c4','fff0d4','f6d7b0','ebba98','d99b89','bf7d87','9c6b83','775d7c','535775','496773','37666a','2c555b','21464f','193c49','15323f','528179','6a9683','96af89','bbc696','ded7a7','d7a46d','b77d55','8d604d','694b45','503c3d','eab46b','ffdb88','fff1b6','e48e6b','bb645e','844d56','61404d','432f40','2b2638','171f30','704d3f','95644c','bd8963','e2ad81','f3c89b','eee1c4','cfbea1','a18e7c','77716d','555c64','374553','68b9b0','99dfce','d8f4d9','897050','a48a5d','cfb67c','e6ce93','356c65','478479','79a487','b3c8a0'];
// Navy, charcoal and muted teal match the supplied pixel portrait.
Object.entries({0:'0d1117',1:'101b30',2:'23324b',3:'34496a',4:'476080',5:'7892af',6:'a8bed8',7:'c1d1e1',8:'e6edfa',9:'c1d4f4',10:'1a2845',11:'14203b',12:'101a35',13:'091329',14:'061024',15:'172542',16:'182e47',17:'20454e',18:'1a3845',19:'14303b',20:'102833',21:'0d202c',22:'326568',23:'427a7a',24:'649795',25:'8ab5ac',26:'b4d0bf',27:'576d7e',28:'324955',29:'24343f',30:'192b35',31:'111d28',32:'a0c7cb',33:'d4f1e8',34:'e0f5fa',35:'80aaa9',36:'527d82',37:'345964',38:'243746',39:'152b3a',40:'101c2d',41:'0d1117',47:'292a30',48:'202127',49:'15171d',50:'343841',51:'252c38',52:'17202d',53:'609eac',54:'9bd3d8',55:'e0f4f0'}).forEach(([i,h])=>hex[i]=h);
const pal=hex.map(h=>[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)));
let p;
function rect(x,y,w,h,c){x=Math.round(x);y=Math.round(y);for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)for(let i=Math.max(0,x);i<Math.min(W,x+w);i++)p[j*W+i]=c;}
function line(x1,y1,x2,y2,c){let dx=Math.abs(x2-x1),dy=-Math.abs(y2-y1),sx=x1<x2?1:-1,sy=y1<y2?1:-1,e=dx+dy;while(true){rect(x1,y1,1,1,c);if(x1===x2&&y1===y2)break;let e2=2*e;if(e2>=dy){e+=dy;x1+=sx;}if(e2<=dx){e+=dx;y1+=sy;}}}
function poly(pts,c){let min=Math.floor(Math.min(...pts.map(q=>q[1]))),max=Math.ceil(Math.max(...pts.map(q=>q[1])));for(let y=min;y<=max;y++){let xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){let a=pts[i],b=pts[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,c);}}
function circle(x,y,r,c){for(let j=-r;j<=r;j++){let dx=Math.floor(Math.sqrt(r*r-j*j));rect(x-dx,y+j,dx*2+1,1,c);}}
const font={L:['100','100','100','100','111'],U:['101','101','101','101','111'],C:['111','100','100','100','111'],A:['010','101','111','101','101'],'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],X:['101','101','010','101','101'],'/':['001','001','010','100','100'],'2':['110','001','010','100','111'],'3':['110','001','010','001','110'],'4':['101','101','111','001','001'],'5':['111','100','110','001','110'],'6':['011','100','111','101','111'],'7':['111','001','010','010','010'],'8':['111','101','111','101','111'],'9':['111','101','111','001','110']};
function text(s,x,y,c){for(let a of s){if(font[a])font[a].forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(x+i,y+j,1,1,c)}));x+=4;}}
function cloud(x,y,s){rect(x,y,26*s,3*s,9);rect(x+5*s,y-3*s,15*s,4*s,9);rect(x+9*s,y-5*s,6*s,3*s,9);rect(x+3*s,y+3*s,22*s,s,10);}
function tree(x,y,h,light=false){rect(x-2,y-h+8,4,h-5,30);rect(x,y-h+10,1,h-10,29);let col=light?18:20,hi=light?17:19;for(let k=0;k<3;k++){let yy=y-h+k*h*.22,ww=8+k*5;poly([[x,yy],[x-ww,yy+h*.47],[x+ww,yy+h*.47]],col);poly([[x,yy+2],[x-ww+3,yy+h*.47-2],[x,yy+h*.4]],hi);}rect(x-3,y-1,6,2,20);}
function fern(x,y){line(x,y,x,y-11,22);for(let k=0;k<4;k++){line(x,y-k*2-2,x-5+k,y-k*2-5,23);line(x,y-k*2-2,x+5-k,y-k*2-5,22);}}
function gem(x,y,t){let w=2+Math.round(2*Math.abs(Math.cos(t*Math.PI*2)));poly([[x,y-6],[x-w,y-2],[x-w,y+3],[x,y+7],[x+w,y+3],[x+w,y-2]],53);line(x,y-5,x-w+1,y-1,55);line(x-w+1,y,x,y+5,54);line(x,y-4,x,y+4,54);}
function character(x,feet,t,jump){let phase=Math.floor(t*12)%8,leg=jump?3:Math.round(Math.sin(phase*Math.PI/4)*4),bob=jump?0:(phase%4===0?0:1),y=feet-36+bob;
// Individual pixel clusters match the supplied portrait: brown hair, black glasses and tee.
rect(x+5,y+27,6,7,51);rect(x+12,y+27,6,7,52);
rect(x+4+leg,y+30,5,5,52);rect(x+12-leg,y+30,5,5,51);
rect(x+3+leg,y+34,8,2,41);rect(x+12-leg,y+34,8,2,41);rect(x+3+leg,y+34,3,1,7);rect(x+12-leg,y+34,3,1,7);
poly([[x+4,y+17],[x+15,y+16],[x+20,y+23],[x+18,y+29],[x+4,y+29],[x+1,y+23]],49);
rect(x+5,y+18,12,10,47);rect(x+6,y+20,9,7,48);rect(x+8,y+18,7,2,41);rect(x+7,y+18,2,1,50);
let arm=jump?-3:Math.round(Math.sin(phase*Math.PI/4)*3);rect(x+1,y+20,4,6,48);rect(x+1-arm,y+24,5,3,45);rect(x-arm,y+26,4,3,45);rect(x+17,y+20,4,6,47);rect(x+18+arm,y+24,4,3,46);rect(x+19+arm,y+26,3,3,46);
rect(x+6,y+4,13,12,44);rect(x+8,y+5,12,11,45);rect(x+11,y+7,9,9,46);rect(x+19,y+9,2,3,45);rect(x+8,y+15,9,3,45);
rect(x+5,y+2,14,5,42);rect(x+7,y,8,3,42);rect(x+12,y+1,6,4,43);rect(x+4,y+4,4,6,42);rect(x+8,y+3,5,3,43);rect(x+15,y+3,5,4,42);rect(x+9,y+1,4,2,44);rect(x+17,y+6,3,2,43);
rect(x+7,y+8,6,4,41);rect(x+15,y+8,6,4,41);rect(x+13,y+9,2,1,41);rect(x+8,y+9,4,2,46);rect(x+16,y+9,4,2,46);rect(x+10,y+9,1,2,41);rect(x+18,y+9,1,2,41);rect(x+8,y+8,3,1,6);rect(x+16,y+8,3,1,6);
rect(x+14,y+14,4,1,42);rect(x+13,y+13,1,1,42);rect(x+18,y+13,1,1,42);rect(x+9,y+13,1,1,43);
}
// A small systems workshop: stock shelves, order processing, a database and reports.
Object.assign(font,{
 B:['110','101','110','101','110'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['111','100','101','101','111'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],J:['001','001','001','101','111'],K:['101','101','110','101','101'],M:['10001','11011','10101','10001','10001'],N:['1001','1101','1011','1001','1001'],O:['111','101','101','101','111'],P:['110','101','110','100','100'],Q:['111','101','101','111','001'],R:['110','101','110','101','101'],S:['111','100','111','001','111'],T:['111','010','010','010','010'],V:['101','101','101','101','010'],W:['10101','10101','10101','10101','01010'],Y:['101','101','010','010','010'],Z:['111','001','010','100','111']});
function box(x,y,c=27){rect(x,y,14,11,29);rect(x+1,y+1,12,9,c);rect(x+6,y+1,2,4,9);rect(x+3,y+7,4,1,48);}
function receipt(x,y){rect(x,y,10,14,6);rect(x+1,y+1,8,12,8);for(let j=0;j<3;j++)rect(x+3,y+3+j*3,4,1,3);}
function check(x,y,lit){rect(x,y,7,7,2);if(lit){line(x+1,y+3,x+3,y+5,54);line(x+3,y+5,x+6,y+1,54);}}
function frame(n){
 p=new Uint8Array(W*H);let t=n/FPS,u=n/FRAMES;
 rect(0,0,W,H,0);rect(0,0,W,165,14);rect(1,1,W-2,H-2,14);
 for(let x=16;x<W;x+=16)for(let y=38;y<160;y+=16)rect(x,y,1,1,1);
 rect(0,163,W,3,3);rect(0,166,W,42,0);rect(0,188,W,1,2);
 // Header strip and restrained copper/teal accents.
 text('LUCA',16,15,8);text('BUSINESS INFORMATION SYSTEMS',65,15,6);
 rect(16,29,368,1,2);rect(16,29,92,1,53);
 // Inventory shelves, before and after an order.
 text('INVENTORY',49,52,7);rect(40,70,82,85,1);rect(43,73,76,78,0);
 for(let y=94;y<150;y+=26){rect(45,y,72,3,3);rect(45,y+3,72,1,2);}
 rect(45,77,2,77,3);rect(115,77,2,77,3);
 let x=34+(u<=.5?u:1-u)*660,walkRight=u<.5;
 box(51,82);box(72,82);if(x<100)box(93,82);
 box(51,108,28);box(72,108,28);box(93,108,28);box(51,134);box(72,134);
 check(110,52,x>98);text('STOCK',63,158,5);
 // Order station: packing desk and a small database server.
 text('ORDERS',179,52,7);rect(147,106,82,5,3);rect(151,111,4,43,2);rect(222,111,4,43,2);
 rect(157,75,34,25,3);rect(159,77,30,21,0);rect(161,80,26,4,17);rect(162,86,13,2,5);rect(162,91,19,2,53);rect(172,100,4,5,3);rect(166,105,17,1,3);
 box(202,94,27);receipt(212,116);
 rect(237,83,19,71,2);for(let j=0;j<4;j++){rect(240,87+j*15,13,11,0);rect(242,90+j*15,6,1,4);rect(250,94+j*15,1,1,Math.floor(t*2+j)%2?53:3);}
 text('MYSQL',236,158,5);check(215,52,x>204);
 // Financial reporting dashboard: data bars and an exported document.
 text('REPORTS',298,52,7);rect(278,70,91,67,3);rect(280,72,87,63,0);rect(282,74,83,7,1);
 for(let j=0;j<3;j++){rect(286+j*26,85,23,10,1);rect(289+j*26,89,13,2,53);}
 for(let yy=103;yy<=124;yy+=7)rect(286,yy,74,1,1);
 for(let j=0;j<6;j++){let h=[9,15,12,22,18,28][j];rect(291+j*11,128-h,6,h,x>300?53:17);rect(291+j*11,128-h,6,2,x>300?54:22);}
 rect(318,137,6,11,3);rect(307,148,28,2,3);receipt(353,140);text('PDF',349,158,5);check(356,52,x>308);
 // Small game checkpoints stand for a stock item, order and exported report.
 for(let j=0;j<3;j++){let xx=[88,193,298][j];rect(xx,180,23,2,17);rect(xx+6,180,11,1,53);}
 let near=Math.min(...[88,193,298].map(q=>Math.abs(x-q)));let jump=near<27?Math.cos(near/27*Math.PI/2)*18:0;
 let ax=Math.round(x),feet=181-Math.round(jump);rect(ax+3,182,20,1,1);character(ax,feet,t,jump>2);
 if(!walkRight){let y0=feet-37;for(let yy=Math.max(0,y0);yy<Math.min(H,feet);yy++){let row=p.slice(yy*W+ax-3,yy*W+ax+27);for(let xx=0;xx<30;xx++)p[yy*W+ax-3+xx]=row[29-xx];}}
 text('STOCK',25,198,4);text('ORDERS',164,198,4);text('REPORTING',304,198,4);
 return p;
}

function scale(a){let q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=a[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(let b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){let b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(a,w,h){let raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){raw[y*(w+1)]=0;Buffer.from(a.subarray(y*w,(y+1)*w)).copy(raw,y*(w+1)+1);}let ih=Buffer.alloc(13);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal.flat())),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
// GIF89a, a fixed global palette, and GIF LZW. No lossy colour quantisation.
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){let c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);let b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){fs.mkdirSync('assets',{recursive:true});let head=Buffer.alloc(13);head.write('GIF89a');head.writeUInt16LE(W*S,6);head.writeUInt16LE(H*S,8);head[10]=0xd5;let parts=[head,Buffer.from(pal.flat()),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];let previous;for(let n=0;n<FRAMES;n++){let a=scale(frame(n));if(n===70)fs.writeFileSync('assets/systems-workshop-v3-still.png',png(a,W*S,H*S));let x0=0,y0=0,x1=W*S-1,y1=H*S-1;
if(previous){x0=W*S;y0=H*S;x1=0;y1=0;for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)if(a[y*W*S+x]!==previous[y*W*S+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x0>x1){x0=0;y0=0;x1=0;y1=0;}}
let ww=x1-x0+1,hh=y1-y0+1,crop=Buffer.alloc(ww*hh);for(let y=0;y<hh;y++)a.copy(crop,y*ww,(y+y0)*W*S+x0,(y+y0)*W*S+x0+ww);
let desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(x0,1);desc.writeUInt16LE(y0,3);desc.writeUInt16LE(ww,5);desc.writeUInt16LE(hh,7);parts.push(Buffer.from([0x21,0xf9,4,4,2,0,0,0]),desc,lzw(crop));previous=a;}parts.push(Buffer.from([0x3b]));let gif=Buffer.concat(parts);fs.writeFileSync('assets/systems-workshop-v3.gif',gif);console.log(JSON.stringify({frames:FRAMES,fps:FPS,seconds:FRAMES/FPS,width:W*S,height:H*S,bytes:gif.length}));}
main();
