// Original pixel-art profile loop. No external dependencies. Node.js 18+.
// Run from the repository root: node scripts/render_adventure.cjs
const fs=require('node:fs'),zlib=require('node:zlib');
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
function character(x,feet,t,jump){let phase=Math.floor(t*12)%8,leg=jump?3:Math.round(Math.sin(phase*Math.PI/4)*4),bob=jump?0:(phase%4===0?0:1),y=feet-36+bob;
// Individual pixel clusters match the supplied portrait: brown hair, black glasses and tee.
rect(x+5,y+27,6,5,51);rect(x+12,y+27,6,5,52);
if(jump){rect(x+2,y+29,6,4,51);rect(x+1,y+32,7,2,41);rect(x+1,y+32,3,1,7);rect(x+14,y+30,6,5,52);rect(x+15,y+34,8,2,41);rect(x+15,y+34,3,1,7);}
else{rect(x+4+leg,y+30,5,5,52);rect(x+12-leg,y+30,5,5,51);rect(x+3+leg,y+34,8,2,41);rect(x+12-leg,y+34,8,2,41);rect(x+3+leg,y+34,3,1,7);rect(x+12-leg,y+34,3,1,7);}
poly([[x+4,y+17],[x+15,y+16],[x+20,y+23],[x+18,y+29],[x+4,y+29],[x+1,y+23]],49);
rect(x+5,y+18,12,10,47);rect(x+6,y+20,9,7,48);rect(x+8,y+18,7,2,41);rect(x+7,y+18,2,1,50);
let arm=jump?-3:Math.round(Math.sin(phase*Math.PI/4)*3);rect(x+1,y+20,4,6,48);rect(x+1-arm,y+24,5,3,45);rect(x-arm,y+26,4,3,45);rect(x+17,y+20,4,6,47);rect(x+18+arm,y+24,4,3,46);rect(x+19+arm,y+26,3,3,46);
rect(x+6,y+4,13,12,44);rect(x+8,y+5,12,11,45);rect(x+11,y+7,9,9,46);rect(x+19,y+9,2,3,45);rect(x+8,y+15,9,3,45);
rect(x+5,y+2,14,5,42);rect(x+7,y,8,3,42);rect(x+12,y+1,6,4,43);rect(x+4,y+4,4,6,42);rect(x+8,y+3,5,3,43);rect(x+15,y+3,5,4,42);rect(x+9,y+1,4,2,44);rect(x+7,y+2,3,1,45);rect(x+17,y+6,3,2,43);
rect(x+7,y+8,6,4,41);rect(x+15,y+8,6,4,41);rect(x+13,y+9,2,1,41);rect(x+8,y+9,4,2,46);rect(x+16,y+9,4,2,46);rect(x+10,y+9,1,2,41);rect(x+18,y+9,1,2,41);rect(x+8,y+8,3,1,6);rect(x+16,y+8,3,1,6);rect(x+8,y+9,1,2,9);rect(x+16,y+9,1,2,9);
rect(x+14,y+14,4,1,42);rect(x+13,y+13,1,1,42);rect(x+18,y+13,1,1,42);rect(x+9,y+13,1,1,43);
}

