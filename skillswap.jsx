import { useState, useEffect, useRef } from "react";

// ─── MOCK DATABASE ───────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Arjun Mehta", avatar: "AM", credits: 120, rating: 4.8, reviews: 23, location: "Mumbai", bio: "Music teacher & language enthusiast", skillsOffered: ["Guitar", "Hindi", "Music Theory"], skillsWanted: ["Python", "Photography", "Spanish"], sessions: 47, joinDate: "2024-01-15", online: true },
  { id: 2, name: "Sofia Reyes", avatar: "SR", credits: 85, rating: 4.9, reviews: 31, location: "Madrid", bio: "Polyglot & software developer", skillsOffered: ["Spanish", "French", "React.js"], skillsWanted: ["Guitar", "Yoga", "Drawing"], sessions: 62, joinDate: "2023-11-20", online: true },
  { id: 3, name: "James Park", avatar: "JP", credits: 45, rating: 4.7, reviews: 18, location: "Seoul", bio: "Photographer & cooking enthusiast", skillsOffered: ["Photography", "Korean", "Lightroom"], skillsWanted: ["French", "Piano", "Writing"], sessions: 29, joinDate: "2024-02-08", online: false },
  { id: 4, name: "Priya Sharma", avatar: "PS", credits: 200, rating: 5.0, reviews: 44, location: "Bangalore", bio: "Yoga instructor & data scientist", skillsOffered: ["Yoga", "Python", "Data Science"], skillsWanted: ["Guitar", "Spanish", "Oil Painting"], sessions: 88, joinDate: "2023-09-10", online: true },
  { id: 5, name: "Lucas Müller", avatar: "LM", credits: 30, rating: 4.6, reviews: 12, location: "Berlin", bio: "Artist & language tutor", skillsOffered: ["Drawing", "Oil Painting", "German"], skillsWanted: ["Python", "Photography", "Yoga"], sessions: 21, joinDate: "2024-03-01", online: false },
  { id: 6, name: "Aisha Okonkwo", avatar: "AO", credits: 155, rating: 4.9, reviews: 37, location: "Lagos", bio: "Writer & creative writing coach", skillsOffered: ["Creative Writing", "English", "Storytelling"], skillsWanted: ["Data Science", "Korean", "Drawing"], sessions: 74, joinDate: "2023-12-05", online: true },
];

const INITIAL_SESSIONS = [
  { id: 1, teacherId: 2, learnerId: 1, skill: "Spanish", date: "2025-06-12", time: "10:00", duration: 30, status: "completed", credits: 30, teacherRating: 5, learnerRating: 5 },
  { id: 2, teacherId: 4, learnerId: 1, skill: "Yoga", date: "2025-06-14", time: "08:00", duration: 60, status: "completed", credits: 60, teacherRating: 5, learnerRating: 4 },
  { id: 3, teacherId: 1, learnerId: 3, skill: "Guitar", date: "2025-06-20", time: "15:00", duration: 30, status: "upcoming", credits: 30 },
  { id: 4, teacherId: 6, learnerId: 1, skill: "Creative Writing", date: "2025-06-25", time: "11:00", duration: 45, status: "upcoming", credits: 45 },
];

const SKILLS_CATALOG = ["Guitar","Piano","Violin","Drums","Music Theory","Spanish","French","German","Korean","Hindi","Japanese","Mandarin","Portuguese","Python","JavaScript","React.js","Data Science","Machine Learning","Photography","Lightroom","Drawing","Oil Painting","Watercolor","Yoga","Pilates","Cooking","Baking","Creative Writing","English","Storytelling","Blockchain","UI/UX Design","Video Editing","Meditation"];

