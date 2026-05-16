import { useState, useEffect, useRef, useCallback } from “react”;

/* ═══════════════════════════════════════════════════════════════
BRICKWORLD — Mobile-First Game UI
Lyrīon Ltd · Co. No. 16825317
═══════════════════════════════════════════════════════════════ */

const COMPANY={name:“Lyrīon Ltd”,number:“16825317”,jurisdiction:“England and Wales”,address:“Milton Keynes, UK”,email:“legal@brickworld.xyz”,support:“hello@brickworld.xyz”,year:2026};

const injectFonts=()=>{if(document.getElementById(“bw-fonts”))return;const l=document.createElement(“link”);l.id=“bw-fonts”;l.rel=“stylesheet”;l.href=“https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap”;document.head.appendChild(l);};

const CSS=`
*{box-sizing:border-box;margin:0;padding:0}
html{overflow-x:hidden;width:100%;-webkit-text-size-adjust:100%}
body{background:#0d1117;color:#f0f0f0;font-family:‘Nunito’,sans-serif;overflow-x:hidden;width:100%;max-width:100vw}
:root{
–red:#E3000B;–red-d:#9e0007;
–yellow:#FFD700;–yellow-d:#b89600;
–blue:#1565C0;–blue-d:#0d3f7a;
–green:#00C853;–green-d:#007a33;
–orange:#FF6D00;–orange-d:#c45200;
–purple:#7B1FA2;–purple-d:#4a0d63;
–teal:#00897B;–teal-d:#005046;
–card:#161b22;–card2:#1c2128;
–border:rgba(255,255,255,.08);
–nav-h:60px;–bottom-h:66px;
–r:‘Fredoka One’,cursive;–b:‘Nunito’,sans-serif;
}
.page{width:100%;min-height:100vh;overflow-x:hidden;padding-bottom:var(–bottom-h)}
.wrap{width:100%;max-width:960px;margin:0 auto;padding:0 14px}
.wrap-sm{width:100%;max-width:600px;margin:0 auto;padding:0 14px}

/* GAME GRID — never overflows */
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.g-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(150px,calc(50% - 6px)),1fr));gap:10px}
.g-auto-lg{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(200px,calc(50% - 6px)),1fr));gap:12px}

/* BRICK BUTTON */
.bb{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:13px 22px;border:none;border-radius:8px;cursor:pointer;font-family:var(–b);font-weight:800;font-size:15px;letter-spacing:.2px;transition:transform .1s,box-shadow .1s;position:relative;user-select:none;text-align:center;-webkit-tap-highlight-color:transparent}
.bb::before{content:’’;position:absolute;top:4px;left:50%;transform:translateX(-50%);width:38%;height:5px;background:rgba(255,255,255,.2);border-radius:3px}
.bb:active{transform:translateY(3px)!important;box-shadow:none!important}
.bb-red{background:var(–red);color:#fff;box-shadow:0 5px 0 var(–red-d)}
.bb-red:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(–red-d)}
.bb-yellow{background:var(–yellow);color:#111;box-shadow:0 5px 0 var(–yellow-d)}
.bb-yellow:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(–yellow-d)}
.bb-green{background:var(–green);color:#fff;box-shadow:0 5px 0 var(–green-d)}
.bb-green:hover{transform:translateY(-2px);box-shadow:0 7px 0 var(–green-d)}
.bb-blue{background:var(–blue);color:#fff;box-shadow:0 5px 0 var(–blue-d)}
.bb-ghost{background:transparent;color:#f0f0f0;border:2px solid rgba(255,255,255,.25);box-shadow:none}
.bb-ghost:hover{border-color:var(–yellow);color:var(–yellow)}
.bb-full{width:100%;display:flex}

/* CARD */
.card{background:var(–card);border-radius:14px;border:2px solid var(–border);overflow:hidden;transition:transform .18s,border-color .18s}
.card:active{transform:scale(.97)}

/* PILL */
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;white-space:nowrap}

/* INPUT */
.inp{background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#f0f0f0;font-family:var(–b);font-size:14px;outline:none;transition:border-color .2s;width:100%}
.inp:focus{border-color:var(–yellow)}
.inp::placeholder{color:rgba(255,255,255,.3)}

/* PROGRESS BAR */
.prog-track{height:10px;background:rgba(255,255,255,.1);border-radius:5px;overflow:hidden;width:100%}
.prog-fill{height:100%;border-radius:5px;transition:width .6s cubic-bezier(.34,1.56,.64,1)}

/* ANIMS */
@keyframes pop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes bounce{0%,100%{transform:translateY(0)}45%{transform:translateY(-10px)}65%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px currentColor}50%{box-shadow:0 0 20px currentColor}}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
@keyframes confetti{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(60px) rotate(720deg);opacity:0}}
.pop{animation:pop .3s cubic-bezier(.34,1.56,.64,1) both}
.slideUp{animation:slideUp .35s ease both}

/* STUD TEXTURE */
.studs{background-image:radial-gradient(circle,rgba(255,255,255,.08) 2px,transparent 2px);background-size:22px 22px}
.studs-light{background-image:radial-gradient(circle,rgba(0,0,0,.07) 2px,transparent 2px);background-size:20px 20px}

/* SCROLLBAR */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#0d1117}
::-webkit-scrollbar-thumb{background:rgba(255,215,0,.3);border-radius:2px}

/* BOTTOM NAV */
.bnav{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(13,17,23,.97);backdrop-filter:blur(16px);border-top:2px solid rgba(255,255,255,.08);height:var(–bottom-h);display:flex;align-items:center;justify-content:space-around;padding:0 4px 6px;safe-area-inset-bottom:env(safe-area-inset-bottom)}
.bnav-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 12px;border:none;background:none;cursor:pointer;border-radius:12px;transition:all .15s;-webkit-tap-highlight-color:transparent;min-width:52px}
.bnav-item.active{background:rgba(255,215,0,.12)}
.bnav-icon{font-size:20px;line-height:1}
.bnav-label{font-size:10px;font-weight:800;font-family:var(–b);letter-spacing:.3px}

/* PAGE HEADER */
.page-header{padding:20px 14px 16px;position:relative;overflow:hidden}
.page-header h1{font-family:var(–r);font-size:clamp(22px,5vw,30px);line-height:1.1;margin-bottom:4px}
.page-header p{font-size:13px;color:rgba(255,255,255,.55);line-height:1.5}

/* SECTION */
.section{padding:16px 14px}
.section-title{font-family:var(–r);font-size:18px;margin-bottom:12px;display:flex;align-items:center;gap:8px}

/* XP BAR ALWAYS VISIBLE */
.xp-strip{background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06);padding:6px 14px;display:flex;align-items:center;gap:10px}

/* WONDER CARD */
.wonder-hero{height:100px;display:flex;align-items:center;justify-content:center;font-size:52px;position:relative;overflow:hidden}

/* LOCK OVERLAY */
.lock-overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;backdrop-filter:blur(2px)}

/* GLOBAL BUILD */
.globe-section{border-radius:16px;overflow:hidden;border:2px solid var(–border);margin-bottom:12px}

/* REWARD POPUP */
.reward{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;background:var(–yellow);color:#111;border-radius:20px;padding:24px 32px;text-align:center;pointer-events:none;max-width:calc(100vw - 40px)}
`;

/* ── TILE / ISO CONSTANTS ── */
const TW=46,TH=23,BH=18,GRID=14;

