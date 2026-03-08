import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const USERS = [
  { id:1, name:"Arjun Mehta",   avatar:"AM", credits:120, rating:4.8, reviews:23, location:"Mumbai",    bio:"Music teacher & language enthusiast", skillsOffered:["Guitar","Hindi","Music Theory"], skillsWanted:["Python","Photography","Spanish"], sessions:47, joinDate:"2024-01-15", online:true  },
  { id:2, name:"Sofia Reyes",   avatar:"SR", credits:85,  rating:4.9, reviews:31, location:"Madrid",    bio:"Polyglot & software developer",        skillsOffered:["Spanish","French","React.js"],   skillsWanted:["Guitar","Yoga","Drawing"],        sessions:62, joinDate:"2023-11-20", online:true  },
  { id:3, name:"James Park",    avatar:"JP", credits:45,  rating:4.7, reviews:18, location:"Seoul",     bio:"Photographer & cooking enthusiast",     skillsOffered:["Photography","Korean","Lightroom"],skillsWanted:["French","Piano","Writing"],      sessions:29, joinDate:"2024-02-08", online:false },
  { id:4, name:"Priya Sharma",  avatar:"PS", credits:200, rating:5.0, reviews:44, location:"Bangalore", bio:"Yoga instructor & data scientist",      skillsOffered:["Yoga","Python","Data Science"],  skillsWanted:["Guitar","Spanish","Oil Painting"],sessions:88, joinDate:"2023-09-10", online:true  },
  { id:5, name:"Lucas Müller",  avatar:"LM", credits:30,  rating:4.6, reviews:12, location:"Berlin",    bio:"Artist & language tutor",               skillsOffered:["Drawing","Oil Painting","German"],skillsWanted:["Python","Photography","Yoga"],   sessions:21, joinDate:"2024-03-01", online:false },
  { id:6, name:"Aisha Okonkwo", avatar:"AO", credits:155, rating:4.9, reviews:37, location:"Lagos",     bio:"Writer & creative writing coach",       skillsOffered:["Creative Writing","English","Storytelling"],skillsWanted:["Data Science","Korean","Drawing"],sessions:74,joinDate:"2023-12-05",online:true},
];

const INITIAL_SESSIONS = [
  { id:1, teacherId:2, learnerId:0, skill:"Spanish",         date:"2025-06-12", time:"10:00", duration:30, status:"completed", credits:30, teacherRating:5, learnerRating:5 },
  { id:2, teacherId:4, learnerId:0, skill:"Yoga",            date:"2025-06-14", time:"08:00", duration:60, status:"completed", credits:60, teacherRating:5, learnerRating:4 },
  { id:3, teacherId:0, learnerId:1, skill:"Guitar",          date:"2025-06-20", time:"15:00", duration:30, status:"accepted",  credits:30 },
  { id:4, teacherId:6, learnerId:0, skill:"Creative Writing",date:"2025-06-25", time:"11:00", duration:45, status:"upcoming",  credits:45 },
];

// Incoming booking requests to the current user (as teacher)
const INCOMING_BOOKINGS = [
  { id:101, studentId:1, name:"Arjun Mehta",  avatar:"AM", rating:4.7, location:"Mumbai",    online:true,  skill:"Guitar",       date:"Today",    time:"10:00 AM", duration:30, status:"pending" },
  { id:102, studentId:2, name:"Sofia Reyes",  avatar:"SR", rating:4.9, location:"Madrid",    online:true,  skill:"Music Theory", date:"Today",    time:"02:00 PM", duration:45, status:"pending" },
  { id:103, studentId:4, name:"Priya Sharma", avatar:"PS", rating:5.0, location:"Bangalore", online:false, skill:"Guitar",       date:"Tomorrow", time:"11:00 AM", duration:60, status:"accepted"},
];

const SKILLS_CATALOG = ["Guitar","Piano","Violin","Drums","Music Theory","Spanish","French","German","Korean","Hindi","Japanese","Mandarin","Portuguese","Python","JavaScript","React.js","Data Science","Machine Learning","Photography","Lightroom","Drawing","Oil Painting","Watercolor","Yoga","Pilates","Cooking","Baking","Creative Writing","English","Storytelling","Blockchain","UI/UX Design","Video Editing","Meditation"];

const C = { bg:"#0a0a0f",surface:"#12121a",card:"#1a1a26",border:"#2a2a3d",accent:"#7c5cfc",accentL:"#a78bfa",gold:"#f5c842",green:"#22d3a0",red:"#f56565",text:"#e8e6f0",muted:"#8882a4" };

