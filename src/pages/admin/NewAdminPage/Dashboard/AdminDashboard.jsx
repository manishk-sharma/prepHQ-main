import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import LoopIcon from "@mui/icons-material/Loop";
import { Container, Row, Col } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

/* ─── PALETTE ──────────────────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#0B0D1A",
    surface: "#111427",
    card: "#141729",
    border: "#1E2240",
    text: "#E0E4FF",
    subtext: "#7880AA",
    primary: "#2EC4B6",
    secondary: "#7C5CFC",
    accent: "#00D4FF",
    success: "#57CC99",
    danger: "#F0338A",
    warning: "#F0C040",
    purple: "#7C5CFC",
    pink: "#F0338A",
    cyan: "#00D4FF",
    teal: "#2EC4B6",
    blue: "#0096FF",
    green: "#57CC99",
  },
  light: {
    bg: "#F0F2F8",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E4E7EC",
    text: "#1A1D2E",
    subtext: "#667085",
    primary: "#20B2AA",
    secondary: "#6C5CE7",
    accent: "#0096FF",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
    purple: "#6C5CE7",
    pink: "#EF4444",
    cyan: "#0096FF",
    teal: "#20B2AA",
    blue: "#0096FF",
    green: "#22C55E",
  },
};

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');

  .dash-card {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    transition: all 0.3s ease;
    position: relative;
  }
  body.light .dash-card {
    background: rgba(255,255,255,0.85);
    border-color: rgba(0,0,0,0.08);
  }
  .dash-card:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 32px rgba(46,196,182,0.15);
  }
  .kpi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 16px 12px 14px;
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;
  }
  .kpi-card:hover { box-shadow: 0 8px 32px rgba(46,196,182,0.1); }
  .section-title { color: var(--text); margin: 0; font-weight: 700; font-size: 14px; }
  .section-sub   { color: var(--subtext); margin: 0; font-size: 11px; }

  .stream-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 8px var(--primary);
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(1.3); }
  }
  .ring-container { position:relative; display:flex; align-items:center; justify-content:center; }
  .ring-label     { position:absolute; font-family:'Space Mono',monospace; font-weight:700; }
  .glow-badge {
    display:inline-flex; align-items:center; gap:3px;
    padding:2px 7px; border-radius:20px; font-size:10px; font-weight:600;
  }
  .progress-bar-custom { background:var(--border); border-radius:99px; height:6px; overflow:hidden; }
  .progress-bar-fill   { height:100%; border-radius:99px; transition:width 0.6s ease; }
  .fade-in { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ══════════════════════════════
     HANGING BULB
  ══════════════════════════════ */
  #lampadario {
    position: fixed;
    left: 90%;
    top: 0;
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: none;
  }

 #filo {
  position: relative;
  width: 2px;
  height: 70px;
  background: #000;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: top;
  animation: oscillaFilo .9s ease-in-out infinite alternate;
}

/* REALISTIC CONE HOLDER */
#filo:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);

  width: 16px;
  height: 14px;

  /* Smooth cone shape */
  background: linear-gradient(
    to bottom,
    #111 0%,
    #000 60%,
    #000 100%
  );

  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  border-radius: 2px;
}
 
#bulb-label {
  width: 42px;
  height: 42px;
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  animation: oscillaLampadina .9s ease-in-out infinite alternate;
  transition: all 0.4s ease;
  pointer-events: none;
margin-top: -4px; 
  /* glass base */
  background: radial-gradient(
    circle at 50% 30%,
    rgba(255,255,255,0.25),
    rgba(255,255,255,0.08) 40%,
    rgba(255,255,255,0.02) 60%,
    transparent 80%
  );
  border: 1px solid rgba(255,255,255,0.2);
}

/* reflection */
#bulb-label::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0,0,0,0.15);
  filter: blur(4px);
}

/* filament */
#bulb-label::after {
  content: "";
  position: absolute;
  top: 18px;
  left: 50%;
  width: 8px;
  height: 12px;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}
/* ───── OFF STATE (GLASS ONLY) ───── */
#bulb-label.off {
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 40%, transparent 80%);
   box-shadow:
    inset 0 0 10px rgba(255,255,255,0.05),
    0 10px 25px rgba(0,0,0,0.25);
}