/* ── COLORS ── */
const COLORS=[
{name:“Classic Red”,hex:”#E3000B”},{name:“Bright Yellow”,hex:”#FFD700”},
{name:“Royal Blue”,hex:”#1565C0”},{name:“Lime Green”,hex:”#00C853”},
{name:“Bone White”,hex:”#F5F5F0”},{name:“Jet Black”,hex:”#1a1a1a”},
{name:“Bright Orange”,hex:”#FF6D00”},{name:“Deep Purple”,hex:”#7B1FA2”},
{name:“Sky Blue”,hex:”#64B5F6”},{name:“Hot Pink”,hex:”#E91E8C”},
{name:“Neon Green”,hex:”#AEEA00”},{name:“Sand Brown”,hex:”#C8973C”},
{name:“Teal”,hex:”#00897B”},{name:“Coral”,hex:”#FF5252”},
{name:“Forest Green”,hex:”#1B5E20”},{name:“Gold”,hex:”#FFC107”},
{name:“Silver”,hex:”#90A4AE”},{name:“Magenta”,hex:”#D500F9”},
{name:“Brick Tan”,hex:”#DEC28A”},{name:“Dark Red”,hex:”#B71C1C”},
];

/* ── NATURAL WONDERS (exclusive to BrickWorld) ── */
const WONDERS=[
{id:101,name:“Niagara Falls”,country:“USA / Canada”,emoji:“💧”,cat:“nature”,diff:2,pieces:980,price:0,free:true,color:”#4FC3F7”,
fact:“3,160 tonnes of water crash over these falls every second — enough to fill 1,400 swimming pools per minute.”,region:“Americas”},
{id:102,name:“Victoria Falls”,country:“Zimbabwe / Zambia”,emoji:“🌊”,cat:“nature”,diff:2,pieces:1120,price:0,free:true,color:”#26C6DA”,
fact:“Victoria Falls is the world’s largest waterfall by total area — twice the height of Niagara and one mile wide.”,region:“Africa”},
{id:103,name:“Idanre Hills”,country:“Nigeria”,emoji:“⛰️”,cat:“nature”,diff:3,pieces:1560,price:0,free:true,color:”#8D6E63”,
fact:“Rising 3,000ft above Ondo State, these sacred Yoruba hills have been home to ancient civilization for over 1,000 years.”,region:“Africa”},
{id:104,name:“Amazon Rainforest”,country:“Brazil”,emoji:“🌳”,cat:“nature”,diff:4,pieces:2200,price:0,free:true,color:”#2E7D32”,
fact:“The Amazon produces 20% of the world’s oxygen and is home to 10% of all species on Earth.”,region:“Americas”},
{id:105,name:“Grand Canyon”,country:“USA”,emoji:“🏜️”,cat:“nature”,diff:3,pieces:1840,price:0,free:true,color:”#BF360C”,
fact:“The Grand Canyon is 277 miles long, 18 miles wide, and over a mile deep — carved over 6 million years.”,region:“Americas”},
{id:106,name:“Northern Lights”,country:“Iceland / Norway”,emoji:“🌌”,cat:“nature”,diff:3,pieces:1350,price:0,free:true,color:”#7E57C2”,
fact:“The Aurora Borealis occurs when solar particles collide with Earth’s atmosphere at 45 million mph.”,region:“Europe”},
{id:107,name:“Mount Kilimanjaro”,country:“Tanzania”,emoji:“🏔️”,cat:“nature”,diff:4,pieces:2400,price:0,free:true,color:”#78909C”,
fact:“Kilimanjaro is the world’s tallest freestanding mountain — its glaciers have shrunk 85% since 1912.”,region:“Africa”},
{id:108,name:“Angel Falls”,country:“Venezuela”,emoji:“🌁”,cat:“nature”,diff:3,pieces:1200,price:0,free:true,color:”#FF7043”,
fact:“Angel Falls drops 3,212ft — 15 times higher than Niagara. Water turns to mist before reaching the bottom.”,region:“Americas”},
{id:109,name:“Sahara Desert”,country:“North Africa”,emoji:“🏜️”,cat:“nature”,diff:3,pieces:1600,price:0,free:true,color:”#F9A825”,
fact:“The Sahara is the world’s largest hot desert — nearly the size of the USA. Only 25% is sand; the rest is rock.”,region:“Africa”},
{id:110,name:“Great Barrier Reef”,country:“Australia”,emoji:“🐠”,cat:“nature”,diff:4,pieces:2800,price:0,free:true,color:”#00ACC1”,
fact:“The reef stretches 1,400 miles and can be seen from space. It’s home to 9,000 known species.”,region:“Oceania”},
{id:111,name:“Yellowstone”,country:“USA”,emoji:“🌋”,cat:“nature”,diff:3,pieces:1700,price:0,free:true,color:”#FF8F00”,
fact:“Yellowstone sits on a supervolcano that last erupted 640,000 years ago. It has more geysers than anywhere on Earth.”,region:“Americas”},
{id:112,name:“Mount Fuji”,country:“Japan”,emoji:“🗻”,cat:“nature”,diff:2,pieces:1100,price:0,free:true,color:”#78909C”,
fact:“Fuji last erupted in 1707. Its perfectly symmetrical cone shape has inspired Japanese art for centuries.”,region:“Asia”},
];

/* ── LANDMARKS ── */
const LANDMARKS=[
{id:1, name:“Great Pyramid”,    country:“Egypt”,       emoji:“🏔️”,cat:“landmark”,diff:3,pieces:1842,price:0,  free:true, color:”#C8963C”,fact:“Built 2560 BC using 2.3 million stone blocks. Each worker was paid in bread and beer.”},
{id:2, name:“Eiffel Tower”,     country:“France”,      emoji:“🗼”,cat:“landmark”,diff:3,pieces:1665,price:0,  free:true, color:”#9E9E9E”,fact:“The Eiffel Tower grows 6 inches taller in summer as the iron expands in heat.”},
{id:3, name:“Taj Mahal”,        country:“India”,       emoji:“🕌”,cat:“landmark”,diff:4,pieces:5923,price:0,  free:true, color:”#E0E0E0”,fact:“20,000 artisans worked 22 years. The marble appears white at dawn, gold at sunset.”},
{id:4, name:“Colosseum”,        country:“Italy”,       emoji:“🏟️”,cat:“landmark”,diff:4,pieces:9036,price:0, free:true, color:”#D4C5A9”,fact:“The Colosseum hosted 100 days of continuous games when it opened in 80 AD.”},
{id:5, name:“Machu Picchu”,     country:“Peru”,        emoji:“🏔️”,cat:“landmark”,diff:3,pieces:3082,price:0, free:true, color:”#558B2F”,fact:“Built 1450 AD by the Inca. The stones fit so precisely no mortar was needed.”},
{id:6, name:“Angkor Wat”,       country:“Cambodia”,    emoji:“🛕”,cat:“landmark”,diff:4,pieces:3122,price:0, free:true, color:”#A1887F”,fact:“Built in the 12th century, Angkor Wat is the world’s largest religious monument.”},
{id:7, name:“Sagrada Família”,  country:“Spain”,       emoji:“⛪”,cat:“landmark”,diff:5,pieces:9800,price:0, free:true, color:”#DEB887”,fact:“Gaudí started it in 1882. It’s still being built today — completion expected 2026.”},
{id:8, name:“Big Ben”,          country:“UK”,          emoji:“🕰️”,cat:“landmark”,diff:2,pieces:890, price:0, free:true, color:”#B0BEC5”,fact:“Big Ben is actually the name of the bell, not the tower. The tower is Elizabeth Tower.”},
{id:9, name:“Hogwarts Castle”,  country:“Fiction”,     emoji:“🏰”,cat:“premium”,  diff:4,pieces:6020,price:12.99,free:false,color:”#5D4037”,fact:“The filming location Alnwick Castle has 1,000 year old walls.”},
{id:10,name:“Burj Khalifa”,     country:“UAE”,         emoji:“🏙️”,cat:“premium”,  diff:3,pieces:1820,price:9.99, free:false,color:”#78909C”,fact:“At 828m, if you dropped a penny from the top it would take 14 seconds to land.”},
];

const ALL_SETS=[…WONDERS,…LANDMARKS];

/* ── RANKS ── */
const RANKS=[
{name:“New Builder”,  icon:“👶”,min:0,     color:”#9E9E9E”,tip:“Everyone starts somewhere!”},
{name:“Apprentice”,   icon:“🔨”,min:100,   color:”#A1887F”,tip:“Getting the hang of it”},
{name:“Bricksmith”,   icon:“⚒️”, min:300,  color:”#CD7F32”,tip:“Those snaps are satisfying”},
{name:“Artisan”,      icon:“🎨”,min:700,   color:”#9E9E9E”,tip:“Clean builds, clean mind”},
{name:“Foreman”,      icon:“🦺”,min:1500,  color:”#FFD700”,tip:“Others follow your lead”},
{name:“Architect”,    icon:“📐”,min:3000,  color:”#00C853”,tip:“You design, bricks obey”},
{name:“Master Builder”,icon:“🏗️”,min:6000,color:”#1565C0”,tip:“The real ones know”},
{name:“Legend”,       icon:“⭐”,min:12000, color:”#7B1FA2”,tip:“Hall of fame territory”},
{name:“Grand Master”, icon:“🏆”,min:25000, color:”#E3000B”,tip:“Bow down, builders”},
{name:“Minifig God”,  icon:“👑”,min:50000, color:”#FF6D00”,tip:“Your builds are worshipped”},
{name:“The Architect”,icon:“🌟”,min:100000,color:”#FFD700”,tip:“Legendary. Eternal.”},
];

/* ── GLOBAL BUILD — ONE WORLD ── */
const ONE_WORLD_REGIONS=[
{id:“af”,name:“Africa”,        emoji:“🌍”,color:”#F9A825”,bricks:284920,target:500000,contributors:12847,pct:57,locked:false},
{id:“eu”,name:“Europe”,        emoji:“🗺️”,color:”#1565C0”,bricks:198450,target:400000,contributors:9821, pct:50,locked:false},
{id:“as”,name:“Asia”,          emoji:“🌏”,color:”#C62828”,bricks:311200,target:600000,contributors:18432,pct:52,locked:false},
{id:“am”,name:“Americas”,      emoji:“🌎”,color:”#2E7D32”,bricks:156800,target:400000,contributors:7654, pct:39,locked:false},
{id:“oc”,name:“Oceania”,       emoji:“🏝️”,color:”#00897B”,bricks:87300, target:200000,contributors:3421, pct:44,locked:false},
{id:“an”,name:“Antarctica”,    emoji:“❄️”,color:”#78909C”,bricks:12400, target:100000,contributors:892,  pct:12,locked:true},
];

/* ── LEADERBOARD ── */
const LB=[
{rank:1,name:“MasterBrick_42”,flag:“🇯🇵”,xp:142580,streak:47,bricks:94210},
{rank:2,name:“LegoLegend_UK”, flag:“🇬🇧”,xp:138920,streak:33,bricks:87430},
{rank:3,name:“ArchitectPro”,  flag:“🇩🇪”,xp:125340,streak:28,bricks:79800},
{rank:4,name:“BrickQueen_NY”, flag:“🇺🇸”,xp:98760, streak:21,bricks:65320},
{rank:5,name:“ObiBuilder”,    flag:“🇳🇬”,xp:87430, streak:19,bricks:58900},
{rank:6,name:“TowerMaster”,   flag:“🇫🇷”,xp:76540, streak:15,bricks:51200},
{rank:7,name:“BrickNinja_JP”, flag:“🇯🇵”,xp:65890, streak:12,bricks:44100},
{rank:8,name:“Q_MK_Builder”,  flag:“🇬🇧”,xp:1250,  streak:3, bricks:890,isMe:true},
];

const SHOP_PLANS=[
{id:“free”,   name:“Free”,             price:0,    color:”#9E9E9E”,
features:[“6 free sets”,“12 colours”,“Community builds”,“Daily challenges”,“Global Build (3 bricks/day)”]},
{id:“builder”,name:“BrickPass Builder”,price:4.99, color:”#00C853”,popular:false,
features:[“30 sets per month”,“All 20 colours”,“50 bricks/day on Global Build”,“XP ×1.5”,“Save unlimited builds”,“Custom brick colours”]},
{id:“pro”,    name:“BrickPass Pro”,    price:9.99, color:”#FFD700”,popular:true,
features:[“Full vault: 200+ sets”,“Unlimited Global Build”,“Co-build rooms”,“All Natural Wonders”,“LDD export”,“XP ×2”,“Brick Scholar”,“BrickWorld Radio”]},
{id:“studio”, name:“BrickPass Studio”, price:24.99,color:”#E3000B”,
features:[“50-player team rooms”,“Analytics dashboard”,“Slack & Teams integration”,“White-label embed”,“Custom sets”,“Priority support”,“XP ×3”,“Branded rooms”]},
];

/* ── UTILS ── */
const hexRgb=h=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return{r,g,b}};
const brighter=(h,f)=>{const{r,g,b}=hexRgb(h);return`rgb(${Math.min(255,Math.round(r*f))},${Math.min(255,Math.round(g*f))},${Math.min(255,Math.round(b*f))})`};
const darker=(h,f)=>{const{r,g,b}=hexRgb(h);return`rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`};
const iso=(c,r,h,cx,cy)=>({x:cx+(c-r)*(TW/2),y:cy+(c+r)*(TH/2)-h*BH});
const toIso=(px,py,cx,cy)=>{const dx=px-cx,dy=py-cy,u=dx/TW+dy/TH,v=-dx/TW+dy/TH;return{col:Math.floor(u+.5),row:Math.floor(v+.5)}};
const stackH=(bricks,c,r)=>bricks.filter(b=>b.col===c&&b.row===r).length;
const getRank=xp=>RANKS.slice().reverse().find(r=>xp>=r.min)||RANKS[0];
const nextRank=xp=>{const i=RANKS.findIndex(r=>r===getRank(xp));return RANKS[i+1]||null};
const fmt=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(1)}K`:String(n);

/* ═══════════════════════════════════════════════════════════════
SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* Minifig character */
function Minifig({color=”#FFD700”,face=“😊”,size=48,style={}}){
return(
<div style={{position:“relative”,width:size,height:size*1.12,flexShrink:0,…style}}>
<div style={{position:“absolute”,top:0,left:“50%”,transform:“translateX(-50%)”,width:size*.36,height:size*.17,background:color,borderRadius:`${size*.18}px ${size*.18}px 0 0`,boxShadow:`inset 0 -2px 3px rgba(0,0,0,.2)`}}/>
<div style={{position:“absolute”,bottom:0,left:0,right:0,height:size*.95,background:color,borderRadius:`${size*.4}px ${size*.4}px ${size*.3}px ${size*.3}px`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:size*.42,boxShadow:`0 ${size*.05}px 0 rgba(0,0,0,.3)`}}>
{face}
</div>
</div>
);
}

/* Brick shape decorative */
function Brick({color=”#E3000B”,w=50,h=24,studs=2,style={}}){
return(
<div style={{position:“relative”,width:w,height:h+7,flexShrink:0,…style}}>
<div style={{position:“absolute”,bottom:0,left:0,width:w,height:h,background:darker(color,.75),borderRadius:4}}/>
<div style={{position:“absolute”,bottom:3,left:0,width:w,height:h,background:color,borderRadius:4,display:“flex”,alignItems:“flex-start”,justifyContent:“space-evenly”,paddingTop:3}}>
{Array.from({length:studs}).map((_,i)=>(
<div key={i} style={{width:h*.55,height:h*.32,background:brighter(color,1.2),borderRadius:h*.16,boxShadow:`0 -2px 0 rgba(0,0,0,.15)`}}/>
))}
</div>
</div>
);
}

/* XP Strip */
function XPStrip({xp}){
const r=getRank(xp),nr=nextRank(xp);
const pct=nr?Math.round(((xp-r.min)/(nr.min-r.min))*100):100;
return(
<div className="xp-strip">
<Minifig color={r.color} face={r.icon} size={28}/>
<div style={{flex:1,minWidth:0}}>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:11,fontWeight:800,marginBottom:3}}>
<span style={{color:r.color}}>{r.name}</span>
<span style={{color:“rgba(255,255,255,.4)”}}>{fmt(xp)} XP{nr&&` · ${fmt(nr.min-xp)} to ${nr.name}`}</span>
</div>
<div className="prog-track" style={{height:6}}>
<div className=“prog-fill” style={{width:`${pct}%`,background:`linear-gradient(90deg,${r.color},var(--yellow))`}}/>
</div>
</div>
</div>
);
}

/* Bottom Navigation */
function BottomNav({page,setPage}){
const tabs=[
{id:“home”,  icon:“🏠”,label:“Home”},
{id:“build”, icon:“🔨”,label:“Build”},
{id:“drop”,  icon:“🎁”,label:“Drop”},
{id:“rival”, icon:“⚔️”, label:“Rival”},
{id:“me”,    icon:“👤”,label:“Me”},
];
return(
<nav className="bnav">
{tabs.map(t=>(
<button key={t.id} className={`bnav-item${page===t.id?" active":""}`} onClick={()=>setPage(t.id)}>
<span className="bnav-icon">{t.icon}</span>
<span className=“bnav-label” style={{color:page===t.id?“var(–yellow)”:“rgba(255,255,255,.45)”}}>{t.label}</span>
</button>
))}
</nav>
);
}

/* Cookie Banner */
function CookieBanner({onAccept,setPage}){
return(
<div style={{position:“fixed”,bottom:66,left:0,right:0,zIndex:300,background:”#161b22”,borderTop:“2px solid rgba(255,215,0,.3)”,padding:“12px 14px”,display:“flex”,gap:10,alignItems:“center”,flexWrap:“wrap”,boxShadow:“0 -4px 20px rgba(0,0,0,.5)”}}>
<Minifig color="#FFD700" face="👀" size={36}/>
<div style={{flex:1,minWidth:200,fontSize:12,color:“rgba(255,255,255,.6)”,lineHeight:1.5}}>
🍪 We use essential & analytics cookies.{” “}
<button onClick={()=>setPage(“legal-cookies”)} style={{background:“none”,border:“none”,color:“var(–yellow)”,cursor:“pointer”,fontSize:12,fontWeight:800,padding:0}}>Cookie Policy</button>
{” “}· {COMPANY.name} · Co. {COMPANY.number}
</div>
<button onClick={onAccept} className=“bb bb-yellow” style={{fontSize:12,padding:“8px 16px”}}>Got it ✓</button>
</div>
);
}

/* Reward popup */
function Reward({msg,sub,onClose}){
return(
<div className=“pop reward” style={{boxShadow:“0 20px 60px rgba(0,0,0,.8)”}}>
<div style={{fontSize:52,marginBottom:8}}>🎉</div>
<div style={{fontFamily:“var(–r)”,fontSize:24,color:”#111”,marginBottom:4}}>{msg}</div>
<div style={{fontSize:14,color:“rgba(0,0,0,.6)”,marginBottom:16}}>{sub}</div>
<button className=“bb bb-red” onClick={onClose} style={{fontSize:14,padding:“10px 24px”}}>Let’s go! 🔨</button>
</div>
);
}

/* Set Card */
function SetCard({s,onClick}){
return(
<div className=“card” style={{cursor:“pointer”}} onClick={onClick}>
<div style={{height:80,background:`linear-gradient(135deg,${s.color}66,${s.color}22)`,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:40,position:“relative”,borderBottom:`2px solid ${s.color}33`}}>
{s.emoji}
<div style={{position:“absolute”,top:6,right:6}}>
{s.free
?<span className=“pill” style={{background:“rgba(0,200,83,.2)”,color:”#00C853”}}>FREE</span>
:<span className=“pill” style={{background:“rgba(255,215,0,.2)”,color:“var(–yellow)”}}>£{s.price}</span>
}
</div>
{s.cat===“nature”&&<div style={{position:“absolute”,top:6,left:6}}><span className=“pill” style={{background:“rgba(46,125,50,.8)”,color:”#fff”}}>🌿 Wild</span></div>}
</div>
<div style={{padding:“10px 12px”}}>
<div style={{fontFamily:“var(–r)”,fontSize:14,marginBottom:2,lineHeight:1.2}}>{s.name}</div>
<div style={{fontSize:10,color:“rgba(255,255,255,.4)”,marginBottom:6,lineHeight:1.4}}>{s.country||s.region}</div>
{s.fact&&<div style={{fontSize:10,color:“rgba(255,255,255,.5)”,lineHeight:1.5,marginBottom:6,fontStyle:“italic”}}>💡 {s.fact.slice(0,70)}…</div>}
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,fontSize:11,color:“rgba(255,255,255,.35)”,fontWeight:700}}>
<span>🧱 {fmt(s.pieces)}</span>
<span style={{color:s.color,letterSpacing:-2}}>{“★”.repeat(s.diff)}</span>
</div>
</div>
</div>
);
}

/* Footer */
function Footer({setPage}){
const lk=(p,l)=><span key={p} onClick={()=>setPage(p)} style={{color:“rgba(255,255,255,.35)”,fontSize:12,cursor:“pointer”,fontWeight:600,display:“block”,marginBottom:6}} onMouseEnter={e=>e.target.style.color=“var(–yellow)”} onMouseLeave={e=>e.target.style.color=“rgba(255,255,255,.35)”}>{l}</span>;
return(
<footer style={{background:”#080b10”,borderTop:“2px solid rgba(255,255,255,.05)”,padding:“32px 14px 20px”}}>
<div className="wrap">
<div style={{display:“grid”,gridTemplateColumns:“repeat(auto-fit,minmax(140px,1fr))”,gap:24,marginBottom:24}}>
<div>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:10}}>
<Brick color="#E3000B" w={26} h={13} studs={1}/>
<span style={{fontFamily:“var(–r)”,fontSize:18,color:“var(–yellow)”}}>BrickWorld</span>
</div>
<p style={{fontSize:11,color:“rgba(255,255,255,.3)”,lineHeight:1.7,marginBottom:10}}>Build. Learn. Compete. The world in bricks.</p>
<p style={{fontSize:10,color:“rgba(255,255,255,.18)”,lineHeight:1.7}}>{COMPANY.name}<br/>Co. No. {COMPANY.number}<br/>{COMPANY.jurisdiction}<br/>{COMPANY.address}</p>
</div>
<div>
<div style={{fontFamily:“var(–r)”,fontSize:13,color:“var(–yellow)”,marginBottom:10}}>Explore</div>
{[[“build”,“Build Engine”],[“vault”,“Set Vault”],[“world”,“Global Build”],[“ranks”,“Leaderboard”],[“education”,“Brick Scholar”],[“shop”,“BrickPass”]].map(([p,l])=>lk(p,l))}
</div>
<div>
<div style={{fontFamily:“var(–r)”,fontSize:13,color:“var(–yellow)”,marginBottom:10}}>Legal</div>
{[[“legal-privacy”,“Privacy Policy”],[“legal-terms”,“Terms of Service”],[“legal-cookies”,“Cookie Policy”],[“legal-refunds”,“Refund Policy”],[“legal-aup”,“Acceptable Use”]].map(([p,l])=>lk(p,l))}
</div>
<div>
<div style={{fontFamily:“var(–r)”,fontSize:13,color:“var(–yellow)”,marginBottom:10}}>Contact</div>
<div style={{fontSize:11,color:“rgba(255,255,255,.35)”,lineHeight:1.8,marginBottom:12}}>{COMPANY.support}<br/>{COMPANY.email}</div>
<div style={{fontSize:10,color:“rgba(255,255,255,.18)”,lineHeight:1.7,padding:“10px”,background:“rgba(255,255,255,.03)”,borderRadius:8}}>BrickWorld is independent. Not affiliated with the LEGO Group. LEGO® is a registered trademark of the LEGO Group.</div>
</div>
</div>
<div style={{borderTop:“1px solid rgba(255,255,255,.05)”,paddingTop:14,fontSize:10,color:“rgba(255,255,255,.18)”,display:“flex”,justifyContent:“space-between”,flexWrap:“wrap”,gap:8}}>
<span>© {COMPANY.year} {COMPANY.name}. All rights reserved. Co. No. {COMPANY.number}.</span>
<span>🇬🇧 UK · Payments by Stripe</span>
</div>
</div>
</footer>
);
}

/* ═══════════════════════════════════════════════════════════════
HOME PAGE — Game Lobby Feel
═══════════════════════════════════════════════════════════════ */
function HomePage({setPage,xp}){
const [bricks,setBricks]=useState(297841);
const [showReward,setShowReward]=useState(false);
const r=getRank(xp);
useEffect(()=>{const t=setInterval(()=>setBricks(n=>n+Math.floor(Math.random()*4+1)),1600);return()=>clearInterval(t);},[]);

return(
<div className=“page” style={{background:”#0d1117”}}>

```
  {/* HERO — full width, mobile first */}
  <div className="studs" style={{background:"linear-gradient(160deg,#1a0a00 0%,#2d1500 40%,#1a2500 100%)",padding:"28px 14px 24px",position:"relative",overflow:"hidden"}}>
    {/* Floating bricks decoration */}
    <div style={{position:"absolute",top:12,right:10,display:"flex",gap:6,opacity:.4,transform:"rotate(-8deg)"}}>
      {["#E3000B","#FFD700","#1565C0"].map((c,i)=><Brick key={i} color={c} w={36} h={18} studs={1} style={{transform:`rotate(${[-5,3,-7][i]}deg)`}}/>)}
    </div>

    {/* Mascots */}
    <div style={{display:"flex",gap:-4,marginBottom:16,alignItems:"flex-end"}}>
      <Minifig color="#E3000B"  face="😎" size={44} style={{transform:"rotate(-6deg)"}}/>
      <Minifig color="#FFD700" face="🤩" size={56} style={{marginLeft:-8,zIndex:2}}/>
      <Minifig color="#1565C0" face="😄" size={44} style={{transform:"rotate(5deg)",marginLeft:-8}}/>
      <Minifig color="#00C853" face="🤓" size={38} style={{transform:"rotate(-3deg)",marginLeft:-6,opacity:.8}}/>
    </div>

    <h1 style={{fontFamily:"var(--r)",fontSize:"clamp(28px,7vw,48px)",lineHeight:1.1,marginBottom:8}}>
      Build the World<br/><span style={{color:"var(--yellow)"}}>One Brick</span> at a Time
    </h1>
    <p style={{fontSize:14,color:"rgba(255,255,255,.6)",lineHeight:1.6,marginBottom:20,maxWidth:380}}>
      Stack iconic landmarks and natural wonders. Join 12,000+ builders worldwide. No download — just bricks.
    </p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <button className="bb bb-red" onClick={()=>setPage("build")} style={{fontSize:16,padding:"14px 24px"}}>🔨 Build Free Now</button>
      <button className="bb bb-ghost" onClick={()=>setPage("vault")} style={{fontSize:14,padding:"14px 18px"}}>📦 Browse Sets</button>
    </div>
  </div>

  {/* LIVE COUNTER STRIP */}
  <div style={{background:"var(--yellow)",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:"#E3000B",animation:"pulse 1.5s ease-in-out infinite"}}/>
      <span style={{fontFamily:"var(--r)",fontSize:16,color:"#111"}}>{fmt(bricks)} bricks placed today</span>
    </div>
    <div style={{display:"flex",gap:16}}>
      {[["12,847","online now"],["200+","free sets"],["7","continents"]].map(([v,l])=>(
        <div key={l} style={{textAlign:"center"}}>
          <div style={{fontFamily:"var(--r)",fontSize:16,color:"#111"}}>{v}</div>
          <div style={{fontSize:9,color:"rgba(0,0,0,.5)",fontWeight:800,textTransform:"uppercase"}}>{l}</div>
        </div>
      ))}
    </div>
  </div>

  {/* DAILY MISSION */}
  <div className="section">
    <div className="section-title">🎯 Daily Mission</div>
    <div style={{background:"linear-gradient(135deg,#2d1b00,#3d2600)",borderRadius:14,padding:16,border:"2px solid rgba(255,109,0,.4)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div>
          <div style={{fontFamily:"var(--r)",fontSize:18,marginBottom:4}}>"Build Victoria Falls"</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>⏱ 18h 42m remaining · 3,241 completed today</div>
        </div>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--r)",fontSize:22,color:"var(--yellow)"}}>+150</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:800}}>XP</div>
        </div>
      </div>
      <div className="prog-track" style={{marginBottom:10}}>
        <div className="prog-fill" style={{width:"68%",background:"linear-gradient(90deg,var(--orange),var(--yellow))"}}/>
      </div>
      <button className="bb bb-yellow bb-full" onClick={()=>setPage("build")} style={{fontSize:14}}>Start Mission →</button>
    </div>
  </div>

  {/* STREAK + QUICK STATS */}
  <div className="section" style={{paddingTop:0}}>
    <div className="g3" style={{gap:10}}>
      {[
        {label:"Your Streak",value:`${3}🔥`,sub:"days in a row",color:"var(--orange)",bg:"#2d1500"},
        {label:"Your Rank",value:r.icon,sub:r.name,color:r.color,bg:"#1a1a2e"},
        {label:"Bricks Placed",value:"890",sub:"all time",color:"var(--yellow)",bg:"#1a1500"},
      ].map(s=>(
        <div key={s.label} style={{background:s.bg,borderRadius:12,padding:"12px 10px",border:"2px solid rgba(255,255,255,.07)",textAlign:"center"}}>
          <div style={{fontFamily:"var(--r)",fontSize:22,color:s.color,marginBottom:2}}>{s.value}</div>
          <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.5}}>{s.sub}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.25)",marginTop:1}}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>

  {/* NATURAL WONDERS — the unique angle */}
  <div className="section" style={{paddingTop:0}}>
    <div className="section-title">🌿 Natural Wonders <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.4)"}}>— Exclusive to BrickWorld</span></div>
    <div style={{overflowX:"hidden"}}>
      <div className="g-auto">
        {WONDERS.slice(0,6).map(s=>(
          <SetCard key={s.id} s={s} onClick={()=>setPage("build")}/>
        ))}
      </div>
    </div>
    <button className="bb bb-green bb-full" onClick={()=>setPage("vault")} style={{marginTop:12,fontSize:14}}>See All {WONDERS.length} Wonders →</button>
  </div>

  {/* GLOBAL BUILD TEASER */}
  <div className="section" style={{paddingTop:0}}>
    <div style={{background:"linear-gradient(135deg,#0d1f3d,#1a0d3d)",borderRadius:16,padding:20,border:"2px solid rgba(123,31,162,.4)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.1}}>🌍</div>
      <div style={{fontFamily:"var(--r)",fontSize:22,marginBottom:6}}>🌍 One World — Global Build</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:14}}>
        Every country. Every continent. One massive collaborative build. 
        <strong style={{color:"var(--yellow)"}}> 56,929 builders have already placed their brick in history.</strong>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button className="bb bb-blue" onClick={()=>setPage("world")} style={{fontSize:14}}>🌍 Join the Build</button>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(255,255,255,.4)"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#00C853",animation:"pulse 1.5s infinite"}}/>
          Live build in progress
        </div>
      </div>
    </div>
  </div>

  {/* HOW IT WORKS */}
  <div className="section" style={{paddingTop:0}}>
    <div className="section-title">📖 How It Works</div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {[
        {n:1,icon:"🎨",title:"Pick a colour & set",desc:"Choose from 200+ sets — landmarks, natural wonders, premium builds. All free to start.",color:"var(--red)"},
        {n:2,icon:"👆",title:"Click to snap",desc:"Tap the grid and your brick clicks into place. Stack higher, build wider. Pure satisfaction.",color:"var(--yellow)"},
        {n:3,icon:"⭐",title:"Earn XP & rank up",desc:"Every brick = XP. Climb 11 ranks from New Builder to The Architect. Compete worldwide.",color:"var(--orange)"},
        {n:4,icon:"🌍",title:"Build with the world",desc:"Join One World — the biggest collaborative brick build in history. Your brick, forever.",color:"var(--purple)"},
      ].map(s=>(
        <div key={s.n} style={{display:"flex",gap:14,alignItems:"flex-start",background:"var(--card)",borderRadius:12,padding:14,border:"2px solid var(--border)"}}>
          <div style={{width:40,height:40,borderRadius:10,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--r)",fontSize:18,color:s.n===1||s.n===3?"#fff":"#111",flexShrink:0,boxShadow:`0 4px 0 rgba(0,0,0,.3)`}}>{s.n}</div>
          <div>
            <div style={{fontSize:16,marginBottom:4}}>{s.icon} <strong style={{fontFamily:"var(--r)"}}>{s.title}</strong></div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* RANK JOURNEY */}
  <div className="section" style={{paddingTop:0}}>
    <div className="section-title">🏆 Your Rank Journey</div>
    <div className="g-auto" style={{gridTemplateColumns:"repeat(auto-fill,minmax(min(80px,calc(25% - 8px)),1fr))"}}>
      {RANKS.map((rank,i)=>(
        <div key={rank.name} style={{background:"var(--card)",borderRadius:10,padding:"10px 6px",textAlign:"center",border:`2px solid ${rank.color}33`,opacity:i<2?1:i<5?.8:.5}}>
          <Minifig color={rank.color} face={rank.icon} size={32} style={{margin:"0 auto 4px"}}/>
          <div style={{fontFamily:"var(--r)",fontSize:9,color:rank.color,lineHeight:1.2}}>{rank.name}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,.25)",marginTop:2}}>{fmt(rank.min)} XP</div>
        </div>
      ))}
    </div>
  </div>

  {/* BRICKDROP TEASER */}
  <div className="section" style={{paddingTop:0}}>
    <div style={{background:"linear-gradient(135deg,#0a0a0a,#1a1000)",borderRadius:16,padding:18,border:"2px solid rgba(255,215,0,.3)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:10,right:14,fontFamily:"var(--r)",fontSize:48,opacity:.08}}>🎁</div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"var(--yellow)",animation:"pulse 1.2s infinite"}}/>
        <span style={{fontFamily:"var(--r)",fontSize:11,color:"var(--yellow)",textTransform:"uppercase",letterSpacing:2}}>Live Now</span>
      </div>
      <div style={{fontFamily:"var(--r)",fontSize:20,marginBottom:4}}>🎁 BrickDrop — Today's Mystery Set</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:12}}>A new mystery set drops every midnight. First 100 to complete it get a permanent gold badge. <strong style={{color:"var(--yellow)"}}>47 people have already started today's drop.</strong></div>
      <button className="bb bb-yellow bb-full" onClick={()=>setPage("drop")} style={{fontSize:14}}>🎁 See Today's Drop →</button>
    </div>
  </div>

  {/* BRICKRIVAL TEASER */}
  <div className="section" style={{paddingTop:0}}>
    <div style={{background:"linear-gradient(135deg,#1a0000,#0d0000)",borderRadius:16,padding:18,border:"2px solid rgba(227,0,11,.3)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:10,right:14,fontFamily:"var(--r)",fontSize:48,opacity:.08}}>⚔️</div>
      <div style={{fontFamily:"var(--r)",fontSize:20,marginBottom:4}}>⚔️ BrickRival — Challenge Anyone</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:8}}>Same set. 10 minutes. One winner. Challenge any builder on the leaderboard — their XP is yours if you win.</div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[{name:"ObiBuilder",flag:"🇳🇬"},{name:"TowerMaster",flag:"🇫🇷"},{name:"BrickQueen",flag:"🇺🇸"}].map(p=>(
          <div key={p.name} style={{flex:1,background:"rgba(255,255,255,.06)",borderRadius:8,padding:"8px 6px",textAlign:"center",border:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{fontSize:18,marginBottom:2}}>{p.flag}</div>
            <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.6)"}}>{p.name}</div>
          </div>
        ))}
      </div>
      <button className="bb bb-red bb-full" onClick={()=>setPage("rival")} style={{fontSize:14}}>⚔️ Enter the Arena →</button>
    </div>
  </div>

  {/* BRICKWORK TEASER */}
  <div className="section" style={{paddingTop:0}}>
    <div style={{background:"linear-gradient(135deg,#001a08,#1a1500)",borderRadius:16,padding:18,border:"2px solid rgba(0,200,83,.25)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:10,right:14,fontFamily:"var(--r)",fontSize:48,opacity:.08}}>🏢</div>
      <div style={{fontFamily:"var(--r)",fontSize:20,marginBottom:4}}>🏢 BrickWork — Team Building That Doesn't Suck</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:12}}>Your entire company builds one structure together — live. Every department gets a colour. There's a sabotage mode. The CEO places the final brick. From £99/session.</div>
      <button className="bb bb-green bb-full" onClick={()=>setPage("brickwork")} style={{fontSize:14}}>🏢 Book a Session →</button>
    </div>
  </div>

  {/* BIG CTA */}
  <div className="studs-light" style={{background:"var(--yellow)",padding:"36px 14px",textAlign:"center"}}>
    <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
      {["😄","🤩","😎"].map((f,i)=>
        <Minifig key={i} color={["#E3000B","#1565C0","#00C853"][i]} face={f} size={52} style={{animation:`bounce 2s ease-in-out infinite`,animationDelay:`${i*.25}s`}}/>
      )}
    </div>
    <h2 style={{fontFamily:"var(--r)",fontSize:"clamp(22px,5vw,32px)",color:"#111",marginBottom:8}}>Ready to build something legendary?</h2>
    <p style={{fontSize:14,color:"rgba(0,0,0,.55)",marginBottom:20,lineHeight:1.6}}>12,847 builders online right now. No account needed. Your first brick takes 3 seconds.</p>
    <button className="bb bb-red" onClick={()=>setPage("build")} style={{fontSize:17,padding:"15px 32px"}}>🔨 Start Building Free</button>
  </div>

  <Footer setPage={setPage}/>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
BUILD ENGINE
═══════════════════════════════════════════════════════════════ */
function BuildPage(){
const cvs=useRef(null);
const bRef=useRef([]);
const hRef=useRef([]);
const hvr=useRef(null);
const clrRef=useRef(0);
const toolRef=useRef(“place”);
const rAF=useRef(null);
const t0=useRef(Date.now());
const [clr,setClr]=useState(0);
const [tool,setTool]=useState(“place”);
const [layer,setLayer]=useState(0);
const layerRef=useRef(0);
const [cnt,setCnt]=useState(0);
const [xp,setXp]=useState(0);
const [secs,setSecs]=useState(0);
const [notif,setNotif]=useState(null);
const [panel,setPanel]=useState(false);
useEffect(()=>{clrRef.current=clr},[clr]);
useEffect(()=>{toolRef.current=tool},[tool]);
useEffect(()=>{layerRef.current=layer},[layer]);
const showN=m=>{setNotif(m);setTimeout(()=>setNotif(null),1800)};

const draw=useCallback(()=>{
const c=cvs.current;if(!c)return;
const x=c.getContext(“2d”);
const W=c.width,H=c.height;
x.clearRect(0,0,W,H);
const bg=x.createLinearGradient(0,0,0,H);bg.addColorStop(0,”#060a10”);bg.addColorStop(1,”#0d1520”);
x.fillStyle=bg;x.fillRect(0,0,W,H);
x.fillStyle=“rgba(255,255,255,.025)”;
for(let px=0;px<W;px+=20)for(let py=0;py<H;py+=20){x.beginPath();x.arc(px,py,1.5,0,Math.PI*2);x.fill();}
const cx=W/2,cy=H*.42;
for(let col=0;col<GRID;col++)for(let row=0;row<GRID;row++){
const{px:px2,py:py2}={px:0,py:0};
const p=iso(col,row,0,cx,cy);
const tw=TW/2,th=TH/2;
x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+tw,p.y+th);x.lineTo(p.x,p.y+TH);x.lineTo(p.x-tw,p.y+th);x.closePath();
x.fillStyle=“rgba(255,255,255,.025)”;x.fill();
x.strokeStyle=“rgba(255,215,0,.1)”;x.lineWidth=.5;x.stroke();
}
[…bRef.current].sort((a,b)=>(a.col+a.row)-(b.col+b.row)||a.h-b.h).forEach(b=>{
const p=iso(b.col,b.row,b.h,cx,cy);
const tw=TW/2,th=TH/2;
x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+tw,p.y+th);x.lineTo(p.x,p.y+TH);x.lineTo(p.x-tw,p.y+th);x.closePath();
x.fillStyle=brighter(b.c,1.25);x.fill();x.strokeStyle=“rgba(0,0,0,.2)”;x.lineWidth=.7;x.stroke();
x.beginPath();x.moveTo(p.x+tw,p.y+th);x.lineTo(p.x+tw,p.y+th+BH);x.lineTo(p.x,p.y+TH+BH);x.lineTo(p.x,p.y+TH);x.closePath();
x.fillStyle=darker(b.c,.72);x.fill();x.strokeStyle=“rgba(0,0,0,.2)”;x.lineWidth=.7;x.stroke();
x.beginPath();x.moveTo(p.x-tw,p.y+th);x.lineTo(p.x-tw,p.y+th+BH);x.lineTo(p.x,p.y+TH+BH);x.lineTo(p.x,p.y+TH);x.closePath();
x.fillStyle=darker(b.c,.52);x.fill();x.strokeStyle=“rgba(0,0,0,.2)”;x.lineWidth=.7;x.stroke();
x.beginPath();x.ellipse(p.x,p.y+th*.72,tw*.22,th*.22,0,0,Math.PI*2);x.fillStyle=brighter(b.c,1.5);x.fill();
});
if(hvr.current&&toolRef.current===“place”){
const{col,row}=hvr.current;
if(col>=0&&col<GRID&&row>=0&&row<GRID){
const h=stackH(bRef.current,col,row)+layerRef.current;
const p=iso(col,row,h,cx,cy);
const tw=TW/2,th=TH/2;
x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+tw,p.y+th);x.lineTo(p.x,p.y+TH);x.lineTo(p.x-tw,p.y+th);x.closePath();
x.fillStyle=“rgba(255,215,0,.35)”;x.fill();x.strokeStyle=“var(–yellow)”;x.lineWidth=2;x.stroke();
}
}
},[]);

useEffect(()=>{
const c=cvs.current;if(!c)return;
const resize=()=>{const p=c.parentElement;if(!p)return;c.width=p.clientWidth;c.height=p.clientHeight;draw();};
resize();
const obs=new ResizeObserver(resize);c.parentElement&&obs.observe(c.parentElement);
rAF.current=requestAnimationFrame(function loop(){draw();rAF.current=requestAnimationFrame(loop);});
const ti=setInterval(()=>setSecs(Math.floor((Date.now()-t0.current)/1000)),1000);
const onKey=e=>{
if(e.key===“p”||e.key===“P”){setTool(“place”);toolRef.current=“place”;}
if(e.key===“d”||e.key===“D”){setTool(“erase”);toolRef.current=“erase”;}
if((e.ctrlKey||e.metaKey)&&e.key===“z”){e.preventDefault();if(hRef.current.length){bRef.current=hRef.current.pop();setCnt(bRef.current.length);}}
};
window.addEventListener(“keydown”,onKey);
return()=>{cancelAnimationFrame(rAF.current);clearInterval(ti);obs.disconnect();window.removeEventListener(“keydown”,onKey);};
},[draw]);

const pos=e=>{
const c=cvs.current;if(!c)return null;
const rect=c.getBoundingClientRect();
const cl=e.touches?e.touches[0].clientX:e.clientX;
const ct=e.touches?e.touches[0].clientY:e.clientY;
const sx=c.width/rect.width,sy=c.height/rect.height;
return toIso((cl-rect.left)*sx,(ct-rect.top)*sy,c.width/2,c.height*.42);
};
const onMove=e=>{const p=pos(e);if(p)hvr.current={col:p.col,row:p.row};};
const onTap=e=>{
const p=pos(e);if(!p)return;
const{col,row}=p;
if(col<0||col>=GRID||row<0||row>=GRID)return;
if(toolRef.current===“place”){
hRef.current.push(bRef.current.map(b=>({…b})));
if(hRef.current.length>40)hRef.current.shift();
bRef.current=[…bRef.current,{col,row,h:stackH(bRef.current,col,row)+layerRef.current,c:COLORS[clrRef.current].hex}];
const n=bRef.current.length;setCnt(n);setXp(x=>x+5);
if(n===1)showN(“🧱 First brick! You’re a builder now!”);
else if(n%10===0)showN(`🔥 ${n} bricks! +${n/2} XP bonus!`);
} else {
const idx=[…bRef.current].map((b,i)=>({b,i})).filter(({b})=>b.col===col&&b.row===row).pop()?.i;
if(idx!=null){hRef.current.push(bRef.current.map(b=>({…b})));bRef.current=bRef.current.filter((_,i)=>i!==idx);setCnt(c=>c-1);}
}
};
const ft=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const face=cnt===0?“😴”:cnt<5?“🙂”:cnt<20?“😄”:cnt<50?“🤩”:“🔥”;

return(
<div style={{height:“100vh”,display:“flex”,flexDirection:“column”,background:”#060a10”,overflow:“hidden”}}>
{/* Top HUD */}
<div style={{background:”#0d1117”,borderBottom:“2px solid rgba(255,255,255,.07)”,padding:“8px 12px”,display:“flex”,alignItems:“center”,gap:12,flexShrink:0}}>
<Minifig color={COLORS[clr].hex} face={face} size={36}/>
<div style={{display:“flex”,gap:12,flex:1,justifyContent:“space-around”,minWidth:0}}>
{[[“🧱”,cnt,“Bricks”],[“⚡”,xp,“XP”],[“⏱”,ft(secs),“Time”]].map(([ic,v,l])=>(
<div key={l} style={{textAlign:“center”}}>
<div style={{fontFamily:“var(–r)”,fontSize:16,color:“var(–yellow)”}}>{v}</div>
<div style={{fontSize:9,color:“rgba(255,255,255,.4)”,textTransform:“uppercase”,letterSpacing:.5}}>{ic} {l}</div>
</div>
))}
</div>
<button onClick={()=>setPanel(p=>!p)} style={{background:“rgba(255,255,255,.1)”,border:“none”,borderRadius:8,padding:“6px 10px”,color:”#fff”,cursor:“pointer”,fontSize:12,fontWeight:700,fontFamily:“var(–b)”}}>
{panel?“✕”:“⚙️”}
</button>
</div>

```
  {/* Canvas area */}
  <div style={{flex:1,position:"relative",overflow:"hidden"}}>
    <canvas ref={cvs} style={{display:"block",width:"100%",height:"100%",touchAction:"none",cursor:tool==="erase"?"crosshair":"cell"}}
      onMouseMove={onMove} onMouseLeave={()=>{hvr.current=null;}} onClick={onTap}
      onTouchStart={onTap} onTouchMove={e=>{e.preventDefault();onMove(e);}}/>
    {/* notification */}
    {notif&&<div className="pop" style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",background:"var(--yellow)",color:"#111",fontFamily:"var(--r)",fontSize:18,padding:"12px 24px",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,.6)",pointerEvents:"none",whiteSpace:"nowrap",zIndex:10}}>{notif}</div>}
    {/* Guide */}
    <div style={{position:"absolute",bottom:8,left:8,background:"rgba(6,10,16,.8)",borderRadius:8,padding:"6px 10px",fontSize:10,color:"rgba(255,255,255,.4)",pointerEvents:"none",backdropFilter:"blur(6px)"}}>
      {face} {cnt===0?"Tap the grid to place your first brick!":cnt<5?"Keep going!":cnt<20?"You're on a roll! 🔥":"Building legend! ⭐"}
    </div>
  </div>

  {/* Slide-up panel */}
  {panel&&(
    <div style={{background:"#0d1117",borderTop:"2px solid rgba(255,255,255,.1)",padding:"12px",flexShrink:0,maxHeight:"55vh",overflowY:"auto"}}>
      {/* Tool row */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[["place","🔨 Place"],["erase","🗑 Erase"]].map(([t,lb])=>(
          <button key={t} onClick={()=>setTool(t)} style={{flex:1,background:tool===t?"rgba(255,215,0,.15)":"rgba(255,255,255,.05)",border:`2px solid ${tool===t?"var(--yellow)":"rgba(255,255,255,.1)"}`,borderRadius:8,padding:"10px",color:tool===t?"var(--yellow)":"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"var(--b)",fontSize:13,fontWeight:800}}>{lb}</button>
        ))}
        <button onClick={()=>{if(hRef.current.length){bRef.current=hRef.current.pop();setCnt(bRef.current.length);}}} style={{flex:1,background:"rgba(255,255,255,.05)",border:"2px solid rgba(255,255,255,.1)",borderRadius:8,padding:"10px",color:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"var(--b)",fontSize:13,fontWeight:800}}>↩ Undo</button>
        <button onClick={()=>{bRef.current=[];hRef.current=[];setCnt(0);}} style={{flex:1,background:"rgba(227,0,11,.1)",border:"2px solid rgba(227,0,11,.25)",borderRadius:8,padding:"10px",color:"#ff4d4d",cursor:"pointer",fontFamily:"var(--b)",fontSize:13,fontWeight:800}}>🗑 Clear</button>
      </div>
      {/* Layer */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Layer Height</div>
        <div style={{display:"flex",gap:6}}>
          {[0,1,2,3,4,5].map(l=>(
            <button key={l} onClick={()=>{setLayer(l);layerRef.current=l;}} style={{flex:1,height:36,borderRadius:7,fontWeight:800,fontSize:13,cursor:"pointer",border:"none",background:layer===l?"var(--yellow)":"rgba(255,255,255,.07)",color:layer===l?"#111":"rgba(255,255,255,.5)"}}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {/* Colour grid */}
      <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Colour — {COLORS[clr].name}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {COLORS.map((c,i)=>(
          <button key={i} title={c.name} onClick={()=>setClr(i)} style={{width:32,height:32,borderRadius:"50%",background:c.hex,border:clr===i?"3px solid #fff":"3px solid transparent",cursor:"pointer",transform:clr===i?"scale(1.3)":"scale(1)",transition:"all .14s",boxShadow:clr===i?`0 0 10px ${c.hex}cc`:"none"}}/>
        ))}
      </div>
    </div>
  )}
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
VAULT PAGE
═══════════════════════════════════════════════════════════════ */
function VaultPage({setPage}){
const [cat,setCat]=useState(“all”);
const [q,setQ]=useState(””);
const cats=[
{id:“all”,label:“All Sets”,icon:“📦”},
{id:“nature”,label:“Natural Wonders”,icon:“🌿”},
{id:“landmark”,label:“Landmarks”,icon:“🏛️”},
{id:“premium”,label:“Premium”,icon:“⭐”},
{id:“free”,label:“Free Only”,icon:“🆓”},
];
const filtered=ALL_SETS.filter(s=>{
const mc=cat===“all”||(cat===“free”?s.free:s.cat===cat);
const ms=!q||s.name.toLowerCase().includes(q.toLowerCase())||s.country?.toLowerCase().includes(q.toLowerCase());
return mc&&ms;
});
return(
<div className=“page” style={{background:”#0d1117”}}>
{/* Header */}
<div style={{background:“linear-gradient(135deg,#001a0d,#002d1a)”,padding:“24px 14px 0”,borderBottom:“2px solid rgba(0,200,83,.15)”}}>
<div className="wrap">
<div style={{display:“flex”,alignItems:“center”,gap:10,marginBottom:12}}>
<Brick color="#00C853" w={28} h={14} studs={2}/>
<h1 style={{fontFamily:“var(–r)”,fontSize:24,color:”#f0f0f0”}}>The Vault</h1>
</div>
<p style={{fontSize:13,color:“rgba(255,255,255,.5)”,marginBottom:14}}>🌿 {WONDERS.length} natural wonders + {LANDMARKS.length} landmarks. Historically accurate, endlessly satisfying.</p>
<input className=“inp” placeholder=“🔍 Search by name or country…” value={q} onChange={e=>setQ(e.target.value)} style={{marginBottom:14}}/>
{/* Category tabs — scroll on mobile */}
<div style={{display:“flex”,gap:6,overflowX:“auto”,paddingBottom:12,scrollbarWidth:“none”}}>
{cats.map(c=>(
<button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?“var(–green)”:“rgba(255,255,255,.07)”,color:cat===c.id?”#fff”:“rgba(255,255,255,.6)”,border:“none”,borderRadius:20,padding:“8px 16px”,cursor:“pointer”,fontFamily:“var(–b)”,fontSize:12,fontWeight:800,whiteSpace:“nowrap”,transition:“all .15s”,flexShrink:0}}>
{c.icon} {c.label}
</button>
))}
</div>
</div>
</div>

```
  <div className="section" style={{paddingTop:16}}>
    <div className="wrap">
      {filtered.length===0?(
        <div style={{textAlign:"center",padding:"48px 0"}}>
          <Minifig color="#9E9E9E" face="🤔" size={56} style={{margin:"0 auto 12px"}}/>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:15}}>Nothing found for "{q}"</p>
        </div>
      ):(
        <>
          <div style={{fontSize:12,color:"rgba(255,255,255,.35)",fontWeight:700,marginBottom:10}}>{filtered.length} sets found</div>
          <div className="g-auto">
            {filtered.map(s=><SetCard key={s.id} s={s} onClick={()=>setPage("build")}/>)}
          </div>
        </>
      )}
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
GLOBAL BUILD — ONE WORLD
═══════════════════════════════════════════════════════════════ */
function WorldPage({setPage}){
const [active,setActive]=useState(“af”);
const reg=ONE_WORLD_REGIONS.find(r=>r.id===active);
const total=ONE_WORLD_REGIONS.reduce((s,r)=>s+r.bricks,0);
const totalTarget=ONE_WORLD_REGIONS.reduce((s,r)=>s+r.target,0);
return(
<div className=“page” style={{background:”#0d1117”}}>
{/* Hero */}
<div className=“studs” style={{background:“linear-gradient(160deg,#050d1f,#0d1535,#1a0935)”,padding:“24px 14px 20px”,borderBottom:“2px solid rgba(123,31,162,.3)”}}>
<div className="wrap-sm">
<div style={{fontFamily:“var(–r)”,fontSize:11,color:“var(–purple)”,textTransform:“uppercase”,letterSpacing:2,marginBottom:8}}>The World’s Biggest Brick Build</div>
<h1 style={{fontFamily:“var(–r)”,fontSize:“clamp(26px,6vw,40px)”,lineHeight:1.1,marginBottom:12}}>
🌍 One World<br/><span style={{color:“var(–yellow)”}}>Build it Together</span>
</h1>
<p style={{fontSize:13,color:“rgba(255,255,255,.55)”,lineHeight:1.6,marginBottom:16}}>
Six continents. One collaborative build. Builders from every country are constructing a brick replica of planet Earth — in real time.
<strong style={{color:“var(–cream)”}}> Your brick stays here forever.</strong>
</p>
{/* Total progress */}
<div style={{background:“rgba(255,255,255,.05)”,borderRadius:12,padding:14,marginBottom:12,border:“2px solid rgba(123,31,162,.25)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:6}}>
<div style={{fontFamily:“var(–r)”,fontSize:16,color:“var(–yellow)”}}>Global Progress</div>
<div style={{fontFamily:“var(–r)”,fontSize:16,color:“var(–purple)”}}>{Math.round(total/totalTarget*100)}%</div>
</div>
<div className="prog-track" style={{marginBottom:6}}>
<div className=“prog-fill” style={{width:`${Math.round(total/totalTarget*100)}%`,background:“linear-gradient(90deg,var(–purple),var(–blue),var(–green))”}}/>
</div>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:11,color:“rgba(255,255,255,.4)”,fontWeight:700}}>
<span>{fmt(total)} bricks placed</span>
<span>by {fmt(ONE_WORLD_REGIONS.reduce((s,r)=>s+r.contributors,0))} builders worldwide</span>
</div>
</div>
</div>
</div>

```
  <div className="section">
    <div className="wrap-sm">
      {/* Continent grid */}
      <div className="section-title">Choose Your Continent</div>
      <div className="g2" style={{marginBottom:20}}>
        {ONE_WORLD_REGIONS.map(r=>(
          <div key={r.id} onClick={()=>!r.locked&&setActive(r.id)} style={{background:r.id===active?`${r.color}22`:"var(--card)",borderRadius:12,border:`2px solid ${r.id===active?r.color:"var(--border)"}`,padding:"12px",cursor:r.locked?"default":"pointer",transition:"all .18s",position:"relative",opacity:r.locked?.6:1}}>
            {r.locked&&(
              <div className="lock-overlay" style={{borderRadius:10}}>
                <div style={{fontSize:22}}>🔒</div>
                <div style={{fontFamily:"var(--r)",fontSize:12,color:"#fff"}}>Coming Soon</div>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:22}}>{r.emoji}</span>
                <span style={{fontFamily:"var(--r)",fontSize:14}}>{r.name}</span>
              </div>
              <span style={{fontFamily:"var(--r)",fontSize:16,color:r.color}}>{r.pct}%</span>
            </div>
            <div className="prog-track" style={{height:6}}>
              <div className="prog-fill" style={{width:`${r.pct}%`,background:r.color}}/>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)",fontWeight:700,marginTop:4}}>{fmt(r.contributors)} builders</div>
          </div>
        ))}
      </div>

      {/* Active region detail */}
      {reg&&!reg.locked&&(
        <div style={{background:`linear-gradient(135deg,${reg.color}18,${reg.color}08)`,borderRadius:16,padding:20,border:`2px solid ${reg.color}44`,marginBottom:16}}>
          <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
            <span style={{fontSize:48}}>{reg.emoji}</span>
            <div>
              <div style={{fontFamily:"var(--r)",fontSize:22,marginBottom:4}}>{reg.name} Section</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[[fmt(reg.bricks),"Bricks"],[fmt(reg.target),"Target"],[fmt(reg.contributors),"Builders"],[`${reg.pct}%`,"Done"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:"var(--r)",fontSize:20,color:reg.color}}>{v}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1,fontWeight:800}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="prog-track" style={{marginBottom:6,height:12}}>
            <div className="prog-fill" style={{width:`${reg.pct}%`,background:`linear-gradient(90deg,${reg.color},${brighter(reg.color,1.3)})`}}/>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",fontWeight:700,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
            <span>{fmt(reg.bricks)} placed</span><span>{fmt(reg.target-reg.bricks)} remaining</span>
          </div>
          <button className="bb bb-yellow bb-full" onClick={()=>setPage("build")} style={{marginBottom:10,fontSize:15}}>
            🧱 Add My Brick to {reg.name}
          </button>
          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",textAlign:"center"}}>Free tier: 3 bricks/day · BrickPass Pro: unlimited</div>
        </div>
      )}

      {/* Recent contributors */}
      <div style={{background:"var(--card)",borderRadius:14,padding:14,border:"2px solid var(--border)"}}>
        <div style={{fontFamily:"var(--r)",fontSize:16,marginBottom:10}}>🌟 Recent Contributors</div>
        {[
          {name:"ObiBuilder",flag:"🇳🇬",region:"Africa",bricks:42,ago:"2m ago"},
          {name:"MasterBrick_42",flag:"🇯🇵",region:"Asia",bricks:150,ago:"5m ago"},
          {name:"Q_MK_Builder",flag:"🇬🇧",region:"Europe",bricks:3,ago:"12m ago"},
          {name:"BrickQueen_NY",flag:"🇺🇸",region:"Americas",bricks:87,ago:"18m ago"},
        ].map((c,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid rgba(255,255,255,.05)":"none"}}>
            <span style={{fontSize:18}}>{c.flag}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:13}}>{c.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>→ {c.region} · {c.ago}</div>
            </div>
            <div style={{fontFamily:"var(--r)",fontSize:14,color:"var(--yellow)"}}>+{c.bricks} 🧱</div>
          </div>
        ))}
      </div>
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
RANKS / LEADERBOARD PAGE
═══════════════════════════════════════════════════════════════ */
function RanksPage({xp,setPage}){
const [tab,setTab]=useState(“global”);
const r=getRank(xp);
return(
<div className=“page” style={{background:”#0d1117”}}>
<div style={{background:“linear-gradient(135deg,#1a1200,#2d2000)”,padding:“24px 14px 0”,borderBottom:“2px solid rgba(255,215,0,.2)”}}>
<div className="wrap-sm">
<div style={{display:“flex”,gap:12,alignItems:“center”,marginBottom:12}}>
<Brick color="#FFD700" w={28} h={14} studs={2}/>
<h1 style={{fontFamily:“var(–r)”,fontSize:24}}>Global Ranks</h1>
</div>
{/* My rank card */}
<div style={{background:“rgba(255,215,0,.1)”,borderRadius:14,padding:14,border:“2px solid rgba(255,215,0,.3)”,marginBottom:0}}>
<div style={{display:“flex”,gap:12,alignItems:“center”}}>
<Minifig color={r.color} face={r.icon} size={52}/>
<div style={{flex:1,minWidth:0}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:3}}>
<span style={{fontFamily:“var(–r)”,fontSize:18,color:r.color}}>{r.name}</span>
<span style={{fontSize:18}}>🇬🇧</span>
</div>
<div style={{fontSize:11,color:“rgba(255,255,255,.45)”,fontStyle:“italic”,marginBottom:6}}>”{r.tip}”</div>
<div className="prog-track" style={{height:7}}>
<div className=“prog-fill” style={{width:`${nextRank(xp)?Math.round(((xp-r.min)/(nextRank(xp).min-r.min))*100):100}%`,background:`linear-gradient(90deg,${r.color},var(--yellow))`}}/>
</div>
<div style={{fontSize:10,color:“rgba(255,255,255,.4)”,marginTop:3}}>
{fmt(xp)} XP · {nextRank(xp)?`${fmt(nextRank(xp).min-xp)} to ${nextRank(xp).name}`:“Max rank!”}
</div>
</div>
</div>
</div>
{/* Tabs */}
<div style={{display:“flex”,gap:6,paddingTop:14,paddingBottom:0}}>
{[“global”,“weekly”,“friends”].map(t=>(
<button key={t} onClick={()=>setTab(t)} style={{background:tab===t?“var(–yellow)”:“rgba(255,255,255,.07)”,color:tab===t?”#111”:“rgba(255,255,255,.6)”,border:“none”,borderRadius:20,padding:“7px 16px”,cursor:“pointer”,fontFamily:“var(–b)”,fontSize:12,fontWeight:800,textTransform:“capitalize”,flex:1,transition:“all .15s”}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
))}
</div>
</div>
</div>

```
  <div className="section">
    <div className="wrap-sm">
      {/* Podium */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:8,marginBottom:20}}>
        {[LB[1],LB[0],LB[2]].map((p,idx)=>{
          const mc=["#C0C0C0","#FFD700","#CD7F32"][idx];
          const ht=[130,160,110];
          return(
            <div key={p.rank} style={{flex:1,maxWidth:180,textAlign:"center"}}>
              <Minifig color={mc} face={["🥈","🥇","🥉"][idx]} size={46} style={{margin:"0 auto 4px"}}/>
              <div style={{fontWeight:800,fontSize:12,marginBottom:1}}>{p.name}</div>
              <div style={{fontSize:11,color:mc,fontWeight:800,marginBottom:6}}>{fmt(p.xp)} XP</div>
              <div style={{height:ht[idx],background:`${mc}22`,border:`2px solid ${mc}66`,borderRadius:"10px 10px 0 0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                <div style={{fontFamily:"var(--r)",fontSize:28,color:mc}}>#{[2,1,3][idx]}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:700}}>🔥 {p.streak}d</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {LB.slice(3).map(p=>{
          const pr=getRank(p.xp);
          return(
            <div key={p.rank} style={{background:p.isMe?"rgba(255,215,0,.07)":"var(--card)",borderRadius:12,border:`2px solid ${p.isMe?"rgba(255,215,0,.3)":"var(--border)"}`,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"var(--r)",fontSize:16,color:"rgba(255,255,255,.25)",width:24,textAlign:"center",flexShrink:0}}>#{p.rank}</span>
              <span style={{fontSize:20,flexShrink:0}}>{p.flag}</span>
              <Minifig color={pr.color} face={pr.icon} size={34} style={{flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:13,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span>{p.name}</span>
                  {p.isMe&&<span className="pill" style={{background:"var(--yellow)",color:"#111"}}>YOU</span>}
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>{pr.icon} {pr.name}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"var(--r)",fontSize:14,color:"var(--yellow)"}}>{fmt(p.xp)} XP</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>🔥 {p.streak}d</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
ME / PROFILE PAGE
═══════════════════════════════════════════════════════════════ */
function MePage({xp,setPage}){
const r=getRank(xp),nr=nextRank(xp);
const pct=nr?Math.round(((xp-r.min)/(nr.min-r.min))*100):100;
return(
<div className=“page” style={{background:”#0d1117”}}>
{/* Hero */}
<div className=“studs” style={{background:“linear-gradient(135deg,#0d1117,#1a1f2e)”,padding:“24px 14px 20px”,borderBottom:“2px solid rgba(255,255,255,.07)”}}>
<div className="wrap-sm">
<div style={{display:“flex”,gap:16,alignItems:“center”,marginBottom:16}}>
<Minifig color={r.color} face={r.icon} size={72} style={{flexShrink:0}}/>
<div style={{flex:1,minWidth:0}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:4,flexWrap:“wrap”}}>
<h1 style={{fontFamily:“var(–r)”,fontSize:22}}>Q_MK_Builder</h1>
<span style={{fontSize:20}}>🇬🇧</span>
</div>
<div style={{display:“flex”,gap:6,flexWrap:“wrap”,marginBottom:8}}>
<span className=“pill” style={{background:`${r.color}33`,color:r.color}}>{r.icon} {r.name}</span>
<span className=“pill” style={{background:“rgba(0,200,83,.15)”,color:”#00C853”}}>Builder Plan</span>
<span className=“pill” style={{background:“rgba(255,109,0,.15)”,color:“var(–orange)”}}>🔥 3-day streak</span>
</div>
<div className="prog-track" style={{marginBottom:4}}>
<div className=“prog-fill” style={{width:`${pct}%`,background:`linear-gradient(90deg,${r.color},var(--yellow))`}}/>
</div>
<div style={{fontSize:10,color:“rgba(255,255,255,.4)”}}>{fmt(xp)} XP · {nr?`${fmt(nr.min-xp)} to ${nr.name}`:“Max!”}</div>
</div>
</div>
{/* Quick stats */}
<div className="g3" style={{gap:8}}>
{[[“890”,“🧱 Bricks”,“var(–yellow)”],[“1,250”,“⚡ XP”,”#00C853”],[“5”,“📦 Sets Done”,“var(–orange)”]].map(([v,l,c])=>(
<div key={l} style={{background:“rgba(255,255,255,.06)”,borderRadius:10,padding:“10px 6px”,textAlign:“center”,border:“1px solid rgba(255,255,255,.07)”}}>
<div style={{fontFamily:“var(–r)”,fontSize:20,color:c}}>{v}</div>
<div style={{fontSize:9,color:“rgba(255,255,255,.4)”,fontWeight:800,marginTop:2}}>{l}</div>
</div>
))}
</div>
</div>
</div>

```
  <div className="section">
    <div className="wrap-sm">
      {/* Achievements */}
      <div className="section-title">🏅 Achievements</div>
      <div className="g2" style={{marginBottom:20}}>
        {ACHIEVEMENTS.map(a=>(
          <div key={a.id} style={{background:a.earned?"rgba(255,215,0,.06)":"rgba(255,255,255,.02)",borderRadius:10,padding:"10px 12px",border:`2px solid ${a.earned?"rgba(255,215,0,.2)":"rgba(255,255,255,.05)"}`,opacity:a.earned?1:.5,display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{fontSize:22,flexShrink:0}}>{a.earned?a.icon:"🔒"}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12,fontWeight:800,lineHeight:1.2,marginBottom:2}}>{a.name}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.35)",lineHeight:1.4}}>{a.desc}</div>
              {a.earned&&<div style={{fontSize:10,color:"var(--yellow)",fontWeight:800,marginTop:2}}>+{a.xp} XP ✓</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Completed shelf */}
      <div className="section-title" style={{marginTop:4}}>🏛️ Completed Sets</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {ALL_SETS.slice(0,6).map(s=>(
          <div key={s.id} title={s.name} style={{width:48,height:48,borderRadius:10,background:`${s.color}22`,border:`2px solid ${s.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.emoji}</div>
        ))}
        <div style={{width:48,height:48,borderRadius:10,background:"rgba(255,255,255,.04)",border:"2px dashed rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"rgba(255,255,255,.2)"}}>+</div>
      </div>

      {/* Upgrade CTA */}
      <div style={{background:"linear-gradient(135deg,var(--red),#8B0000)",borderRadius:14,padding:18,marginBottom:12,border:"2px solid rgba(227,0,11,.4)"}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
          <Minifig color="#FFD700" face="🤩" size={44}/>
          <div>
            <div style={{fontFamily:"var(--r)",fontSize:17,marginBottom:2}}>Upgrade to Pro</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.65)"}}>Unlock 200+ sets, unlimited Global Build, XP ×2</div>
          </div>
        </div>
        <button className="bb bb-yellow bb-full" onClick={()=>setPage("shop")} style={{fontSize:14}}>See BrickPass Plans →</button>
      </div>

      {/* Settings links */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[["🔒","Privacy Policy","legal-privacy"],["📋","Terms of Service","legal-terms"],["💳","Refund Policy","legal-refunds"],["✅","Acceptable Use","legal-aup"]].map(([ico,label,page])=>(
          <button key={page} onClick={()=>setPage(page)} style={{background:"var(--card)",border:"2px solid var(--border)",borderRadius:10,padding:"11px 14px",color:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"var(--b)",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
            <span style={{fontSize:16}}>{ico}</span>{label}
          </button>
        ))}
      </div>
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

const ACHIEVEMENTS=[
{id:1, name:“First Brick”,    desc:“Place your first brick”,          icon:“🧱”,earned:true, xp:10},
{id:2, name:“Studs Up”,       desc:“Place 1,000 bricks total”,        icon:“📦”,earned:true, xp:100},
{id:3, name:“Speed Builder”,  desc:“Finish a set in under 30 mins”,   icon:“⚡”,earned:true, xp:200},
{id:4, name:“Night Owl”,      desc:“Build after midnight”,             icon:“🦉”,earned:true, xp:50},
{id:5, name:“History Buff”,   desc:“Complete 5 landmark sets”,         icon:“📜”,earned:true, xp:300},
{id:6, name:“7 Wonders”,      desc:“Complete all 7 Wonders”,           icon:“🌍”,earned:false,xp:1000},
{id:7, name:“Wild Heart”,     desc:“Complete 5 natural wonders”,       icon:“🌿”,earned:false,xp:750},
{id:8, name:“World Builder”,  desc:“Place 500 bricks in One World”,    icon:“🌎”,earned:false,xp:500},
{id:9, name:“Streak Master”,  desc:“Build 30 days in a row”,           icon:“🔥”,earned:false,xp:750},
{id:10,name:“Colour Wheel”,   desc:“Use all 20 colours in one build”,  icon:“🎨”,earned:true, xp:150},
{id:11,name:“Social Builder”, desc:“Co-build with 5 players”,          icon:“🤝”,earned:false,xp:300},
{id:12,name:“Completionist”,  desc:“Complete 25 sets”,                 icon:“✅”,earned:false,xp:2000},
];

/* ═══════════════════════════════════════════════════════════════
SHOP PAGE
═══════════════════════════════════════════════════════════════ */
function ShopPage({setPage}){
return(
<div className=“page” style={{background:”#0d1117”}}>
<div className=“studs-light” style={{background:“linear-gradient(160deg,#1a0800,#2d0000,#1a0008)”,padding:“24px 14px 20px”,borderBottom:“2px solid rgba(227,0,11,.2)”}}>
<div className=“wrap-sm” style={{textAlign:“center”}}>
<div style={{display:“flex”,justifyContent:“center”,gap:8,marginBottom:16}}>
{[“😊”,“🤩”,“👑”,“😎”].map((f,i)=>(
<Minifig key={i} color={[”#E3000B”,”#FFD700”,”#FF6D00”,”#1565C0”][i]} face={f} size={[42,56,42,36][i]} style={{animation:`bounce 2s ease-in-out infinite`,animationDelay:`${i*.2}s`}}/>
))}
</div>
<h1 style={{fontFamily:“var(–r)”,fontSize:“clamp(22px,5vw,32px)”,marginBottom:6}}>BrickPass & Shop</h1>
<p style={{fontSize:13,color:“rgba(255,255,255,.5)”,maxWidth:360,margin:“0 auto”}}>No ads. No nonsense. Just more bricks.</p>
</div>
</div>

```
  <div className="section">
    <div className="wrap-sm">
      {/* Plans — stack on mobile */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
        {SHOP_PLANS.map(p=>(
          <div key={p.id} style={{background:p.popular?"linear-gradient(135deg,#1a1f30,#0d1525)":"var(--card)",borderRadius:14,border:`3px solid ${p.popular?p.color:"var(--border)"}`,padding:20,position:"relative"}}>
            {p.popular&&<div style={{position:"absolute",top:-12,right:16,background:p.color,color:"#111",fontWeight:800,fontSize:11,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap",boxShadow:`0 3px 0 rgba(0,0,0,.3)`}}>✨ Most Popular</div>}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Minifig color={p.color} face={p.id==="free"?"😊":p.id==="builder"?"😄":p.id==="pro"?"🤩":"👑"} size={44}/>
                <div>
                  <div style={{fontFamily:"var(--r)",fontSize:18,lineHeight:1.1}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:3,marginTop:2}}>
                    <span style={{fontFamily:"var(--r)",fontSize:26,color:p.color}}>{p.price===0?"Free":`£${p.price}`}</span>
                    {p.price>0&&<span style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>/month</span>}
                  </div>
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
              {p.features.map(f=>(
                <div key={f} style={{display:"flex",gap:6,fontSize:12,color:"rgba(255,255,255,.65)",alignItems:"flex-start"}}>
                  <span style={{color:p.color,flexShrink:0,fontWeight:800}}>✓</span><span>{f}</span>
                </div>
              ))}
            </div>
            <button className={`bb bb-full bb-${p.id==="free"?"ghost":p.id==="pro"?"yellow":p.id==="studio"?"red":"green"}`} style={{fontSize:14}}>
              {p.id==="free"?"Start Free":"Subscribe £"+p.price+"/mo"}
            </button>
          </div>
        ))}
      </div>

      {/* Legal disclaimer */}
      <div style={{background:"rgba(255,255,255,.03)",borderRadius:10,padding:12,border:"1px solid rgba(255,255,255,.06)",marginBottom:12}}>
        <p style={{fontSize:10,color:"rgba(255,255,255,.28)",lineHeight:1.8}}>
          All payments secured by <strong style={{color:"rgba(255,255,255,.4)"}}>Stripe</strong>. Prices in GBP. Subscriptions auto-renew monthly unless cancelled. Cancel anytime in account settings. Subject to our{" "}
          <button onClick={()=>setPage("legal-refunds")} style={{background:"none",border:"none",color:"var(--yellow)",cursor:"pointer",fontSize:10,fontWeight:800,padding:0}}>Refund Policy</button> and{" "}
          <button onClick={()=>setPage("legal-terms")} style={{background:"none",border:"none",color:"var(--yellow)",cursor:"pointer",fontSize:10,fontWeight:800,padding:0}}>Terms</button>.
          {" "}{COMPANY.name} · Co. {COMPANY.number}.
        </p>
      </div>
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
LEGAL PAGES
═══════════════════════════════════════════════════════════════ */
const LS=({title,children,setPage})=>(

  <div className="page" style={{background:"#0d1117",paddingTop:0}}>
    <div style={{background:"var(--card)",padding:"16px 14px",borderBottom:"2px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
      <button onClick={()=>setPage("me")} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14,fontWeight:700,padding:0,fontFamily:"var(--b)"}}>← Back</button>
    </div>
    <div style={{padding:"24px 14px 40px",maxWidth:680,margin:"0 auto"}}>
      <h1 style={{fontFamily:"var(--r)",fontSize:24,color:"var(--yellow)",marginBottom:4}}>{title}</h1>
      <p style={{fontSize:11,color:"rgba(255,255,255,.25)",marginBottom:24}}>Last updated May 2026 · {COMPANY.name} · Co. {COMPANY.number}</p>
      <div style={{fontSize:13,lineHeight:1.9,color:"rgba(255,255,255,.68)"}}>{children}</div>
    </div>
  </div>
);
const LH=({c})=><h2 style={{fontFamily:"var(--r)",fontSize:16,color:"#f0f0f0",marginTop:22,marginBottom:7}}>{c}</h2>;
const LP=({c})=><p style={{marginBottom:11}}>{c}</p>;
const LU=({items})=><ul style={{paddingLeft:18,marginBottom:11}}>{items.map((it,i)=><li key={i} style={{marginBottom:5}}>{it}</li>)}</ul>;

function PrivacyPage({setPage}){return(<LS title="🔒 Privacy Policy" setPage={setPage}><LP c={`${COMPANY.name} operates BrickWorld and is committed to protecting your data under UK GDPR and the Data Protection Act 2018.`}/><LH c="Data We Collect"/><LU items={[“Account info: username, email, hashed password”,“Payments: processed by Stripe — we never store card numbers”,“Usage: build activity, XP, ranks, sets, session time”,“Technical: IP, browser type, device info”,“Support messages”]} /><LH c="Legal Basis"/><LP c="Contract (to provide the service); Legitimate Interests (security); Consent (analytics cookies); Legal Obligation (financial records)."/><LH c="Your Rights"/><LP c={`Access, correction, erasure, restriction, portability, objection. Email ${COMPANY.email}. Complaints to the ICO at ico.org.uk.`}/><LH c="Data Sharing"/><LP c="Stripe (payments), Netlify (hosting), analytics (with consent). We never sell your data."/><LH c="Contact"/><LP c={COMPANY.email}/></LS>);}

function TermsPage({setPage}){return(<LS title="📋 Terms of Service" setPage={setPage}><LP c={`These Terms govern use of BrickWorld, operated by ${COMPANY.name} (Co. ${COMPANY.number}).`}/><LH c="LEGO® Disclaimer"/><LP c="BrickWorld is an independent platform. NOT affiliated with, endorsed by, or associated with the LEGO Group. LEGO® is a registered trademark of the LEGO Group. 'Bricks' refers exclusively to BrickWorld's own digital elements."/><LH c="Age"/><LP c="You must be 13 or older to create an account."/><LH c="Subscriptions"/><LP c="Billed monthly via Stripe. Cancel anytime; access continues to end of period."/><LH c="Your Content"/><LP c={`You retain ownership of builds you create. You grant ${COMPANY.name} a non-exclusive licence to display them on the platform.`}/><LH c="Conduct"/><LU items={[“No illegal, harmful, or offensive content”,“No reverse-engineering or scraping”,“No impersonation”,“No bots without written consent”,“No violation of applicable law”]}/><LH c="Governing Law"/><LP c={`England and Wales. Contact: ${COMPANY.email}`}/></LS>);}

function CookiesPage({setPage}){return(<LS title="🍪 Cookie Policy" setPage={setPage}><LH c="Essential (Always)"/><LU items={[“Session cookie”,“Auth token”,“Consent preference”]}/><LH c="Analytics (With Consent)"/><LU items={[“Anonymised usage stats”,“Error tracking”]}/><LH c="Payment"/><LP c="Stripe cookies for secure payment processing. See stripe.com/privacy."/><LH c="Managing"/><LP c={`Withdraw consent in the footer or browser settings. Contact: ${COMPANY.email}`}/></LS>);}

function RefundPage({setPage}){return(<LS title="💳 Refund Policy" setPage={setPage}><LH c="Cancellations"/><LP c="Cancel anytime. Access continues to end of billing period. No partial refunds."/><LH c="14-Day Cooling-Off (UK)"/><LP c={`UK consumers may cancel within 14 days of a new subscription under the Consumer Contracts Regulations 2013, if you have not substantially used the Service. Email ${COMPANY.email}.`}/><LH c="Exceptional Refunds"/><LP c="Double charges due to our error; features unavailable 7+ consecutive days; confirmed fraud."/><LH c="Digital Goods"/><LP c="Cosmetics and sets non-refundable once delivered, except where required by law."/><LH c="How to Request"/><LP c={`Email ${COMPANY.email} — subject "Refund Request — [username]" with transaction ID. 5 business day response. Statutory rights unaffected.`}/></LS>);}

function AUPPage({setPage}){return(<LS title="✅ Acceptable Use" setPage={setPage}><LU items={[“No illegal, harmful, or offensive content”,“No unauthorised platform access”,“No reverse-engineering or source extraction”,“No bots/scrapers without written consent”,“No commercial exploitation without permission”,“No impersonation of Lyrīon Ltd staff”,“No malware or harmful code”,“No gambling, fraud, or illegal activity”,“No hate symbols or content harmful to minors”,“No violation of applicable law”]}/><LP c={`Report violations to ${COMPANY.email}.`}/></LS>);}

/* ═══════════════════════════════════════════════════════════════
MAIN APP
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
BRICKDROP — Daily Mystery Set
═══════════════════════════════════════════════════════════════ */
function useCountdown(){
const calc=()=>{const now=new Date(),mid=new Date(now);mid.setHours(24,0,0,0);return mid-now;};
const [ms,setMs]=useState(calc());
useEffect(()=>{const t=setInterval(()=>setMs(calc()),1000);return()=>clearInterval(t);},[]);
return{h:Math.floor(ms/3600000),m:Math.floor((ms%3600000)/60000),s:Math.floor((ms%60000)/1000)};
}

const TODAY_DROP={name:”??????????”,revealed:true,emoji:“🏯”,realName:“Osaka Castle”,country:“Japan”,pieces:2140,
completers:47,firstHundred:100,xpReward:500,fact:“Built in 1583 by Toyotomi Hideyoshi. Survived two sieges, two lightning strikes, and an air raid.”,color:”#C62828”};

const PAST_DROPS=[
{name:“Stonehenge”,emoji:“🪨”,date:“Yesterday”,completers:312,color:”#78909C”},
{name:“Area 51”,emoji:“🛸”,date:“2 days ago”,completers:891,color:”#1B5E20”},
{name:“Titanic”,emoji:“🚢”,date:“3 days ago”,completers:204,color:”#0D47A1”},
{name:“Pompeii”,emoji:“🌋”,date:“4 days ago”,completers:567,color:”#BF360C”},
];

function BrickDropPage({setPage,isPro}){
const {h,m,s}=useCountdown();
const [revealed,setRevealed]=useState(false);
const completionPct=Math.round((TODAY_DROP.completers/TODAY_DROP.firstHundred)*100);

return(
<div className=“page” style={{background:”#0a0a0a”}}>
{/* HERO */}
<div style={{background:“linear-gradient(160deg,#0a0a0a,#1a0a00,#0a0a1a)”,padding:“24px 14px 20px”,borderBottom:“2px solid rgba(255,215,0,.2)”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,top:0,left:0,right:0,bottom:0,backgroundImage:“radial-gradient(circle at 50% 50%,rgba(255,215,0,.04) 0%,transparent 70%)”}}/>
<div className=“wrap-sm” style={{position:“relative”}}>
<div style={{display:“flex”,alignItems:“center”,gap:10,marginBottom:8}}>
<div style={{width:10,height:10,borderRadius:“50%”,background:“var(–yellow)”,animation:“pulse 1.2s ease-in-out infinite”,boxShadow:“0 0 10px var(–yellow)”}}/>
<span style={{fontFamily:“var(–r)”,fontSize:11,color:“var(–yellow)”,textTransform:“uppercase”,letterSpacing:2}}>Live Now</span>
</div>
<h1 style={{fontFamily:“var(–r)”,fontSize:“clamp(28px,7vw,44px)”,lineHeight:1.1,marginBottom:6}}>
🎁 BrickDrop
</h1>
<p style={{fontSize:13,color:“rgba(255,255,255,.55)”,lineHeight:1.6,marginBottom:20,maxWidth:360}}>
Every day at midnight a mystery set drops. Build it in 24 hours. First 100 to finish get a <strong style={{color:“var(–yellow)”}}>permanent gold badge</strong> on their profile. Miss it and it’s gone forever.
</p>

```
      {/* Countdown */}
      <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:16,marginBottom:16,border:"2px solid rgba(255,215,0,.2)"}}>
        <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10,textAlign:"center"}}>Next Drop In</div>
        <div style={{display:"flex",justifyContent:"center",gap:8}}>
          {[[h,"Hours"],[m,"Mins"],[s,"Secs"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center",flex:1}}>
              <div style={{background:"#111",borderRadius:10,padding:"10px 6px",border:"2px solid rgba(255,215,0,.3)",marginBottom:4}}>
                <span style={{fontFamily:"var(--r)",fontSize:"clamp(28px,6vw,42px)",color:"var(--yellow)"}}>{String(v).padStart(2,"0")}</span>
              </div>
              <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
        {!isPro&&(
          <div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,215,0,.08)",borderRadius:8,textAlign:"center"}}>
            <span style={{fontSize:11,color:"rgba(255,215,0,.8)",fontWeight:700}}>⭐ Pro members get a 1-hour head start before public drop</span>
          </div>
        )}
      </div>
    </div>
  </div>

  <div className="section">
    <div className="wrap-sm">
      {/* Today's drop */}
      <div className="section-title">🎯 Today's Drop</div>
      <div style={{background:`linear-gradient(135deg,${TODAY_DROP.color}22,${TODAY_DROP.color}08)`,borderRadius:16,border:`2px solid ${TODAY_DROP.color}55`,overflow:"hidden",marginBottom:16}}>
        {/* Mystery reveal */}
        <div style={{height:140,background:TODAY_DROP.revealed?`linear-gradient(135deg,${TODAY_DROP.color}44,${TODAY_DROP.color}22)`:"#111",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:TODAY_DROP.revealed?"default":"pointer"}} onClick={()=>!revealed&&setRevealed(true)}>
          {TODAY_DROP.revealed?(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:64}}>{TODAY_DROP.emoji}</div>
              <div style={{fontFamily:"var(--r)",fontSize:22,marginTop:4}}>{TODAY_DROP.realName}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{TODAY_DROP.country}</div>
            </div>
          ):(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:64,filter:"blur(8px)"}}>🏯</div>
              <div style={{fontFamily:"var(--r)",fontSize:16,marginTop:8}}>Tap to Reveal</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Mystery building awaits...</div>
            </div>
          )}
        </div>
        <div style={{padding:16}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:12,fontStyle:"italic"}}>💡 {TODAY_DROP.fact}</div>
          {/* First 100 progress */}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:800,marginBottom:6}}>
            <span style={{color:"var(--yellow)"}}>🏆 First 100 Race</span>
            <span style={{color:TODAY_DROP.completers>=100?"#00C853":"rgba(255,255,255,.5)"}}>{TODAY_DROP.completers}/100 claimed</span>
          </div>
          <div className="prog-track" style={{marginBottom:10}}>
            <div className="prog-fill" style={{width:`${completionPct}%`,background:`linear-gradient(90deg,var(--yellow),var(--orange))`}}/>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <div style={{flex:1,background:"rgba(255,255,255,.05)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--r)",fontSize:18,color:"var(--yellow)"}}>{TODAY_DROP.completers}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:800,textTransform:"uppercase"}}>Completed</div>
            </div>
            <div style={{flex:1,background:"rgba(255,255,255,.05)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--r)",fontSize:18,color:"var(--orange)"}}>{TODAY_DROP.pieces.toLocaleString()}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:800,textTransform:"uppercase"}}>Pieces</div>
            </div>
            <div style={{flex:1,background:"rgba(255,215,0,.12)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--r)",fontSize:18,color:"var(--yellow)"}}>+{TODAY_DROP.xpReward}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.4)",fontWeight:800,textTransform:"uppercase"}}>XP Reward</div>
            </div>
          </div>
          <button className="bb bb-yellow bb-full" onClick={()=>setPage("build")} style={{fontSize:15}}>
            🔨 Build Now — {100-TODAY_DROP.completers} badges left
          </button>
        </div>
      </div>

      {/* Past Drops — locked for free */}
      <div className="section-title" style={{marginTop:4}}>📦 Drop Archive</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {PAST_DROPS.map((d,i)=>(
          <div key={i} style={{background:"var(--card)",borderRadius:12,border:"2px solid var(--border)",padding:"12px 14px",display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden"}}>
            {!isPro&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)",borderRadius:10}}><span className="pill" style={{background:"rgba(255,215,0,.2)",color:"var(--yellow)",fontSize:12}}>🔒 Pro Only</span></div>}
            <span style={{fontSize:28}}>{d.emoji}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--r)",fontSize:15}}>{d.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{d.date} · {d.completers} completed</div>
            </div>
            <div style={{width:32,height:32,borderRadius:"50%",background:`${d.color}33`,border:`2px solid ${d.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>→</div>
          </div>
        ))}
      </div>
      {!isPro&&<button className="bb bb-yellow bb-full" onClick={()=>setPage("shop")} style={{fontSize:14}}>🔓 Unlock Full Archive with Pro →</button>}
    </div>
  </div>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
BRICKRIVAL — Head to Head Duels
═══════════════════════════════════════════════════════════════ */
const OPEN_CHALLENGES=[
{name:“ObiBuilder”,   flag:“🇳🇬”,rank:“Master Builder”,xp:58900,icon:“🏗️”,color:”#1565C0”,streak:19},
{name:“LegoLegend_UK”,flag:“🇬🇧”,rank:“Grand Master”,  xp:87430,icon:“⭐”,color:”#7B1FA2”,streak:33},
{name:“BrickQueen_NY”,flag:“🇺🇸”,rank:“Architect”,     xp:65320,icon:“📐”,color:”#00C853”,streak:21},
{name:“TowerMaster”,  flag:“🇫🇷”,rank:“Artisan”,       xp:51200,icon:“🎨”,color:”#CD7F32”,streak:15},
];

const LIVE_MATCHES=[
{p1:{name:“MasterBrick_42”,flag:“🇯🇵”,pct:78},p2:{name:“BrickNinja_JP”,flag:“🇯🇵”,pct:65},set:“Eiffel Tower”,mins:4},
{p1:{name:“ArchitectPro”,  flag:“🇩🇪”,pct:45},p2:{name:“StubbornBlder”,flag:“🇧🇷”,pct:52},set:“Great Pyramid”,mins:7},
];

const BRACKET=[
{round:“Quarter Finals”,matches:[[“MasterBrick_42”,“ObiBuilder”],[“LegoLegend_UK”,“BrickQueen_NY”],[“ArchitectPro”,“TowerMaster”],[“BrickNinja_JP”,“YOU”]]},
{round:“Semi Finals”,  matches:[[“MasterBrick_42”,”???”],[“ArchitectPro”,”???”]]},
{round:“Final”,        matches:[[”???”,”???”]]},
];

function BrickRivalPage({setPage}){
const [tab,setTab]=useState(“challenge”);
const myRecord={w:3,l:2,rating:1180};

return(
<div className=“page” style={{background:”#0d0a0a”}}>
{/* HERO */}
<div style={{background:“linear-gradient(160deg,#1a0000,#2d0505,#1a0010)”,padding:“24px 14px 0”,borderBottom:“2px solid rgba(227,0,11,.25)”,overflow:“hidden”,position:“relative”}}>
<div style={{position:“absolute”,top:-40,right:-20,fontSize:120,opacity:.04,transform:“rotate(15deg)”}}>⚔️</div>
<div className=“wrap-sm” style={{position:“relative”}}>
<h1 style={{fontFamily:“var(–r)”,fontSize:“clamp(26px,6vw,40px)”,lineHeight:1.1,marginBottom:6}}>
⚔️ BrickRival
</h1>
<p style={{fontSize:13,color:“rgba(255,255,255,.55)”,lineHeight:1.6,marginBottom:16,maxWidth:360}}>
Two builders. Same set. 10 minutes. One winner. Challenge anyone on the leaderboard — their XP is on the line.
</p>
{/* My record */}
<div style={{background:“rgba(255,255,255,.06)”,borderRadius:12,padding:“12px 14px”,marginBottom:0,display:“flex”,gap:14,alignItems:“center”,border:“2px solid rgba(227,0,11,.2)”}}>
<Minifig color="#E3000B" face="😤" size={44}/>
<div style={{flex:1,minWidth:0}}>
<div style={{fontFamily:“var(–r)”,fontSize:15,marginBottom:4}}>Your Record</div>
<div style={{display:“flex”,gap:10}}>
<span style={{fontFamily:“var(–r)”,fontSize:20,color:”#00C853”}}>{myRecord.w}W</span>
<span style={{fontFamily:“var(–r)”,fontSize:20,color:“var(–red)”}}>{myRecord.l}L</span>
<span style={{fontSize:12,color:“rgba(255,255,255,.4)”,alignSelf:“center”}}>Rating: <strong style={{color:“var(–yellow)”}}>{myRecord.rating}</strong></span>
</div>
</div>
<div style={{textAlign:“center”,flexShrink:0}}>
<div style={{fontFamily:“var(–r)”,fontSize:11,color:“rgba(255,255,255,.35)”,marginBottom:2}}>RANK</div>
<div style={{fontFamily:“var(–r)”,fontSize:20,color:“var(–yellow)”}}>#847</div>
</div>
</div>

```
      {/* Tabs */}
      <div style={{display:"flex",gap:6,paddingTop:14}}>
        {[["challenge","⚔️ Challenge"],["live","🔴 Live"],["bracket","🏆 Tournament"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?"var(--red)":"rgba(255,255,255,.07)",color:tab===t?"#fff":"rgba(255,255,255,.6)",border:"none",borderRadius:8,padding:"9px 6px",cursor:"pointer",fontFamily:"var(--b)",fontSize:12,fontWeight:800,transition:"all .15s"}}>{l}</button>
        ))}
      </div>
    </div>
  </div>

  <div className="section">
    <div className="wrap-sm">
      {/* CHALLENGE TAB */}
      {tab==="challenge"&&(
        <>
          <div className="section-title">Open to Challenge</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {OPEN_CHALLENGES.map(p=>(
              <div key={p.name} style={{background:"var(--card)",borderRadius:13,border:"2px solid var(--border)",padding:"14px",display:"flex",alignItems:"center",gap:12}}>
                <Minifig color={p.color} face={p.icon} size={46} style={{flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:14}}>{p.name}</span>
                    <span style={{fontSize:18}}>{p.flag}</span>
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{p.rank} · {fmt(p.xp)} XP · 🔥{p.streak}d</div>
                </div>
                <button className="bb bb-red" style={{fontSize:12,padding:"9px 14px",flexShrink:0}} onClick={()=>setPage("build")}>
                  ⚔️ Duel
                </button>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,padding:"10px 14px",background:"rgba(255,255,255,.04)",borderRadius:10,border:"1px solid rgba(255,255,255,.07)",fontSize:12,color:"rgba(255,255,255,.4)",textAlign:"center"}}>
            Free: 1 duel/day · <button onClick={()=>setPage("shop")} style={{background:"none",border:"none",color:"var(--yellow)",cursor:"pointer",fontSize:12,fontWeight:800,padding:0}}>Pro: unlimited ⭐</button>
          </div>
        </>
      )}

      {/* LIVE TAB */}
      {tab==="live"&&(
        <>
          <div className="section-title">🔴 Live Matches — Spectate Now</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {LIVE_MATCHES.map((m,i)=>(
              <div key={i} style={{background:"var(--card)",borderRadius:14,border:"2px solid rgba(227,0,11,.25)",padding:16,overflow:"hidden"}}>
                <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                  <span>🏗️ {m.set}</span>
                  <span style={{color:"var(--red)"}}>⏱ {m.mins}m remaining</span>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                  {/* Player 1 */}
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:16,marginBottom:2}}>{m.p1.flag}</div>
                    <div style={{fontWeight:800,fontSize:13,marginBottom:6}}>{m.p1.name}</div>
                    <div className="prog-track" style={{height:12,marginBottom:3}}>
                      <div className="prog-fill" style={{width:`${m.p1.pct}%`,background:"var(--blue)"}}/>
                    </div>
                    <div style={{fontFamily:"var(--r)",fontSize:16,color:"#64B5F6"}}>{m.p1.pct}%</div>
                  </div>
                  {/* VS */}
                  <div style={{fontFamily:"var(--r)",fontSize:20,color:"var(--red)",flexShrink:0,padding:"0 4px"}}>VS</div>
                  {/* Player 2 */}
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:16,marginBottom:2}}>{m.p2.flag}</div>
                    <div style={{fontWeight:800,fontSize:13,marginBottom:6}}>{m.p2.name}</div>
                    <div className="prog-track" style={{height:12,marginBottom:3}}>
                      <div className="prog-fill" style={{width:`${m.p2.pct}%`,background:"var(--orange)"}}/>
                    </div>
                    <div style={{fontFamily:"var(--r)",fontSize:16,color:"var(--orange)"}}>{m.p2.pct}%</div>
                  </div>
                </div>
                <button className="bb bb-ghost bb-full" style={{fontSize:13}}>👀 Spectate Live</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BRACKET TAB */}
      {tab==="bracket"&&(
        <>
          <div className="section-title">🏆 This Week's Tournament</div>
          <div style={{background:"rgba(255,215,0,.06)",borderRadius:12,padding:"10px 14px",border:"1px solid rgba(255,215,0,.2)",marginBottom:16,fontSize:12,color:"rgba(255,255,255,.6)"}}>
            🎯 Weekly prize: <strong style={{color:"var(--yellow)"}}>Tournament Champion badge + 5,000 XP</strong>. Finals on Sunday midnight.
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {BRACKET.map((round,ri)=>(
              <div key={ri}>
                <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>{round.round}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {round.matches.map((m,mi)=>(
                    <div key={mi} style={{background:"var(--card)",borderRadius:10,border:"2px solid var(--border)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,fontWeight:800,fontSize:13,color:m[0]==="YOU"?"var(--yellow)":m[0]==="???"?"rgba(255,255,255,.25)":"#f0f0f0"}}>{m[0]}</div>
                      <div style={{fontFamily:"var(--r)",fontSize:13,color:"var(--red)",flexShrink:0}}>VS</div>
                      <div style={{flex:1,fontWeight:800,fontSize:13,textAlign:"right",color:m[1]==="YOU"?"var(--yellow)":m[1]==="???"?"rgba(255,255,255,.25)":"#f0f0f0"}}>{m[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="bb bb-yellow bb-full" style={{marginTop:16,fontSize:14}} onClick={()=>setPage("build")}>
            ⚔️ Enter Next Tournament
          </button>
        </>
      )}
    </div>
  </div>
</div>
```

);
}

/* ═══════════════════════════════════════════════════════════════
BRICKWORK — Corporate Team Building
═══════════════════════════════════════════════════════════════ */
const BRICKWORK_PLANS=[
{id:“starter”,name:“Starter”,price:99, players:“Up to 25”,duration:“60 mins”,color:”#00C853”,
features:[“Live isometric build session”,“Department colour assignment”,“Real-time shared canvas”,“Auto time-lapse on completion”,“Session leaderboard”,“Basic roast commentary 😄”]},
{id:“team”,name:“Team”,price:249,players:“Up to 100”,duration:“90 mins”,color:”#FFD700”,popular:true,
features:[“Everything in Starter”,“🔥 Sabotage Mode”,“Branded company colours”,“Full roast commentary”,“Custom set (your office!)”,“HD time-lapse video emailed to all”,“Dedicated session host”,“Session replay link”]},
{id:“enterprise”,name:“Enterprise”,price:499,players:“Up to 500”,duration:“Full day / custom”,color:”#E3000B”,
features:[“Everything in Team”,“White-label your session”,“Custom brick set designed for you”,“Live DJ commentary mode”,“Cross-office tournaments”,“Analytics: who built the most (receipts)”,“Post-session report PDF”,“Ongoing annual licence option”]},
];

const ROAST_EXAMPLES=[
{dept:“Accounts”,bricks:3,  roast:“Accounts have placed 3 bricks. Accounts — are you OK? Do you need us to send help?”},
{dept:“Engineering”,bricks:847,roast:“Engineering are basically running away with this. Someone unplug their keyboards.”},
{dept:“Sales”,bricks:12,   roast:“Sales promised 200 bricks by end of quarter. Current score: 12. Classic.”},
{dept:“HR”,bricks:156,     roast:“HR have placed 156 bricks and added a wellness corner to the build. Nobody asked. Nobody’s surprised.”},
{dept:“CEO”,bricks:1,      roast:“The CEO has placed exactly 1 brick. It is, however, perfectly centred. We respect it.”},
];

function BrickWorkPage({setPage}){
const [roastIdx,setRoastIdx]=useState(0);
useEffect(()=>{const t=setInterval(()=>setRoastIdx(i=>(i+1)%ROAST_EXAMPLES.length),3000);return()=>clearInterval(t);},[]);
const r=ROAST_EXAMPLES[roastIdx];

return(
<div className=“page” style={{background:”#0d1117”}}>
{/* HERO */}
<div className=“studs-light” style={{background:“linear-gradient(160deg,#1a1500,#2d2200,#001a0d)”,padding:“28px 14px 24px”,borderBottom:“2px solid rgba(255,215,0,.2)”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,top:10,right:10,display:“flex”,gap:6,opacity:.3}}>
{[[”#E3000B”,“HR”],[”#1565C0”,“ENG”],[”#FFD700”,“SALES”],[”#00C853”,“OPS”]].map(([c,d])=>(
<div key={d} style={{background:c,borderRadius:6,padding:“3px 7px”,fontSize:9,fontWeight:800,color:”#fff”,transform:`rotate(${Math.random()*10-5}deg)`}}>{d}</div>
))}
</div>
<div className="wrap-sm">
<div style={{display:“inline-flex”,alignItems:“center”,gap:6,background:“rgba(255,215,0,.15)”,border:“2px solid rgba(255,215,0,.3)”,borderRadius:20,padding:“5px 12px”,marginBottom:12}}>
<span style={{fontSize:11,fontWeight:800,color:“var(–yellow)”}}>🏢 For Teams & Companies</span>
</div>
<h1 style={{fontFamily:“var(–r)”,fontSize:“clamp(26px,6vw,42px)”,lineHeight:1.1,marginBottom:10}}>
BrickWork
<span style={{color:“var(–yellow)”,display:“block”}}>Team Building</span>
That Doesn’t Suck
</h1>
<p style={{fontSize:14,color:“rgba(255,255,255,.6)”,lineHeight:1.7,marginBottom:20,maxWidth:380}}>
Your entire company builds one massive structure together — live, in real time. Every department gets a colour. The chaos is the point. The laughter is the product.
</p>
<div style={{display:“flex”,gap:10,flexWrap:“wrap”}}>
<button className=“bb bb-yellow” style={{fontSize:15,padding:“14px 24px”}}>📧 Book a Session</button>
<button className=“bb bb-ghost” style={{fontSize:14,padding:“14px 18px”}}>▶ Watch a Demo</button>
</div>
</div>
</div>

```
  <div className="section">
    <div className="wrap-sm">
      {/* LIVE ROAST TICKER */}
      <div style={{background:"#111",borderRadius:14,border:"2px solid rgba(255,215,0,.2)",padding:16,marginBottom:20,overflow:"hidden"}}>
        <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--red)",animation:"pulse 1.2s infinite"}}/>
          Live Session Commentary
        </div>
        <div key={roastIdx} className="slideUp" style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{background:"rgba(255,215,0,.15)",borderRadius:8,padding:"4px 10px",flexShrink:0,fontSize:11,fontWeight:800,color:"var(--yellow)",whiteSpace:"nowrap"}}>{r.dept}</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.6,fontStyle:"italic"}}>"{r.roast}"</p>
        </div>
        <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,height:3,background:"rgba(255,255,255,.08)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:"var(--yellow)",borderRadius:2,animation:"bw-ticker 3s linear",width:"100%",transformOrigin:"left"}}/>
          </div>
          <span style={{fontSize:10,color:"rgba(255,255,255,.25)",fontWeight:700}}>auto-roasting {ROAST_EXAMPLES.length} depts</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section-title">How a Session Works</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {[
          {n:1,icon:"📧",title:"Book in 2 minutes",desc:"Choose your package, pick a date, tell us your team size. We handle the rest.",color:"var(--yellow)"},
          {n:2,icon:"🎨",title:"Departments get colours",desc:"HR is yellow. Engineering is blue. Sales is red. IT is grey (they chose it). You'll know who built what.",color:"var(--blue)"},
          {n:3,icon:"⚔️",title:"60 minutes of chaos",desc:"Everyone builds on the same canvas in real time. Sabotage Mode lets one anonymous player erase a colleague's bricks for 60 seconds. No one will ever trust Accounts again.",color:"var(--red)"},
          {n:4,icon:"🎬",title:"The grand reveal",desc:"The CEO places the final brick. Time-lapse video renders automatically and gets emailed to every participant. It will be shared on Slack. It will become a legend.",color:"var(--green)"},
        ].map(s=>(
          <div key={s.n} style={{display:"flex",gap:14,alignItems:"flex-start",background:"var(--card)",borderRadius:12,padding:14,border:"2px solid var(--border)"}}>
            <div style={{width:38,height:38,borderRadius:9,background:s.color,color:s.n===2||s.n===3?"#fff":"#111",fontFamily:"var(--r)",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 0 rgba(0,0,0,.3)`}}>{s.n}</div>
            <div>
              <div style={{fontSize:16,marginBottom:3}}>{s.icon} <strong style={{fontFamily:"var(--r)"}}>{s.title}</strong></div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES GRID */}
      <div className="section-title">Features That'll Actually Make You Laugh</div>
      <div className="g2" style={{marginBottom:20}}>
        {[
          {icon:"🔥",title:"Sabotage Mode",desc:"One anonymous player can erase anyone's bricks for 60 seconds. Chaos. Drama. Teamwork destroyed."},
          {icon:"🤖",title:"Auto-Roast AI",desc:"Real-time commentary based on each department's brick count. Brutally accurate. HR will file a complaint."},
          {icon:"🎬",title:"Time-lapse",desc:"The whole build rendered as a video and emailed to everyone. Future onboarding material. Guaranteed."},
          {icon:"👑",title:"CEO Brick",desc:"The CEO places the final brick on live camera. No pressure. Everyone's watching. Good luck."},
          {icon:"📊",title:"League Table",desc:"Who built the most? Who built the least? Name and shame. Receipts provided."},
          {icon:"🎮",title:"Custom Set",desc:"Team plan and above: we build a pixelated version of your actual office as the set. Your building. In bricks."},
        ].map(f=>(
          <div key={f.title} style={{background:"var(--card)",borderRadius:12,border:"2px solid var(--border)",padding:"12px 14px"}}>
            <div style={{fontSize:24,marginBottom:6}}>{f.icon}</div>
            <div style={{fontFamily:"var(--r)",fontSize:14,marginBottom:4}}>{f.title}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* PRICING */}
      <div className="section-title">Session Pricing</div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
        {BRICKWORK_PLANS.map(p=>(
          <div key={p.id} style={{background:p.popular?"linear-gradient(135deg,#1a1f30,#0d1525)":"var(--card)",borderRadius:14,border:`3px solid ${p.popular?p.color:"var(--border)"}`,padding:18,position:"relative"}}>
            {p.popular&&<div style={{position:"absolute",top:-11,right:14,background:p.color,color:"#111",fontWeight:800,fontSize:11,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap"}}>Most Popular</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontFamily:"var(--r)",fontSize:20,marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>{p.players} · {p.duration}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--r)",fontSize:32,color:p.color}}>£{p.price}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>per session</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:14}}>
              {p.features.map(f=>(
                <div key={f} style={{display:"flex",gap:6,fontSize:11,color:"rgba(255,255,255,.65)",alignItems:"flex-start"}}>
                  <span style={{color:p.color,flexShrink:0,fontWeight:800}}>✓</span><span>{f}</span>
                </div>
              ))}
            </div>
            <button className="bb bb-full" style={{fontSize:14,background:p.color,color:p.id==="team"?"#111":"#fff",border:"none",boxShadow:`0 4px 0 rgba(0,0,0,.3)`}}>
              Book {p.name} — £{p.price}
            </button>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div style={{background:"var(--card)",borderRadius:14,border:"2px solid var(--border)",padding:16,marginBottom:12}}>
        <div style={{fontFamily:"var(--r)",fontSize:14,marginBottom:12,color:"var(--yellow)"}}>💬 What Teams Say</div>
        {[
          {quote:"Our quarterly all-hands has never had a 98% attendance rate before. Or since.",person:"Head of People, Series B Startup"},
          {quote:"The sabotage round took out our entire engineering department in 60 seconds. We've never been closer as a team.",person:"CTO, FinTech Company"},
          {quote:"Sales finished last. We were not allowed to let them forget it.",person:"Anonymous (not from Sales)"},
        ].map((t,i)=>(
          <div key={i} style={{paddingBottom:i<2?10:0,marginBottom:i<2?10:0,borderBottom:i<2?"1px solid rgba(255,255,255,.06)":"none"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.6,fontStyle:"italic",marginBottom:4}}>"{t.quote}"</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,.35)",fontWeight:700}}>— {t.person}</p>
          </div>
        ))}
      </div>

      <button className="bb bb-yellow bb-full" style={{fontSize:15,padding:"15px 0"}}>📧 Book Your Session Now →</button>
    </div>
  </div>
  <Footer setPage={setPage}/>
</div>
```

);
}

export default function BrickWorld(){
const [page,setPage]=useState(“home”);
const [xp]=useState(1250);
const [cookies,setCookies]=useState(false);
const [reward,setReward]=useState(null);

useEffect(()=>{
injectFonts();
if(!document.getElementById(“bw-css”)){
const s=document.createElement(“style”);s.id=“bw-css”;s.textContent=CSS;document.head.appendChild(s);
}
try{if(localStorage.getItem(“bw_ck”)===“1”)setCookies(true);}catch(e){}
return()=>{const el=document.getElementById(“bw-css”);if(el)el.remove();};
},[]);

const accept=()=>{try{localStorage.setItem(“bw_ck”,“1”);}catch(e){}setCookies(true);};

// Main nav tabs
const NAV_MAP={home:“home”,build:“build”,drop:“drop”,rival:“rival”,me:“me”,world:“me”,ranks:“me”,vault:“home”,shop:“me”,brickwork:“me”};
const isLegal=page.startsWith(“legal-”);
const isBuild=page===“build”;
const showNav=!isLegal&&!isBuild;
const navPage=NAV_MAP[page]||“home”;

const navigate=p=>{
// map sub-pages to their parent for nav highlighting
const remap={vault:“home”,world:“world”,education:“me”,shop:“me”};
setPage(p);
};

return(
<div style={{fontFamily:“var(–b)”,minHeight:“100vh”,background:”#0d1117”,color:”#f0f0f0”,overflowX:“hidden”,width:“100%”,maxWidth:“100vw”}}>
{/* XP strip on main pages */}
{showNav&&<XPStrip xp={xp}/>}

```
  {/* Pages */}
  {page==="home"         &&<HomePage    setPage={navigate} xp={xp}/>}
  {page==="build"        &&<BuildPage/>}
  {page==="vault"        &&<VaultPage   setPage={navigate}/>}
  {page==="world"        &&<WorldPage   setPage={navigate}/>}
  {page==="ranks"        &&<RanksPage   xp={xp} setPage={navigate}/>}
  {page==="me"           &&<MePage      xp={xp} setPage={navigate}/>}
  {page==="shop"         &&<ShopPage    setPage={navigate}/>}
  {page==="legal-privacy"&&<PrivacyPage setPage={navigate}/>}
  {page==="legal-terms"  &&<TermsPage   setPage={navigate}/>}
  {page==="legal-cookies"&&<CookiesPage setPage={navigate}/>}
  {page==="legal-refunds"&&<RefundPage  setPage={navigate}/>}
  {page==="legal-aup"    &&<AUPPage     setPage={navigate}/>}
  {page==="drop"          &&<BrickDropPage  setPage={navigate} isPro={false}/>}
  {page==="rival"         &&<BrickRivalPage setPage={navigate}/>}
  {page==="brickwork"     &&<BrickWorkPage  setPage={navigate}/>}

  {/* Bottom nav */}
  {showNav&&<BottomNav page={navPage} setPage={p=>{navigate(p);}}/>}

  {/* Cookie banner */}
  {!cookies&&!isLegal&&!isBuild&&<CookieBanner onAccept={accept} setPage={navigate}/>}

  {/* Reward overlay */}
  {reward&&<Reward msg={reward.msg} sub={reward.sub} onClose={()=>setReward(null)}/>}
</div>
```

);
}