const ME = { id:0, name:"You", avatar:"YO", credits:60, rating:4.8, reviews:12, location:"Tiruppur, TN", bio:"Passionate skill-sharer!", skillsOffered:["Guitar","Music Theory","Hindi"], skillsWanted:["Python","Photography"], sessions:18, joinDate:"2025-01-01", online:true };

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("ss-styles")) return;
  const s = document.createElement("style");
  s.id = "ss-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#0a0a0f;color:#e8e6f0;font-family:'DM Sans',sans-serif;}
    ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#12121a;} ::-webkit-scrollbar-thumb{background:#2a2a3d;border-radius:3px;}
    .syne{font-family:'Syne',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes ringIn{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    @keyframes blink{0%,100%{box-shadow:0 0 0 0 rgba(124,92,252,.7)}70%{box-shadow:0 0 0 10px rgba(124,92,252,0)}}
    .fade-up{animation:fadeUp .4s ease both;}
    .pulse{animation:pulse 2s infinite;}
    .slide-in{animation:slideIn .4s ease both;}
    .ring-in{animation:ringIn .5s cubic-bezier(.34,1.56,.64,1) both;}
    .blink{animation:blink 1.4s infinite;}
    .card-h{transition:all .25s;cursor:pointer;}
    .card-h:hover{transform:translateY(-3px);border-color:#7c5cfc !important;box-shadow:0 8px 28px rgba(124,92,252,.18);}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .22s;border-radius:11px;padding:10px 20px;}
    .btn-p{background:linear-gradient(135deg,#7c5cfc,#a78bfa);color:#fff;}
    .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(124,92,252,.4);}
    .btn-g{background:linear-gradient(135deg,#22d3a0,#34d399);color:#fff;}
    .btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(34,211,160,.35);}
    .btn-r{background:linear-gradient(135deg,#f56565,#fc8181);color:#fff;}
    .btn-r:hover{transform:translateY(-2px);}
    .btn-ghost{background:transparent;border:1px solid #2a2a3d;color:#e8e6f0;padding:9px 18px;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:14px;cursor:pointer;transition:all .2s;}
    .btn-ghost:hover{border-color:#7c5cfc;color:#a78bfa;}
    .inp{background:#1a1a26;border:1px solid #2a2a3d;color:#e8e6f0;padding:11px 14px;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .25s;width:100%;}
    .inp:focus{border-color:#7c5cfc;}
    .inp::placeholder{color:#8882a4;}
    textarea.inp{resize:vertical;min-height:80px;}
    select.inp option{background:#1a1a26;}
    .tag{display:inline-flex;align-items:center;background:rgba(124,92,252,.13);border:1px solid rgba(124,92,252,.28);color:#a78bfa;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:500;}
    .tag-g{background:rgba(34,211,160,.11);border:1px solid rgba(34,211,160,.28);color:#22d3a0;}
    .tag-gold{background:rgba(245,200,66,.11);border:1px solid rgba(245,200,66,.28);color:#f5c842;}
    .nav-i{padding:9px 14px;border-radius:10px;cursor:pointer;transition:all .18s;color:#8882a4;font-size:14px;font-weight:500;display:flex;align-items:center;gap:9px;border:none;background:none;width:100%;font-family:'DM Sans',sans-serif;}
    .nav-i:hover{background:#1a1a26;color:#e8e6f0;}
    .nav-i.active{background:rgba(124,92,252,.15);color:#a78bfa;}
    .ctrl{width:50px;height:50px;border-radius:50%;border:1px solid #2a2a3d;background:#1a1a26;color:#e8e6f0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
    .ctrl:hover{border-color:#7c5cfc;background:rgba(124,92,252,.15);}
    .ctrl.off{border-color:#f56565 !important;background:rgba(245,101,101,.18) !important;color:#f56565 !important;}
    .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;}
    .modal{background:#1a1a26;border:1px solid #2a2a3d;border-radius:20px;padding:28px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;animation:fadeUp .3s ease;}
    .notif{position:fixed;top:20px;right:20px;z-index:999;width:340px;background:#1a1a26;border:1.5px solid rgba(124,92,252,.5);border-radius:18px;padding:20px;box-shadow:0 16px 48px rgba(0,0,0,.5);}
    .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:998;background:#1a1a26;border-radius:12px;padding:11px 20px;display:flex;align-items:center;gap:9px;font-size:14px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.45);white-space:nowrap;}
  `;
  document.head.appendChild(s);
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Ic = ({ d, size=18, color="currentColor", fill="none", sw=2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {typeof d==="string" ? <path d={d}/> : d}
  </svg>
);
const RAW = {
  home:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
  search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  cal:     <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  video:   <><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
  vidOff:  <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10M1 1l22 22"/>,
  user:    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  bell:    <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  coin:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 3h5.5"/></>,
  star:    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>,
  award:   <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  trend:   <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></>,
  clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>,
  swap:    <><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></>,
  logout:  <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></>,
  mic:     <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></>,
  micOff:  <><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"/></>,
  plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  check:   <polyline points="20,6 9,17 4,12"/>,
  phone:   <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>,
  send:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></>,
  board:   <><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  chat:    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
  teach:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
};

const Avatar = ({ u, size=40, online=false }) => {
  const cs = ["#7c5cfc","#22d3a0","#f5c842","#f56565","#60a5fa","#f472b6"];
  const c = cs[(u.id+3)%cs.length];
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${c}33,${c}66)`, border:`2px solid ${c}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.35, fontWeight:700, color:c, fontFamily:"Syne,sans-serif" }}>{u.avatar}</div>
      {online && u.online && <div style={{ position:"absolute", bottom:1, right:1, width:size*.24, height:size*.24, background:"#22d3a0", borderRadius:"50%", border:"2px solid #0a0a0f" }}/>}
    </div>
  );
};
const Stars = ({ r=5, sz=13 }) => (
  <div style={{ display:"flex", gap:2, alignItems:"center" }}>
    {[1,2,3,4,5].map(i=>(
      <Ic key={i} d={RAW.star} size={sz} color={i<=Math.round(r)?"#f5c842":"#2a2a3d"} fill={i<=Math.round(r)?"#f5c842":"#2a2a3d"} sw={1}/>
    ))}
    <span style={{ fontSize:sz-1, color:C.muted, marginLeft:3 }}>{r}</span>
  </div>
);
const Toast = ({ msg, onClose }) => {
  useEffect(()=>{ const t=setTimeout(onClose,3800); return()=>clearTimeout(t); });
  return <div className="toast slide-in" style={{ border:`1px solid ${msg.color||C.green}44` }}><span style={{ fontSize:18 }}>{msg.icon}</span>{msg.text}</div>;
};

// ─── INCOMING BOOKING ALERT ───────────────────────────────────────────────────
const BookingAlert = ({ b, onAccept, onDecline }) => (
  <div className="notif slide-in">
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div className="blink" style={{ width:9, height:9, background:C.accent, borderRadius:"50%" }}/>
        <span className="syne" style={{ fontWeight:700, fontSize:15 }}>New Booking Request!</span>
      </div>
      <button onClick={onDecline} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><Ic d={RAW.x} size={15} color={C.muted}/></button>
    </div>
    <div style={{ background:C.surface, borderRadius:12, padding:"11px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
      <Avatar u={b} size={44} online/>
      <div>
        <div style={{ fontWeight:700, fontSize:14 }}>{b.name}</div>
        <div style={{ fontSize:13, color:C.muted }}>wants to learn <span style={{ color:C.accentL, fontWeight:600 }}>{b.skill}</span></div>
        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>📅 {b.date} · {b.time} · {b.duration} min</div>
      </div>
    </div>
    <div style={{ display:"flex", gap:9 }}>
      <button className="btn btn-g" style={{ flex:1, padding:"9px 0", fontSize:13 }} onClick={onAccept}><Ic d={RAW.check} size={14} color="#fff"/> Accept</button>
      <button className="btn btn-r" style={{ flex:1, padding:"9px 0", fontSize:13 }} onClick={onDecline}><Ic d={RAW.x} size={14} color="#fff"/> Decline</button>
    </div>
    <div style={{ fontSize:12, color:C.muted, textAlign:"center", marginTop:8 }}>Earn <span style={{ color:C.gold, fontWeight:600 }}>{b.duration} credits</span> on completion</div>
  </div>
);

// ─── WHITEBOARD ───────────────────────────────────────────────────────────────
const Whiteboard = ({ onClose }) => {
  const ref = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#a78bfa");
  const [sz, setSz] = useState(3);
  const [tool, setTool] = useState("pen");
  const getPos = (e,c) => { const r=c.getBoundingClientRect(); const s=e.touches?e.touches[0]:e; return [s.clientX-r.left, s.clientY-r.top]; };
  const start = e => { drawing.current=true; const c=ref.current,ctx=c.getContext("2d"); const [x,y]=getPos(e,c); ctx.beginPath(); ctx.moveTo(x,y); e.preventDefault(); };
  const draw  = e => { if(!drawing.current)return; const c=ref.current,ctx=c.getContext("2d"); ctx.lineWidth=tool==="eraser"?sz*7:sz; ctx.strokeStyle=tool==="eraser"?"#0d0d18":color; ctx.lineCap="round"; ctx.lineJoin="round"; const [x,y]=getPos(e,c); ctx.lineTo(x,y); ctx.stroke(); e.preventDefault(); };
  const stop  = () => { drawing.current=false; };
  useEffect(()=>{ const c=ref.current; if(!c)return; c.width=c.offsetWidth; c.height=c.offsetHeight; const ctx=c.getContext("2d"); ctx.fillStyle="#0d0d18"; ctx.fillRect(0,0,c.width,c.height); },[]);
  const COLS = ["#a78bfa","#22d3a0","#f5c842","#f56565","#60a5fa","#fff","#f472b6"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.9)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:C.card, borderBottom:`1px solid ${C.border}`, padding:"9px 18px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <span className="syne" style={{ fontWeight:700 }}>🖊️ Whiteboard</span>
        <div style={{ display:"flex", gap:5 }}>{COLS.map(c=><button key={c} onClick={()=>{setColor(c);setTool("pen");}} style={{ width:22,height:22,borderRadius:"50%",background:c,border:`2px solid ${color===c&&tool==="pen"?"#fff":"transparent"}`,cursor:"pointer",transition:"transform .15s",transform:color===c&&tool==="pen"?"scale(1.25)":"scale(1)" }}/>)}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:12,color:C.muted }}>Size</span><input type="range" min={1} max={12} value={sz} onChange={e=>setSz(+e.target.value)} style={{ width:70 }}/><span style={{ fontSize:12,color:C.muted,width:14 }}>{sz}</span></div>
        <button className="btn-ghost" style={{ fontSize:13,padding:"6px 12px" }} onClick={()=>setTool(t=>t==="eraser"?"pen":"eraser")}>{tool==="eraser"?"✏️ Pen":"🧹 Eraser"}</button>
        <button className="btn-ghost" style={{ fontSize:13,padding:"6px 12px" }} onClick={()=>{ const c=ref.current; c.getContext("2d").clearRect(0,0,c.width,c.height); const ctx=c.getContext("2d"); ctx.fillStyle="#0d0d18"; ctx.fillRect(0,0,c.width,c.height); }}>Clear</button>
        <button className="btn btn-r" style={{ marginLeft:"auto",padding:"7px 16px",fontSize:13 }} onClick={onClose}>Close</button>
      </div>
      <canvas ref={ref} style={{ flex:1, cursor:tool==="eraser"?"cell":"crosshair", touchAction:"none" }} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
    </div>
  );
};

// ─── LIVE SESSION ─────────────────────────────────────────────────────────────
const LiveSession = ({ session, allUsers, currentUser, isTeacher, onEnd }) => {
  const other = isTeacher ? { ...allUsers.find(u=>u.id===session.studentId)||{}, name:session.name||"Student", avatar:session.avatar||"ST", online:true } : allUsers.find(u=>u.id===session.teacherId)||{name:"Teacher",avatar:"TC",online:true,id:99};
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted]     = useState(false);
  const [vidOff, setVidOff]   = useState(false);
  const [showWB, setShowWB]   = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [tab, setTab]         = useState("chat");
  const [chat, setChat]       = useState([
    { from:"system", text:`Session started! ${isTeacher?"Teaching":"Learning"} ${session.skill} 🎉` },
    { from:"other",  text: isTeacher ? "Hi! Ready to learn 😊" : "Welcome! Let's start the session." },
  ]);
  const [msg, setMsg]   = useState("");
  const [notes, setNotes] = useState("");
  const [handAlert, setHandAlert] = useState(false);
  const chatRef = useRef(null);

  useEffect(()=>{ const t=setInterval(()=>setElapsed(e=>e+1),1000); return()=>clearInterval(t); },[]);
  useEffect(()=>{
    const t1=setTimeout(()=>setHandAlert(true),20000);
    const t2=setTimeout(()=>{ setChat(c=>[...c,{ from:"other", text: isTeacher?"Could you explain that again? 🙋":"Can we try a practice exercise?" }]); },28000);
    return()=>{ clearTimeout(t1); clearTimeout(t2); };
  },[]);
  useEffect(()=>{ chatRef.current?.scrollTo(0,chatRef.current.scrollHeight); },[chat]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const dur = session.duration||30;
  const pct = Math.min((elapsed/(dur*60))*100,100);

  const send = () => {
    if(!msg.trim()) return;
    setChat(c=>[...c,{from:"me",text:msg}]);
    setMsg("");
    setTimeout(()=>{
      const rp = isTeacher
        ? ["Got it! 👍","That makes sense!","Can you show on whiteboard?","I'll try that!","Amazing! 🔥"]
        : ["Great explanation!","I understand now.","Let me try that.","Can we go slower?","Thanks! 😊"];
      setChat(c=>[...c,{from:"other",text:rp[Math.floor(Math.random()*rp.length)]}]);
    },1800);
  };

  return (
    <div style={{ height:"100vh", background:C.bg, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {showWB && <Whiteboard onClose={()=>setShowWB(false)}/>}

      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"9px 18px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <div className="syne" style={{ fontSize:15, fontWeight:700 }}>
            {isTeacher?"Teaching":"Learning"}: <span style={{ color:C.accentL }}>{session.skill}</span>
          </div>
          <div style={{ fontSize:12, color:C.muted }}>{isTeacher?"Student":"Teacher"}: {other.name}</div>
        </div>
        <div style={{ background:"rgba(245,101,101,.12)", border:"1px solid rgba(245,101,101,.3)", borderRadius:20, padding:"5px 14px", display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:7,height:7,background:C.red,borderRadius:"50%" }} className="pulse"/>
          <span style={{ fontFamily:"monospace",fontWeight:700,fontSize:14 }}>{fmt(elapsed)}</span>
          <span style={{ fontSize:12,color:C.muted }}>/ {fmt(dur*60)}</span>
        </div>
        <div style={{ background:"rgba(245,200,66,.1)", border:"1px solid rgba(245,200,66,.25)", borderRadius:10, padding:"5px 12px", display:"flex", alignItems:"center", gap:5 }}>
          <Ic d={RAW.coin} size={14} color={C.gold}/><span style={{ color:C.gold,fontWeight:700,fontSize:13 }}>{isTeacher?"+":"-"}{dur} credits on end</span>
        </div>
        {handAlert && (
          <div className="ring-in" style={{ background:"rgba(245,200,66,.14)", border:"1px solid rgba(245,200,66,.4)", borderRadius:10, padding:"5px 12px", fontSize:13, color:C.gold, display:"flex", alignItems:"center", gap:6 }}>
            ✋ {other.name} raised hand
            <button onClick={()=>setHandAlert(false)} style={{ background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:15,padding:0 }}>×</button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ height:3, background:C.border }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg,${C.accent},${C.green})`, width:`${pct}%`, transition:"width 1s linear" }}/>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Videos */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12, padding:16, overflow:"hidden" }}>
          {/* Other person (large) */}
          <div style={{ flex:1, background:"linear-gradient(135deg,#13131f,#0d0d18)", borderRadius:16, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", minHeight:0 }}>
            <div style={{ textAlign:"center" }}>
              <Avatar u={other} size={80} online/>
              <div className="syne" style={{ marginTop:12,fontSize:18,fontWeight:700 }}>{other.name}</div>
              <div style={{ color:C.muted,fontSize:13,marginTop:3 }}>{other.location||""}</div>
              <div style={{ marginTop:10, display:"flex", gap:8, justifyContent:"center" }}>
                <span className="tag-g" style={{ fontSize:12 }}>● Live</span>
                <span className="tag" style={{ fontSize:12 }}>{isTeacher?"Learning":"Teaching"} {session.skill}</span>
              </div>
            </div>
            <div style={{ position:"absolute",bottom:12,left:12,background:"rgba(0,0,0,.65)",backdropFilter:"blur(4px)",borderRadius:7,padding:"3px 10px",fontSize:12 }}>{other.name}</div>
          </div>

          {/* Self (small) */}
          <div style={{ height:120, background:"linear-gradient(135deg,#0d0d18,#12121a)", borderRadius:14, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0, opacity:vidOff?.55:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <Avatar u={currentUser} size={48} online/>
              <div><div style={{ fontWeight:600 }}>You ({isTeacher?"Teacher":"Student"})</div><div style={{ fontSize:12,color:C.muted }}>{muted?"🔇 Muted":"🎙️ Live"}</div></div>
            </div>
            {vidOff && <div style={{ position:"absolute",inset:0,background:"rgba(10,10,15,.75)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center" }}><Ic d={RAW.vidOff} size={26} color={C.muted}/></div>}
            <div style={{ position:"absolute",bottom:8,left:12,background:"rgba(0,0,0,.65)",borderRadius:6,padding:"2px 9px",fontSize:11 }}>You</div>
          </div>

          {/* Controls */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:12, flexShrink:0 }}>
            <button className={`ctrl${muted?" off":""}`} onClick={()=>setMuted(m=>!m)} title="Mute"><Ic d={muted?RAW.micOff:RAW.mic} size={19} color={muted?"#f56565":"currentColor"}/></button>
            <button className={`ctrl${vidOff?" off":""}`} onClick={()=>setVidOff(v=>!v)} title="Camera"><Ic d={vidOff?RAW.vidOff:RAW.video} size={19} color={vidOff?"#f56565":"currentColor"}/></button>
            {isTeacher && <button className="ctrl" onClick={()=>setShowWB(true)} title="Whiteboard"><Ic d={RAW.board} size={19}/></button>}
            <button className="ctrl" onClick={()=>setShowChat(s=>!s)} style={showChat?{borderColor:C.accent,background:"rgba(124,92,252,.15)",color:C.accentL}:{}} title="Chat"><Ic d={RAW.chat} size={19} color={showChat?C.accentL:"currentColor"}/></button>
            <button className="btn btn-r" style={{ padding:"11px 26px", borderRadius:24, marginLeft:6 }} onClick={onEnd}>
              <Ic d={RAW.phone} size={15} color="#fff" fill="#fff" sw={1}/> End Session
            </button>
          </div>
        </div>

        {/* Chat panel */}
        {showChat && (
          <div style={{ width:295, borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:C.surface, flexShrink:0 }}>
            <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
              {[["chat","💬 Chat"],["notes","📝 Notes"]].map(([t,l])=>(
                <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"11px 0",background:tab===t?"rgba(124,92,252,.12)":"transparent",border:"none",color:tab===t?C.accentL:C.muted,fontFamily:"DM Sans,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",borderBottom:tab===t?`2px solid ${C.accent}`:"2px solid transparent",transition:"all .2s" }}>{l}</button>
              ))}
            </div>
            {tab==="chat" && (<>
              <div ref={chatRef} style={{ flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:9 }}>
                {chat.map((m,i)=>(
                  <div key={i}>
                    {m.from==="system" && <div style={{ textAlign:"center",background:"rgba(124,92,252,.1)",borderRadius:8,padding:"5px 9px",fontSize:12,color:C.muted }}>{m.text}</div>}
                    {m.from==="me"     && <div style={{ alignSelf:"flex-end",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2 }}><span style={{ fontSize:11,color:C.muted }}>You</span><div style={{ background:"rgba(124,92,252,.24)",borderRadius:"11px 11px 2px 11px",padding:"7px 11px",maxWidth:"88%",fontSize:13,lineHeight:1.5 }}>{m.text}</div></div>}
                    {m.from==="other"  && <div style={{ display:"flex",flexDirection:"column",gap:2 }}><span style={{ fontSize:11,color:C.muted }}>{other.name}</span><div style={{ background:C.card,borderRadius:"11px 11px 11px 2px",padding:"7px 11px",maxWidth:"88%",fontSize:13,lineHeight:1.5 }}>{m.text}</div></div>}
                  </div>
                ))}
              </div>
              <div style={{ padding:10,borderTop:`1px solid ${C.border}`,display:"flex",gap:7 }}>
                <input className="inp" style={{ flex:1,padding:"8px 11px",fontSize:13 }} placeholder="Send a message..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
                <button onClick={send} style={{ width:36,height:36,background:`linear-gradient(135deg,${C.accent},${C.accentL})`,border:"none",borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Ic d={RAW.send} size={14} color="#fff"/></button>
              </div>
            </>)}
            {tab==="notes" && (
              <div style={{ flex:1,display:"flex",flexDirection:"column",padding:12,gap:8 }}>
                <div style={{ fontSize:12,color:C.muted }}>Private notes (only visible to you)</div>
                <textarea className="inp" style={{ flex:1,resize:"none",fontSize:13,lineHeight:1.6 }} placeholder={`Session notes...\n\n- Topics covered\n- Progress\n- Next steps`} value={notes} onChange={e=>setNotes(e.target.value)}/>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SESSION SUMMARY ──────────────────────────────────────────────────────────
const SessionSummary = ({ session, isTeacher, creditChange, onClose }) => {
  const [rating, setRating] = useState(0);
  const [done, setDone]     = useState(false);
  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div className="ring-in" style={{ maxWidth:440,width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:34,textAlign:"center" }}>
        <div style={{ fontSize:56,marginBottom:14 }}>🎓</div>
        <div className="syne" style={{ fontSize:22,fontWeight:800,marginBottom:6 }}>Session Complete!</div>
        <div style={{ color:C.muted,fontSize:14,marginBottom:26 }}>{isTeacher?`You taught ${session.skill}`:`You learned ${session.skill}`}</div>
        <div style={{ background:"linear-gradient(135deg,rgba(245,200,66,.14),rgba(124,92,252,.1))",border:"1px solid rgba(245,200,66,.3)",borderRadius:14,padding:"18px 22px",marginBottom:22 }}>
          <div style={{ fontSize:13,color:C.muted,marginBottom:6 }}>{isTeacher?"Credits Earned":"Credits Spent"}</div>
          <div className="syne" style={{ fontSize:40,fontWeight:800,color:isTeacher?C.gold:C.red,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <Ic d={RAW.coin} size={34} color={isTeacher?C.gold:C.red}/>{isTeacher?"+":"-"}{session.duration||30}
          </div>
        </div>
        {!done ? (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14,fontWeight:600,marginBottom:10 }}>Rate this session</div>
            <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:14 }}>
              {[1,2,3,4,5].map(i=>(
                <button key={i} onClick={()=>setRating(i)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:32,transition:"transform .15s",transform:rating>=i?"scale(1.15)":"scale(1)" }}>{rating>=i?"⭐":"☆"}</button>
              ))}
            </div>
            {rating>0 && <button className="btn btn-g" style={{ width:"100%",padding:"12px 0",fontSize:14,marginBottom:8 }} onClick={()=>setDone(true)}>Submit Rating</button>}
          </div>
        ):(
          <div style={{ background:"rgba(34,211,160,.1)",border:"1px solid rgba(34,211,160,.25)",borderRadius:10,padding:12,marginBottom:18,color:C.green,fontWeight:600 }}>✅ Rating submitted!</div>
        )}
        <button className="btn btn-p" style={{ width:"100%",padding:"12px 0",fontSize:14 }} onClick={onClose}>Back to Dashboard</button>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ user, users, sessions, bookings, onBook, onStartSession, onNavigate, onAcceptBooking, onDeclineBooking }) => {
  const upcoming  = sessions.filter(s=>(s.learnerId===user.id||s.teacherId===user.id)&&s.status==="upcoming");
  const accepted  = sessions.filter(s=>s.teacherId===user.id&&s.status==="accepted");
  const completed = sessions.filter(s=>(s.learnerId===user.id||s.teacherId===user.id)&&s.status==="completed");
  const pendingBookings = bookings.filter(b=>b.status==="pending");

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,rgba(124,92,252,.18),rgba(34,211,160,.09))",border:"1px solid rgba(124,92,252,.28)",borderRadius:18,padding:"24px 28px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",right:-20,top:-20,width:160,height:160,background:"radial-gradient(circle,rgba(124,92,252,.14) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" }}/>
        <div style={{ fontSize:13,color:C.accentL,marginBottom:6,fontWeight:500 }}>Welcome back 👋</div>
        <div className="syne" style={{ fontSize:24,fontWeight:800,marginBottom:12 }}>Hello, {user.name.split(" ")[0]}!</div>
        <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
          {[
            [RAW.coin,"#f5c842",user.credits,"Credits"],
            [RAW.cal,C.green,upcoming.length+accepted.length,"Upcoming"],
            [RAW.award,C.accentL,completed.length+user.sessions,"Sessions"],
          ].map(([icon,color,val,label])=>(
            <div key={label} style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ background:`${color}22`,borderRadius:8,padding:"5px 9px",display:"flex",gap:5,alignItems:"center" }}>
                <Ic d={icon} size={15} color={color}/><span style={{ fontWeight:700,color,fontSize:17 }}>{val}</span>
              </div>
              <span style={{ color:C.muted,fontSize:13 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending booking requests */}
      {pendingBookings.length>0 && (
        <div style={{ background:"linear-gradient(135deg,rgba(124,92,252,.1),rgba(34,211,160,.07))",border:"1px solid rgba(124,92,252,.3)",borderRadius:16,padding:20 }}>
          <div className="syne" style={{ fontWeight:700,fontSize:16,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
            <div className="blink" style={{ width:8,height:8,background:C.accent,borderRadius:"50%" }}/> Teaching Requests ({pendingBookings.length})
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {pendingBookings.map(b=>(
              <div key={b.id} className="fade-up" style={{ background:C.surface,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                <Avatar u={b} size={40} online/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:14 }}>{b.name} <span style={{ color:C.muted,fontWeight:400,fontSize:13 }}>wants to learn</span> <span style={{ color:C.accentL,fontWeight:600 }}>{b.skill}</span></div>
                  <div style={{ fontSize:12,color:C.muted }}>📅 {b.date} · {b.time} · {b.duration} min · <span style={{ color:C.gold }}>+{b.duration} credits</span></div>
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button className="btn btn-g" style={{ padding:"7px 14px",fontSize:13 }} onClick={()=>onAcceptBooking(b.id)}><Ic d={RAW.check} size={13} color="#fff"/> Accept</button>
                  <button className="btn btn-r" style={{ padding:"7px 14px",fontSize:13 }} onClick={()=>onDeclineBooking(b.id)}><Ic d={RAW.x} size={13} color="#fff"/> Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready to start */}
      {accepted.length>0 && (
        <div>
          <div className="syne" style={{ fontWeight:700,fontSize:16,marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
            <div className="pulse" style={{ width:8,height:8,background:C.green,borderRadius:"50%" }}/> Ready to Start Teaching
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {accepted.map(s=>{
              const b = bookings.find(bk=>bk.id===s.bookingRef)||{};
              const student = users.find(u=>u.id===s.learnerId)||{ name:"Student", avatar:"ST", id:s.learnerId, online:true, location:"" };
              return (
                <div key={s.id} style={{ background:"linear-gradient(135deg,rgba(34,211,160,.08),rgba(124,92,252,.06))",border:"1px solid rgba(34,211,160,.25)",borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
                  <Avatar u={student} size={46} online/>
                  <div style={{ flex:1 }}>
                    <div className="syne" style={{ fontWeight:700,fontSize:15 }}>{student.name}</div>
                    <div style={{ fontSize:13,color:C.muted }}>Learning <span style={{ color:C.accentL }}>{s.skill}</span> · {s.date} · {s.time} · {s.duration} min</div>
                    <div style={{ fontSize:12,color:C.green,marginTop:3 }}>+{s.duration} credits on completion</div>
                  </div>
                  <button className="btn btn-p" onClick={()=>onStartSession(s,true)} style={{ padding:"10px 20px" }}>
                    <Ic d={RAW.video} size={15} color="#fff"/> Start Teaching
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14 }}>
        {[
          { label:"Platform Users",val:"12,847",icon:RAW.user,  color:C.accent },
          { label:"Skills",        val:"340+",  icon:RAW.trend, color:C.green  },
          { label:"Sessions Today",val:"1,203", icon:RAW.video, color:C.gold   },
          { label:"Credits Given", val:"89K",   icon:RAW.coin,  color:"#f472b6"},
        ].map(st=>(
          <div key={st.label} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:18 }}>
            <div style={{ background:`${st.color}1e`,borderRadius:9,padding:7,display:"inline-flex",marginBottom:10 }}><Ic d={st.icon} size={17} color={st.color}/></div>
            <div className="syne" style={{ fontSize:22,fontWeight:700,marginBottom:3 }}>{st.val}</div>
            <div style={{ fontSize:13,color:C.muted }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
        {/* Top tutors */}
        <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div className="syne" style={{ fontWeight:700,fontSize:15 }}>Top Tutors</div>
            <button onClick={()=>onNavigate("browse")} style={{ fontSize:12,color:C.accentL,background:"none",border:"none",cursor:"pointer" }}>View all →</button>
          </div>
          {users.filter(u=>u.id!==user.id).sort((a,b)=>b.rating-a.rating).slice(0,4).map((u,i)=>(
            <div key={u.id} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
              <span style={{ fontSize:13,color:C.muted,width:14,textAlign:"center" }}>{i+1}</span>
              <Avatar u={u} size={34} online/>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{u.name}</div>
                <div style={{ fontSize:12,color:C.muted }}>{u.skillsOffered[0]}</div>
              </div>
              <Stars r={u.rating} sz={11}/>
            </div>
          ))}
        </div>

        {/* Upcoming sessions */}
        <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20 }}>
          <div className="syne" style={{ fontWeight:700,fontSize:15,marginBottom:16 }}>Upcoming Sessions</div>
          {upcoming.length===0 && accepted.length===0 ? (
            <div style={{ textAlign:"center",padding:"20px 0" }}>
              <div style={{ fontSize:30,marginBottom:8 }}>📅</div>
              <div style={{ color:C.muted,fontSize:13 }}>No upcoming sessions</div>
              <button className="btn btn-p" onClick={()=>onNavigate("browse")} style={{ marginTop:10,padding:"7px 14px",fontSize:12 }}>Find a Tutor</button>
            </div>
          ) : (
            [...upcoming,...accepted].slice(0,3).map(s=>{
              const isT = s.teacherId===user.id;
              const other = users.find(u=>u.id===(isT?s.learnerId:s.teacherId))||{name:"User",avatar:"US",id:99,online:false};
              return (
                <div key={s.id} style={{ background:C.surface,borderRadius:10,padding:"11px 13px",display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <Avatar u={other} size={30}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600,fontSize:13 }}>{s.skill} <span style={{ fontSize:11,color:isT?C.green:C.accentL }}>{isT?"(Teaching)":"(Learning)"}</span></div>
                    <div style={{ fontSize:12,color:C.muted }}>{s.date} · {s.time}</div>
                  </div>
                  <button className="btn btn-p" style={{ padding:"5px 11px",fontSize:12 }} onClick={()=>onStartSession(s,isT)}>
                    <Ic d={RAW.video} size={12} color="#fff"/> Join
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recommended */}
      <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20 }}>
        <div className="syne" style={{ fontWeight:700,fontSize:15,marginBottom:16 }}>Recommended for You</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12 }}>
          {users.filter(u=>u.id!==user.id).slice(0,4).map(u=>(
            <div key={u.id} className="card-h" onClick={()=>onBook(u)} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <Avatar u={u} size={38} online/>
                <div><div style={{ fontWeight:600,fontSize:13 }}>{u.name}</div><Stars r={u.rating} sz={11}/></div>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {u.skillsOffered.slice(0,2).map(s=><span key={s} className="tag" style={{ fontSize:11 }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── BROWSE ───────────────────────────────────────────────────────────────────
const Browse = ({ users, currentUser, onBook }) => {
  const [search,setSearch]   = useState("");
  const [filter,setFilter]   = useState("");
  const [sort,setSort]       = useState("rating");
  const filtered = users.filter(u=>u.id!==currentUser.id)
    .filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.skillsOffered.some(s=>s.toLowerCase().includes(search.toLowerCase())))
    .filter(u=>!filter||u.skillsOffered.includes(filter))
    .sort((a,b)=>sort==="rating"?b.rating-a.rating:sort==="sessions"?b.sessions-a.sessions:b.credits-a.credits);
  return (
    <div>
      <div className="syne" style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>Browse Skills</div>
      <div style={{ color:C.muted,fontSize:14,marginBottom:20 }}>Find the perfect tutor for your learning goals</div>
      <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap" }}>
        <div style={{ flex:1,minWidth:180,position:"relative" }}>
          <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted }}><Ic d={RAW.search} size={15}/></div>
          <input className="inp" style={{ paddingLeft:38 }} placeholder="Search skills or tutors..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="inp" style={{ width:170 }} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All Skills</option>
          {SKILLS_CATALOG.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="inp" style={{ width:150 }} value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="sessions">Most Sessions</option>
          <option value="credits">Most Active</option>
        </select>
      </div>
      <div style={{ fontSize:13,color:C.muted,marginBottom:14 }}>{filtered.length} tutor{filtered.length!==1?"s":""} found</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16 }}>
        {filtered.map(u=>(
          <div key={u.id} className="card-h" style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22 }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:14 }}>
              <Avatar u={u} size={50} online/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
                  <div className="syne" style={{ fontWeight:700,fontSize:15 }}>{u.name}</div>
                  {u.online&&<div style={{ width:7,height:7,background:C.green,borderRadius:"50%" }} className="pulse"/>}
                </div>
                <Stars r={u.rating}/>
                <div style={{ fontSize:12,color:C.muted,marginTop:3 }}>📍 {u.location}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ display:"flex",alignItems:"center",gap:3,color:C.gold }}><Ic d={RAW.coin} size={13} color={C.gold}/><span style={{ fontWeight:700,fontSize:14 }}>{u.credits}</span></div>
                <div style={{ fontSize:11,color:C.muted }}>credits</div>
              </div>
            </div>
            <p style={{ fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.6 }}>{u.bio}</p>
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:11,color:C.muted,marginBottom:5,fontWeight:500 }}>TEACHES</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{u.skillsOffered.map(s=><span key={s} className="tag">{s}</span>)}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11,color:C.muted,marginBottom:5,fontWeight:500 }}>WANTS TO LEARN</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{u.skillsWanted.map(s=><span key={s} className="tag-g">{s}</span>)}</div>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn btn-p" style={{ flex:1 }} onClick={()=>onBook(u)}><Ic d={RAW.cal} size={14} color="#fff"/> Book Session</button>
              <div style={{ display:"flex",alignItems:"center",gap:5,background:C.surface,borderRadius:9,padding:"0 11px",fontSize:12,color:C.muted }}><Ic d={RAW.award} size={13} color={C.muted}/>{u.sessions}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SESSIONS PAGE ────────────────────────────────────────────────────────────
const SessionsPage = ({ sessions, users, bookings, currentUser, onJoin, onReview }) => {
  const [tab,setTab] = useState("upcoming");
  const all = sessions.filter(s=>s.learnerId===currentUser.id||s.teacherId===currentUser.id);
  const shown = tab==="upcoming" ? all.filter(s=>s.status==="upcoming"||s.status==="accepted") : all.filter(s=>s.status==="completed");
  const StatusBadge = ({ s }) => {
    const isT = s.teacherId===currentUser.id;
    return <span className={isT?"tag-gold":"tag"} style={{ fontSize:11 }}>{isT?"Teaching":"Learning"}</span>;
  };
  return (
    <div>
      <div className="syne" style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>My Sessions</div>
      <div style={{ color:C.muted,fontSize:14,marginBottom:20 }}>Track your learning and teaching history</div>
      <div style={{ display:"flex",gap:8,marginBottom:20 }}>
        {["upcoming","completed"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px",borderRadius:9,border:`1px solid ${tab===t?C.accent:C.border}`,background:tab===t?"rgba(124,92,252,.18)":"transparent",color:tab===t?C.accentL:C.muted,fontFamily:"DM Sans,sans-serif",fontSize:14,cursor:"pointer",textTransform:"capitalize",transition:"all .2s" }}>
            {t} <span style={{ background:C.surface,borderRadius:20,padding:"1px 7px",fontSize:12,marginLeft:4 }}>{all.filter(s=>tab==="upcoming"?s.status==="upcoming"||s.status==="accepted":s.status==="completed").length}</span>
          </button>
        ))}
      </div>
      {shown.length===0 ? (
        <div style={{ textAlign:"center",padding:"60px 0",color:C.muted }}>
          <div style={{ fontSize:44,marginBottom:14 }}>{tab==="upcoming"?"📅":"🎓"}</div>
          <div style={{ fontSize:16,fontWeight:500 }}>No {tab} sessions</div>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {shown.map(s=>{
            const isT = s.teacherId===currentUser.id;
            const other = users.find(u=>u.id===(isT?s.learnerId:s.teacherId))||{name:"User",avatar:"US",id:99,online:false};
            return (
              <div key={s.id} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
                <Avatar u={other} size={46} online/>
                <div style={{ flex:1,minWidth:150 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:4 }}>
                    <div className="syne" style={{ fontWeight:700,fontSize:15 }}>{s.skill}</div>
                    <StatusBadge s={s}/>
                  </div>
                  <div style={{ fontSize:13,color:C.muted,marginBottom:5 }}>with {other.name} · {s.date} at {s.time}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <span style={{ fontSize:13,color:C.muted }}><Ic d={RAW.clock} size={12} color={C.muted}/> {s.duration} min</span>
                    <span style={{ fontSize:13,display:"flex",alignItems:"center",gap:3,color:isT?C.green:C.red }}>
                      <Ic d={RAW.coin} size={12} color={isT?C.green:C.red}/>{isT?"+":"-"}{s.credits}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex",gap:9 }}>
                  {(s.status==="upcoming"||s.status==="accepted") && (
                    <button className="btn btn-p" style={{ padding:"8px 18px",fontSize:13 }} onClick={()=>onJoin(s,isT)}>
                      <Ic d={RAW.video} size={13} color="#fff"/> {isT?"Start Teaching":"Join"}
                    </button>
                  )}
                  {s.status==="completed"&&!s.teacherRating && <button className="btn-ghost" style={{ padding:"7px 14px",fontSize:13 }} onClick={()=>onReview(s)}>Rate</button>}
                  {s.status==="completed"&&s.teacherRating && <Stars r={isT?s.learnerRating:s.teacherRating}/>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const Profile = ({ user, setUser, toast }) => {
  const [editing,setEditing] = useState(false);
  const [form,setForm]       = useState({...user});
  const [nO,setNO] = useState(""); const [nW,setNW] = useState("");
  const save = () => { setUser(form); setEditing(false); toast({icon:"✅",text:"Profile updated!",color:C.green}); };
  return (
    <div style={{ maxWidth:680,margin:"0 auto" }}>
      <div style={{ background:"linear-gradient(135deg,rgba(124,92,252,.14),rgba(34,211,160,.08))",border:"1px solid rgba(124,92,252,.24)",borderRadius:18,padding:26,marginBottom:18,display:"flex",alignItems:"flex-start",gap:20,flexWrap:"wrap" }}>
        <Avatar u={user} size={76} online/>
        <div style={{ flex:1 }}>
          <div className="syne" style={{ fontSize:21,fontWeight:800,marginBottom:3 }}>{user.name}</div>
          <div style={{ color:C.muted,fontSize:13,marginBottom:10 }}>📍 {user.location} · Member since {user.joinDate}</div>
          <div style={{ display:"flex",gap:18,flexWrap:"wrap" }}>
            {[["Credits",user.credits,C.gold],[`Sessions`,user.sessions,C.accentL],["Rating",user.rating||"New",C.green],["Reviews",user.reviews,C.text]].map(([l,v,c])=>(
              <div key={l} style={{ textAlign:"center" }}><div className="syne" style={{ fontSize:20,fontWeight:700,color:c }}>{v}</div><div style={{ fontSize:11,color:C.muted }}>{l}</div></div>
            ))}
          </div>
        </div>
        <button className={editing?"btn btn-g":"btn-ghost"} onClick={editing?save:()=>setEditing(true)} style={{ padding:"9px 18px" }}>{editing?"Save Changes":"Edit Profile"}</button>
      </div>

      <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:14 }}>
        <div className="syne" style={{ fontWeight:700,marginBottom:12 }}>About Me</div>
        {editing ? <textarea className="inp" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/> : <p style={{ color:C.muted,lineHeight:1.7,fontSize:14 }}>{user.bio}</p>}
      </div>

      {[["skillsOffered","Skills I Teach","tag",nO,setNO],["skillsWanted","Skills I Want","tag-g",nW,setNW]].map(([key,title,cls,val,setter])=>(
        <div key={key} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:14 }}>
          <div className="syne" style={{ fontWeight:700,marginBottom:12 }}>{title}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:editing?12:0 }}>
            {(editing?form[key]:user[key]).map(s=>(
              <span key={s} className={cls} style={{ display:"flex",alignItems:"center",gap:5 }}>{s}{editing&&<button onClick={()=>setForm({...form,[key]:form[key].filter(x=>x!==s)})} style={{ background:"none",border:"none",cursor:"pointer",color:"inherit",padding:0,fontSize:13 }}>×</button>}</span>
            ))}
            {(editing?form[key]:user[key]).length===0&&<span style={{ color:C.muted,fontSize:13 }}>None added</span>}
          </div>
          {editing&&(
            <div style={{ display:"flex",gap:8 }}>
              <select className="inp" value={val} onChange={e=>setter(e.target.value)} style={{ flex:1 }}>
                <option value="">Add a skill...</option>
                {SKILLS_CATALOG.filter(s=>!form[key].includes(s)).map(s=><option key={s}>{s}</option>)}
              </select>
              <button className="btn btn-p" style={{ padding:"0 14px" }} onClick={()=>{ if(val&&!form[key].includes(val)){setForm({...form,[key]:[...form[key],val]});setter("");} }}><Ic d={RAW.plus} size={15} color="#fff"/></button>
            </div>
          )}
        </div>
      ))}

      <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22 }}>
        <div className="syne" style={{ fontWeight:700,marginBottom:12 }}>Time Credits</div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div><div style={{ fontSize:38,fontWeight:800,color:C.gold,fontFamily:"Syne,sans-serif" }}>{user.credits}</div><div style={{ fontSize:13,color:C.muted }}>Available</div></div>
          <div style={{ textAlign:"right",fontSize:13,color:C.muted }}><div>1 credit = 1 minute of teaching</div><div style={{ marginTop:4 }}>Teach to earn · Learn to spend</div></div>
        </div>
        <div style={{ background:C.border,borderRadius:4,height:6,overflow:"hidden" }}><div style={{ height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accentL})`,width:`${Math.min((user.credits/200)*100,100)}%`,transition:"width .6s ease",borderRadius:4 }}/></div>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:5,fontSize:12,color:C.muted }}><span>0</span><span>200 (Gold)</span></div>
      </div>
    </div>
  );
};

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
const BookingModal = ({ tutor, currentUser, onConfirm, onClose, showToast }) => {
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({ skill:tutor.skillsOffered[0]||"", date:"", time:"", duration:30 });
  const times = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];
  const cost = form.duration;
  const confirm = () => {
    if(currentUser.credits<cost){ showToast({icon:"⚠️",text:"Not enough credits!",color:C.red}); return; }
    onConfirm({ teacherId:tutor.id, learnerId:currentUser.id, skill:form.skill, date:form.date, time:form.time, duration:form.duration, status:"upcoming", credits:cost, id:Date.now() });
    onClose();
  };
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div className="syne" style={{ fontWeight:700,fontSize:17 }}>Book a Session</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer" }}><Ic d={RAW.x} size={18} color={C.muted}/></button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12,background:C.surface,borderRadius:12,padding:14,marginBottom:20 }}>
          <Avatar u={tutor} size={46} online/><div><div className="syne" style={{ fontWeight:700 }}>{tutor.name}</div><Stars r={tutor.rating}/><div style={{ fontSize:12,color:C.muted }}>{tutor.reviews} reviews</div></div>
        </div>
        {step===1 && (
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Skill</label>
              <select className="inp" value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})}>{tutor.skillsOffered.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Date</label>
              <input className="inp" type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Time</label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7 }}>
                {times.map(t=><button key={t} onClick={()=>setForm({...form,time:t})} style={{ padding:"7px 0",borderRadius:9,border:`1px solid ${form.time===t?C.accent:C.border}`,background:form.time===t?"rgba(124,92,252,.2)":C.surface,color:form.time===t?C.accentL:C.muted,fontSize:12,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .18s" }}>{t}</button>)}
              </div></div>
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Duration</label>
              <div style={{ display:"flex",gap:8 }}>
                {[30,45,60].map(d=><button key={d} onClick={()=>setForm({...form,duration:d})} style={{ flex:1,padding:"9px 0",borderRadius:9,border:`1px solid ${form.duration===d?C.accent:C.border}`,background:form.duration===d?"rgba(124,92,252,.2)":C.surface,color:form.duration===d?C.accentL:C.muted,fontSize:14,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .18s" }}>{d} min</button>)}
              </div></div>
            <button className="btn btn-p" style={{ padding:"12px 0",fontSize:14 }} onClick={()=>{ if(!form.date||!form.time){showToast({icon:"⚠️",text:"Pick date & time",color:C.gold});return;} setStep(2); }}>Review →</button>
          </div>
        )}
        {step===2 && (
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div style={{ background:C.surface,borderRadius:12,padding:18 }}>
              <div className="syne" style={{ fontWeight:700,marginBottom:12 }}>Summary</div>
              {[["Skill",form.skill],["Date",form.date],["Time",form.time],["Duration",`${form.duration} min`],["With",tutor.name]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:14 }}>
                  <span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontSize:15,fontWeight:700 }}>
                <span>Credits</span><span style={{ color:C.gold,display:"flex",alignItems:"center",gap:5 }}><Ic d={RAW.coin} size={15} color={C.gold}/>{cost}</span>
              </div>
            </div>
            <div style={{ background:currentUser.credits>=cost?"rgba(34,211,160,.1)":"rgba(245,101,101,.1)",border:`1px solid ${currentUser.credits>=cost?"rgba(34,211,160,.3)":"rgba(245,101,101,.3)"}`,borderRadius:10,padding:12,fontSize:13 }}>
              <div style={{ display:"flex",justifyContent:"space-between" }}><span style={{ color:C.muted }}>Balance</span><span style={{ fontWeight:700,color:currentUser.credits>=cost?C.green:C.red }}>{currentUser.credits}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:5 }}><span style={{ color:C.muted }}>After</span><span style={{ fontWeight:700 }}>{currentUser.credits-cost}</span></div>
            </div>
            <div style={{ display:"flex",gap:9 }}>
              <button className="btn-ghost" onClick={()=>setStep(1)} style={{ flex:1 }}>← Back</button>
              <button className="btn btn-p" onClick={confirm} style={{ flex:2 }}>Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
const ReviewModal = ({ session, users, currentUser, onSubmit, onClose }) => {
  const [rating,setRating] = useState(5);
  const isT = session.teacherId===currentUser.id;
  const other = users.find(u=>u.id===(isT?session.learnerId:session.teacherId))||{name:"User",avatar:"US",id:99};
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div className="syne" style={{ fontWeight:700,fontSize:17 }}>Rate Session</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer" }}><Ic d={RAW.x} size={18} color={C.muted}/></button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12,background:C.surface,borderRadius:12,padding:14,marginBottom:20 }}>
          <Avatar u={other} size={44}/><div><div className="syne" style={{ fontWeight:700 }}>{other.name}</div><div style={{ color:C.muted,fontSize:13 }}>{session.skill} · {session.duration} min</div></div>
        </div>
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <div style={{ fontSize:14,fontWeight:600,marginBottom:12 }}>Overall Rating</div>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            {[1,2,3,4,5].map(i=><button key={i} onClick={()=>setRating(i)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:34,transition:"transform .15s",transform:rating>=i?"scale(1.15)":"scale(1)" }}>{rating>=i?"⭐":"☆"}</button>)}
          </div>
          <div style={{ marginTop:8,color:C.muted,fontSize:14 }}>{["","Poor","Fair","Good","Great","Excellent!"][rating]}</div>
        </div>
        <button className="btn btn-p" style={{ width:"100%",padding:"12px 0",fontSize:14 }} onClick={()=>{ onSubmit(session.id,rating); onClose(); }}>Submit Review</button>
      </div>
    </div>
  );
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const Auth = ({ onLogin }) => {
  const [mode,setMode] = useState("login");
  const [form,setForm] = useState({ name:"",email:"",password:"",skill:"" });
  const submit = () => onLogin(mode==="register"?{ ...ME, name:form.name||"New User", avatar:(form.name||"NU").slice(0,2).toUpperCase(), skillsOffered:form.skill?[form.skill]:[], credits:0 }:ME);
  return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ position:"fixed",inset:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",top:"12%",left:"18%",width:380,height:380,background:"radial-gradient(circle,rgba(124,92,252,.11) 0%,transparent 70%)",borderRadius:"50%" }}/>
        <div style={{ position:"absolute",bottom:"18%",right:"12%",width:280,height:280,background:"radial-gradient(circle,rgba(34,211,160,.07) 0%,transparent 70%)",borderRadius:"50%" }}/>
      </div>
      <div style={{ width:"100%",maxWidth:440,animation:"fadeUp .6s ease" }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:44,height:44,background:"linear-gradient(135deg,#7c5cfc,#22d3a0)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center" }}><Ic d={RAW.swap} size={22} color="#fff"/></div>
            <span className="syne" style={{ fontSize:26,fontWeight:800,background:"linear-gradient(135deg,#a78bfa,#22d3a0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>SkillSwap</span>
          </div>
          <p style={{ color:C.muted,fontSize:14 }}>Trade skills. Grow together. No money needed.</p>
        </div>
        <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:28 }}>
          <div style={{ display:"flex",background:C.surface,borderRadius:10,padding:3,marginBottom:24 }}>
            {["login","register"].map(m=><button key={m} onClick={()=>setMode(m)} style={{ flex:1,padding:"9px 0",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontWeight:600,fontSize:14,transition:"all .25s",background:mode===m?"linear-gradient(135deg,#7c5cfc,#a78bfa)":"transparent",color:mode===m?"#fff":C.muted }}>{m==="login"?"Sign In":"Create Account"}</button>)}
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {mode==="register"&&<div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Full Name</label><input className="inp" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>}
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Email</label><input className="inp" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>Password</label><input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
            {mode==="register"&&<div><label style={{ fontSize:13,color:C.muted,display:"block",marginBottom:7 }}>First Skill to Teach</label><select className="inp" value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})}><option value="">Select skill</option>{SKILLS_CATALOG.map(s=><option key={s}>{s}</option>)}</select></div>}
            <button className="btn btn-p" style={{ padding:"13px 0",fontSize:15,marginTop:4 }} onClick={submit}>{mode==="login"?"Sign In":"Create Account"}</button>
            {mode==="login"&&<button className="btn-ghost" style={{ padding:"11px 0",textAlign:"center",width:"100%" }} onClick={submit}>🚀 Enter as Guest (Demo)</button>}
          </div>
        </div>
        <p style={{ textAlign:"center",marginTop:16,fontSize:13,color:C.muted }}>Join 12,000+ skill-swappers · No credit card needed</p>
      </div>
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(()=>{ injectStyles(); },[]);

  const [currentUser,setCurrentUser] = useState(null);
  const [users]                      = useState(USERS);
  const [sessions,setSessions]       = useState(INITIAL_SESSIONS);
  const [bookings,setBookings]       = useState(INCOMING_BOOKINGS);
  const [page,setPage]               = useState("dashboard");
  const [bookModal,setBookModal]     = useState(null);
  const [reviewSess,setReviewSess]   = useState(null);
  const [liveSession,setLiveSession] = useState(null); // { session, isTeacher }
  const [summaryData,setSummaryData] = useState(null);
  const [incomingAlert,setIncomingAlert] = useState(null);
  const [toast,setToast]             = useState(null);

  const showToast = (msg) => setToast(msg);

  // Simulate new incoming booking after 5s
  useEffect(()=>{
    if(!currentUser) return;
    const t = setTimeout(()=>{
      setIncomingAlert({ id:201, name:"Kenji Tanaka", avatar:"KT", rating:4.8, location:"Tokyo", online:true, skill:"Guitar", date:"Today", time:"Now", duration:30, status:"pending", studentId:10 });
    },5000);
    return()=>clearTimeout(t);
  },[currentUser]);

  const acceptIncoming = () => {
    const b = { ...incomingAlert, status:"accepted" };
    setBookings(prev=>[...prev,b]);
    // Add an accepted session too
    setSessions(prev=>[...prev,{ id:Date.now(), teacherId:0, learnerId:10, skill:b.skill, date:b.date, time:b.time, duration:b.duration, status:"accepted", credits:b.duration, bookingRef:b.id, studentId:b.studentId, name:b.name, avatar:b.avatar }]);
    setIncomingAlert(null);
    showToast({ icon:"🎉", text:"Booking accepted! Student notified.", color:C.green });
  };
  const declineIncoming = () => { setIncomingAlert(null); showToast({ icon:"👋", text:"Request declined.", color:C.muted }); };

  const acceptBooking = (id) => {
    const b = bookings.find(x=>x.id===id);
    setBookings(prev=>prev.map(x=>x.id===id?{...x,status:"accepted"}:x));
    if(b) setSessions(prev=>[...prev,{ id:Date.now(), teacherId:0, learnerId:b.studentId||b.id, skill:b.skill, date:b.date, time:b.time, duration:b.duration, status:"accepted", credits:b.duration, bookingRef:id, name:b.name, avatar:b.avatar }]);
    showToast({ icon:"✅", text:"Booking accepted!", color:C.green });
  };
  const declineBooking = (id) => { setBookings(prev=>prev.map(x=>x.id===id?{...x,status:"declined"}:x)); showToast({ icon:"❌", text:"Booking declined.", color:C.red }); };

  const handleBook = (session) => {
    setSessions(prev=>[...prev,{ ...session, id:Date.now() }]);
    setCurrentUser(u=>({...u,credits:u.credits-session.credits}));
    const t = users.find(u=>u.id===session.teacherId);
    showToast({ icon:"🎉", text:`${session.skill} session booked with ${t?.name||"tutor"}!`, color:C.green });
  };

  const startSession = (session, isTeacher) => setLiveSession({ session, isTeacher });

  const endSession = () => {
    const { session, isTeacher } = liveSession;
    setSessions(prev=>prev.map(s=>s.id===session.id?{...s,status:"completed"}:s));
    if(isTeacher) setCurrentUser(u=>({...u,credits:u.credits+(session.duration||30),sessions:u.sessions+1}));
    setSummaryData({ session, isTeacher });
    setLiveSession(null);
  };

  const handleReview = (id, rating) => {
    setSessions(prev=>prev.map(s=>s.id===id?{...s,teacherRating:rating,learnerRating:rating}:s));
    showToast({ icon:"⭐", text:"Review submitted!", color:C.gold });
  };

  if(!currentUser) return <Auth onLogin={u=>{ setCurrentUser(u); setPage("dashboard"); }}/>;
  if(liveSession)  return <LiveSession session={liveSession.session} allUsers={[...users,{...currentUser}]} currentUser={currentUser} isTeacher={liveSession.isTeacher} onEnd={endSession}/>;
  if(summaryData)  return <SessionSummary session={summaryData.session} isTeacher={summaryData.isTeacher} creditChange={summaryData.session.duration||30} onClose={()=>{ setSummaryData(null); setPage("sessions"); }}/>;

  const NAV = [
    { id:"dashboard", icon:RAW.home,   label:"Dashboard"    },
    { id:"browse",    icon:RAW.search, label:"Browse Skills" },
    { id:"sessions",  icon:RAW.cal,    label:"My Sessions"  },
    { id:"teach",     icon:RAW.teach,  label:"Teach"        },
    { id:"profile",   icon:RAW.user,   label:"Profile"      },
  ];

  // Teach page = bookings management
  const TeachPage = () => {
    const accepted = bookings.filter(b=>b.status==="accepted");
    const pending  = bookings.filter(b=>b.status==="pending");
    const teachSessions = sessions.filter(s=>s.teacherId===currentUser.id);
    return (
      <div>
        <div className="syne" style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>Teaching Hub</div>
        <div style={{ color:C.muted,fontSize:14,marginBottom:22 }}>Manage your students and start live teaching sessions</div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:24 }}>
          {[
            { l:"Pending",val:pending.length,  color:C.gold,   icon:"🕐" },
            { l:"Accepted",val:accepted.length, color:C.green,  icon:"✅" },
            { l:"Taught",  val:teachSessions.filter(s=>s.status==="completed").length+currentUser.sessions, color:C.accentL,icon:"🎓" },
            { l:"Credits", val:currentUser.credits, color:C.gold, icon:"🪙" },
          ].map(s=>(
            <div key={s.l} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,textAlign:"center" }}>
              <div style={{ fontSize:24,marginBottom:6 }}>{s.icon}</div>
              <div className="syne" style={{ fontSize:26,fontWeight:800,color:s.color }}>{s.val}</div>
              <div style={{ fontSize:13,color:C.muted }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Ready to Start */}
        {accepted.length>0 && (
          <div style={{ marginBottom:22 }}>
            <div className="syne" style={{ fontWeight:700,fontSize:16,marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
              <div className="pulse" style={{ width:8,height:8,background:C.green,borderRadius:"50%" }}/> Ready to Start
            </div>
            {accepted.map(b=>{
              const relSess = sessions.find(s=>s.bookingRef===b.id||s.status==="accepted"&&s.teacherId===currentUser.id&&s.skill===b.skill);
              return (
                <div key={b.id} style={{ background:"linear-gradient(135deg,rgba(34,211,160,.08),rgba(124,92,252,.06))",border:"1px solid rgba(34,211,160,.25)",borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",marginBottom:10 }}>
                  <Avatar u={b} size={48} online/>
                  <div style={{ flex:1 }}>
                    <div className="syne" style={{ fontWeight:700,fontSize:15 }}>{b.name}</div>
                    <div style={{ fontSize:13,color:C.muted }}>Learning <span style={{ color:C.accentL }}>{b.skill}</span> · {b.date} · {b.time} · {b.duration} min</div>
                    <div style={{ fontSize:12,color:C.green,marginTop:2 }}>+{b.duration} credits on completion</div>
                  </div>
                  <button className="btn btn-p" onClick={()=>{
                    const sess = relSess || { id:Date.now(), teacherId:currentUser.id, learnerId:b.studentId||1, skill:b.skill, date:b.date, time:b.time, duration:b.duration, status:"accepted", credits:b.duration, name:b.name, avatar:b.avatar };
                    startSession(sess, true);
                  }} style={{ padding:"11px 22px" }}>
                    <Ic d={RAW.video} size={15} color="#fff"/> Start Teaching
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pending */}
        {pending.length>0 && (
          <div style={{ marginBottom:22 }}>
            <div className="syne" style={{ fontWeight:700,fontSize:16,marginBottom:12 }}>Pending Requests</div>
            {pending.map(b=>(
              <div key={b.id} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",marginBottom:10 }}>
                <Avatar u={b} size={46} online/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:3 }}>{b.name} {b.online&&<span style={{ fontSize:12,color:C.green }}>● Online</span>}</div>
                  <div style={{ fontSize:13,color:C.muted }}>Wants: <span style={{ color:C.accentL }}>{b.skill}</span> · {b.date} · {b.time} · {b.duration} min</div>
                  <Stars r={b.rating} sz={12}/>
                </div>
                <div style={{ display:"flex",gap:9 }}>
                  <button className="btn btn-g" style={{ padding:"8px 16px",fontSize:13 }} onClick={()=>acceptBooking(b.id)}><Ic d={RAW.check} size={13} color="#fff"/> Accept</button>
                  <button className="btn btn-r" style={{ padding:"8px 16px",fontSize:13 }} onClick={()=>declineBooking(b.id)}><Ic d={RAW.x} size={13} color="#fff"/> Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookings.filter(b=>b.status!=="declined").length===0 && (
          <div style={{ textAlign:"center",padding:"60px 0",color:C.muted }}>
            <div style={{ fontSize:48,marginBottom:14 }}>📭</div>
            <div style={{ fontSize:16,fontWeight:600 }}>No booking requests yet</div>
            <div style={{ fontSize:13,marginTop:8 }}>Students will appear here when they book your sessions</div>
          </div>
        )}
      </div>
    );
  };

  const pendingCount = bookings.filter(b=>b.status==="pending").length;

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:C.bg }}>
      {/* Sidebar */}
      <div style={{ width:230,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"18px 10px",position:"sticky",top:0,height:"100vh",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,padding:"6px 10px",marginBottom:24 }}>
          <div style={{ width:34,height:34,background:"linear-gradient(135deg,#7c5cfc,#22d3a0)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Ic d={RAW.swap} size={17} color="#fff"/></div>
          <span className="syne" style={{ fontSize:19,fontWeight:800,background:"linear-gradient(135deg,#a78bfa,#22d3a0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>SkillSwap</span>
        </div>
        <nav style={{ flex:1,display:"flex",flexDirection:"column",gap:3 }}>
          {NAV.map(item=>(
            <button key={item.id} className={`nav-i${page===item.id?" active":""}`} onClick={()=>setPage(item.id)}>
              <Ic d={item.icon} size={17} color={page===item.id?C.accentL:C.muted}/>
              {item.label}
              {item.id==="teach"&&pendingCount>0&&(
                <span style={{ marginLeft:"auto",background:C.accent,color:"#fff",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:700 }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:12,marginBottom:14 }}>
          <div style={{ fontSize:11,color:C.muted,fontWeight:600,marginBottom:7 }}>YOUR CREDITS</div>
          <div style={{ display:"flex",alignItems:"center",gap:7 }}><Ic d={RAW.coin} size={19} color={C.gold}/><span style={{ fontSize:22,fontWeight:800,color:C.gold,fontFamily:"Syne,sans-serif" }}>{currentUser.credits}</span></div>
          <div style={{ background:C.border,borderRadius:3,height:5,marginTop:8,overflow:"hidden" }}><div style={{ height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accentL})`,width:`${Math.min((currentUser.credits/200)*100,100)}%`,transition:"width .6s" }}/></div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:9,padding:"6px 4px" }}>
          <Avatar u={currentUser} size={34} online/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{currentUser.name}</div>
            <div style={{ fontSize:11,color:C.green }}>● Online</div>
          </div>
          <button onClick={()=>setCurrentUser(null)} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",padding:3 }} title="Sign Out"><Ic d={RAW.logout} size={15}/></button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1,overflow:"auto" }}>
        <div style={{ maxWidth:1060,margin:"0 auto",padding:"26px 24px" }}>
          {page==="dashboard" && (
            <Dashboard
              user={currentUser} users={users} sessions={sessions} bookings={bookings}
              onBook={u=>setBookModal(u)}
              onStartSession={startSession}
              onNavigate={p=>setPage(p)}
              onAcceptBooking={acceptBooking}
              onDeclineBooking={declineBooking}
            />
          )}
          {page==="browse"    && <Browse users={users} currentUser={currentUser} onBook={u=>setBookModal(u)}/>}
          {page==="sessions"  && <SessionsPage sessions={sessions} users={users} bookings={bookings} currentUser={currentUser} onJoin={startSession} onReview={s=>setReviewSess(s)}/>}
          {page==="teach"     && <TeachPage/>}
          {page==="profile"   && <Profile user={currentUser} setUser={setCurrentUser} toast={showToast}/>}
        </div>
      </div>

      {bookModal  && <BookingModal tutor={bookModal} currentUser={currentUser} onConfirm={handleBook} onClose={()=>setBookModal(null)} showToast={showToast}/>}
      {reviewSess && <ReviewModal session={reviewSess} users={users} currentUser={currentUser} onSubmit={handleReview} onClose={()=>setReviewSess(null)}/>}
      {incomingAlert && <BookingAlert b={incomingAlert} onAccept={acceptIncoming} onDecline={declineIncoming}/>}
      {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
    </div>
  );
}
