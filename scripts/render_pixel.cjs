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
function frame(n){p=new Uint8Array(W*H);let t=n/FPS,u=n/FRAMES;
// Night sky with stepped colour bands, no antialiasing.
rect(0,0,W,35,14);rect(0,35,W,20,13);rect(0,55,W,18,12);rect(0,73,W,20,11);rect(0,93,W,36,10);rect(0,129,W,79,19);
circle(307,52,13,9);circle(312,48,12,13);
for(let j=0;j<33;j++){let sx=(j*97+23)%400,sy=30+(j*31)%66;rect(sx,sy,1,1,j%5===0?7:4);if(j%8===0&&Math.sin(t*Math.PI+j)>0.7){rect(sx-1,sy,3,1,6);rect(sx,sy-1,1,3,6);}}
for(let k=-1;k<4;k++){cloud(k*200-u*400,42+(k%2)*10,1);}
// Tileable parallax silhouettes. Each layer completes an integer period per loop.
for(let k=-1;k<3;k++){let x=k*400-u*400;poly([[x,109],[x+43,90],[x+71,108],[x+140,65],[x+220,118],[x+271,80],[x+330,108],[x+400,109],[x+400,150],[x,150]],15);poly([[x+98,105],[x+140,65],[x+176,94],[x+145,84],[x+135,91],[x+129,83]],13);}
for(let k=-1;k<4;k++){let x=k*400-u*800;poly([[x,142],[x+32,124],[x+95,140],[x+160,109],[x+237,129],[x+294,118],[x+360,138],[x+400,142],[x+400,169],[x,169]],18);for(let j=0;j<8;j++)tree(x+j*55,154,28+(j*13)%23,true);}
// Abandoned little mountain station and a lit window.
for(let k=-1;k<3;k++){let x=k*800-u*800+340;
rect(x,132,50,38,29);rect(x+2,136,46,32,30);for(let y=138;y<166;y+=5)rect(x+2,y,46,1,29);
poly([[x-7,134],[x+23,109],[x+57,134]],20);poly([[x-3,131],[x+23,112],[x+51,131]],18);line(Math.round(x-7),134,Math.round(x+23),109,22);
rect(x+8,142,13,13,39);rect(x+10,144,9,9,32);rect(x+11,144,2,8,33);rect(x+14,144,1,9,29);rect(x+10,148,9,1,29);rect(x+31,144,12,25,31);rect(x+33,146,8,21,29);rect(x+39,156,1,1,33);rect(x+39,116,6,12,30);
for(let j=0;j<3;j++){let sy=110-((t*7+j*9)%28);rect(x+40+Math.sin(t*Math.PI/2+j)*3,sy,4+j,2,6);}
tree(x-30,174,64);tree(x+81,174,76);}
// Solid ground, grass tufts, stones and roots.
rect(0,174,W,34,31);rect(0,174,W,3,22);rect(0,177,W,3,18);rect(0,181,W,27,30);rect(0,200,W,8,31);
for(let k=-1;k<10;k++){let x=k*50-(u*800%50);rect(x,181,21,2,29);rect(x+24,190,12,2,29);rect(x+5,199,8,1,28);rect(x+42,184,5,3,31);rect(x+52,196,3,2,29);line(Math.round(x+12),174,Math.round(x+9),170,23);line(Math.round(x+13),174,Math.round(x+16),169,22);}
// Two low platforms per 800-pixel level, matched to a two-second jump cycle.
let cyc=(t%2)/2,jumping=cyc>.27&&cyc<.77,jp=jumping?Math.sin((cyc-.27)/.5*Math.PI)*37:0;
for(let k=-2;k<5;k++){let x=234+k*200-u*800;
rect(x,161,28,13,29);rect(x,160,28,3,23);rect(x+1,163,26,2,18);rect(x+4,166,6,2,28);rect(x+17,170,7,2,30);
let gx=x+14,gy=140+Math.round(Math.sin(t*Math.PI*2)*2);gem(gx,gy,t);
for(let j=0;j<2;j++){let sx=gx-11+j*23,sy=gy-10+((n+j*17)%40)/5;if((n+j*17)%40<15){rect(sx,sy,1,3,34);rect(sx-1,sy+1,3,1,34);}}
fern(x+72,174);rect(x+96,171,6,3,2);rect(x+97,170,4,1,4);
}
// Small fixed screen shadow and the player sprite.
rect(126,173,24,1,20);character(126,174-Math.round(jp),t,jumping);
// HUD is intentionally small so the scene stays the focus.
rect(11,10,54,16,41);text('LUCA',17,15,8);for(let j=0;j<3;j++){let x=42+j*6;rect(x,15,2,2,35);rect(x+3,15,2,2,35);rect(x+1,17,3,2,35);rect(x+2,19,1,1,35);}
rect(339,10,49,16,41);gem(346,17,t);text('X 01',355,15,8);
// Foreground foliage anchored to the scrolling level, never crossing the face.
for(let k=-1;k<5;k++){let x=k*200-(u*800%200);fern(x+12,204);fern(x+20,208);rect(x+33,205,7,3,20);}
return p;}
function scale(a){let q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=a[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(let b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){let b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(a,w,h){let raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){raw[y*(w+1)]=0;Buffer.from(a.subarray(y*w,(y+1)*w)).copy(raw,y*(w+1)+1);}let ih=Buffer.alloc(13);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal.flat())),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
// GIF89a, a fixed global palette, and GIF LZW. No lossy colour quantisation.
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){let c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);let b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){fs.mkdirSync('assets',{recursive:true});let head=Buffer.alloc(13);head.write('GIF89a');head.writeUInt16LE(W*S,6);head.writeUInt16LE(H*S,8);head[10]=0xd5;let parts=[head,Buffer.from(pal.flat()),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];for(let n=0;n<FRAMES;n++){let a=scale(frame(n));if(n===70)fs.writeFileSync('assets/pixel-platformer-navy-v2-still.png',png(a,W*S,H*S));let desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(W*S,5);desc.writeUInt16LE(H*S,7);parts.push(Buffer.from([0x21,0xf9,4,4,2,0,0,0]),desc,lzw(a));}parts.push(Buffer.from([0x3b]));let gif=Buffer.concat(parts);fs.writeFileSync('assets/pixel-platformer-navy-v2.gif',gif);console.log(JSON.stringify({frames:FRAMES,fps:FPS,seconds:FRAMES/FPS,width:W*S,height:H*S,bytes:gif.length}));}
main();

