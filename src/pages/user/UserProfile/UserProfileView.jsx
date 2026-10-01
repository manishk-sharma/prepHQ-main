import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useUserProfile } from "../../../services/userServices";
import customprofileimage from "../../../assets/img/custom-image.webp";
import { FaLinkedin, FaGithub, FaGlobe, FaCodepen } from "react-icons/fa";

const requiredFields = [
  "name", "lastname", "email", "username", "usertype",
  "phone", "city", "linkdin", "degreeOne", "instituteOne", "profile_image",
];

function calcCompletion(user) {
  if (!user) return 0;
  const filled = requiredFields.filter(
    (f) => user[f] && user[f].toString().trim() !== ""
  ).length;
  return Math.round((filled / requiredFields.length) * 100);
}

function InfoRow({ label, value }) {
  return (
    <div className="d-flex gap-2 mb-2 align-items-start">
      <span style={{ color: "#888", minWidth: 130, fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#074568", fontSize: 13 }}>
        {value || <span style={{ color: "#bbb" }}>—</span>}
      </span>
    </div>
  );
}

function Card({ title, children, action }) {
  return (
    <div
      className="mb-3"
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        padding: "18px 20px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 style={{ color: "#074568", fontWeight: 700, margin: 0 }}>{title}</h6>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function UserProfileView() {
  const reduxToken = useSelector((state) => state.auth?.user?.token);
  const { data: user, isLoading } = useUserProfile({ enabled: !!reduxToken });

  const progress = calcCompletion(user
    ? { ...user, profile_image: user.profile_image_url }
    : null
  );

  const editLink = (
    <Link
      to="/user/profile/edit"
      style={{ fontSize: 12, color: "#57cc99", fontWeight: 600, textDecoration: "none" }}
    >
      Edit
    </Link>
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border" style={{ color: "#57cc99" }} />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="row g-3">

        {/* ── LEFT COLUMN ── */}
        <div className="col-12 col-lg-3">
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            {/* Profile image + completion ring */}
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: `conic-gradient(#57cc99 0% ${progress}%, #e0e0e0 ${progress}% 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <img
                src={user?.profile_image_url || customprofileimage}
                alt="Profile"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #fff",
                }}
              />
            </div>

            <h6 style={{ color: "#074568", fontWeight: 700, marginBottom: 2 }}>
              {user?.name || "—"} {user?.lastname || ""}
            </h6>
            <p style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>
              @{user?.username || "username"}
            </p>
            <span
              style={{
                background: "#57cc99",
                color: "#fff",
                borderRadius: 20,
                padding: "2px 12px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {user?.usertype || "User Type"}
            </span>

            {/* Completion bar */}
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontSize: 11, color: "#888" }}>Profile Completion</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#074568" }}>{progress}%</span>
              </div>
              <div style={{ background: "#e0e0e0", borderRadius: 10, height: 6 }}>
                <div
                  style={{
                    width: `${progress}%`,
                    background: "#57cc99",
                    borderRadius: 10,
                    height: "100%",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            <hr style={{ borderColor: "#f0f0f0", margin: "16px 0" }} />

            {/* Social links */}
            <div className="d-flex justify-content-center gap-3">
              {[
                { icon: <FaLinkedin size={22} />, key: "linkdin",   label: "LinkedIn"  },
                { icon: <FaGithub   size={22} />, key: "github",    label: "GitHub"    },
                { icon: <FaGlobe    size={22} />, key: "portfolio", label: "Portfolio" },
                { icon: <FaCodepen  size={22} />, key: "codePen",   label: "CodePen"   },
              ].map(({ icon, key, label }) =>
                user?.[key] ? (
                  <a
                    key={key}
                    href={user[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    style={{
                      color: "#074568",
                      transition: "color 0.2s, transform 0.2s",
                      display: "flex",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#57cc99"}
                    onMouseLeave={e => e.currentTarget.style.color = "#074568"}
                  >
                    {icon}
                  </a>
                ) : (
                  <span
                    key={key}
                    title={`${label} — not added`}
                    style={{ color: "#d0d0d0", display: "flex", cursor: "default" }}
                  >
                    {icon}
                  </span>
                )
              )}
            </div>

            <hr style={{ borderColor: "#f0f0f0", margin: "16px 0" }} />

            <Link
              to="/user/profile/edit"
              className="btn btn-sm w-100"
              style={{ background: "#074568", color: "#fff", fontWeight: 600 }}
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="col-12 col-lg-9">

          {/* Personal Details */}
          <Card title="Personal Details" action={editLink}>
            <div className="row">
              <div className="col-md-6">
                <InfoRow label="First Name"   value={user?.name} />
                <InfoRow label="Last Name"    value={user?.lastname} />
                <InfoRow label="Username"     value={user?.username} />
                <InfoRow label="Email"        value={user?.email} />
              </div>
              <div className="col-md-6">
                <InfoRow label="User Type"    value={user?.usertype} />
                <InfoRow
                  label="Phone"
                  value={
                    user?.phone
                      ? `${user?.countrycode || ""} ${user.phone}`.trim()
                      : null
                  }
                />
                <InfoRow label="City"         value={user?.city} />
              </div>
            </div>
          </Card>

          {/* Resume */}
          <Card title="Resume" action={editLink}>
            {user?.resume ? (
              <div className="d-flex align-items-center gap-3">
                <a
                  href={user.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{ background: "#57cc99", color: "#fff", fontWeight: 600 }}
                >
                  View Resume
                </a>
                {user.resume_date && (
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Last updated:{" "}
                    {new Date(user.resume_date.replace(" ", "T")).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                )}
              </div>
            ) : (
              <p style={{ color: "#bbb", fontSize: 13, margin: 0 }}>
                No resume uploaded.{" "}
                <Link to="/user/profile/edit" style={{ color: "#57cc99", fontWeight: 600 }}>
                  Upload now
                </Link>
              </p>
            )}
          </Card>

          {/* Education */}
          <Card title="Education Details" action={editLink}>
            {user?.degreeOne ? (
              <div className="row">
                {[
                  { degree: user.degreeOne, institute: user.instituteOne },
                  ...(user.degreeTwo
                    ? [{ degree: user.degreeTwo, institute: user.instituteTwo }]
                    : []),
                ].map((edu, i) => (
                  <div className="col-md-6" key={i}>
                    <div
                      style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        padding: "12px 14px",
                        marginBottom: 8,
                      }}
                    >
                      <InfoRow label="Degree"    value={edu.degree} />
                      <InfoRow label="Institute" value={edu.institute} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#bbb", fontSize: 13, margin: 0 }}>
                No education details added.{" "}
                <Link to="/user/profile/edit" style={{ color: "#57cc99", fontWeight: 600 }}>
                  Add now
                </Link>
              </p>
            )}
          </Card>

          {/* Professional */}
          <Card title="Professional Details" action={editLink}>
            {user?.organizationOne ? (
              <div className="row">
                {[
                  {
                    org: user.organizationOne,
                    des: user.designationOne,
                    exp: user.experienceonOne,
                  },
                  ...(user.organizationTwo
                    ? [{
                        org: user.organizationTwo,
                        des: user.designationTwo,
                        exp: user.experienceonTwo,
                      }]
                    : []),
                ].map((pro, i) => (
                  <div className="col-md-6" key={i}>
                    <div
                      style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        padding: "12px 14px",
                        marginBottom: 8,
                      }}
                    >
                      <InfoRow label="Organization"      value={pro.org} />
                      <InfoRow label="Designation"       value={pro.des} />
                      <InfoRow label="Total Experience"  value={pro.exp} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#bbb", fontSize: 13, margin: 0 }}>
                No professional details added.{" "}
                <Link to="/user/profile/edit" style={{ color: "#57cc99", fontWeight: 600 }}>
                  Add now
                </Link>
              </p>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