// An eight-second city run. Four obstacles and pickups share one physical timeline.
const PLAYER_X=126,GROUND=174,SPEED=100,PERIOD=2;
function motion(t){const a=((t%PERIOD)+PERIOD)%PERIOD,start=.46,end=1.56,s=(a-start)/(end-start),jump=s>0&&s<1;return{a,jump,height:jump?44*4*s*(1-s):0};}
function token(x,y,kind){
 // A stepped pixel outline keeps the four symbols readable at profile scale.
 rect(x-7,y-10,15,1,3);rect(x-10,y-7,1,15,3);rect(x+10,y-7,1,15,3);rect(x-7,y+10,15,1,3);
 rect(x-8,y-8,17,17,1);
 if(kind===0){rect(x-6,y-6,13,12,7);rect(x-6,y-6,13,3,53);rect(x-4,y-5,1,1,8);rect(x-2,y-5,1,1,8);rect(x-4,y-1,4,5,3);rect(x+1,y-1,4,1,53);rect(x+1,y+2,4,1,4);}
 if(kind===1){line(x-3,y-4,x-6,y,54);line(x-6,y,x-3,y+4,54);line(x+4,y-4,x+7,y,54);line(x+7,y,x+4,y+4,54);line(x+2,y-5,x,y+5,8);}
 if(kind===2){rect(x-6,y-4,13,8,6);rect(x-8,y-1,4,7,6);rect(x+5,y-1,4,7,6);rect(x-5,y-2,2,5,1);rect(x-7,y,6,1,1);rect(x+3,y-1,2,2,54);rect(x+6,y+2,2,2,35);}
 if(kind===3){rect(x-6,y-6,13,13,53);rect(x-4,y-5,10,11,7);rect(x-6,y-5,2,11,3);rect(x-2,y-3,6,1,4);rect(x-2,y,6,1,4);rect(x-2,y+3,4,1,4);}
}
function sparkle(x,y,age){
 const k=age/.36;
 for(let j=0;j<8;j++){const angle=j*Math.PI/4,r=3+k*15,xx=Math.round(x+Math.cos(angle)*r),yy=Math.round(y+Math.sin(angle)*r-k*5);rect(xx,yy,k<.5?2:1,k<.5?2:1,j%2?54:8);}
 if(k<.4){line(Math.round(x)-3,Math.round(y),Math.round(x)+3,Math.round(y),55);line(Math.round(x),Math.round(y)-3,Math.round(x),Math.round(y)+3,55);}
}
function dust(t,event){
 const age=(t-event+PERIOD)%PERIOD;
 if(age>.22)return;
 for(let j=0;j<4;j++){const q=age/.22,x=PLAYER_X+8-j*4-q*(10+j*2),y=GROUND-2-Math.sin(q*Math.PI)*(2+j%2);rect(x,y,q<.45?3:2,1,j%2?4:3);}
}
function frame(n){p=new Uint8Array(W*H);const t=n/FPS,u=n/FRAMES,m=motion(t),scroll=t*SPEED;
 rect(0,0,W,H,14);rect(0,91,W,42,13);rect(0,133,W,41,12);
 // Deterministic twinkles repeat exactly after eight seconds.
 for(let j=0;j<37;j++){const x=(j*97+29)%W,y=29+(j*31)%71,bright=Math.sin(t*Math.PI/2+j)> .78;rect(x,y,1,1,bright?6:3);if(j%13===0&&bright){rect(x-1,y,3,1,4);rect(x,y-1,1,3,4);}}
 circle(326,47,14,4);circle(326,47,13,9);circle(332,43,13,14);rect(317,52,2,1,7);
 // Distant silhouette, middle skyline and detailed near buildings use exact tile periods.
 for(let k=-2;k<5;k++)for(let j=0;j<4;j++){const x=k*200+j*50-u*200,h=30+(j*19)%37;rect(x,160-h,37,h,15);rect(x+4,157-h,28,3,15);if(j%2===0)rect(x+15,151-h,1,6,2);}
 for(let k=-2;k<5;k++)for(let j=0;j<8;j++){
  const x=k*400+j*50-u*400,h=46+(j*17)%47,y=165-h;rect(x,y,37,h,2);rect(x+2,y+2,33,h-2,15);rect(x,y,37,2,3);
  if(j%3===0){rect(x+8,y-5,16,5,2);rect(x+19,y-11,1,6,3);rect(x+18,y-12,3,1,4);}
  for(let row=0;row<Math.floor((h-12)/10);row++)for(let col=0;col<4;col++){if((row*7+col*3+j)%5!==0)rect(x+6+col*7,y+8+row*10,2,3,(row+col+j)%7===0?5:3);}
 }
 for(let k=-2;k<6;k++)for(let j=0;j<8;j++){
  const x=k*400+j*50-u*800,h=19+(j*11)%28,y=174-h;rect(x,y,43,h,19);rect(x,y,43,2,3);rect(x+2,y+2,39,1,17);
  for(let row=0;row<Math.floor((h-8)/9);row++)for(let col=0;col<4;col++)rect(x+6+col*9,y+7+row*9,3,3,(row+col+j)%4===0?4:17);
  if(j%3===1){rect(x+6,y-7,15,7,18);rect(x+7,y-6,13,1,3);rect(x+8,y-4,2,3,17);rect(x+13,y-4,2,3,17);rect(x+18,y-4,2,3,17);}
 }
 // Foreground roof tiles, narrow luminous trim and restrained reflections.
 rect(0,GROUND,W,4,3);rect(0,GROUND,W,1,53);rect(0,GROUND+4,W,H-GROUND,0);rect(0,GROUND+5,W,1,1);
 for(let j=-1;j<12;j++){const x=j*40-(scroll%40);rect(x,186,29,1,1);rect(x+7,199,30,1,1);rect(x+33,179,1,28,1);rect(x+3,180,12,1,10);}
 // The shadow stays on the roof and becomes smaller as the player rises.
 const sw=Math.round(22-m.height*.18);rect(PLAYER_X+12-sw/2,GROUND-1,sw,1,1);
 for(let k=-3;k<9;k++){
  const center=238+k*200-scroll,x=center-14;
  rect(x,162,28,12,2);rect(x,161,28,2,53);rect(x+2,164,24,2,3);rect(x+3,169,22,1,1);rect(x+25,164,2,10,1);
  // Collect at the jump apex; the symbol disappears into a short pixel burst.
  const age=(PLAYER_X+12-center)/SPEED,kind=((k%4)+4)%4,y=112+Math.round(Math.sin(t*Math.PI)*1);
  if(age<0)token(center,y,kind);else if(age<.36)sparkle(PLAYER_X+12-age*28,112,age);
 }
 dust(m.a,.46);dust(m.a,1.56);character(PLAYER_X,GROUND-Math.round(m.height),t,m.jump);
 // Light HUD: name and four dots that follow the four collectible types.
 rect(11,10,34,14,1);rect(11,10,34,1,2);text('LUCA',18,15,8);
 rect(343,10,45,14,1);rect(343,10,45,1,2);const active=Math.floor((t+1)/2)%4;
 for(let j=0;j<4;j++){rect(350+j*9,15,5,5,j===active?53:3);if(j===active)rect(351+j*9,16,3,3,54);}
 return p;
}
function scale(a){let q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=a[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(let b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){let b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(a,w,h){let raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){raw[y*(w+1)]=0;Buffer.from(a.subarray(y*w,(y+1)*w)).copy(raw,y*(w+1)+1);}let ih=Buffer.alloc(13);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal.flat())),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
// GIF89a, a fixed global palette, and GIF LZW. No lossy colour quantisation.
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){let c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);let b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){fs.mkdirSync('assets',{recursive:true});
// Validate the circular scene at its exact boundary before encoding.
const a0=Buffer.from(frame(0)),a1=Buffer.from(frame(FRAMES));if(!a0.equals(a1))throw Error('Scene loop boundary differs');
if(process.argv.includes('--preview'))for(const n of [0,23,50,78,100])fs.writeFileSync('assets/polish-check-'+n+'.png',png(scale(frame(n)),W*S,H*S));
fs.mkdirSync('assets',{recursive:true});let head=Buffer.alloc(13);head.write('GIF89a');head.writeUInt16LE(W*S,6);head.writeUInt16LE(H*S,8);head[10]=0xd5;let parts=[head,Buffer.from(pal.flat()),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];let previous;for(let n=0;n<FRAMES;n++){let a=scale(frame(n));if(n===70)fs.writeFileSync('assets/pixel-code-adventure-v5-still.png',png(a,W*S,H*S));let x0=0,y0=0,x1=W*S-1,y1=H*S-1;
if(previous){x0=W*S;y0=H*S;x1=0;y1=0;for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)if(a[y*W*S+x]!==previous[y*W*S+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x0>x1){x0=0;y0=0;x1=0;y1=0;}}
let ww=x1-x0+1,hh=y1-y0+1,crop=Buffer.alloc(ww*hh);for(let y=0;y<hh;y++)a.copy(crop,y*ww,(y+y0)*W*S+x0,(y+y0)*W*S+x0+ww);
let desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(x0,1);desc.writeUInt16LE(y0,3);desc.writeUInt16LE(ww,5);desc.writeUInt16LE(hh,7);parts.push(Buffer.from([0x21,0xf9,4,4,2,0,0,0]),desc,lzw(crop));previous=a;}parts.push(Buffer.from([0x3b]));let gif=Buffer.concat(parts);fs.writeFileSync('assets/pixel-code-adventure-v5.gif',gif);console.log(JSON.stringify({frames:FRAMES,fps:FPS,seconds:FRAMES/FPS,width:W*S,height:H*S,bytes:gif.length}));}
main();
