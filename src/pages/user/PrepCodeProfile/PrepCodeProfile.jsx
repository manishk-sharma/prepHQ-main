import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useUserSubmissions } from "../../../services/codingQuestionsServices";

const STATUS_COLORS = {
  ACCEPTED: "#57cc99",
  "WRONG ANSWER": "#e74c3c",
  OTHER: "#f39c12",
};

const LANG_COLORS = ["#074568", "#57cc99", "#e74c3c", "#f39c12", "#8e44ad", "#2980b9"];

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        padding: "18px 20px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <p style={{ color: "#888", fontSize: 12, margin: 0, marginBottom: 4 }}>{label}</p>
      <h4 style={{ color: color || "#074568", fontWeight: 700, margin: 0 }}>{value}</h4>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      <h6 style={{ color: "#074568", fontWeight: 700, marginBottom: 16 }}>{title}</h6>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.OTHER;
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function LangBadge({ lang }) {
  return (
    <span
      style={{
        background: "#f0f4f8",
        color: "#074568",
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {lang}
    </span>
  );
}

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
        }}
      >
        <strong style={{ color: "#074568" }}>{payload[0].name}</strong>
        <p style={{ margin: 0, color: "#888" }}>{payload[0].value} submissions</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
        }}
      >
        <strong style={{ color: "#074568", textTransform: "capitalize" }}>{label}</strong>
        <p style={{ margin: 0, color: "#888" }}>{payload[0].value} submissions</p>
      </div>
    );
  }
  return null;
};

export default function PrepCodeProfile() {
  const reduxToken = useSelector((state) => state.auth?.user?.token);
  const { data: submissions = [], isLoading, isError } = useUserSubmissions({
    enabled: !!reduxToken,
  });

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 300 }}
      >
        <div className="spinner-border" style={{ color: "#57cc99" }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3 text-center" style={{ color: "#e74c3c", minHeight: 200 }}>
        Failed to load submissions. Please try again later.
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: 300 }}
      >
        <p style={{ color: "#888", fontSize: 15, marginBottom: 12 }}>
          No submissions yet. Start solving problems!
        </p>
        <Link
          to="/prepcode"
          className="btn btn-sm"
          style={{ background: "#57cc99", color: "#fff", fontWeight: 600 }}
        >
          Go to PrepCode
        </Link>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const total = submissions.length;
  const accepted = submissions.filter((s) => s.status === "ACCEPTED").length;
  const wrongAnswer = submissions.filter((s) => s.status === "WRONG ANSWER").length;
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  // Pie data — status breakdown
  const statusGroups = submissions.reduce((acc, s) => {
    const key = s.status === "ACCEPTED" || s.status === "WRONG ANSWER" ? s.status : "OTHER";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusGroups).map(([name, value]) => ({ name, value }));

  // Bar data — language breakdown
  const langGroups = submissions.reduce((acc, s) => {
    const lang = s.language || "unknown";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(langGroups).map(([name, count]) => ({ name, count }));

  // Sorted submissions — newest first
  const sorted = [...submissions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="p-3">

      {/* ── Stats Row ── */}
      <div className="d-flex gap-3 flex-wrap mb-3">
        <StatCard label="Total Submissions" value={total} />
        <StatCard label="Accepted" value={accepted} color="#57cc99" />
        <StatCard label="Wrong Answer" value={wrongAnswer} color="#e74c3c" />
        <StatCard label="Acceptance Rate" value={`${acceptanceRate}%`} color="#074568" />
      </div>

      {/* ── Charts Row ── */}
      <div className="row g-3 mb-3">

        {/* Pie — Status breakdown */}
        <div className="col-12 col-lg-5">
          <SectionCard title="Submission Status Breakdown">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${Math.round(percent * 100)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || STATUS_COLORS.OTHER}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-1">
              {pieData.map((entry) => (
                <div key={entry.name} className="d-flex align-items-center gap-1">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: STATUS_COLORS[entry.name] || STATUS_COLORS.OTHER,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#555" }}>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bar — Language breakdown */}
        <div className="col-12 col-lg-7">
          <SectionCard title="Submissions by Language">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 4, right: 10, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#888", textTransform: "capitalize" }}
                  tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={entry.name} fill={LANG_COLORS[i % LANG_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      </div>

      {/* ── Submissions Table ── */}
      <SectionCard title={`Recent Submissions (${total})`}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e5e5" }}>
                {["#", "Problem", "Language", "Status", "Test Cases", "Runtime", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        color: "#074568",
                        fontWeight: 700,
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, idx) => (
                <tr
                  key={s.submission_id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "10px 12px", color: "#aaa", fontWeight: 600 }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <Link
                      to={`/prepcode/problems/${s.question?.slug}`}
                      style={{ color: "#074568", fontWeight: 600, textDecoration: "none" }}
                    >
                      {s.question?.title || `Problem #${s.submission?.question_id}`}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <LangBadge lang={s.language} />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <StatusBadge status={s.status} />
                  </td>
                  <td style={{ padding: "10px 12px", color: "#555" }}>
                    <span style={{ fontWeight: 600, color: "#57cc99" }}>
                      {s.passed_count}
                    </span>
                    <span style={{ color: "#bbb" }}> / {s.total_count}</span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#888" }}>
                    {s.runtime_ms != null ? `${s.runtime_ms} ms` : "—"}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#888", whiteSpace: "nowrap" }}>
                    {new Date(s.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
