// Original pixel-art profile loop. No external dependencies. Node.js 18+.
// Run from the repository root: node scripts/render_adventure.cjs
const fs=require('node:fs'),zlib=require('node:zlib');
const W=400,H=208,S=2,FPS=50,RUN_FRAMES=1000,FRAMES=1175;
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
font['+']=['000','010','111','010','000'];
Object.assign(font,{S:['111','100','111','001','111'],E:['111','100','110','100','111'],N:['101','111','111','111','101'],T:['111','010','010','010','010'],I:['111','010','010','010','111']});
function text(s,x,y,c){for(let a of s){if(font[a])font[a].forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(x+i,y+j,1,1,c)}));x+=4;}}
// Eight hand-posed run silhouettes: contact, recoil, passing and lift on each leg.
const RUN=[[[5,31,2,35],[16,31,19,35]],[[7,31,5,32],[15,31,17,35]],[[12,29,13,31],[12,32,11,35]],[[16,29,19,32],[9,32,6,35]],[[16,31,19,35],[5,31,2,35]],[[15,31,17,35],[7,31,5,32]],[[12,32,11,35],[12,29,13,31]],[[9,32,6,35],[16,29,19,32]]];
// Interpolate the hand-drawn poses at the output frame rate. Keep the final
// raster on the pixel grid while removing abrupt knee and arm changes.
function runPose(t){
 const cycle=((t*12)%8+8)%8,index=Math.floor(cycle),q=cycle-index;
 return RUN[index].map((limb,j)=>limb.map((v,k)=>v+(RUN[(index+1)%8][j][k]-v)*q));
}
function leg(x,y,hip,k,color){
 const [kx,ky,fx,fy]=k;
 poly([[x+hip-2,y+27],[x+hip+2,y+27],[x+kx+2,y+ky],[x+fx+2,y+fy],[x+fx-2,y+fy],[x+kx-2,y+ky]],color);
 rect(x+fx-2,y+fy-1,8,2,41);rect(x+fx-1,y+fy-1,4,1,7);
}
function arm(x,y,sx,sy,ex,ey,hx,hy,color){
 poly([[x+sx-2,y+sy],[x+sx+2,y+sy],[x+ex+2,y+ey],[x+hx+2,y+hy],[x+hx-2,y+hy],[x+ex-2,y+ey]],color);
 rect(x+hx-1,y+hy-1,3,3,45);
}
function character(x,feet,t,jump,win=false,idle=false,weapon=null){
 const phase=idle?0:((t*12)%8+8)%8,air=(t%2),rise=air<1.01,bob=jump||win||idle?0:1-Math.cos(phase*Math.PI/2),y=feet-36-bob;
 if(jump){leg(x,y,8,rise?[5,30,3,32]:[7,31,5,34],52);leg(x,y,15,rise?[17,29,20,33]:[17,31,18,35],51);}
 else if(idle){leg(x,y,8,[9,31,8,35],52);leg(x,y,15,[14,31,15,35],51);}
 else{const pose=runPose(t);leg(x,y,8,pose[0],52);leg(x,y,15,pose[1],51);}
 const swing=idle?0:-3*Math.cos(phase*Math.PI/4);
 if(win)arm(x,y,4,20,0,14,-1,9,48);else arm(x,y,4,20,jump?1:3,24,jump?0:2-swing,jump?24:27,48);
 poly([[x+5,y+17],[x+15,y+16],[x+20,y+22],[x+18,y+29],[x+4,y+29],[x+1,y+23]],49);
 rect(x+5,y+18,12,10,47);rect(x+7,y+20,8,7,48);rect(x+8,y+18,7,2,41);rect(x+7,y+18,2,1,50);rect(x+6,y+27,10,1,50);
 if(weapon)arm(x,y,17,20,21,24,25-weapon.recoil,21+Math.round(weapon.aim/2),47);
 else if(win)arm(x,y,17,20,22,14,23,9,47);else if(jump)arm(x,y,17,20,20,rise?19:22,22,rise?17:24,47);
 else arm(x,y,17,20,19,24,19+swing,26,47);
rect(x+6,y+4,13,12,44);rect(x+8,y+5,12,11,45);rect(x+11,y+7,9,9,46);rect(x+19,y+9,2,3,45);rect(x+8,y+15,9,3,45);
rect(x+5,y+2,14,5,42);rect(x+7,y,8,3,42);rect(x+12,y+1,6,4,43);rect(x+4,y+4,4,6,42);rect(x+8,y+3,5,3,43);rect(x+15,y+3,5,4,42);rect(x+9,y+1,4,2,44);rect(x+7,y+2,3,1,45);rect(x+17,y+6,3,2,43);
rect(x+7,y+8,6,4,41);rect(x+15,y+8,6,4,41);rect(x+13,y+9,2,1,41);rect(x+8,y+9,4,2,46);rect(x+16,y+9,4,2,46);rect(x+10,y+9,1,2,41);rect(x+18,y+9,1,2,41);rect(x+8,y+8,3,1,6);rect(x+16,y+8,3,1,6);rect(x+8,y+9,1,2,9);rect(x+16,y+9,1,2,9);
rect(x+14,y+14,4,1,42);rect(x+13,y+13,1,1,42);rect(x+18,y+13,1,1,42);rect(x+9,y+13,1,1,43);
 // A short blink sits inside the glasses and repeats at the same point of the loop.
 if(t%4>3.76&&t%4<3.88){rect(x+9,y+9,3,2,46);rect(x+17,y+9,3,2,46);rect(x+9,y+10,3,1,42);rect(x+17,y+10,3,1,42);}
}

