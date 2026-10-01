import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
  useUserProfile,
  useUpdateProfile,
  useUploadProfileImage,
  useUploadResume,
  useDeleteResume,
} from "../../../services/userServices";
import customprofileimage from "../../../assets/img/custom-image.webp";

const INITIAL_FORM = {
  name: "", lastname: "", username: "", email: "",
  usertype: "", countrycode: "+91", phone: "", city: "",
  portfolio: "", linkdin: "", github: "", codePen: "",
  degreeOne: "", instituteOne: "", degreeTwo: "", instituteTwo: "",
  organizationOne: "", designationOne: "", experienceonOne: "",
  organizationTwo: "", designationTwo: "", experienceonTwo: "",
  profile_image: "",
};

const requiredFields = [
  "name", "lastname", "email", "username", "usertype",
  "phone", "city", "linkdin", "degreeOne", "instituteOne", "profile_image",
];

function calcCompletion(form) {
  if (!form) return 0;
  const filled = requiredFields.filter(
    (f) => form[f] && form[f].toString().trim() !== ""
  ).length;
  return Math.round((filled / requiredFields.length) * 100);
}

function FormCard({ title, children }) {
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
      <h6 style={{ color: "#074568", fontWeight: 700, marginBottom: 16 }}>{title}</h6>
      {children}
    </div>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": { borderColor: "#074568" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#074568" },
};

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const reduxToken = useSelector((state) => state.auth?.user?.token);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showSecondEdu, setShowSecondEdu] = useState(false);
  const [showSecondPro, setShowSecondPro] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const { data: userData, isError: userError } = useUserProfile({ enabled: !!reduxToken });
  const updateProfileMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();
  const uploadResumeMutation = useUploadResume();
  const deleteResumeMutation = useDeleteResume();

  useEffect(() => {
    if (!userData) return;
    const { password, ...safe } = userData;
    setFormData((prev) => ({
      ...prev,
      ...safe,
      profile_image: safe.profile_image_url || "",
    }));
    if (safe.degreeTwo || safe.instituteTwo) setShowSecondEdu(true);
    if (safe.organizationTwo || safe.designationTwo || safe.experienceonTwo) setShowSecondPro(true);
  }, [userData]);

  useEffect(() => {
    if (userError) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [userError, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.lastname || !formData.username || !formData.email) {
      toast.error("Name, Last Name, Username and Email are required.");
      return;
    }
    try {
      const {
        name, lastname, username, email, usertype, countrycode, phone, city,
        portfolio, linkdin, github, codePen,
        degreeOne, instituteOne, degreeTwo, instituteTwo,
        organizationOne, designationOne, experienceonOne,
        organizationTwo, designationTwo, experienceonTwo,
      } = formData;

      const result = await updateProfileMutation.mutateAsync({
        name, lastname, username, email, usertype,
        countrycode: countrycode || "+91", phone, city,
        portfolio, linkdin, github, codePen,
        degreeOne, instituteOne, degreeTwo, instituteTwo,
        organizationOne, designationOne, experienceonOne,
        organizationTwo, designationTwo, experienceonTwo,
      });

      if (result?.status) {
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/user/profile"), 1000);
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadImageMutation.mutateAsync(file);
      const imageUrl = data.image.startsWith("http")
        ? data.image
        : `https://prephq.theiotacademy.co/${data.image}`;
      setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
      toast.success("Profile image updated!");
    } catch (err) {
      toast.error(err?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!formData.resume) return;
    try {
      await deleteResumeMutation.mutateAsync();
      setFormData((prev) => ({ ...prev, resume: null, resume_url: null, resume_date: null }));
      toast.success("Resume deleted.");
    } catch (err) {
      toast.error(err?.message || "Delete failed.");
    }
  };

  const onDropResume = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, DOC, DOCX allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }
    setResumeUploading(true);
    try {
      const data = await uploadResumeMutation.mutateAsync(file);
      setFormData((prev) => ({
        ...prev,
        resume: data.resume,
        resume_url: data.resume_url || data.resume,
        resume_date: data.resume_date,
      }));
      toast.success("Resume uploaded!");
    } catch (err) {
      toast.error(err?.message || "Resume upload failed.");
    } finally {
      setResumeUploading(false);
    }
  }, [uploadResumeMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropResume,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: resumeUploading,
  });

  const progress = calcCompletion(formData);
  const isSaving = updateProfileMutation.isPending;

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
            {/* Profile image with upload */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
              <div
                style={{
                  width: 110, height: 110, borderRadius: "50%",
                  background: `conic-gradient(#57cc99 0% ${progress}%, #e0e0e0 ${progress}% 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <img
                  src={formData.profile_image || customprofileimage}
                  alt="Profile"
                  style={{
                    width: 96, height: 96, borderRadius: "50%",
                    objectFit: "cover", border: "3px solid #fff",
                  }}
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                style={{
                  position: "absolute", bottom: 4, right: 4,
                  background: "#57cc99", borderRadius: "50%",
                  width: 28, height: 28, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", border: "2px solid #fff",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={uploading}
              />
            </div>

            {uploading && (
              <p style={{ fontSize: 11, color: "#57cc99", marginBottom: 4 }}>Uploading image...</p>
            )}

            <h6 style={{ color: "#074568", fontWeight: 700, marginBottom: 2 }}>
              {formData.name || "—"} {formData.lastname || ""}
            </h6>
            <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
              @{formData.username || "username"}
            </p>

            {/* Completion bar */}
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontSize: 11, color: "#888" }}>Profile Completion</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#074568" }}>{progress}%</span>
              </div>
              <div style={{ background: "#e0e0e0", borderRadius: 10, height: 6 }}>
                <div
                  style={{
                    width: `${progress}%`, background: "#57cc99",
                    borderRadius: 10, height: "100%", transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <hr style={{ borderColor: "#f0f0f0", margin: "12px 0" }} />

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-sm w-100 mb-2"
              style={{ background: "#074568", color: "#fff", fontWeight: 600 }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => navigate("/user/profile")}
              className="btn btn-sm w-100"
              style={{ border: "1px solid #e0e0e0", color: "#888", fontWeight: 600 }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="col-12 col-lg-9">

          {/* Personal Details */}
          <FormCard title="Personal Details">
            <div className="row g-3">
              <div className="col-md-6">
                <TextField
                  fullWidth size="small" variant="outlined"
                  label="First Name" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="First Name" sx={fieldSx}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth size="small" variant="outlined"
                  label="Last Name" name="lastname"
                  value={formData.lastname} onChange={handleChange}
                  placeholder="Last Name" sx={fieldSx}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth size="small" variant="outlined"
                  label="Username" name="username"
                  value={formData.username} onChange={handleChange}
                  placeholder="Username" sx={fieldSx}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth size="small" variant="outlined"
                  label="Email" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="Email" disabled sx={fieldSx}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  select fullWidth size="small" variant="outlined"
                  label="User Type" name="usertype"
                  value={formData.usertype ?? ""} onChange={handleChange}
                  sx={fieldSx}
                >
                  <MenuItem value="">Select User Type</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                </TextField>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-2">
                  <TextField
                    select size="small" variant="outlined"
                    label="Code" name="countrycode"
                    value={formData.countrycode || "+91"} onChange={handleChange}
                    sx={{ ...fieldSx, minWidth: 90 }}
                  >
                    <MenuItem value="+91">+91</MenuItem>
                    <MenuItem value="+92">+92</MenuItem>
                    <MenuItem value="+1">+1</MenuItem>
                    <MenuItem value="+44">+44</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Phone" name="phone"
                    value={formData.phone || ""}
                    inputProps={{ maxLength: 15 }}
                    placeholder="Phone number"
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (val.length <= 15) handleChange({ target: { name: "phone", value: val } });
                    }}
                    sx={fieldSx}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth size="small" variant="outlined"
                  label="City" name="city"
                  value={formData.city || ""} onChange={handleChange}
                  placeholder="City" sx={fieldSx}
                />
              </div>
            </div>
          </FormCard>

          {/* Social Links */}
          <FormCard title="Social Links">
            <div className="row g-3">
              {[
                { label: "LinkedIn URL",  name: "linkdin" },
                { label: "GitHub URL",    name: "github" },
                { label: "Portfolio URL", name: "portfolio" },
                { label: "CodePen URL",   name: "codePen" },
              ].map(({ label, name }) => (
                <div className="col-md-6" key={name}>
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label={label} name={name} type="url"
                    value={formData[name] || ""} onChange={handleChange}
                    placeholder="https://..." sx={fieldSx}
                  />
                </div>
              ))}
            </div>
          </FormCard>

          {/* Resume */}
          <FormCard title="Resume">
            {formData.resume ? (
              <div className="upload-dropzone" style={{ cursor: "default", padding: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <IoCloudUploadOutline size={40} style={{ color: "#57cc99", marginBottom: 8 }} />
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#074568" }}>
                    Resume uploaded
                  </p>
                  {formData.resume_date && (
                    <p style={{ margin: "0 0 14px", fontSize: 12, color: "#888" }}>
                      Uploaded:{" "}
                      {new Date(formData.resume_date.replace(" ", "T")).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  )}
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{ background: "#074568", color: "#fff", fontWeight: 600 }}
                    >
                      View Resume
                    </a>
                    <button
                      onClick={handleResumeDelete}
                      disabled={deleteResumeMutation.isPending}
                      className="btn btn-sm btn-outline-danger"
                    >
                      {deleteResumeMutation.isPending ? "Deleting..." : "Delete Resume"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`upload-dropzone ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="upload-inner">
                  <IoCloudUploadOutline className="upload-icon" size={50} />
                  <div className="upload-text">
                    <span>{resumeUploading ? "Uploading..." : "Drag and Drop here"}</span>
                    {!resumeUploading && (
                      <>
                        <span className="or-text">or</span>
                        <button type="button" className="browse-btn">Browse files</button>
                        <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                          PDF, DOC, DOCX — max 5MB
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FormCard>

          {/* Education */}
          <FormCard title="Education Details">
            {/* Entry 1 */}
            <div
              style={{
                background: "#f8f9fa", borderRadius: 8,
                padding: "14px 16px", marginBottom: 12,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: 12, fontWeight: 700, color: "#074568" }}>Education 1</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  style={{ fontSize: 11, padding: "2px 8px" }}
                  onClick={() => setFormData((p) => ({ ...p, degreeOne: "", instituteOne: "" }))}
                >
                  Clear
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Degree" name="degreeOne"
                    value={formData.degreeOne || ""} onChange={handleChange}
                    placeholder="Ex: B.Tech" sx={fieldSx}
                  />
                </div>
                <div className="col-md-6">
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Institute" name="instituteOne"
                    value={formData.instituteOne || ""} onChange={handleChange}
                    placeholder="Ex: IIT Roorkee" sx={fieldSx}
                  />
                </div>
              </div>
            </div>

            {/* Entry 2 toggle */}
            {!showSecondEdu && !formData.degreeTwo ? (
              <button
                className="btn btn-sm"
                style={{ border: "1px dashed #57cc99", color: "#57cc99", fontSize: 12 }}
                onClick={() => setShowSecondEdu(true)}
              >
                + Add Second Education
              </button>
            ) : (
              <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "14px 16px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#074568" }}>Education 2</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: 11, padding: "2px 8px" }}
                    onClick={() => {
                      setFormData((p) => ({ ...p, degreeTwo: "", instituteTwo: "" }));
                      setShowSecondEdu(false);
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <TextField
                      fullWidth size="small" variant="outlined"
                      label="Degree" name="degreeTwo"
                      value={formData.degreeTwo || ""} onChange={handleChange}
                      placeholder="Ex: MBA" sx={fieldSx}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextField
                      fullWidth size="small" variant="outlined"
                      label="Institute" name="instituteTwo"
                      value={formData.instituteTwo || ""} onChange={handleChange}
                      placeholder="Ex: IIM Ahmedabad" sx={fieldSx}
                    />
                  </div>
                </div>
              </div>
            )}
          </FormCard>

          {/* Professional */}
          <FormCard title="Professional Details">
            {/* Entry 1 */}
            <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: 12, fontWeight: 700, color: "#074568" }}>Experience 1</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  style={{ fontSize: 11, padding: "2px 8px" }}
                  onClick={() => setFormData((p) => ({ ...p, organizationOne: "", designationOne: "", experienceonOne: "" }))}
                >
                  Clear
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Organization" name="organizationOne"
                    value={formData.organizationOne || ""} onChange={handleChange}
                    placeholder="Ex: Google" sx={fieldSx}
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Designation" name="designationOne"
                    value={formData.designationOne || ""} onChange={handleChange}
                    placeholder="Ex: Software Engineer" sx={fieldSx}
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    fullWidth size="small" variant="outlined"
                    label="Total Experience" name="experienceonOne"
                    value={formData.experienceonOne || ""} onChange={handleChange}
                    placeholder="Ex: 2 years" sx={fieldSx}
                  />
                </div>
              </div>
            </div>

            {/* Entry 2 toggle */}
            {!showSecondPro && !formData.organizationTwo ? (
              <button
                className="btn btn-sm"
                style={{ border: "1px dashed #57cc99", color: "#57cc99", fontSize: 12 }}
                onClick={() => setShowSecondPro(true)}
              >
                + Add Second Experience
              </button>
            ) : (
              <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "14px 16px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#074568" }}>Experience 2</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ fontSize: 11, padding: "2px 8px" }}
                    onClick={() => {
                      setFormData((p) => ({ ...p, organizationTwo: "", designationTwo: "", experienceonTwo: "" }));
                      setShowSecondPro(false);
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <TextField
                      fullWidth size="small" variant="outlined"
                      label="Organization" name="organizationTwo"
                      value={formData.organizationTwo || ""} onChange={handleChange}
                      placeholder="Ex: Microsoft" sx={fieldSx}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      fullWidth size="small" variant="outlined"
                      label="Designation" name="designationTwo"
                      value={formData.designationTwo || ""} onChange={handleChange}
                      placeholder="Ex: Team Lead" sx={fieldSx}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      fullWidth size="small" variant="outlined"
                      label="Total Experience" name="experienceonTwo"
                      value={formData.experienceonTwo || ""} onChange={handleChange}
                      placeholder="Ex: 3 years" sx={fieldSx}
                    />
                  </div>
                </div>
              </div>
            )}
          </FormCard>

          {/* Bottom action bar */}
          <div className="d-flex gap-2 justify-content-end">
            <button
              onClick={() => navigate("/user/profile")}
              className="btn btn-sm"
              style={{ border: "1px solid #e0e0e0", color: "#888", fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-sm"
              style={{ background: "#074568", color: "#fff", fontWeight: 600, minWidth: 110 }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
