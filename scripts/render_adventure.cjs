// Original pixel-art profile loop. No external dependencies. Node.js 18+.
// Run from the repository root: node scripts/render_adventure.cjs
const fs=require('node:fs'),zlib=require('node:zlib');
const W=400,H=208,S=2,FPS=50,RUN_FRAMES=400,FRAMES=550;
const hex=['202c42','283952','344b62','416479','597887','79939a','9cadad','ccd3c4','fff0d4','f6d7b0','ebba98','d99b89','bf7d87','9c6b83','775d7c','535775','496773','37666a','2c555b','21464f','193c49','15323f','528179','6a9683','96af89','bbc696','ded7a7','d7a46d','b77d55','8d604d','694b45','503c3d','eab46b','ffdb88','fff1b6','e48e6b','bb645e','844d56','61404d','432f40','2b2638','171f30','704d3f','95644c','bd8963','e2ad81','f3c89b','eee1c4','cfbea1','a18e7c','77716d','555c64','374553','68b9b0','99dfce','d8f4d9','897050','a48a5d','cfb67c','e6ce93','356c65','478479','79a487','b3c8a0'];
// Navy, charcoal and muted teal match the supplied pixel portrait.
Object.entries({0:'0d1117',1:'101b30',2:'23324b',3:'34496a',4:'476080',5:'7892af',6:'a8bed8',7:'c1d1e1',8:'e6edfa',9:'c1d4f4',10:'1a2845',11:'14203b',12:'101a35',13:'091329',14:'061024',15:'172542',16:'182e47',17:'20454e',18:'1a3845',19:'14303b',20:'102833',21:'0d202c',22:'326568',23:'427a7a',24:'649795',25:'8ab5ac',26:'b4d0bf',27:'576d7e',28:'324955',29:'24343f',30:'192b35',31:'111d28',32:'a0c7cb',33:'d4f1e8',34:'e0f5fa',35:'80aaa9',36:'527d82',37:'345964',38:'243746',39:'152b3a',40:'101c2d',41:'0d1117',47:'292a30',48:'202127',49:'15171d',50:'343841',51:'252c38',52:'17202d',53:'609eac',54:'9bd3d8',55:'e0f4f0'}).forEach(([i,h])=>hex[i]=h);
// Shared profile accents: sea glass, lilac, amber and rose.
Object.entries({12:'1a203b',13:'101831',14:'091226',22:'73d9c7',23:'b1a3ff',24:'f3c77d',25:'ed9eac',26:'9fd8a5',27:'302b52',28:'655339',29:'533448',30:'142333',31:'254a4b'}).forEach(([i,h])=>hex[i]=h);
const pal=hex.map(h=>[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)));
let p;
function rect(x,y,w,h,c){x=Math.round(x);y=Math.round(y);for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)for(let i=Math.max(0,x);i<Math.min(W,x+w);i++)p[j*W+i]=c;}
function line(x1,y1,x2,y2,c){let dx=Math.abs(x2-x1),dy=-Math.abs(y2-y1),sx=x1<x2?1:-1,sy=y1<y2?1:-1,e=dx+dy;while(true){rect(x1,y1,1,1,c);if(x1===x2&&y1===y2)break;let e2=2*e;if(e2>=dy){e+=dy;x1+=sx;}if(e2<=dx){e+=dx;y1+=sy;}}}
function poly(pts,c){let min=Math.floor(Math.min(...pts.map(q=>q[1]))),max=Math.ceil(Math.max(...pts.map(q=>q[1])));for(let y=min;y<=max;y++){let xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){let a=pts[i],b=pts[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,c);}}
function circle(x,y,r,c){for(let j=-r;j<=r;j++){let dx=Math.floor(Math.sqrt(r*r-j*j));rect(x-dx,y+j,dx*2+1,1,c);}}
const font={L:['100','100','100','100','111'],U:['101','101','101','101','111'],C:['111','100','100','100','111'],A:['010','101','111','101','101'],'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],X:['101','101','010','101','101'],'/':['001','001','010','100','100'],'2':['110','001','010','100','111'],'3':['110','001','010','001','110'],'4':['101','101','111','001','001'],'5':['111','100','110','001','110'],'6':['011','100','111','101','111'],'7':['111','001','010','010','010'],'8':['111','101','111','101','111'],'9':['111','101','111','001','110']};
function text(s,x,y,c){for(let a of s){if(font[a])font[a].forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(x+i,y+j,1,1,c)}));x+=4;}}
// Eight hand-posed run silhouettes: contact, recoil, passing and lift on each leg.
const RUN=[[[5,31,2,35],[16,31,19,35]],[[7,31,5,32],[15,31,17,35]],[[12,29,13,31],[12,32,11,35]],[[16,29,19,32],[9,32,6,35]],[[16,31,19,35],[5,31,2,35]],[[15,31,17,35],[7,31,5,32]],[[12,32,11,35],[12,29,13,31]],[[9,32,6,35],[16,29,19,32]]];
function leg(x,y,hip,k,color){
 const [kx,ky,fx,fy]=k;
 poly([[x+hip-2,y+27],[x+hip+2,y+27],[x+kx+2,y+ky],[x+fx+2,y+fy],[x+fx-2,y+fy],[x+kx-2,y+ky]],color);
 rect(x+fx-2,y+fy-1,8,2,41);rect(x+fx-1,y+fy-1,4,1,7);
}
function arm(x,y,sx,sy,ex,ey,hx,hy,color){
 poly([[x+sx-2,y+sy],[x+sx+2,y+sy],[x+ex+2,y+ey],[x+hx+2,y+hy],[x+hx-2,y+hy],[x+ex-2,y+ey]],color);
 rect(x+hx-1,y+hy-1,3,3,45);
}
function character(x,feet,t,jump,win=false){
 const phase=Math.floor(t*12)%8,air=(t%2),rise=air<1.01,bob=jump||win?0:[0,1,2,1,0,1,2,1][phase],y=feet-36-bob;
 if(jump){leg(x,y,8,rise?[5,30,3,32]:[7,31,5,34],52);leg(x,y,15,rise?[17,29,20,33]:[17,31,18,35],51);}
 else{leg(x,y,8,RUN[phase][0],52);leg(x,y,15,RUN[phase][1],51);}
 const swing=[-3,-2,0,2,3,2,0,-2][phase];
 if(win)arm(x,y,4,20,0,14,-1,9,48);else arm(x,y,4,20,jump?1:3,24,jump?0:2-swing,jump?24:27,48);
 poly([[x+5,y+17],[x+15,y+16],[x+20,y+22],[x+18,y+29],[x+4,y+29],[x+1,y+23]],49);
 rect(x+5,y+18,12,10,47);rect(x+7,y+20,8,7,48);rect(x+8,y+18,7,2,41);rect(x+7,y+18,2,1,50);rect(x+6,y+27,10,1,50);
 if(win)arm(x,y,17,20,22,14,23,9,47);else if(jump)arm(x,y,17,20,20,rise?19:22,22,rise?17:24,47);
 else arm(x,y,17,20,19,24,19+swing,26,47);
rect(x+6,y+4,13,12,44);rect(x+8,y+5,12,11,45);rect(x+11,y+7,9,9,46);rect(x+19,y+9,2,3,45);rect(x+8,y+15,9,3,45);
rect(x+5,y+2,14,5,42);rect(x+7,y,8,3,42);rect(x+12,y+1,6,4,43);rect(x+4,y+4,4,6,42);rect(x+8,y+3,5,3,43);rect(x+15,y+3,5,4,42);rect(x+9,y+1,4,2,44);rect(x+7,y+2,3,1,45);rect(x+17,y+6,3,2,43);
rect(x+7,y+8,6,4,41);rect(x+15,y+8,6,4,41);rect(x+13,y+9,2,1,41);rect(x+8,y+9,4,2,46);rect(x+16,y+9,4,2,46);rect(x+10,y+9,1,2,41);rect(x+18,y+9,1,2,41);rect(x+8,y+8,3,1,6);rect(x+16,y+8,3,1,6);rect(x+8,y+9,1,2,9);rect(x+16,y+9,1,2,9);
rect(x+14,y+14,4,1,42);rect(x+13,y+13,1,1,42);rect(x+18,y+13,1,1,42);rect(x+9,y+13,1,1,43);
 // A short blink sits inside the glasses and repeats at the same point of the loop.
 if(t%4>3.76&&t%4<3.88){rect(x+9,y+9,3,2,46);rect(x+17,y+9,3,2,46);rect(x+9,y+10,3,1,42);rect(x+17,y+10,3,1,42);}
}