// A twenty-second adventure: rooftop encounters, a sentinel fight and an exit portal.
const PLAYER_X=126,GROUND=174,SPEED=100,PERIOD=2;
// Lilac armour and rose sensors identify every enemy; teal belongs to Luca.
const ENCOUNTERS=[{at:1.4,type:'crawler',speed:116,color:23},{at:3.12,type:'drone',speed:132,color:25},{at:5.4,type:'crawler',speed:126,color:23},{at:7.12,type:'drone',speed:142,color:25},{at:9.4,type:'crawler',speed:142,color:23},{at:11.12,type:'drone',speed:156,color:25}];
const BOSS_HITS=[14.2,15.9,17.6],BOSS_SHOTS=[13.3,15.3,17.3];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=q=>{q=clamp(q);return q*q*(3-2*q);};
function worldScroll(t){if(t<=12)return t*SPEED;const q=Math.min(2,t-12);return (12+q-q*q/4)*SPEED;}
function playerX(t){return PLAYER_X+Math.round(208*ease((t-18.65)/1.05));}
function weaponPose(t){
 const feet=GROUND-Math.round(motion(t).height),x=playerX(t),target=bossPosition(t);
 const aim=t>=12?Math.round(clamp((target.y-(feet-15))*8/Math.max(50,target.x-x-30),-4,4)):0;
 const shot=BOSS_HITS.find(hit=>t>=hit-.7&&t<hit-.49),age=shot===undefined?1:t-(shot-.7),recoil=Math.round(2*Math.exp(-age*19));
 return {feet,x,aim,recoil,muzzleX:x+33-recoil,muzzleY:feet-15+aim,firing:age<.08};
}
function motion(t){
 const boss=t>=12.95&&t<18.55,a=(((t-(boss?.95:0))%PERIOD)+PERIOD)%PERIOD,start=.46,end=1.56,s=(a-start)/(end-start);
 let height=s>0&&s<1?44*4*s*(1-s):0;
 // Ground enemies are hit on the way down, then the player bounces clear.
 if(t<12&&Math.floor(t/2)%2===0&&a>=1.4&&a<1.9){const q=(a-1.4)/.5;height=22*(1-q)+80*q*(1-q);}
 if(t>=18.55||(t>=12&&t<12.95))height=0;
 return{a,jump:height>0,height,boss};
}
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
function dust(t,event,xx=PLAYER_X){
 const age=(t-event+PERIOD)%PERIOD;
 if(age>.22)return;
 for(let j=0;j<4;j++){const q=age/.22,x=xx+8-j*4-q*(10+j*2),y=GROUND-2-Math.sin(q*Math.PI)*(2+j%2);rect(x,y,q<.45?3:2,1,j%2?4:3);}
}
function crawler(x,t,color,age){
 if(age<.18)rect(x-14,173,28,1,1);
 if(age>=0){
  if(age<.12){rect(x-12,169,25,4,3);rect(x-10,168,21,2,color);rect(x-7,170,4,1,25);}
  if(age<.42){const q=age/.42;for(let j=0;j<8;j++){const angle=j*Math.PI/4;rect(x+Math.cos(angle)*q*25,154+Math.sin(angle)*q*17-q*8,q<.55?2:1,q<.55?2:1,j%2?color:8);}}
  if(age<.22){const r=4+age*55;rect(x-r,171,4,1,color);rect(x+r-3,171,4,1,color);}
  return;
 }
 const step=t*7*Math.PI;
 // Six skittering legs and a plated shell distinguish the ground enemies.
 for(let j=0;j<3;j++){const xx=Math.round(x-9+j*9),s=Math.round(3*Math.sin(step+j*Math.PI));line(xx,165,xx+s,172,4);rect(xx+s-2,172,4,1,color);}
 rect(x-12,156,25,10,41);rect(x-10,153,21,13,3);rect(x-8,152,17,3,color);rect(x-10,156,20,7,27);
 rect(x+2,155,6,9,color);rect(x+3,157,1,5,8);rect(x-13,157,14,6,41);
 rect(x-12,158,4,2,25);rect(x-5,158,4,2,25);rect(x-12,158,1,1,8);rect(x-5,158,1,1,8);
 line(Math.round(x-8),153,Math.round(x-11),149,4);rect(x-12,148,3,2,25);
}
function drone(x,t,enemy){
 const y=154+Math.round(Math.sin((t-enemy.at)*5)*2),rotor=Math.round(7+5*Math.sin(t*8*Math.PI));
 rect(x-12,173,24,1,1);
 // Low-flying sentries fire a single bolt that passes below the jump.
 rect(x-14,y-7,29,2,4);rect(x-11,y-9,1,4,3);rect(x+11,y-9,1,4,3);
 rect(x-11-rotor/2,y-10,rotor,1,23);rect(x+11-rotor/2,y-10,rotor,1,23);
 rect(x-12,y-5,25,10,41);rect(x-10,y-6,21,11,3);rect(x-8,y-4,17,7,29);
 rect(x-10,y-3,14,3,25);rect(x-9,y-3,3,1,8);rect(x+7,y-3,3,4,23);rect(x-5,y+5,9,2,4);
 const thrust=2+Math.round(1+Math.sin(t*6*Math.PI));rect(x-1,y+7,2,thrust,23);rect(x-1,y+7,2,1,8);
 const shotAge=t-(enemy.at-.7);
 if(shotAge>=0&&shotAge<1.25){const start=PLAYER_X+12+.7*enemy.speed-15,bx=Math.round(start-shotAge*245);
  if(bx>0){rect(bx+3,159,10,1,29);rect(bx,158,5,3,25);rect(bx,159,3,1,8);}
 }
}
function enemies(t){
 for(const enemy of ENCOUNTERS){
  const age=t-enemy.at,x=Math.round(PLAYER_X+12-(enemy.type==='crawler'&&age>=0?worldScroll(t)-worldScroll(enemy.at):age*enemy.speed));
  if(enemy.type==='crawler'&&age>.65)continue;
  if(x<-40||x>W+40)continue;
  if(enemy.type==='crawler')crawler(x,t,enemy.color,age);else drone(x,t,enemy);
  // A short alert precedes an encounter; a score rises from each defeated bot.
  if(age>-.7&&age<-.3){const yy=133-Math.round(ease((age+.7)/.4)*2);rect(x,yy,2,5,25);rect(x,yy+7,2,2,25);}
  if(enemy.type==='crawler'&&age>=0&&age<.65){text('+200',x-36,139-Math.round(age*19),age<.15?8:24);}
 }
}
function pickupFlight(t){
 if(t>=8)return;
 const cycle=Math.floor((t-1)/2),age=t-(1+cycle*2),kind=((cycle%4)+4)%4;
 if(age<0||age>.56)return;
 const destination=352+kind*9;
 function point(a){const q=Math.min(1,a/.56),u=1-q;return[138*u*u+2*255*u*q+destination*q*q,112*u*u+2*5*u*q+17*q*q];}
 for(let j=3;j>=0;j--){const a=age-j*.035;if(a<0)continue;const [xx,yy]=point(a);rect(xx,yy,j===0?3:1,j===0?3:1,j===0?22+kind:3);}
}
function drawPlayer(feet,t,m){
 if(t>=19.72)return;
 const xx=playerX(t),weapon=t>=9&&t<18.55?weaponPose(t):null,scene=p;p=new Uint8Array(W*H);character(xx,feet,m.boss?t-.95:t,m.jump,false,t>=12&&t<18.65&&!m.jump,weapon);const sprite=p;p=scene;
 const landAt=t<12&&Math.floor(t/2)%2===0?1.9:1.56,anticipation=t<18.55&&m.a>=.34&&m.a<.46,landing=t<18.55&&m.a>=landAt&&m.a<landAt+.18;
 const squash=anticipation?1-.08*Math.sin(clamp((m.a-.34)/.12)*Math.PI):landing?1-.10*Math.sin(clamp((m.a-landAt)/.18)*Math.PI):1,lean=m.jump?(m.a<1.01?1:0):0;
 for(let y=Math.max(0,Math.floor(feet)-39);y<=Math.min(H-1,Math.ceil(feet)+2);y++)for(let x=xx-9;x<xx+34;x++){
  const c=sprite[y*W+x];if(c){if(t>19.45&&x>330+Math.round((1-clamp((t-19.45)/.27))*30))continue;const yy=Math.min(GROUND-1,Math.round(feet-(feet-y)*squash));rect(x+lean,yy,1,1,c);}
 }
 // The hand, barrel, recoil and projectile share one muzzle position.
 if(weapon){const {muzzleX:mx,muzzleY:my,recoil,aim}=weapon;
  poly([[xx+23-recoil,feet-17],[mx,my-2],[mx,my+2],[xx+23-recoil,feet-13]],41);
  line(xx+24-recoil,feet-16,mx-1,my-1,5);line(xx+24-recoil,feet-15,mx,my,22);rect(xx+24-recoil,feet-13,2,3,47);
  if(weapon.firing){rect(mx+1,my-2,2,5,22);rect(mx+2,my-1,4,3,8);}
 }
}
function powerUp(t){
 if(t>=8&&t<9){const x=Math.round(PLAYER_X+12+(9-t)*SPEED),y=112+Math.round(Math.sin(t*5)*2);circle(x,y,9,31);poly([[x+1,y-7],[x-5,y+1],[x,y+1],[x-2,y+7],[x+5,y-2],[x,y-2]],22);}
 if(t>=9&&t<9.5){if(t<9.36)sparkle(PLAYER_X+12,112,t-9,0);pixelText('POWER UP',47,1,22);}
 if(t>=9&&t<12){const feet=GROUND-Math.round(motion(t).height);for(let j=3;j>0;j--)rect(PLAYER_X-j*7,feet-15+j,4,1,j===1?22:31);}
}
function bossPosition(t){
 const hit=BOSS_HITS.find(at=>t>=at&&t<at+.34),age=hit===undefined?1:t-hit;
 return {x:Math.round(420-120*ease((t-12.35)/.9)+(hit===undefined?0:5*(1-ease(age/.34)))),y:128+Math.round(Math.sin((t-12.35)*2.7)*3)};
}
function sentinel(t){
 if(t<12.35||t>=18.65)return;
 const {x,y}=bossPosition(t),dead=t>=BOSS_HITS[2],damage=BOSS_HITS.filter(hit=>t>=hit).length;
 if(!dead){
  const flash=BOSS_HITS.some(hit=>t>=hit&&t<hit+.1),charge=BOSS_SHOTS.some(shot=>t>=shot-.35&&t<shot),shell=flash?8:4;
  rect(x-28,173,57,1,1);
  // Stepped armour, rotating engine blades and one bright central eye.
  for(const side of [-1,1]){const ex=x+side*26;rect(ex-7,y-12,15,24,41);rect(ex-5,y-14,11,27,shell);rect(ex-3,y-10,7,18,27);rect(ex-2,y-8,5,14,23);
   const rotor=Math.round(7+3*Math.sin(t*6*Math.PI));rect(ex-rotor,y-17,rotor*2+1,2,6);rect(ex-4,y+14,9,3,23);rect(ex-2,y+17,5,4+Math.round(Math.sin(t*6*Math.PI)),23);}
  poly([[x-20,y-13],[x-12,y-21],[x+13,y-21],[x+21,y-12],[x+18,y+16],[x-17,y+16]],41);
  rect(x-17,y-13,35,25,shell);rect(x-12,y-18,25,7,shell);rect(x-14,y-10,29,20,2);rect(x-10,y-7,21,14,29);
  rect(x-8,y-5,17,10,charge?24:25);rect(x-5,y-3,11,6,flash?8:41);rect(x-3,y-2,7,4,charge?8:25);rect(x-2,y-2,2,1,8);
  rect(x-7,y+11,15,3,23);rect(x-20,y-7,3,12,6);rect(x+18,y-7,3,12,6);
  rect(x-15,y+15,4,Math.max(1,156-y-15),3);rect(x-24,155,14,6,3);rect(x-25,157,5,3,charge?24:25);
  if(charge){const q=clamp((t-(BOSS_SHOTS.find(shot=>t>=shot-.35&&t<shot)-.35))/.35);circle(x-25,158,2+Math.floor(q*3),24);circle(x-25,158,1,8);}
 }
 // Three telegraphed low shots are cleared by three deliberate jumps.
 for(const shot of BOSS_SHOTS){const age=t-shot;if(age>=0&&age<1.4){const bx=Math.round(278-age*200);rect(bx+3,158,14,2,29);rect(bx,156,7,5,25);rect(bx,157,3,3,8);}}
 for(const hit of BOSS_HITS){const fired=hit-.7,age=t-fired;if(age>=0&&age<.7){const q=age/.7,gun=weaponPose(fired),tx=bossPosition(hit),xx=Math.round(gun.muzzleX+(tx.x-gun.muzzleX)*q),yy=Math.round(gun.muzzleY+(tx.y-gun.muzzleY)*q);
   rect(xx-10,yy,8,1,31);rect(xx-4,yy-1,6,3,22);rect(xx,yy,3,1,8);}
  const impact=t-hit;if(impact>=0&&impact<.3){const q=impact/.3;for(let j=0;j<8;j++){const a=j*Math.PI/4;rect(x+Math.cos(a)*(4+q*20),y+Math.sin(a)*(4+q*16),2,2,j%2?22:8);}}
 }
 if(dead){const q=t-BOSS_HITS[2];for(let j=0;j<18;j++){const a=j*2.399,r=8+q*(18+j%5*6),xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r+q*q*29;rect(xx,yy,j%3===0?4:2,j%3===0?3:2,j%3===0?4:(j%2?23:22));}
  if(q<.55){const r=6+q*70;for(let j=0;j<32;j++){const a=j*Math.PI/16;rect(x+Math.cos(a)*r,y+Math.sin(a)*r*.75,1,1,j%2?22:23);}}
  if(q<.7)pixelText('+1000',73-Math.round(q*12),1,24);
 }
 if(t>=12.8&&t<17.9){panel(160,10,80,14,23);text('SENTINEL',164,15,7);for(let j=0;j<3;j++){const justLost=j===3-damage&&BOSS_HITS.some(hit=>t>=hit&&t<hit+.28);rect(205+j*10,16,7,3,j<3-damage?25:(justLost?24:3));}}
}
function exitPortal(t){
 if(t<18.35)return;
 const q=ease((t-18.35)/.4),cx=346,cy=140,rx=17*q,ry=32*q;
 if(rx<1)return;
 for(let y=-Math.floor(ry);y<=ry;y++){const dx=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-dx-1,cy+y,3,1,31);rect(cx+dx,cy+y,3,1,27);rect(cx-dx,cy+y,1,1,22);rect(cx+dx+1,cy+y,1,1,23);}
 for(let j=0;j<5;j++){const y=cy-24+((t*17+j*11)%48),dx=Math.round(Math.sin(t*2+j)*rx*.55);rect(cx+dx,y,1,3,j%2?31:27);}
 for(let j=0;j<8;j++){const a=t*1.8+j*Math.PI/4;rect(cx+Math.cos(a)*(rx+3),cy+Math.sin(a)*(ry+3),2,2,j%2?22:23);}
 rect(cx-19,173,39,1,22);
}
function panel(x,y,w,h,accent=22){
 rect(x,y,w,h,2);rect(x+1,y+1,w-2,h-2,1);rect(x+1,y,Math.min(16,w-2),1,accent);
}
function border(){rect(0,0,W,1,2);rect(0,H-1,W,1,2);rect(0,0,1,H,2);rect(W-1,0,1,H,2);}
function scene(n){p=new Uint8Array(W*H);const t=n/FPS,scroll=worldScroll(t),u=scroll/800,m=motion(t);
 rect(0,0,W,H,14);rect(0,91,W,42,13);rect(0,133,W,41,12);
 // Restrained twinkles and three parallax layers keep the night skyline alive.
 for(let j=0;j<37;j++){const x=(j*97+29)%W,y=29+(j*31)%71,bright=Math.sin(t*Math.PI/2+j)> .78;rect(x,y,1,1,bright?6:3);if(j%13===0&&bright){rect(x-1,y,3,1,4);rect(x,y-1,1,3,4);}}
 // One quiet shooting star in each complete loop.
 const streak=t-.6;if(streak>0&&streak<.65){const xx=Math.round(57+streak*124),yy=Math.round(31+streak*27);line(xx-12,yy-3,xx-5,yy-1,3);line(xx-4,yy-1,xx,yy,6);rect(xx,yy,2,1,8);}
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
 const sw=Math.round(22-m.height*.18);if(t<19.72)rect(playerX(t)+12-sw/2,GROUND-1,sw,1,1);
 for(let k=0;k<4;k++){
  const center=238+k*200-scroll,x=center-14;
  // Collect at the jump apex; the symbol disappears into a short pixel burst.
  const age=(PLAYER_X+12-center)/SPEED,kind=((k%4)+4)%4,y=112+Math.round(Math.sin(t*Math.PI)*2);
  if(age<0)token(center,y,kind);else if(age<.36)sparkle(PLAYER_X+12-age*28,112,age,kind);
 }
 powerUp(t);enemies(t);sentinel(t);exitPortal(t);
 if(t<18.55){dust(m.a,.46);dust(m.a,t<12&&Math.floor(t/2)%2===0?1.9:1.56);}
 if(t>=18.65&&t<19.72)dust(t%PERIOD,0,playerX(t));
 drawPlayer(GROUND-Math.round(m.height),t,m);pickupFlight(t);
 if(t>=19.72&&t<20)sparkle(346,143,t-19.72,0);
 if(t<1.1){const ink=t<.12||t>.98?3:(t<.22||t>.9?5:7);panel(147,32,106,18);pixelText('ROOFTOP RUN',38,1,ink);}
 if(t>=12.08&&t<12.95)pixelText('SENTINEL APPROACHING',43,1,25);
 // Light HUD: name, score and four collected symbols.
 panel(11,10,34,14);text('LUCA',18,15,22);
 const collected=Math.max(0,Math.min(4,Math.floor((t+1)/2))),defeated=ENCOUNTERS.filter(e=>e.type==='crawler'&&t>=e.at).length;
 text(String(collected*100+defeated*200+(t>=9?250:0)+(t>=17.6?1000:0)).padStart(4,'0'),53,15,24);
 panel(343,10,45,14,23);
 for(let j=0;j<4;j++)rect(350+j*9,15,5,5,j<collected?22+j:3);
 // A quiet progress line makes the longer adventure easy to follow.
 rect(11,203,378,1,2);rect(11,203,Math.floor(378*clamp(t/20)),1,22);
 border();
 return p;
}
// The same original bitmap alphabet used by the profile's typing header.
const LEVEL_FONT={
 A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'11111/00100/00100/00100/00100/00100/11111',J:'00111/00010/00010/00010/10010/10010/01100',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',P:'11110/10001/10001/11110/10000/10000/10000',Q:'01110/10001/10001/10001/10101/10010/01101',R:'11110/10001/10001/11110/10100/10010/10001',S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',V:'10001/10001/10001/10001/10001/01010/00100',W:'10001/10001/10001/10101/10101/10101/01010',X:'10001/10001/01010/00100/01010/10001/10001',Y:'10001/10001/01010/00100/00100/00100/00100',Z:'11111/00001/00010/00100/01000/10000/11111','-':'00000/00000/00000/11111/00000/00000/00000',' ':'00000/00000/00000/00000/00000/00000/00000'};