/* ───── ON STATE (REAL BULB GLOW) ───── */
#bulb-label.on {
  background: radial-gradient(circle at 40% 35%, #fffde7 0%, #ffe082 35%, #ffb300 70%, rgba(255,179,0,0.2) 100%);

  box-shadow:
    0 0 15px rgba(255,220,80,0.9),
    0 0 40px rgba(255,200,50,0.7),
    0 0 80px rgba(255,165,0,0.5),
    0 0 140px rgba(255,140,0,0.3),
    -40px -15px 120px rgba(255,255,200,0.2); /* side shadow like original */
}

/* filament glow */
#bulb-label.on::after {
  background: #ffd54f;
  box-shadow:
    0 0 6px #ffd54f,
    0 0 12px #ffb300,
    0 0 18px #ff9800;
}

/* EXTRA GLASS SHINE WHEN ON */
#bulb-label.on::before {
  opacity: 1;
  background: rgba(255,255,255,0.9);
}
  /* Invisible large click zone — has pointer events */
  #bulb-click-area {
  position: absolute;
  width: 60px;
  height: 60px;
  top: 70px; /* SAME as bulb */
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;
  pointer-events: all;
}

  /* Light cone below bulb when ON */
  #light-cone {
    position: fixed;
    top: 190px;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 180px solid transparent;
    border-right: 180px solid transparent;
    pointer-events: none;
    z-index: 0;
    transition: border-bottom-width 0.5s ease, opacity 0.5s ease;
    transform: translateX(-50%);
  }
  #light-cone.on {
    border-bottom: 360px solid rgba(255,218,60,0.055);
    opacity: 1;
  }
  #light-cone.off {
    border-bottom: 0px solid transparent;
    opacity: 0;
  }

  @keyframes oscillaFilo {
    from { transform: rotate(5deg); }
    to   { transform: rotate(-5deg); }
  }
  @keyframes oscillaLampadina {
    from { transform: translateX(-50%) rotate(3deg) translate(-16px, -1px); }
    to   { transform: translateX(-50%) rotate(-3deg) translate(16px, -1px); }
  }
`;

/* ─── DATA ──────────────────────────────────────────────────────────────────── */
const monthlyData = [
  { month: "Jan", revenue: 4200, profit: 1800, cost: 2400 },
  { month: "Feb", revenue: 3800, profit: 1600, cost: 2200 },
  { month: "Mar", revenue: 5200, profit: 2800, cost: 2400 },
  { month: "Apr", revenue: 4600, profit: 2100, cost: 2500 },
  { month: "May", revenue: 5800, profit: 3200, cost: 2600 },
  { month: "Jun", revenue: 5100, profit: 2700, cost: 2400 },
  { month: "Jul", revenue: 6200, profit: 3600, cost: 2600 },
  { month: "Aug", revenue: 5500, profit: 2900, cost: 2600 },
  { month: "Sep", revenue: 4900, profit: 2300, cost: 2600 },
  { month: "Oct", revenue: 5700, profit: 3100, cost: 2600 },
  { month: "Nov", revenue: 6800, profit: 4000, cost: 2800 },
  { month: "Dec", revenue: 6100, profit: 3400, cost: 2700 },
];
const weeklyBar = [
  { day: "Mon", sales: 160, returns: 12,  orders: 155 },
  { day: "Tue", sales: 270, returns: 60,  orders: 160 },
  { day: "Wed", sales: 220, returns: 8,   orders: 140 },
  { day: "Thu", sales: 80,  returns: 55,  orders: 90  },
  { day: "Fri", sales: 150, returns: 50,  orders: 70  },
  { day: "Sat", sales: 140, returns: 45,  orders: 75  },
  { day: "Sun", sales: 100, returns: 60,  orders: 155 },
];
const radarData = [
  { metric: "Speed",    A: 88, B: 70 },
  { metric: "Quality",  A: 92, B: 75 },
  { metric: "Support",  A: 78, B: 82 },
  { metric: "UX",       A: 95, B: 60 },
  { metric: "Price",    A: 65, B: 90 },
  { metric: "Features", A: 85, B: 68 },
];
const composedData = [
  { month: "Jan", bar: 95,  area: 280, line: 290 },
  { month: "Feb", bar: 140, area: 200, line: 270 },
  { month: "Mar", bar: 175, area: 250, line: 240 },
  { month: "Apr", bar: 285, area: 290, line: 260 },
  { month: "May", bar: 340, area: 310, line: 250 },
  { month: "Jun", bar: 260, area: 240, line: 230 },
  { month: "Jul", bar: 380, area: 280, line: 260 },
  { month: "Aug", bar: 175, area: 230, line: 270 },
];
const topPages = [
  { name: "/blog/react-tips", views: 12400, pct: 87 },
  { name: "/tutorials/node",  views: 9800,  pct: 72 },
  { name: "/projects",        views: 7200,  pct: 55 },
  { name: "/interviews",      views: 6100,  pct: 46 },
  { name: "/blog/css-tricks", views: 4900,  pct: 37 },
];

/* ─── RING ──────────────────────────────────────────────────────────────────── */
function Ring({ value, color, size = 64, stroke = 5, P }) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={P.border} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}   strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 6px ${color}88)`, transition:"stroke-dasharray 1s ease" }} />
      </svg>
      <span className="ring-label" style={{ color, fontSize: size < 50 ? 10 : 13 }}>{value}%</span>
    </div>
  );
}