// An eight-second city run. Four obstacles and pickups share one physical timeline.
const PLAYER_X=126,GROUND=174,SPEED=100,PERIOD=2;
function motion(t){const a=((t%PERIOD)+PERIOD)%PERIOD,start=.46,end=1.56,s=(a-start)/(end-start),jump=s>0&&s<1;return{a,jump,height:jump?44*4*s*(1-s):0};}
function token(x,y,kind){
 // A stepped pixel outline keeps the four symbols readable at profile scale.
 const accent=22+kind;
 rect(x-7,y-10,15,1,accent);rect(x-10,y-7,1,15,accent);rect(x+10,y-7,1,15,accent);rect(x-7,y+10,15,1,accent);
 rect(x-8,y-8,17,17,1);
 if(kind===0){rect(x-6,y-6,13,12,7);rect(x-6,y-6,13,3,22);rect(x-4,y-5,1,1,8);rect(x-2,y-5,1,1,8);rect(x-4,y-1,4,5,3);rect(x+1,y-1,4,1,53);rect(x+1,y+2,4,1,4);}
 if(kind===1){line(x-3,y-4,x-6,y,24);line(x-6,y,x-3,y+4,24);line(x+4,y-4,x+7,y,24);line(x+7,y,x+4,y+4,24);line(x+2,y-5,x,y+5,8);}
 if(kind===2){rect(x-6,y-4,13,8,6);rect(x-8,y-1,4,7,6);rect(x+5,y-1,4,7,6);rect(x-5,y-2,2,5,1);rect(x-7,y,6,1,1);rect(x+3,y-1,2,2,23);rect(x+6,y+2,2,2,25);}
 if(kind===3){rect(x-6,y-6,13,13,25);rect(x-4,y-5,10,11,7);rect(x-6,y-5,2,11,3);rect(x-2,y-3,6,1,4);rect(x-2,y,6,1,4);rect(x-2,y+3,4,1,4);}
}
function sparkle(x,y,age,kind){
 const k=age/.36;
 for(let j=0;j<8;j++){const angle=j*Math.PI/4,r=3+k*15,xx=Math.round(x+Math.cos(angle)*r),yy=Math.round(y+Math.sin(angle)*r-k*5);rect(xx,yy,k<.5?2:1,k<.5?2:1,j%2?22+kind:8);}
 if(k<.4){line(Math.round(x)-3,Math.round(y),Math.round(x)+3,Math.round(y),55);line(Math.round(x),Math.round(y)-3,Math.round(x),Math.round(y)+3,55);}
}
function dust(t,event){
 const age=(t-event+PERIOD)%PERIOD;
 if(age>.22)return;
 for(let j=0;j<4;j++){const q=age/.22,x=PLAYER_X+8-j*4-q*(10+j*2),y=GROUND-2-Math.sin(q*Math.PI)*(2+j%2);rect(x,y,q<.45?3:2,1,j%2?4:3);}
}
function obstacle(center,kind,t){
 const x=center-14;
 if(kind===0){
  rect(x,161,28,13,2);rect(x,161,28,1,22);rect(x+2,163,24,2,3);
  for(let row=0;row<3;row++)rect(x+4,166+row*2,20,1,1);
  rect(x+25,164,2,10,1);rect(x+3,164,1,1,7);
 }else if(kind===1){
  rect(x-1,158,30,16,27);rect(x-2,156,32,3,3);rect(x-1,156,30,1,23);
  for(let row=0;row<3;row++){const yy=160+row*5;rect(x,yy,28,1,2);for(let col=0;col<4;col++)rect(x+col*9+(row%2?4:0),yy+1,1,4,2);}
 }else if(kind===2){
  rect(x-2,166,32,8,2);rect(x+4,162,20,12,3);rect(x+3,161,22,2,23);rect(x+7,164,14,8,1);
  const rotor=Math.floor(t*8)%4;
  rect(x+12,165,4,6,4);if(rotor%2){rect(x+9,167,10,2,6);}else{rect(x+13,165,2,6,6);}
  rect(x+10,167,7,2,2);rect(x+13,168,1,1,8);
 }else{
  rect(x,164,28,10,29);rect(x-1,163,30,2,25);rect(x+2,166,24,1,27);rect(x+3,171,22,1,27);
  for(let j=0;j<4;j++){const xx=x+5+j*6,h=5+(j%2)*2;rect(xx,163-h,1,h,22);rect(xx-2,161-h,3,3,26);rect(xx+1,158-h+3,3,3,31);}
 }
}
function pickupFlight(t){
 const cycle=Math.floor((t-1)/2),age=t-(1+cycle*2),kind=((cycle%4)+4)%4;
 if(age<0||age>.56)return;
 const destination=352+kind*9;
 function point(a){const q=Math.min(1,a/.56),u=1-q;return[138*u*u+2*255*u*q+destination*q*q,112*u*u+2*5*u*q+17*q*q];}
 for(let j=3;j>=0;j--){const a=age-j*.035;if(a<0)continue;const [xx,yy]=point(a);rect(xx,yy,j===0?3:1,j===0?3:1,j===0?22+kind:3);}
}
function drawPlayer(feet,t,m){
 const scene=p;p=new Uint8Array(W*H);character(PLAYER_X,feet,t,m.jump);const sprite=p;p=scene;
 const anticipation=m.a>=.36&&m.a<.46,landing=m.a>=1.56&&m.a<1.68,squash=anticipation?.9:(landing?.93:1),lean=m.jump?(m.a<1.01?1:0):0;
 for(let y=Math.max(0,Math.floor(feet)-39);y<=Math.min(H-1,Math.ceil(feet)+2);y++)for(let x=PLAYER_X-9;x<PLAYER_X+34;x++){
  const c=sprite[y*W+x];if(c){const yy=Math.min(GROUND-1,Math.round(feet-(feet-y)*squash));rect(x+lean,yy,1,1,c);}
 }
}
function scene(n){p=new Uint8Array(W*H);const t=n/FPS,u=n/RUN_FRAMES,m=motion(t),scroll=t*SPEED;
 rect(0,0,W,H,14);rect(0,91,W,42,13);rect(0,133,W,41,12);
 // Deterministic twinkles repeat exactly after eight seconds.
 for(let j=0;j<37;j++){const x=(j*97+29)%W,y=29+(j*31)%71,bright=Math.sin(t*Math.PI/2+j)> .78;rect(x,y,1,1,bright?6:3);if(j%13===0&&bright){rect(x-1,y,3,1,4);rect(x,y-1,1,3,4);}}
 // One quiet shooting star in each complete loop.
 const streak=t%8-.6;if(streak>0&&streak<.65){const xx=Math.round(57+streak*124),yy=Math.round(31+streak*27);line(xx-12,yy-3,xx-5,yy-1,3);line(xx-4,yy-1,xx,yy,6);rect(xx,yy,2,1,8);}
 circle(326,47,14,4);circle(326,47,13,9);circle(332,43,13,14);rect(317,52,2,1,7);
 // Distant silhouette, middle skyline and detailed near buildings use exact tile periods.
 for(let k=-2;k<5;k++)for(let j=0;j<4;j++){const x=k*200+j*50-u*200,h=30+(j*19)%37;rect(x,160-h,37,h,15);rect(x+4,157-h,28,3,15);if(j%2===0)rect(x+15,151-h,1,6,2);}
 for(let k=-2;k<5;k++)for(let j=0;j<8;j++){
  const x=k*400+j*50-u*400,h=46+(j*17)%47,y=165-h;rect(x,y,37,h,2);rect(x+2,y+2,33,h-2,j%3===1?27:15);rect(x,y,37,2,3);
  if(j%3===0){rect(x+8,y-5,16,5,2);rect(x+19,y-11,1,6,3);rect(x+18,y-12,3,1,4);}
  for(let row=0;row<Math.floor((h-12)/10);row++)for(let col=0;col<4;col++){if((row*7+col*3+j)%5!==0)rect(x+6+col*7,y+8+row*10,2,3,(row+col+j)%7===0?28:3);}
 }
 for(let k=-2;k<6;k++)for(let j=0;j<8;j++){
  const x=k*400+j*50-u*800,h=19+(j*11)%28,y=174-h;rect(x,y,43,h,j%3===0?30:19);rect(x,y,43,2,3);rect(x+2,y+2,39,1,17);
  for(let row=0;row<Math.floor((h-8)/9);row++)for(let col=0;col<4;col++)rect(x+6+col*9,y+7+row*9,3,3,(row+col+j)%6===0?28:((row+col+j)%7===1?29:17));
  if(j===5){rect(x+29,y+6,11,12,27);line(x+33,y+8,x+31,y+11,23);line(x+31,y+11,x+33,y+14,23);line(x+36,y+8,x+38,y+11,23);line(x+38,y+11,x+36,y+14,23);}
  if(j%3===1){rect(x+6,y-7,15,7,18);rect(x+7,y-6,13,1,3);rect(x+8,y-4,2,3,17);rect(x+13,y-4,2,3,17);rect(x+18,y-4,2,3,17);}
 }
 // Foreground roof tiles, narrow luminous trim and restrained reflections.
 rect(0,GROUND,W,4,3);rect(0,GROUND,W,1,53);rect(0,GROUND+4,W,H-GROUND,0);rect(0,GROUND+5,W,1,1);
 for(let j=-1;j<12;j++){const x=j*40-(scroll%40);rect(x,186,29,1,1);rect(x+7,199,30,1,1);rect(x+33,179,1,28,1);rect(x+3,180,12,1,10);if(j%3===0)rect(x+4,181,6,1,31);if(j%3===1)rect(x+8,181,7,1,27);}
 // The shadow stays on the roof and becomes smaller as the player rises.
 const sw=Math.round(22-m.height*.18);rect(PLAYER_X+12-sw/2,GROUND-1,sw,1,1);
 for(let k=-3;k<9;k++){
  const center=238+k*200-scroll,x=center-14;
  obstacle(center,((k%4)+4)%4,t);
  // Collect at the jump apex; the symbol disappears into a short pixel burst.
  const age=(PLAYER_X+12-center)/SPEED,kind=((k%4)+4)%4,y=112+Math.round(Math.sin(t*Math.PI)*2);
  if(age<0)token(center,y,kind);else if(age<.36)sparkle(PLAYER_X+12-age*28,112,age,kind);
 }
 dust(m.a,.46);dust(m.a,1.56);drawPlayer(GROUND-Math.round(m.height),t,m);pickupFlight(t);
 // Light HUD: name and four dots that follow the four collectible types.
 rect(11,10,34,14,1);rect(11,10,34,1,2);text('LUCA',18,15,22);
 rect(343,10,45,14,1);rect(343,10,45,1,2);const active=((Math.floor((t-1)/2)%4)+4)%4,hitAge=((t-1)%2+2)%2;
 for(let j=0;j<4;j++){rect(350+j*9,15,5,5,j===active?22+j:3);if(j===active)rect(351+j*9,16,3,3,hitAge>.5&&hitAge<.7?8:22+j);}
 return p;
}
// The same original bitmap alphabet used by the profile's typing header.
const LEVEL_FONT={
 A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'11111/00100/00100/00100/00100/00100/11111',J:'00111/00010/00010/00010/10010/10010/01100',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',P:'11110/10001/10001/11110/10000/10000/10000',Q:'01110/10001/10001/10001/10101/10010/01101',R:'11110/10001/10001/11110/10100/10010/10001',S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',V:'10001/10001/10001/10001/10001/01010/00100',W:'10001/10001/10001/10101/10101/10101/01010',X:'10001/10001/01010/00100/01010/10001/10001',Y:'10001/10001/01010/00100/00100/00100/00100',Z:'11111/00001/00010/00100/01000/10000/11111','-':'00000/00000/00000/11111/00000/00000/00000',' ':'00000/00000/00000/00000/00000/00000/00000'};