Object.assign(LEVEL_FONT,{'0':'01110/10001/10011/10101/11001/10001/01110','1':'00100/01100/00100/00100/00100/00100/01110','2':'01110/10001/00001/00010/00100/01000/11111','>':'10000/01000/00100/00010/00100/01000/10000','!':'00100/00100/00100/00100/00100/00000/00100','+':'00000/00100/00100/11111/00100/00100/00000'});
function pixelText(s,y,scale,color){
 let x=Math.round((W-(s.length*6-1)*scale)/2),index=0;
 for(const c of s){const ink=Array.isArray(color)?color[index]:color;
  LEVEL_FONT[c].split('/').forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='1')rect(x+i*scale,y+j*scale,scale,scale,ink);}));x+=6*scale;index++;
 }
}
function levelUp(n){
 // The completed skyline stays behind the results instead of changing worlds.
 // Map colours to a small fixed set so the backdrop stays quiet and lossless.
 const backdrop=scene(RUN_FRAMES-1),t=(n-RUN_FRAMES)/FPS;
 p=Uint8Array.from(backdrop,c=>c===14?14:(c===0||c===1||c===41?0:15));
 rect(1,1,W-2,26,14);
 panel(66,30,268,151);rect(67,31,266,149,14);
 rect(67,30,16,1,22);rect(317,180,16,1,23);
 pixelText('STAGE CLEAR',44,1,6);
 const lift=Math.round(3*(1-ease(t/.44)));
 pixelText('LEVEL UP',62+lift,3,22);
 pixelText('01 > 02',99,1,[7,7,7,23,7,22,22]);
 // A short fill and a single hop settle before the readable hold.
 rect(164,115,72,2,2);rect(164,115,Math.round(72*ease((t-.24)/.65)),2,22);
 const q=clamp((t-.32)/.48),hop=Math.round(Math.sin(q*Math.PI)*5);
 rect(185,169,31,1,1);character(187,169-hop,0,false,true);
 border();
 return p;
}
function iris(a,b,q,cx,cy){
 if(q<=0)return a;if(q>=1)return b;
 const radius=ease(q)*Math.max(Math.hypot(cx,cy),Math.hypot(W-cx,H-cy),Math.hypot(cx,H-cy),Math.hypot(W-cx,cy))+2;
 const out=new Uint8Array(a.length);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=Math.hypot(x-cx,y-cy),i=y*W+x;out[i]=d<radius?b[i]:a[i];if(Math.abs(d-radius)<.7)out[i]=3;}
 return out;
}
function frame(n){
 if(n<RUN_FRAMES)return scene(n);
 if(n>=FRAMES)return scene(0);
 const end=levelUp(n);
 if(n<RUN_FRAMES+20)return iris(scene(RUN_FRAMES-1),end,(n-RUN_FRAMES)/19,346,140);
 if(n>=FRAMES-25)return iris(end,scene(0),(n-(FRAMES-25))/24,200,104);
 return end;
}