/* ─── STREAM HOOK ───────────────────────────────────────────────────────────── */
function useStreamData() {
  const [data, setData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: 755 + i, v: Math.floor(30 + Math.random() * 80) }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        next.push({ t: prev[prev.length - 1].t + 1, v: Math.floor(20 + Math.random() * 90) });
        return next;
      });
    }, 800);
    return () => clearInterval(id);
  }, []);
  return data;
}

/* ─── HANGING BULB COMPONENT ────────────────────────────────────────────────── */
function HangingBulb({ isOn, onToggle }) {
  return (
    <div id="lampadario">
      <div id="filo" />
      <div id="lampadina">
        {/* Visual bulb — no pointer events */}
        <div id="bulb-label" className={isOn ? "on" : "off"} />
        {/* Invisible clickable overlay */}
        <div id="bulb-click-area" onClick={onToggle} title={isOn ? "Switch to Dark" : "Switch to Light"} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [themeMode, setThemeMode] = useState(() => {
  return localStorage.getItem("themeMode") || "light";
});
  const P        = THEMES[themeMode];
  const stream   = useStreamData();
  const styleRef = useRef(false);
  const bulbOn   = themeMode === "light";   // bulb ON  → light mode

  /* ── CSS custom properties ── */
useEffect(() => {
  const root = document.documentElement;
  Object.entries(P).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));

  document.body.classList.toggle("light", themeMode === "light");
  document.body.classList.toggle("dark-theme", themeMode === "dark");

  // ✅ SAVE THEME
  localStorage.setItem("themeMode", themeMode);

}, [themeMode, P]);

  /* ── Inject global CSS once ── */
  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  const toggleTheme = () => setThemeMode(prev => (prev === "dark" ? "light" : "dark"));
  const liveVal     = stream[stream.length - 1]?.v ?? 0;

  /* ── Tooltip: closes over P, no prop passing ── */
  const TooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: P.surface, border: `1px solid ${P.border}`,
        borderRadius: 10, padding: "10px 14px",
        fontFamily: "'DM Sans',sans-serif", fontSize: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}>
        <div style={{ color: P.subtext, marginBottom: 6, fontWeight: 600 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, display: "flex", gap: 8, marginBottom: 2 }}>
            <span style={{ opacity: 0.7 }}>{p.name}:</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const kpiData = [
    { label:"Revenue",   val:90, color:P.primary,   icon:<TrendingUpIcon fontSize="small"/>,  trend:"+12.4%", up:true  },
    { label:"Users",     val:67, color:P.danger,    icon:<PeopleIcon fontSize="small"/>,       trend:"+8.1%",  up:true  },
    { label:"Conv.",     val:99, color:P.accent,    icon:<ShoppingCartIcon fontSize="small"/>, trend:"+2.3%",  up:true  },
    { label:"Bounce",    val:57, color:P.secondary, icon:<VisibilityIcon fontSize="small"/>,   trend:"-4.7%",  up:false },
    { label:"NPS",       val:82, color:P.success,   icon:<StarIcon fontSize="small"/>,         trend:"+5.6%",  up:true  },
    { label:"Retention", val:83, color:P.warning,   icon:<LoopIcon fontSize="small"/>,         trend:"+3.2%",  up:true  },
  ];

  const PIE_DATA = [
    { name:"Direct",   value:28, color:P.primary   },
    { name:"Organic",  value:23, color:P.danger     },
    { name:"Referral", value:21, color:P.accent     },
    { name:"Social",   value:17, color:P.secondary  },
    { name:"Email",    value:11, color:P.success    },
  ];

  const PAGE_COLORS = [P.purple, P.pink, P.cyan, P.teal, P.blue];

  return (
    <div style={{ background: P.bg, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>

      {/* Decorative light cone */}
      <div id="light-cone" className={bulbOn ? "on" : "off"} />

      {/* Hanging bulb toggle */}
      <HangingBulb isOn={bulbOn} onToggle={toggleTheme} />

      <Container fluid style={{ padding: " 24px 32px", maxWidth: "100%" }}>

        {/* ── ROW 1: KPI RINGS ── */}
        <div className="mb-3  kpis-grid">
          {kpiData.map((k) => (
            <div key={k.label} className="kpis">
              <div className="kpi-card fade-in">
                <div style={{ position:"absolute", top:10, right:10 }}>
                  <span className="glow-badge" style={{
                    background: k.up ? `${P.green}22` : `${P.pink}22`,
                    color:      k.up ? P.green : P.pink,
                    border:    `1px solid ${k.up ? P.green : P.pink}44`,
                  }}>
                    {k.up ? <TrendingUpIcon sx={{fontSize:11}}/> : <TrendingDownIcon sx={{fontSize:11}}/>}
                    {k.trend}
                  </span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, paddingTop:4 }}>
                  <Ring value={k.val} color={k.color} size={70} stroke={5} P={P} />
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:18, color:k.color, textShadow:`0 0 12px ${k.color}66` }}>
                      {k.val}%
                    </div>
                    <div style={{ fontSize:11, color:P.subtext, marginTop:2 }}>{k.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROW 2: Revenue Area + Donut ── */}
        <Row className="g-3 mb-3">
          <Col xs={12} lg={8}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px 20px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <p className="section-title">Revenue & Profit</p>
                  <p className="section-sub">Live monthly trends</p>
                </div>
                <div style={{ display:"flex", gap:12 }}>
                  {[{label:"Revenue",color:P.purple},{label:"Profit",color:P.pink},{label:"Cost",color:P.cyan}].map(l=>(
                    <span key={l.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:P.subtext }}>
                      <span style={{ width:8, height:8, borderRadius:2, background:l.color, display:"inline-block" }}/>{l.label}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{top:4,right:8,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={P.purple} stopOpacity={0.5}/>
                      <stop offset="100%" stopColor={P.purple} stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={P.pink} stopOpacity={0.45}/>
                      <stop offset="100%" stopColor={P.pink} stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={P.cyan} stopOpacity={0.35}/>
                      <stop offset="100%" stopColor={P.cyan} stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                  <XAxis dataKey="month" tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TooltipContent/>}/>
                  <Area type="monotone" dataKey="revenue" stroke={P.purple} strokeWidth={2.5} fill="url(#gRevenue)" dot={false} activeDot={{r:5,fill:P.purple,strokeWidth:0}}/>
                  <Area type="monotone" dataKey="profit"  stroke={P.pink}   strokeWidth={2}   fill="url(#gProfit)"  dot={false} activeDot={{r:5,fill:P.pink,  strokeWidth:0}}/>
                  <Area type="monotone" dataKey="cost"    stroke={P.cyan}   strokeWidth={2}   fill="url(#gCost)"    dot={false} activeDot={{r:5,fill:P.cyan,  strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Col>

          <Col xs={12} lg={4}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px" }}>
              <p className="section-title" style={{marginBottom:2}}>Traffic Sources</p>
              <p className="section-sub"  style={{marginBottom:12}}>Channel distribution</p>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <ResponsiveContainer width={200} height={180}>
                  <PieChart>
                    <defs>
                      {PIE_DATA.map((d,i)=>(
                        <radialGradient key={i} id={`pg${i}`}>
                          <stop offset="0%"   stopColor={d.color} stopOpacity={1}/>
                          <stop offset="100%" stopColor={d.color} stopOpacity={0.7}/>
                        </radialGradient>
                      ))}
                    </defs>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                      {PIE_DATA.map((d,i)=>(
                        <Cell key={i} fill={`url(#pg${i})`} style={{filter:`drop-shadow(0 0 6px ${d.color}66)`}}/>
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipContent/>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"10px 16px", justifyContent:"center", marginTop:4 }}>
                {PIE_DATA.map(d=>(
                  <div key={d.name} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="28" height="28" style={{ transform:"rotate(-90deg)", position:"absolute" }}>
                        <circle cx="14" cy="14" r="10" fill="none" stroke={P.border} strokeWidth="3"/>
                        <circle cx="14" cy="14" r="10" fill="none" stroke={d.color} strokeWidth="3"
                          strokeDasharray={`${(d.value/100)*62.8} 62.8`} strokeLinecap="round"
                          style={{filter:`drop-shadow(0 0 4px ${d.color})`}}/>
                      </svg>
                      <span style={{ fontSize:7, fontFamily:"'Space Mono',monospace", fontWeight:700, color:d.color, zIndex:1 }}>{d.value}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:d.color, fontFamily:"'Space Mono',monospace" }}>{d.value}%</div>
                      <div style={{ fontSize:10, color:P.subtext }}>{d.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* ── ROW 3: Live Stream + Radar ── */}
        <Row className="g-3 mb-3">
          <Col xs={12} lg={7}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px 20px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div className="stream-dot"/>
                    <p className="section-title">Real-Time Stream</p>
                  </div>
                  <p className="section-sub">Live data every 800ms</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:26, fontWeight:700, color:P.teal, textShadow:`0 0 16px ${P.teal}88` }}>
                    {stream[stream.length-1]?.t ?? "--"}
                  </div>
                  <div style={{ fontSize:12, color:P.subtext }}>
                    v : <span style={{ color:P.teal, fontFamily:"'Space Mono',monospace", fontWeight:700 }}>{liveVal}</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stream} margin={{top:4,right:8,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border}/>
                  <XAxis dataKey="t" tick={{fill:P.subtext,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:P.subtext,fontSize:10}} axisLine={false} tickLine={false} domain={[0,110]}/>
                  <Tooltip content={<TooltipContent/>}/>
                  <Line type="monotone" dataKey="v" stroke={P.teal} strokeWidth={2.5} dot={false}
                    activeDot={{r:6,fill:P.teal,strokeWidth:2,stroke:P.bg,style:{filter:`drop-shadow(0 0 8px ${P.teal})`}}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>

          <Col xs={12} lg={5}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px" }}>
              <p className="section-title" style={{marginBottom:2}}>Performance Radar</p>
              <p className="section-sub"  style={{marginBottom:8}}>Multi-axis comparison</p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={P.border}/>
                  <PolarAngleAxis dataKey="metric" tick={{fill:P.subtext,fontSize:11}}/>
                  <PolarRadiusAxis tick={false} axisLine={false}/>
                  <Radar name="Current" dataKey="A" stroke={P.purple} fill={P.purple} fillOpacity={0.3} strokeWidth={2} style={{filter:`drop-shadow(0 0 6px ${P.purple}88)`}}/>
                  <Radar name="Target"  dataKey="B" stroke={P.pink}   fill={P.pink}   fillOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 2"/>
                  <Legend iconSize={10} wrapperStyle={{fontSize:11,color:P.subtext}}/>
                  <Tooltip content={<TooltipContent/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {/* ── ROW 4: Weekly Bar + Composed ── */}
        <Row className="g-3 mb-3">
          <Col xs={12} lg={6}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px 20px 12px" }}>
              <p className="section-title" style={{marginBottom:2}}>Weekly Sales vs Returns</p>
              <p className="section-sub"  style={{marginBottom:16}}>Grouped bar comparison</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyBar} margin={{top:4,right:8,left:-20,bottom:0}} barGap={3}>
                  <defs>
                    <linearGradient id="bSales"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.purple}/><stop offset="100%" stopColor={P.blue}/></linearGradient>
                    <linearGradient id="bReturns" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.pink}  /><stop offset="100%" stopColor="#aa1155"/></linearGradient>
                    <linearGradient id="bOrders"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.cyan}  /><stop offset="100%" stopColor="#0088aa"/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
                  <XAxis dataKey="day" tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TooltipContent/>}/>
                  <Legend iconSize={10} wrapperStyle={{fontSize:11,color:P.subtext,paddingTop:8}}/>
                  <Bar dataKey="sales"   fill="url(#bSales)"   radius={[4,4,0,0]} maxBarSize={24}/>
                  <Bar dataKey="returns" fill="url(#bReturns)" radius={[4,4,0,0]} maxBarSize={24}/>
                  <Bar dataKey="orders"  fill="url(#bOrders)"  radius={[4,4,0,0]} maxBarSize={24}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px 20px 12px" }}>
              <p className="section-title" style={{marginBottom:2}}>Composed Chart</p>
              <p className="section-sub"  style={{marginBottom:16}}>Bar + Line + Area combined</p>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={composedData} margin={{top:4,right:8,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="cArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.teal}   stopOpacity={0.4}/><stop offset="100%" stopColor={P.teal}   stopOpacity={0.02}/></linearGradient>
                    <linearGradient id="cBar"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.purple}/><stop offset="100%" stopColor="#3311aa"/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
                  <XAxis dataKey="month" tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:P.subtext,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TooltipContent/>}/>
                  <Legend iconSize={10} wrapperStyle={{fontSize:11,color:P.subtext,paddingTop:8}}/>
                  <Area type="monotone" dataKey="area" stroke={P.teal}   fill="url(#cArea)" strokeWidth={2}   dot={false}/>
                  <Bar  dataKey="bar"                  fill="url(#cBar)"                    radius={[4,4,0,0]} maxBarSize={28}/>
                  <Line type="monotone" dataKey="line" stroke={P.pink}   strokeWidth={2.5}  dot={false} activeDot={{r:5,fill:P.pink,strokeWidth:0}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {/* ── ROW 5: Top Pages + Quick Stats ── */}
        <Row className="g-3 mb-3">
          <Col xs={12} lg={6}>
            <div className="dash-card fade-in h-100" style={{ padding:"20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <p className="section-title">Top Pages</p>
                  <p className="section-sub">By pageviews this month</p>
                </div>
                <Chip label="Live" size="small" sx={{ background:`${P.green}22`, color:P.green, border:`1px solid ${P.green}44`, fontSize:10, "& .MuiChip-label":{px:1} }}/>
              </div>
              {topPages.map((pg,i)=>(
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:P.text, fontFamily:"'Space Mono',monospace" }}>{pg.name}</span>
                    <span style={{ fontSize:11, color:P.subtext }}>{pg.views.toLocaleString()} views</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-bar-fill" style={{
                      width:`${pg.pct}%`,
                      background:`linear-gradient(90deg, ${PAGE_COLORS[i]}, ${PAGE_COLORS[(i+1)%PAGE_COLORS.length]})`,
                      boxShadow:`0 0 8px ${PAGE_COLORS[i]}88`,
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <Row className="g-3 h-100">
              {[
                { title:"Avg. Session",  val:"4m 32s", sub:"+12s vs last week", color:P.purple, icon:"⏱" },
                { title:"Pages / Visit", val:"5.8",    sub:"+0.4 vs last week", color:P.cyan,   icon:"📄" },
                { title:"New Users",     val:"12,480", sub:"+18% this month",   color:P.teal,   icon:"👤" },
                { title:"Error Rate",    val:"0.03%",  sub:"Down from 0.07%",   color:P.green,  icon:"🛡" },
              ].map((s,i)=>(
                <Col xs={6} key={i}>
                  <div className="dash-card fade-in h-100" style={{ padding:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <p style={{ margin:0, fontSize:11, color:P.subtext }}>{s.title}</p>
                        <p style={{ margin:"6px 0 4px", fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:20, color:s.color, textShadow:`0 0 14px ${s.color}66` }}>{s.val}</p>
                        <p style={{ margin:0, fontSize:10, color:P.subtext }}>{s.sub}</p>
                      </div>
                      <span style={{ fontSize:22 }}>{s.icon}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

      </Container>
    </div>
  );
}