Object.assign(LEVEL_FONT,{'0':'01110/10001/10011/10101/11001/10001/01110','1':'00100/01100/00100/00100/00100/00100/01110','2':'01110/10001/00001/00010/00100/01000/11111','>':'10000/01000/00100/00010/00100/01000/10000','!':'00100/00100/00100/00100/00100/00000/00100'});
function pixelText(s,y,scale,color){
 let x=Math.round((W-(s.length*6-1)*scale)/2),index=0;
 for(const c of s){const ink=Array.isArray(color)?color[index]:color;
  LEVEL_FONT[c].split('/').forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(x+i*scale,y+j*scale,scale,scale,ink);}));x+=6*scale;index++;
 }
}
function levelUp(n){
 p=new Uint8Array(W*H);const t=(n-RUN_FRAMES)/FPS;
 rect(0,0,W,H,14);rect(0,155,W,53,13);
 // Stepped frame, corner accents and restrained confetti use the profile palette.
 rect(30,23,340,164,1);rect(32,25,336,160,14);
 rect(37,23,326,1,3);rect(37,186,326,1,3);rect(30,30,1,150,3);rect(369,30,1,150,3);
 for(const [x,y,c] of [[30,23,22],[357,23,23],[30,175,25],[357,175,24]]){rect(x+3,y,10,2,c);rect(x,y+3,2,9,c);}
 for(let j=0;j<22;j++){
  const x=45+(j*47)%310,y=34+((j*31+t*(5+j%4))%138),c=22+j%4;
  if((x<103||x>299)||(y<51||y>159)){rect(x,y,j%3===0?2:1,2,c);if(j%5===0){rect(x-1,y+1,3,1,c);}}
 }
 // Upward chevrons cue the level transition before the large title.
 for(let j=0;j<2;j++){const yy=34+j*5;poly([[192,yy+5],[200,yy],[208,yy+5],[208,yy+8],[200,yy+3],[192,yy+8]],j?22:24);}
 const lift=Math.round(Math.exp(-t*8)*4);
 pixelText('LEVEL UP!',61+lift,3,[22,22,22,22,22,22,23,23,24]);
 pixelText('01 > 02',94,1,7);
 for(let j=0;j<4;j++)token(146+j*36,124,j);
 // A small victory pose keeps the ending recognisably Luca's game.
 rect(183,183,35,1,1);const hop=Math.round(Math.abs(Math.sin(t*Math.PI*2))*2);
 character(187,183-hop,0,false,true);
 return p;
}
const DITHER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function dissolve(a,b,q){
 const out=new Uint8Array(a.length);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const threshold=(DITHER[(Math.floor(y/2)%4)*4+Math.floor(x/2)%4]+.5)/16;out[y*W+x]=q>=threshold?b[y*W+x]:a[y*W+x];}return out;
}
function frame(n){
 if(n<RUN_FRAMES)return scene(n);
 if(n>=FRAMES)return scene(0);
 const end=levelUp(n);
 if(n<RUN_FRAMES+12)return dissolve(scene(RUN_FRAMES-1),end,(n-RUN_FRAMES)/11);
 if(n>=FRAMES-25)return dissolve(end,scene(0),(n-(FRAMES-25))/24);
 return end;
}