function scale(a){let q=Buffer.alloc(W*S*H*S);for(let y=0;y<H*S;y++)for(let x=0;x<W*S;x++)q[y*W*S+x]=a[Math.floor(y/S)*W+Math.floor(x/S)];return q;}
function crc(buf){let c=-1;for(let b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(name,data){let b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(name,4);data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,-4)),b.length-4);return b;}
function png(a,w,h){let raw=Buffer.alloc((w+1)*h);for(let y=0;y<h;y++){raw[y*(w+1)]=0;Buffer.from(a.subarray(y*w,(y+1)*w)).copy(raw,y*(w+1)+1);}let ih=Buffer.alloc(13);ih.writeUInt32BE(w);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=3;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',Buffer.from(pal.flat())),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
// GIF89a, a fixed global palette, and GIF LZW. No lossy colour quantisation.
function lzw(a){let out=[],acc=0,bits=0,size=7,next=66,dict=new Map();const emit=v=>{acc|=v<<bits;bits+=size;while(bits>=8){out.push(acc&255);acc>>>=8;bits-=8;}};emit(64);let cur=a[0];for(let i=1;i<a.length;i++){let c=a[i],key=cur*64+c,v=dict.get(key);if(v!==undefined)cur=v;else{emit(cur);if(next<4096){dict.set(key,next++);if(next>(1<<size)&&size<12)size++;}else{emit(64);dict.clear();size=7;next=66;}cur=c;}}emit(cur);emit(65);if(bits)out.push(acc&255);let b=Buffer.from(out),blocks=[];for(let i=0;i<b.length;i+=255)blocks.push(Buffer.from([Math.min(255,b.length-i)]),b.subarray(i,i+255));return Buffer.concat([Buffer.from([6]),...blocks,Buffer.from([0])]);}
function main(){
 fs.mkdirSync('assets',{recursive:true});
 const a0=Buffer.from(frame(0)),a1=Buffer.from(frame(FRAMES-1));
 if(!a0.equals(a1))throw Error('Scene loop boundary differs');
 if(process.argv.includes('--preview'))for(const n of [0,25,30,35,40,62,70,76,137,450,640,675,700,710,715,795,880,940,970,980,985,1000,1005,1010,1019,1050,1130,1150,1160,1174]){
  fs.writeFileSync('assets/polish-check-'+n+'.png',png(scale(frame(n)),W*S,H*S));
 }
 if(process.argv.includes('--preview-only'))return;
 const width=W*S,height=H*S,transparent=63,head=Buffer.alloc(13);
 head.write('GIF89a');head.writeUInt16LE(width,6);head.writeUInt16LE(height,8);head[10]=0xd5;
 const parts=[head,Buffer.from(pal.flat()),Buffer.from([0x21,0xff,11]),Buffer.from('NETSCAPE2.0'),Buffer.from([3,1,0,0,0])];
 let previous;
 for(let n=0;n<FRAMES;n++){
  const a=scale(frame(n));if(a.includes(transparent))throw Error('Reserved transparent palette index used');
  if(n===70)fs.writeFileSync('assets/pixel-code-adventure-v13-still.png',png(a,width,height));
  let x0=0,y0=0,x1=width-1,y1=height-1;
  if(previous){
   x0=width;y0=height;x1=y1=0;
   for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(a[y*width+x]!==previous[y*width+x]){
    x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
   }
   if(x0>x1)x0=y0=x1=y1=0;
  }
  const ww=x1-x0+1,hh=y1-y0+1,crop=Buffer.alloc(ww*hh);
  // Retain every changed pixel exactly; unchanged pixels do not need re-encoding.
  for(let y=0;y<hh;y++)for(let x=0;x<ww;x++){
   const at=(y+y0)*width+x+x0;
   crop[y*ww+x]=previous&&a[at]===previous[at]?transparent:a[at];
  }
  const desc=Buffer.alloc(10);desc[0]=0x2c;desc.writeUInt16LE(x0,1);desc.writeUInt16LE(y0,3);desc.writeUInt16LE(ww,5);desc.writeUInt16LE(hh,7);
  parts.push(Buffer.from([0x21,0xf9,4,previous?5:4,2,0,transparent,0]),desc,lzw(crop));previous=a;
 }
 parts.push(Buffer.from([0x3b]));const gif=Buffer.concat(parts);
 fs.writeFileSync('assets/pixel-code-adventure-v13.gif',gif);
 console.log(JSON.stringify({frames:FRAMES,fps:FPS,seconds:FRAMES/FPS,width,height,bytes:gif.length,losslessDeltaFrames:true}));
}
main();

