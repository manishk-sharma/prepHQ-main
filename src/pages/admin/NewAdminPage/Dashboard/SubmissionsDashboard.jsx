import { useMemo, useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area,
} from "recharts";
import { Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import { useAdminSubmissions } from "../../../../services/codingQuestionsServices";
import { getProfileImageUrl } from "../../../../utils/helper";

/* ── PALETTE (mirrors AdminDashboard) ──────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#0B0D1A", surface: "#111427", card: "#141729", border: "#1E2240",
    text: "#E0E4FF", subtext: "#7880AA",
    primary: "#2EC4B6", secondary: "#7C5CFC", accent: "#00D4FF",
    success: "#57CC99", danger: "#F0338A", warning: "#F0C040",
    purple: "#7C5CFC", pink: "#F0338A", cyan: "#00D4FF", teal: "#2EC4B6",
    blue: "#0096FF", green: "#57CC99",
  },
  light: {
    bg: "#F0F2F8", surface: "#FFFFFF", card: "#FFFFFF", border: "#E4E7EC",
    text: "#1A1D2E", subtext: "#667085",
    primary: "#20B2AA", secondary: "#6C5CE7", accent: "#0096FF",
    success: "#22C55E", danger: "#EF4444", warning: "#F59E0B",
    purple: "#6C5CE7", pink: "#EF4444", cyan: "#0096FF", teal: "#20B2AA",
    blue: "#0096FF", green: "#22C55E",
  },
};

const STATUS_COLOR = (P) => ({
  ACCEPTED:     P.success,
  "WRONG ANSWER": P.danger,
  OTHER:        P.warning,
});

const LANG_COLORS = (P) => [P.purple, P.cyan, P.teal, P.pink, P.blue, P.warning];

/* ── SHARED TOOLTIP ────────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, P }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: P.surface, border: `1px solid ${P.border}`,
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}>
      {label && <div style={{ color: P.subtext, marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.primary, display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ opacity: 0.75 }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── CARD WRAPPER ──────────────────────────────────────────────────────────── */
function DashCard({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      padding: "20px",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── KPI CARD ──────────────────────────────────────────────────────────────── */
function KpiCard({ label, value, icon, color, sub, P }) {
  return (
    <div style={{
      background: P.card, border: `1px solid ${P.border}`,
      borderRadius: 18, padding: "16px 18px", flex: 1, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: P.subtext }}>{label}</p>
          <p style={{ margin: "6px 0 4px", fontWeight: 700, fontSize: 26, color, textShadow: `0 0 14px ${color}66` }}>
            {value}
          </p>
          {sub && <p style={{ margin: 0, fontSize: 10, color: P.subtext }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 24, color, opacity: 0.85 }}>{icon}</span>
      </div>
    </div>
  );
}

/* ── USER AVATAR ───────────────────────────────────────────────────────────── */
function UserAvatar({ src, name, size = 28 }) {
  const [err, setErr] = useState(false);
  const initials = (name || "?").charAt(0).toUpperCase();
  if (!src || err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "#57cc99", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.4, fontWeight: 700, flexShrink: 0,
      }}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={getProfileImageUrl(src)}
      alt={name}
      onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

/* ── STATUS BADGE ──────────────────────────────────────────────────────────── */
function StatusBadge({ status, P }) {
  const sc = STATUS_COLOR(P);
  const color = sc[status] || sc.OTHER;
  return (
    <span style={{
      background: `${color}22`, color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function SubmissionsDashboard() {
  const themeMode = localStorage.getItem("themeMode") || "dark";
  const P = THEMES[themeMode];

  /* sync CSS vars so dash-card hover still works */
  const synced = useRef(false);
  useEffect(() => {
    if (synced.current) return;
    synced.current = true;
    const root = document.documentElement;
    Object.entries(P).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
  }, [P]);

  const { data: submissions = [], isLoading, isError } = useAdminSubmissions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ── Derived data ──────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const total    = submissions.length;
    const accepted = submissions.filter((s) => s.status === "ACCEPTED").length;
    const users    = new Set(submissions.map((s) => s.user?.id)).size;
    const questions = new Set(submissions.map((s) => s.question?.id)).size;
    return { total, accepted, users, questions, rate: total ? Math.round((accepted / total) * 100) : 0 };
  }, [submissions]);

  /* Pie — status */
  const pieData = useMemo(() => {
    const groups = submissions.reduce((acc, s) => {
      const key = s.status === "ACCEPTED" || s.status === "WRONG ANSWER" ? s.status : "OTHER";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  /* Bar — language */
  const langData = useMemo(() => {
    const groups = submissions.reduce((acc, s) => {
      const lang = s.language || "unknown";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
      .sort((a, b) => b.count - a.count);
  }, [submissions]);

  /* Area — submissions over time (by date) */
  const timeData = useMemo(() => {
    const byDate = submissions.reduce((acc, s) => {
      const date = new Date(s.created_at).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short",
      });
      if (!acc[date]) acc[date] = { date, total: 0, accepted: 0 };
      acc[date].total++;
      if (s.status === "ACCEPTED") acc[date].accepted++;
      return acc;
    }, {});
    return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [submissions]);

  /* Top users */
  const topUsers = useMemo(() => {
    const byUser = submissions.reduce((acc, s) => {
      const uid = s.user?.id;
      if (!uid) return acc;
      if (!acc[uid]) acc[uid] = { user: s.user, total: 0, accepted: 0 };
      acc[uid].total++;
      if (s.status === "ACCEPTED") acc[uid].accepted++;
      return acc;
    }, {});
    return Object.values(byUser)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [submissions]);

  /* Filtered table rows */
  const tableRows = useMemo(() => {
    return [...submissions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          s.question?.title?.toLowerCase().includes(q) ||
          s.user?.username?.toLowerCase().includes(q) ||
          s.user?.email?.toLowerCase().includes(q) ||
          s.language?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
        return matchSearch && matchStatus;
      });
  }, [submissions, search, statusFilter]);

  /* ── Loading / Error ─────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div style={{ background: P.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner-border" style={{ color: P.primary }} />
          <p style={{ color: P.subtext, marginTop: 12, fontSize: 13 }}>Loading submissions…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ background: P.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: P.danger, fontSize: 14 }}>Failed to load submissions. Please try again.</p>
      </div>
    );
  }

  const lc = LANG_COLORS(P);
  const sc = STATUS_COLOR(P);

  return (
    <div style={{ background: P.bg, minHeight: "100vh", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h5 style={{ color: P.text, fontWeight: 700, margin: 0 }}>Submissions Dashboard</h5>
        <p style={{ color: P.subtext, fontSize: 12, margin: "4px 0 0" }}>
          All user code submissions across PrepCode
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <KpiCard label="Total Submissions" value={stats.total}    icon={<CodeOutlinedIcon />}       color={P.primary}   P={P} />
        <KpiCard label="Accepted"          value={stats.accepted} icon={<CheckCircleOutlineIcon />} color={P.success}   sub={`${stats.rate}% acceptance rate`} P={P} />
        <KpiCard label="Wrong Answer"      value={stats.total - stats.accepted} icon={<CancelOutlinedIcon />} color={P.danger} P={P} />
        <KpiCard label="Active Users"      value={stats.users}    icon={<PeopleOutlineIcon />}      color={P.secondary} sub={`across ${stats.questions} questions`} P={P} />
      </div>

      {/* ── Charts Row 1: Pie + Bar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16, marginBottom: 20 }}>

        {/* Donut — Status */}
        <DashCard style={{ background: P.card, border: `1px solid ${P.border}`, backdropFilter: "none" }}>
          <p style={{ color: P.text, fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>Submission Status</p>
          <p style={{ color: P.subtext, fontSize: 11, margin: "0 0 12px" }}>Accepted vs Wrong Answer</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <defs>
                {pieData.map((d, i) => (
                  <radialGradient key={i} id={`sdPie${i}`}>
                    <stop offset="0%"   stopColor={sc[d.name] || P.warning} stopOpacity={1} />
                    <stop offset="100%" stopColor={sc[d.name] || P.warning} stopOpacity={0.7} />
                  </radialGradient>
                ))}
              </defs>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value" stroke="none">
                {pieData.map((d, i) => (
                  <Cell key={i} fill={`url(#sdPie${i})`}
                    style={{ filter: `drop-shadow(0 0 6px ${sc[d.name] || P.warning}66)` }} />
                ))}
              </Pie>
              <Tooltip content={(props) => <ChartTooltip {...props} P={P} />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center", marginTop: 4 }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: sc[d.name] || P.warning, display: "inline-block" }} />
                <span style={{ fontSize: 11, color: P.subtext }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </DashCard>

        {/* Bar — Language */}
        <DashCard style={{ background: P.card, border: `1px solid ${P.border}`, backdropFilter: "none" }}>
          <p style={{ color: P.text, fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>Submissions by Language</p>
          <p style={{ color: P.subtext, fontSize: 11, margin: "0 0 12px" }}>Total attempts per language</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={langData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {langData.map((_, i) => (
                  <linearGradient key={i} id={`sdBar${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={lc[i % lc.length]} />
                    <stop offset="100%" stopColor={lc[i % lc.length]} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: P.subtext, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.subtext, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={(props) => <ChartTooltip {...props} P={P} />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {langData.map((_, i) => (
                  <Cell key={i} fill={`url(#sdBar${i})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashCard>
      </div>

      {/* ── Charts Row 2: Area over time + Top Users ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Area — submissions over time */}
        <DashCard style={{ background: P.card, border: `1px solid ${P.border}`, backdropFilter: "none" }}>
          <p style={{ color: P.text, fontWeight: 700, fontSize: 13, margin: "0 0 4px" }}>Submission Activity</p>
          <p style={{ color: P.subtext, fontSize: 11, margin: "0 0 12px" }}>Total vs Accepted per day</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sdAreaTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={P.purple} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={P.purple} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sdAreaAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={P.success} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={P.success} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
              <XAxis dataKey="date" tick={{ fill: P.subtext, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.subtext, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={(props) => <ChartTooltip {...props} P={P} />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: P.subtext, paddingTop: 8 }} />
              <Area type="monotone" dataKey="total"    name="Total"    stroke={P.purple}  strokeWidth={2.5} fill="url(#sdAreaTotal)" dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="accepted" name="Accepted" stroke={P.success} strokeWidth={2}   fill="url(#sdAreaAcc)"   dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </DashCard>

        {/* Top Users */}
        <DashCard style={{ background: P.card, border: `1px solid ${P.border}`, backdropFilter: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ color: P.text, fontWeight: 700, fontSize: 13, margin: 0 }}>Top Users</p>
              <p style={{ color: P.subtext, fontSize: 11, margin: "2px 0 0" }}>By total submissions</p>
            </div>
            <Chip label="Top 5" size="small" sx={{
              background: `${P.primary}22`, color: P.primary,
              border: `1px solid ${P.primary}44`, fontSize: 10,
              "& .MuiChip-label": { px: 1 },
            }} />
          </div>
          {topUsers.map((u, i) => {
            const pct = stats.total > 0 ? Math.round((u.total / stats.total) * 100) : 0;
            const barColor = lc[i % lc.length];
            return (
              <div key={u.user.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <UserAvatar 
                  src={u.user.profile_image}
                   name={u.user.name || u.user.username} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: P.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.user.name ? `${u.user.name} ${u.user.lastname || ""}`.trim() : u.user.username || `User #${u.user.id}`}
                      </span>
                      <span style={{ fontSize: 11, color: P.subtext, flexShrink: 0, marginLeft: 8 }}>
                        {u.total} sub
                      </span>
                    </div>
                    <div style={{ background: P.border, borderRadius: 99, height: 5, marginTop: 4, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%", borderRadius: 99,
                        background: `linear-gradient(90deg, ${barColor}, ${barColor}99)`,
                        boxShadow: `0 0 6px ${barColor}88`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </DashCard>
      </div>

      {/* ── Submissions Table ── */}
      <DashCard style={{ background: P.card, border: `1px solid ${P.border}`, backdropFilter: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ color: P.text, fontWeight: 700, fontSize: 13, margin: 0 }}>
              All Submissions <span style={{ color: P.subtext, fontWeight: 400, fontSize: 12 }}>({tableRows.length})</span>
            </p>
            <p style={{ color: P.subtext, fontSize: 11, margin: "2px 0 0" }}>Sorted by newest first</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question, user, language…"
              style={{
                background: P.surface, border: `1px solid ${P.border}`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12,
                color: P.text, outline: "none", width: 220,
              }}
            />
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: P.surface, border: `1px solid ${P.border}`,
                borderRadius: 8, padding: "6px 10px", fontSize: 12,
                color: P.text, outline: "none", cursor: "pointer",
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WRONG ANSWER">Wrong Answer</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${P.border}` }}>
                {["#", "User", "Question", "Language", "Status", "Tests", "Runtime", "Date"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", color: P.subtext, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "24px", textAlign: "center", color: P.subtext }}>
                    No submissions match your filters.
                  </td>
                </tr>
              ) : (
                tableRows.map((s, idx) => (
                  <tr key={s.submission_id} style={{
                    borderBottom: `1px solid ${P.border}`,
                    background: idx % 2 === 0 ? "transparent" : `${P.border}33`,
                  }}>
                    <td style={{ padding: "10px 12px", color: P.subtext }}>{idx + 1}</td>

                    {/* User */}
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <UserAvatar src={s.user?.profile_image} name={s.user?.name || s.user?.username} size={26} />
                        <div>
                          <div style={{ color: P.text, fontWeight: 600, fontSize: 12 }}>
                            {s.user?.name ? `${s.user.name} ${s.user.lastname || ""}`.trim() : s.user?.username || `User #${s.user?.id}`}
                          </div>
                          <div style={{ color: P.subtext, fontSize: 10 }}>{s.user?.email || ""}</div>
                        </div>
                      </div>
                    </td>

                    {/* Question */}
                    <td style={{ padding: "10px 12px", color: P.primary, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {s.question?.title || `Q#${s.submission?.question_id}`}
                    </td>

                    {/* Language */}
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        background: `${P.secondary}22`, color: P.secondary,
                        border: `1px solid ${P.secondary}44`,
                        borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, textTransform: "capitalize",
                      }}>
                        {s.language}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "10px 12px" }}>
                      <StatusBadge status={s.status} P={P} />
                    </td>

                    {/* Tests */}
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ color: P.success, fontWeight: 700 }}>{s.passed_count}</span>
                      <span style={{ color: P.subtext }}> / {s.total_count}</span>
                    </td>

                    {/* Runtime */}
                    <td style={{ padding: "10px 12px", color: P.subtext, whiteSpace: "nowrap" }}>
                      {s.runtime_ms != null ? `${s.runtime_ms} ms` : "—"}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "10px 12px", color: P.subtext, whiteSpace: "nowrap" }}>
                      {new Date(s.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashCard>
    </div>
  );
}