function scale(a){let q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=a[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(let b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){let b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(a,w,h){let raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){raw[y*(w+1)]=0;Buffer.from(a.subarray(y*w,(y+1)*w)).copy(raw,y*(w+1)+1);}let ih=Buffer.alloc(13);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal.flat())),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
// GIF89a, a fixed global palette, and GIF LZW. No lossy colour quantisation.
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){let c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);let b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){fs.mkdirSync('assets',{recursive:true});
// Validate the circular scene at its exact boundary before encoding.
const a0=Buffer.from(frame(0)),a1=Buffer.from(frame(FRAMES-1));if(!a0.equals(a1))throw Error('Scene loop boundary differs');
if(process.argv.includes('--preview'))for(const n of [0,350,400,412,450,500,549])fs.writeFileSync('assets/polish-check-'+n+'.png',png(scale(frame(n)),W*S,H*S));
fs.mkdirSync('assets',{recursive:true});let head=Buffer.alloc(13);head.write('GIF89a');head.writeUInt16LE(W*S,6);head.writeUInt16LE(H*S,8);head[10]=0xd5;let parts=[head,Buffer.from(pal.flat()),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];let previous;for(let n=0;n<FRAMES;n++){let a=scale(frame(n));if(n===70)fs.writeFileSync('assets/pixel-code-adventure-v8-still.png',png(a,W*S,H*S));let x0=0,y0=0,x1=W*S-1,y1=H*S-1;
if(previous){x0=W*S;y0=H*S;x1=0;y1=0;for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)if(a[y*W*S+x]!==previous[y*W*S+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x0>x1){x0=0;y0=0;x1=0;y1=0;}}
let ww=x1-x0+1,hh=y1-y0+1,crop=Buffer.alloc(ww*hh);for(let y=0;y<hh;y++)a.copy(crop,y*ww,(y+y0)*W*S+x0,(y+y0)*W*S+x0+ww);
let desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(x0,1);desc.writeUInt16LE(y0,3);desc.writeUInt16LE(ww,5);desc.writeUInt16LE(hh,7);parts.push(Buffer.from([0x21,0xf9,4,4,2,0,0,0]),desc,lzw(crop));previous=a;}parts.push(Buffer.from([0x3b]));let gif=Buffer.concat(parts);fs.writeFileSync('assets/pixel-code-adventure-v8.gif',gif);console.log(JSON.stringify({frames:FRAMES,fps:FPS,seconds:FRAMES/FPS,gameSeconds:RUN_FRAMES/FPS,levelUpSeconds:(FRAMES-RUN_FRAMES)/FPS,width:W*S,height:H*S,bytes:gif.length}));}
main();