const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#1a1a26",
  border: "#2a2a3d",
  accent: "#7c5cfc",
  accentLight: "#a78bfa",
  gold: "#f5c842",
  green: "#22d3a0",
  red: "#f56565",
  text: "#e8e6f0",
  muted: "#8882a4",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#0a0a0f; color:#e8e6f0; font-family:'DM Sans',sans-serif; }
    ::-webkit-scrollbar { width:6px; } 
    ::-webkit-scrollbar-track { background:#12121a; }
    ::-webkit-scrollbar-thumb { background:#2a2a3d; border-radius:3px; }
    .syne { font-family:'Syne',sans-serif; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(124,92,252,0.3)} 50%{box-shadow:0 0 40px rgba(124,92,252,0.6)} }
    .fade-up { animation: fadeUp 0.5s ease forwards; }
    .pulse { animation: pulse 2s infinite; }
    .spin { animation: spin 1s linear infinite; }
    .card-hover { transition: all 0.3s ease; cursor:pointer; }
    .card-hover:hover { transform:translateY(-4px); border-color:#7c5cfc !important; box-shadow:0 8px 32px rgba(124,92,252,0.2); }
    .btn-primary { background:linear-gradient(135deg,#7c5cfc,#a78bfa); border:none; color:#fff; padding:12px 24px; border-radius:12px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px; cursor:pointer; transition:all 0.3s ease; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,92,252,0.4); }
    .btn-secondary { background:transparent; border:1px solid #2a2a3d; color:#e8e6f0; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all 0.3s ease; }
    .btn-secondary:hover { border-color:#7c5cfc; color:#a78bfa; }
    .input-field { background:#1a1a26; border:1px solid #2a2a3d; color:#e8e6f0; padding:12px 16px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; width:100%; outline:none; transition:border-color 0.3s; }
    .input-field:focus { border-color:#7c5cfc; }
    .input-field::placeholder { color:#8882a4; }
    .tag { display:inline-flex; align-items:center; gap:6px; background:rgba(124,92,252,0.15); border:1px solid rgba(124,92,252,0.3); color:#a78bfa; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; }
    .tag-green { background:rgba(34,211,160,0.12); border-color:rgba(34,211,160,0.3); color:#22d3a0; }
    .tag-gold { background:rgba(245,200,66,0.12); border-color:rgba(245,200,66,0.3); color:#f5c842; }
    .online-dot { width:8px; height:8px; background:#22d3a0; border-radius:50%; animation:pulse 2s infinite; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
    .modal { background:#1a1a26; border:1px solid #2a2a3d; border-radius:20px; padding:32px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto; animation:fadeUp 0.3s ease; }
    .nav-item { padding:10px 16px; border-radius:10px; cursor:pointer; transition:all 0.2s; color:#8882a4; font-size:14px; font-weight:500; display:flex; align-items:center; gap:10px; }
    .nav-item:hover { background:#1a1a26; color:#e8e6f0; }
    .nav-item.active { background:rgba(124,92,252,0.15); color:#a78bfa; }
    .stat-card { background:#1a1a26; border:1px solid #2a2a3d; border-radius:16px; padding:20px; }
    .progress-bar { background:#2a2a3d; border-radius:4px; height:6px; overflow:hidden; }
    .progress-fill { height:100%; background:linear-gradient(90deg,#7c5cfc,#a78bfa); border-radius:4px; transition:width 0.6s ease; }
    select.input-field option { background:#1a1a26; }
    .notification { position:fixed; top:20px; right:20px; background:#1a1a26; border:1px solid #22d3a0; border-radius:12px; padding:16px 20px; z-index:999; animation:fadeUp 0.3s ease; max-width:320px; }
    .video-room { background:#0d0d15; border:1px solid #2a2a3d; border-radius:20px; overflow:hidden; }
    .video-screen { background:linear-gradient(135deg,#1a1a26,#12121a); display:flex; align-items:center; justify-content:center; border-radius:12px; }
    textarea.input-field { resize:vertical; min-height:100px; }
  `;
  document.head.appendChild(style);
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    video: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
    coin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 3h5.5a1.5 1.5 0 000-3"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
    mic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>,
    micOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"/></svg>,
    videoOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10M1 1l22 22"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9z"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    swap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  };
  return icons[name] || null;
};

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ user, size = 44, showOnline = false }) => {
  const colors = ["#7c5cfc","#22d3a0","#f5c842","#f56565","#60a5fa","#f472b6"];
  const color = colors[user.id % colors.length];
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}33, ${color}66)`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color, fontFamily: "Syne, sans-serif" }}>
        {user.avatar}
      </div>
      {showOnline && user.online && (
        <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, background: "#22d3a0", borderRadius: "50%", border: "2px solid #0a0a0f" }} />
      )}
    </div>
  );
};

// ─── STAR RATING ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
  <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f5c842" : "#2a2a3d"} stroke={i <= Math.round(rating) ? "#f5c842" : "#2a2a3d"} strokeWidth="1">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
      </svg>
    ))}
    <span style={{ fontSize: 12, color: "#8882a4", marginLeft: 4 }}>{rating}</span>
  </div>
);

// ─── NOTIFICATION TOAST ──────────────────────────────────────────────────────
const Toast = ({ msg, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className="notification" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ color: "#22d3a0", marginTop: 2 }}><Icon name="check" size={16} color="#22d3a0" /></div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{msg.title}</div>
        <div style={{ fontSize: 13, color: "#8882a4" }}>{msg.body}</div>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#8882a4", cursor: "pointer", marginLeft: "auto" }}><Icon name="x" size={14} /></button>
    </div>
  );
};

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", skill: "" });

  const handleSubmit = () => {
    if (mode === "login") {
      onLogin({ id: 0, name: "You", avatar: "YO", credits: 60, rating: 4.5, reviews: 5, location: "Your City", bio: "New to SkillSwap!", skillsOffered: ["English"], skillsWanted: ["Spanish"], sessions: 3, joinDate: "2025-06-01", online: true });
    } else {
      onLogin({ id: 0, name: form.name || "New User", avatar: (form.name || "NU").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(), credits: 0, rating: 0, reviews: 0, location: "Your City", bio: "New to SkillSwap!", skillsOffered: form.skill ? [form.skill] : [], skillsWanted: [], sessions: 0, joinDate: new Date().toISOString().split("T")[0], online: true });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, background: "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(34,211,160,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 460, animation: "fadeUp 0.6s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #7c5cfc, #22d3a0)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="swap" size={24} color="#fff" />
            </div>
            <span className="syne" style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SkillSwap</span>
          </div>
          <p style={{ color: COLORS.muted, fontSize: 15 }}>Trade skills. Grow together. No money needed.</p>
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14, transition: "all 0.3s", background: mode === m ? "linear-gradient(135deg,#7c5cfc,#a78bfa)" : "transparent", color: mode === m ? "#fff" : COLORS.muted }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Full Name</label>
                <input className="input-field" placeholder="e.g. Arjun Mehta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>First Skill You Can Teach</label>
                <select className="input-field" value={form.skill} onChange={e => setForm({...form, skill: e.target.value})}>
                  <option value="">Select a skill</option>
                  {SKILLS_CATALOG.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: 8, padding: "14px 0", fontSize: 15, fontWeight: 600 }}>
              {mode === "login" ? "Sign In to SkillSwap" : "Create My Account"}
            </button>
            {mode === "login" && (
              <button className="btn-secondary" onClick={handleSubmit} style={{ padding: "12px 0", textAlign: "center" }}>
                🚀 Demo — Enter as Guest
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: COLORS.muted }}>
          Join 12,000+ skill-swappers worldwide · No credit card needed
        </p>
      </div>
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = ({ currentUser, users, sessions, onBook, onNavigate }) => {
  const myUpcoming = sessions.filter(s => (s.learnerId === currentUser.id || s.teacherId === currentUser.id) && s.status === "upcoming");
  const myCompleted = sessions.filter(s => (s.learnerId === currentUser.id || s.teacherId === currentUser.id) && s.status === "completed");
  const topTutors = users.filter(u => u.id !== currentUser.id).sort((a,b) => b.rating - a.rating).slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Welcome */}
      <div style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.2), rgba(34,211,160,0.1))", border: "1px solid rgba(124,92,252,0.3)", borderRadius: 20, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 180, height: 180, background: "radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ fontSize: 13, color: COLORS.accentLight, marginBottom: 8, fontWeight: 500 }}>Welcome back 👋</div>
        <div className="syne" style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Hello, {currentUser.name.split(" ")[0]}!</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(245,200,66,0.2)", borderRadius: 8, padding: "6px 10px", display: "flex", gap: 6, alignItems: "center" }}>
              <Icon name="coin" size={16} color="#f5c842" />
              <span style={{ fontWeight: 700, color: "#f5c842", fontSize: 18 }}>{currentUser.credits}</span>
            </div>
            <span style={{ color: COLORS.muted, fontSize: 14 }}>Time Credits</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(34,211,160,0.15)", borderRadius: 8, padding: "6px 10px", display: "flex", gap: 6, alignItems: "center" }}>
              <Icon name="calendar" size={16} color="#22d3a0" />
              <span style={{ fontWeight: 700, color: "#22d3a0", fontSize: 18 }}>{myUpcoming.length}</span>
            </div>
            <span style={{ color: COLORS.muted, fontSize: 14 }}>Upcoming Sessions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(124,92,252,0.15)", borderRadius: 8, padding: "6px 10px", display: "flex", gap: 6, alignItems: "center" }}>
              <Icon name="award" size={16} color="#a78bfa" />
              <span style={{ fontWeight: 700, color: "#a78bfa", fontSize: 18 }}>{myCompleted.length + currentUser.sessions}</span>
            </div>
            <span style={{ color: COLORS.muted, fontSize: 14 }}>Total Sessions</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {[
          { label: "Platform Users", value: "12,847", icon: "user", color: "#7c5cfc" },
          { label: "Skills Available", value: "340+", icon: "trending", color: "#22d3a0" },
          { label: "Sessions Today", value: "1,203", icon: "video", color: "#f5c842" },
          { label: "Credits Exchanged", value: "89K", icon: "coin", color: "#f472b6" },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ background: `${stat.color}20`, borderRadius: 10, padding: 8 }}>
                <Icon name={stat.icon} size={18} color={stat.color} />
              </div>
            </div>
            <div className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Tutors + Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Top Tutors */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 16 }}>Top Tutors</div>
            <button onClick={() => onNavigate("browse")} style={{ fontSize: 12, color: COLORS.accentLight, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {topTutors.map((u, i) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 13, color: COLORS.muted, width: 16, textAlign: "center" }}>{i+1}</div>
                <Avatar user={u} size={36} showOnline />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{u.skillsOffered[0]}</div>
                </div>
                <Stars rating={u.rating} size={12} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Upcoming Sessions</div>
          {myUpcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ color: COLORS.muted, fontSize: 14 }}>No upcoming sessions</div>
              <button className="btn-primary" onClick={() => onNavigate("browse")} style={{ marginTop: 12, padding: "8px 16px", fontSize: 13 }}>Find a Tutor</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myUpcoming.slice(0,3).map(s => {
                const teacher = users.find(u => u.id === s.teacherId) || currentUser;
                return (
                  <div key={s.id} style={{ background: COLORS.surface, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar user={teacher} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.skill}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{s.date} · {s.time}</div>
                    </div>
                    <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onNavigate("video", s)}>
                      Join
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Skills */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
        <div className="syne" style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Recommended for You</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {users.filter(u => u.id !== currentUser.id).slice(0,4).map(u => (
            <div key={u.id} className="card-hover" onClick={() => onBook(u)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar user={u} size={40} showOnline />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <Stars rating={u.rating} size={11} />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {u.skillsOffered.slice(0,2).map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── BROWSE SKILLS ────────────────────────────────────────────────────────────
const BrowseSkills = ({ users, currentUser, onBook }) => {
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = users
    .filter(u => u.id !== currentUser.id)
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.skillsOffered.some(s => s.toLowerCase().includes(search.toLowerCase())))
    .filter(u => !filterSkill || u.skillsOffered.includes(filterSkill))
    .sort((a,b) => sortBy === "rating" ? b.rating - a.rating : sortBy === "sessions" ? b.sessions - a.sessions : b.credits - a.credits);

  return (
    <div>
      <div className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Browse Skills</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Find the perfect tutor for your learning goals</div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.muted }}><Icon name="search" size={16} /></div>
          <input className="input-field" placeholder="Search skills or tutors..." style={{ paddingLeft: 42 }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 180 }} value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
          <option value="">All Skills</option>
          {SKILLS_CATALOG.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="sessions">Most Sessions</option>
          <option value="credits">Most Active</option>
        </select>
      </div>

      {/* Results */}
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>{filtered.length} tutor{filtered.length !== 1 ? "s" : ""} found</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {filtered.map(u => (
          <div key={u.id} className="card-hover" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <Avatar user={u} size={52} showOnline />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div className="syne" style={{ fontWeight: 700, fontSize: 15 }}>{u.name}</div>
                  {u.online && <div className="online-dot" />}
                </div>
                <Stars rating={u.rating} />
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>📍 {u.location}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#f5c842" }}>
                  <Icon name="coin" size={14} color="#f5c842" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{u.credits}</span>
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>credits</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14, lineHeight: 1.6 }}>{u.bio}</p>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 500 }}>TEACHES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {u.skillsOffered.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 500 }}>WANTS TO LEARN</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {u.skillsWanted.map(s => <span key={s} className="tag-green">{s}</span>)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => onBook(u)}>
                Book Session
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.surface, borderRadius: 10, padding: "0 12px", fontSize: 13, color: COLORS.muted }}>
                <Icon name="award" size={14} color={COLORS.muted} />
                {u.sessions} sessions
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
const BookingModal = ({ tutor, currentUser, onConfirm, onClose, toast }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ skill: tutor.skillsOffered[0] || "", date: "", time: "", duration: 30 });
  const times = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
  const cost = form.duration;

  const handleConfirm = () => {
    if (currentUser.credits < cost) {
      toast({ title: "Insufficient Credits", body: "Teach a session first to earn credits!" });
      return;
    }
    onConfirm({ teacherId: tutor.id, learnerId: currentUser.id, skill: form.skill, date: form.date, time: form.time, duration: form.duration, status: "upcoming", credits: cost });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 18 }}>Book a Session</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer" }}><Icon name="x" size={20} /></button>
        </div>

        {/* Tutor Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <Avatar user={tutor} size={48} showOnline />
          <div>
            <div className="syne" style={{ fontWeight: 700 }}>{tutor.name}</div>
            <Stars rating={tutor.rating} />
            <div style={{ fontSize: 13, color: COLORS.muted }}>{tutor.reviews} reviews</div>
          </div>
        </div>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Skill to Learn</label>
              <select className="input-field" value={form.skill} onChange={e => setForm({...form, skill: e.target.value})}>
                {tutor.skillsOffered.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Date</label>
              <input className="input-field" type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Time Slot</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {times.map(t => (
                  <button key={t} onClick={() => setForm({...form, time: t})} style={{ padding: "8px 0", borderRadius: 10, border: `1px solid ${form.time === t ? "#7c5cfc" : COLORS.border}`, background: form.time === t ? "rgba(124,92,252,0.2)" : COLORS.surface, color: form.time === t ? "#a78bfa" : COLORS.muted, fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 8 }}>Duration</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[30, 45, 60].map(d => (
                  <button key={d} onClick={() => setForm({...form, duration: d})} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${form.duration === d ? "#7c5cfc" : COLORS.border}`, background: form.duration === d ? "rgba(124,92,252,0.2)" : COLORS.surface, color: form.duration === d ? "#a78bfa" : COLORS.muted, fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>{d} min</button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ padding: "14px 0" }} onClick={() => { if (!form.date || !form.time) { toast({ title: "Select date & time", body: "Please fill all fields" }); return; } setStep(2); }}>
              Review Booking →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: COLORS.surface, borderRadius: 14, padding: 20 }}>
              <div className="syne" style={{ fontWeight: 700, marginBottom: 14 }}>Booking Summary</div>
              {[
                ["Skill", form.skill],
                ["Date", form.date],
                ["Time", form.time],
                ["Duration", `${form.duration} minutes`],
                ["With", tutor.name],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                  <span style={{ color: COLORS.muted }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 16, fontWeight: 700 }}>
                <span>Credits Required</span>
                <span style={{ color: "#f5c842", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="coin" size={16} color="#f5c842" />
                  {cost}
                </span>
              </div>
            </div>
            <div style={{ background: currentUser.credits >= cost ? "rgba(34,211,160,0.1)" : "rgba(245,101,101,0.1)", border: `1px solid ${currentUser.credits >= cost ? "rgba(34,211,160,0.3)" : "rgba(245,101,101,0.3)"}`, borderRadius: 12, padding: 14, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.muted }}>Your balance</span>
                <span style={{ fontWeight: 700, color: currentUser.credits >= cost ? "#22d3a0" : "#f56565" }}>{currentUser.credits} credits</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ color: COLORS.muted }}>After booking</span>
                <span style={{ fontWeight: 700, color: COLORS.text }}>{currentUser.credits - cost} credits</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
              <button className="btn-primary" onClick={handleConfirm} style={{ flex: 2 }}>Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SESSIONS PAGE ────────────────────────────────────────────────────────────
const SessionsPage = ({ sessions, users, currentUser, onJoin, onReview }) => {
  const [tab, setTab] = useState("upcoming");
  const mySessions = sessions.filter(s => s.learnerId === currentUser.id || s.teacherId === currentUser.id);
  const filtered = mySessions.filter(s => s.status === tab);

  return (
    <div>
      <div className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>My Sessions</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Track your learning and teaching history</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["upcoming","completed"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", borderRadius: 10, border: `1px solid ${tab === t ? "#7c5cfc" : COLORS.border}`, background: tab === t ? "rgba(124,92,252,0.2)" : "transparent", color: tab === t ? "#a78bfa" : COLORS.muted, fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
            {t} <span style={{ background: COLORS.surface, borderRadius: 20, padding: "2px 8px", fontSize: 12, marginLeft: 6 }}>{mySessions.filter(s => s.status === t).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{tab === "upcoming" ? "📅" : "🎓"}</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>No {tab} sessions</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(s => {
            const isLearner = s.learnerId === currentUser.id;
            const other = users.find(u => u.id === (isLearner ? s.teacherId : s.learnerId)) || { name: "Unknown", avatar: "??", id: 99, online: false };
            return (
              <div key={s.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 22, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <Avatar user={other} size={48} showOnline />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div className="syne" style={{ fontWeight: 700, fontSize: 15 }}>{s.skill}</div>
                    <span className={`tag${isLearner ? "" : "-gold"}`} style={{ fontSize: 11 }}>{isLearner ? "Learning" : "Teaching"}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>
                    with {other.name} · {s.date} at {s.time}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 13, color: COLORS.muted }}>
                      <Icon name="clock" size={13} color={COLORS.muted} style={{ verticalAlign: "middle" }} /> {s.duration} min
                    </span>
                    <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4, color: isLearner ? "#f56565" : "#22d3a0" }}>
                      <Icon name="coin" size={13} color={isLearner ? "#f56565" : "#22d3a0"} />
                      {isLearner ? "-" : "+"}{s.credits}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {s.status === "upcoming" && (
                    <button className="btn-primary" onClick={() => onJoin(s)} style={{ padding: "8px 20px", fontSize: 13 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="video" size={14} />Join</span>
                    </button>
                  )}
                  {s.status === "completed" && !s.teacherRating && (
                    <button className="btn-secondary" onClick={() => onReview(s)} style={{ padding: "8px 16px", fontSize: 13 }}>Rate Session</button>
                  )}
                  {s.status === "completed" && s.teacherRating && (
                    <Stars rating={isLearner ? s.teacherRating : s.learnerRating} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── VIDEO ROOM ───────────────────────────────────────────────────────────────
const VideoRoom = ({ session, users, currentUser, onEnd }) => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chat, setChat] = useState([
    { from: "system", text: "Session started. Have a great learning experience! 🎉" },
  ]);
  const [msg, setMsg] = useState("");
  const intervalRef = useRef(null);
  const other = users.find(u => u.id === session.teacherId) || { name: "Tutor", avatar: "TU", id: 99, online: true };

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const sendMsg = () => {
    if (!msg.trim()) return;
    setChat(c => [...c, { from: "me", text: msg }]);
    setMsg("");
    setTimeout(() => {
      const replies = ["Great point!", "Let me explain...", "Exactly right! 👍", "Try it this way:", "You're doing well!"];
      setChat(c => [...c, { from: "other", text: replies[Math.floor(Math.random()*replies.length)] }]);
    }, 1200);
  };

  return (
    <div style={{ height: "calc(100vh - 80px)", display: "flex", gap: 20 }}>
      {/* Main Video */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="syne" style={{ fontWeight: 700, fontSize: 18 }}>{session.skill} Session</div>
            <div style={{ fontSize: 14, color: COLORS.muted }}>with {other.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(245,101,101,0.15)", border: "1px solid rgba(245,101,101,0.3)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, background: "#f56565", borderRadius: "50%" }} className="pulse" />
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "DM Mono, monospace" }}>{fmt(elapsed)}</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Remote */}
          <div className="video-screen" style={{ borderRadius: 16, background: `linear-gradient(135deg, #1a1a26, #12121a)`, minHeight: 260, position: "relative", border: "1px solid #2a2a3d" }}>
            <div style={{ textAlign: "center" }}>
              <Avatar user={other} size={72} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>{other.name}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>🎙️ Teaching {session.skill}</div>
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "4px 10px", fontSize: 12 }}>{other.name}</div>
          </div>

          {/* Local */}
          <div className="video-screen" style={{ borderRadius: 16, minHeight: 260, position: "relative", border: "1px solid #2a2a3d", opacity: videoOff ? 0.5 : 1 }}>
            <div style={{ textAlign: "center" }}>
              <Avatar user={currentUser} size={72} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>You</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{muted ? "🔇 Muted" : "🎙️ Live"}</div>
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "4px 10px", fontSize: 12 }}>You</div>
            {videoOff && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,15,0.7)", borderRadius: 16 }}><Icon name="videoOff" size={32} color={COLORS.muted} /></div>}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          <button onClick={() => setMuted(m => !m)} style={{ width: 52, height: 52, borderRadius: "50%", border: `1px solid ${muted ? "#f56565" : COLORS.border}`, background: muted ? "rgba(245,101,101,0.2)" : COLORS.card, color: muted ? "#f56565" : COLORS.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <Icon name={muted ? "micOff" : "mic"} size={20} />
          </button>
          <button onClick={() => setVideoOff(v => !v)} style={{ width: 52, height: 52, borderRadius: "50%", border: `1px solid ${videoOff ? "#f56565" : COLORS.border}`, background: videoOff ? "rgba(245,101,101,0.2)" : COLORS.card, color: videoOff ? "#f56565" : COLORS.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <Icon name={videoOff ? "videoOff" : "video"} size={20} />
          </button>
          <button onClick={onEnd} style={{ background: "#f56565", border: "none", borderRadius: 26, padding: "0 28px", height: 52, color: "#fff", fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
            <Icon name="phone" size={16} color="#fff" /> End Session
          </button>
        </div>
      </div>

      {/* Chat */}
      <div style={{ width: 300, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="syne" style={{ fontWeight: 700 }}>Session Chat</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ ...(m.from === "system" ? { textAlign: "center", color: COLORS.muted, fontSize: 12, background: COLORS.surface, borderRadius: 8, padding: "6px 10px" } : m.from === "me" ? { alignSelf: "flex-end", background: "rgba(124,92,252,0.25)", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", maxWidth: "85%", fontSize: 13 } : { alignSelf: "flex-start", background: COLORS.surface, borderRadius: "12px 12px 12px 2px", padding: "8px 12px", maxWidth: "85%", fontSize: 13 }) }}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
          <input className="input-field" placeholder="Type a message..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} style={{ flex: 1, padding: "10px 12px" }} />
          <button onClick={sendMsg} style={{ width: 40, height: 40, background: "linear-gradient(135deg,#7c5cfc,#a78bfa)", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plus" size={18} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage = ({ user, setUser, toast }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");

  const save = () => { setUser(form); setEditing(false); toast({ title: "Profile Updated", body: "Your changes have been saved!" }); };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Header Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.15), rgba(34,211,160,0.08))", border: "1px solid rgba(124,92,252,0.25)", borderRadius: 20, padding: 28, marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
        <Avatar user={user} size={80} showOnline />
        <div style={{ flex: 1 }}>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 12 }}>📍 {user.location} · Member since {user.joinDate}</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}><div className="syne" style={{ fontSize: 22, fontWeight: 700, color: "#f5c842" }}>{user.credits}</div><div style={{ fontSize: 12, color: COLORS.muted }}>Credits</div></div>
            <div style={{ textAlign: "center" }}><div className="syne" style={{ fontSize: 22, fontWeight: 700 }}>{user.sessions}</div><div style={{ fontSize: 12, color: COLORS.muted }}>Sessions</div></div>
            <div style={{ textAlign: "center" }}><div className="syne" style={{ fontSize: 22, fontWeight: 700, color: "#22d3a0" }}>{user.rating || "New"}</div><div style={{ fontSize: 12, color: COLORS.muted }}>Rating</div></div>
            <div style={{ textAlign: "center" }}><div className="syne" style={{ fontSize: 22, fontWeight: 700 }}>{user.reviews}</div><div style={{ fontSize: 12, color: COLORS.muted }}>Reviews</div></div>
          </div>
        </div>
        <button className={editing ? "btn-primary" : "btn-secondary"} onClick={editing ? save : () => setEditing(true)} style={{ padding: "10px 20px" }}>
          {editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Bio */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div className="syne" style={{ fontWeight: 700, marginBottom: 14 }}>About Me</div>
        {editing ? <textarea className="input-field" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} style={{ minHeight: 80 }} /> : <p style={{ color: COLORS.muted, lineHeight: 1.7, fontSize: 15 }}>{user.bio}</p>}
      </div>

      {/* Skills */}
      {[["skillsOffered","Skills I Teach","tag","newOffered",setNewOffered],["skillsWanted","Skills I Want to Learn","tag-green","newWanted",setNewWanted]].map(([key, title, tagClass, varName, setter]) => (
        <div key={key} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div className="syne" style={{ fontWeight: 700, marginBottom: 14 }}>{title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: editing ? 14 : 0 }}>
            {(editing ? form[key] : user[key]).map(s => (
              <span key={s} className={tagClass} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {s}
                {editing && <button onClick={() => setForm({...form, [key]: form[key].filter(x => x !== s)})} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: 12 }}>×</button>}
              </span>
            ))}
            {(editing ? form[key] : user[key]).length === 0 && <span style={{ color: COLORS.muted, fontSize: 14 }}>None added yet</span>}
          </div>
          {editing && (
            <div style={{ display: "flex", gap: 8 }}>
              <select className="input-field" value={varName === "newOffered" ? newOffered : newWanted} onChange={e => setter(e.target.value)} style={{ flex: 1 }}>
                <option value="">Add a skill...</option>
                {SKILLS_CATALOG.filter(s => !form[key].includes(s)).map(s => <option key={s}>{s}</option>)}
              </select>
              <button className="btn-primary" style={{ padding: "0 16px" }} onClick={() => {
                const val = varName === "newOffered" ? newOffered : newWanted;
                if (val && !form[key].includes(val)) { setForm({...form, [key]: [...form[key], val]}); setter(""); }
              }}><Icon name="plus" size={16} /></button>
            </div>
          )}
        </div>
      ))}

      {/* Credits history */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
        <div className="syne" style={{ fontWeight: 700, marginBottom: 14 }}>Time Credits</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#f5c842", fontFamily: "Syne, sans-serif" }}>{user.credits}</div>
            <div style={{ fontSize: 14, color: COLORS.muted }}>Available Credits</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: COLORS.muted }}>Credits = Minutes</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Teach 30min = Earn 30 credits</div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min((user.credits / 200) * 100, 100)}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: COLORS.muted }}>
          <span>0</span><span>200 credits (Gold Status)</span>
        </div>
      </div>
    </div>
  );
};

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
const ReviewModal = ({ session, users, currentUser, onSubmit, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const other = users.find(u => u.id === (session.learnerId === currentUser.id ? session.teacherId : session.learnerId)) || { name: "User", avatar: "US", id: 99 };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="syne" style={{ fontWeight: 700, fontSize: 18 }}>Rate Your Session</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer" }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <Avatar user={other} size={48} />
          <div>
            <div className="syne" style={{ fontWeight: 700 }}>{other.name}</div>
            <div style={{ color: COLORS.muted, fontSize: 14 }}>{session.skill} · {session.duration} min</div>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 12 }}>Overall Rating</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setRating(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 36, transition: "transform 0.2s", transform: rating >= i ? "scale(1.1)" : "scale(1)" }}>
                {rating >= i ? "⭐" : "☆"}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, color: COLORS.muted, fontSize: 14 }}>
            {["","Poor","Fair","Good","Great","Excellent!"][rating]}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 8 }}>Leave a Comment</div>
          <textarea className="input-field" placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 90 }} />
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: "14px 0" }} onClick={() => { onSubmit(session.id, rating, comment); onClose(); }}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SkillSwap() {
  useEffect(() => { injectStyles(); }, []);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null); // { type, data }
  const [activeSession, setActiveSession] = useState(null);
  const [toast, setToast] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);

  const showToast = (msg) => { setToast(msg); };

  const handleLogin = (user) => { setCurrentUser({ ...user, id: user.id === 0 ? 99 : user.id }); };
  const handleLogout = () => { setCurrentUser(null); setPage("dashboard"); };

  const handleBooking = (session) => {
    setSessions(s => [...s, { ...session, id: Date.now() }]);
    setCurrentUser(u => ({ ...u, credits: u.credits - session.credits }));
    showToast({ title: "Session Booked! 🎉", body: `${session.skill} with ${users.find(u => u.id === session.teacherId)?.name || "Tutor"} on ${session.date}` });
  };

  const handleEndSession = () => {
    const s = activeSession;
    setSessions(prev => prev.map(sess => sess.id === s.id ? { ...sess, status: "completed" } : sess));
    setCurrentUser(u => ({ ...u, credits: u.credits + (s.teacherId === currentUser.id ? s.credits || 30 : 0) }));
    showToast({ title: "Session Complete! 🎓", body: `Credits have been transferred. Don't forget to rate!` });
    setActiveSession(null);
    setPage("sessions");
  };

  const handleReview = (sessionId, rating, comment) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, teacherRating: rating, learnerRating: rating } : s));
    showToast({ title: "Review Submitted! ⭐", body: "Thank you for your feedback!" });
  };

  const navItems = [
    { id: "dashboard", icon: "home", label: "Dashboard" },
    { id: "browse", icon: "search", label: "Browse Skills" },
    { id: "sessions", icon: "calendar", label: "My Sessions" },
    { id: "profile", icon: "user", label: "Profile" },
  ];

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;

  if (activeSession) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", padding: "20px 24px" }}>
      <VideoRoom session={activeSession} users={[...users, currentUser]} currentUser={currentUser} onEnd={handleEndSession} />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", padding: "20px 12px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7c5cfc, #22d3a0)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="swap" size={18} color="#fff" />
          </div>
          <span className="syne" style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #22d3a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SkillSwap</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)} style={{ background: "none", border: "none", textAlign: "left", width: "100%", fontFamily: "DM Sans, sans-serif" }}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Credits */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", justify: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>YOUR CREDITS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="coin" size={20} color="#f5c842" />
            <span style={{ fontSize: 24, fontWeight: 800, color: "#f5c842", fontFamily: "Syne, sans-serif" }}>{currentUser.credits}</span>
          </div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${Math.min((currentUser.credits / 200) * 100, 100)}%` }} />
          </div>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px" }}>
          <Avatar user={currentUser} size={36} showOnline />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Online</div>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", padding: 4 }} title="Sign Out">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 28px" }}>
          {page === "dashboard" && <Dashboard currentUser={currentUser} users={users} sessions={sessions} onBook={u => setModal({ type: "book", data: u })} onNavigate={(p, data) => { if (p === "video") { setActiveSession(data); } else setPage(p); }} />}
          {page === "browse" && <BrowseSkills users={users} currentUser={currentUser} onBook={u => setModal({ type: "book", data: u })} />}
          {page === "sessions" && <SessionsPage sessions={sessions} users={users} currentUser={currentUser} onJoin={s => setActiveSession(s)} onReview={s => setReviewSession(s)} />}
          {page === "profile" && <ProfilePage user={currentUser} setUser={u => setCurrentUser(u)} toast={showToast} />}
        </div>
      </div>

      {/* Booking Modal */}
      {modal?.type === "book" && (
        <BookingModal tutor={modal.data} currentUser={currentUser} onConfirm={handleBooking} onClose={() => setModal(null)} toast={showToast} />
      )}

      {/* Review Modal */}
      {reviewSession && (
        <ReviewModal session={reviewSession} users={users} currentUser={currentUser} onSubmit={handleReview} onClose={() => setReviewSession(null)} />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
