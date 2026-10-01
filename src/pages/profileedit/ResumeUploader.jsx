import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUploadResume, useDeleteResume } from "../../services/userServices";

export default function ResumeUploader({ formData, setFormData }) {
  const [uploading, setUploading] = useState(false);
  const uploadResumeMutation = useUploadResume();
  const deleteResumeMutation = useDeleteResume();

  const handleDelete = async () => {
    if (!formData?.resume) {
      toast.warning("No resume to delete.");
      return;
    }

    try {
      await deleteResumeMutation.mutateAsync();
      toast.success('Resume deleted successfully.');
      // Clear resume info from formData state on success
      setFormData(prev => ({ ...prev, resume: null, resume_url: null, resumeDate: null }));
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error(error?.message || 'An error occurred. Please try again.');
    }
  };


  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type (only PDF, DOC, DOCX allowed)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }

    setUploading(true);

    try {
      const data = await uploadResumeMutation.mutateAsync(file);

      setFormData((prev) => ({
        ...prev,
        resume: data.resume,       // Full URL from backend
        resume_url: data.resume_url || data.resume, // full URL used by the View Resume link
        resumeDate: data.resumeDate, //update date backend
        resume_date: data.resume_date //update date immediately
      }));
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <div className="resume">
        <p>
            <label htmlFor="resumeUpload" style={{ cursor: "pointer", color: "#57CC99" }}>
                {formData?.resume ? "Update Resume First Delete Old Resume" : "Upload Resume"}
                {formData?.resume ? (
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none"><path d="M4.96437 0.58305C4.9644 0.428562 5.02649 0.280407 5.13698 0.171141C5.24747 0.0618747 5.39734 0.000436847 5.55364 0.000328132L11.446 0C11.6023 0.000358237 11.7521 0.0619662 11.8626 0.17132C11.9731 0.280674 12.0351 0.428853 12.0353 0.583378V2.02376H4.96437V0.58305ZM14.6525 20.1661C14.6375 20.3932 14.5352 20.6061 14.3666 20.7611C14.198 20.9161 13.9758 21.0016 13.7456 21H3.18634C2.95614 20.9994 2.73469 20.9127 2.56647 20.7574C2.39825 20.602 2.29571 20.3896 2.27945 20.1626L1.37587 7.09808H15.6169L14.6527 20.1659L14.6525 20.1661ZM17 5.91483H0V4.56129C0.000252722 4.2023 0.144626 3.85808 0.40142 3.60421C0.658215 3.35034 1.00644 3.20757 1.36964 3.20725L15.6302 3.2068C15.9934 3.20735 16.3415 3.35025 16.5982 3.60414C16.8549 3.85804 16.9993 4.20221 16.9996 4.56116V5.91471L17 5.91483ZM5.76275 17.8856C5.76275 17.9632 5.77823 18.0402 5.8083 18.1119C5.83838 18.1837 5.88247 18.2489 5.93804 18.3038C5.99361 18.3588 6.05959 18.4023 6.1322 18.4321C6.20481 18.4618 6.28264 18.4771 6.36123 18.4771C6.43983 18.4771 6.51765 18.4618 6.59026 18.4321C6.66287 18.4023 6.72885 18.3588 6.78442 18.3038C6.84 18.2489 6.88408 18.1837 6.91416 18.1119C6.94424 18.0402 6.95972 17.9632 6.95972 17.8856V9.59008C6.95846 9.43407 6.89489 9.28487 6.78285 9.17498C6.67081 9.06508 6.51939 9.00339 6.36154 9.00334C6.2037 9.00328 6.05223 9.06487 5.94011 9.17469C5.828 9.28451 5.76432 9.43366 5.76296 9.58967V17.8856H5.76275ZM10.0329 17.8856C10.0329 18.0425 10.096 18.1929 10.2082 18.3039C10.3205 18.4148 10.4727 18.4772 10.6315 18.4772C10.7902 18.4772 10.9425 18.4148 11.0547 18.3039C11.167 18.1929 11.23 18.0425 11.23 17.8856V9.59008C11.2288 9.43405 11.1652 9.28483 11.0531 9.17492C10.9411 9.06501 10.7896 9.00331 10.6318 9.00325C10.4739 9.0032 10.3224 9.0648 10.2103 9.17463C10.0982 9.28447 10.0345 9.43364 10.0331 9.58967L10.0329 17.8856Z" fill="#FC0005"></path></svg>
                </span>
                ) : (
                  
                <span className="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="38"
                        viewBox="0 0 32 38"
                        fill="none"
                    >
                        <path
                        d="M25.0041 37.998H7.00726C6.96328 37.9772 6.92231 37.9445 6.87633 37.9385C3.09747 37.4378 -0.0307543 34.1103 0.000228181 29.8825C0.0541976 22.6336 0.0122214 15.3836 0.0212163 8.13471C0.0212163 7.58145 0.0492004 7.01628 0.15614 6.47591C0.920707 2.6348 4.12589 0.0360489 8.12562 0.00828656C10.4493 -0.00757761 12.774 0.00332901 15.0987 0.00828656C15.3935 0.00828656 15.6883 0.0400149 16.0052 0.0588536C16.0052 0.245258 16.0052 0.392001 16.0052 0.538745C16.0052 4.02688 15.9892 7.516 16.0201 11.0041C16.0261 11.6209 16.1421 12.2693 16.36 12.8464C17.0676 14.7183 18.8455 15.8546 20.9613 15.8576C24.4724 15.8635 27.9844 15.8596 31.4954 15.8596C31.6413 15.8596 31.7872 15.8596 31.9911 15.8596C31.9911 16.1104 31.9911 16.3167 31.9911 16.5239C31.9911 21.1255 32.0181 25.7281 31.9781 30.3297C31.9501 33.4975 29.8983 36.3392 26.9 37.4735C26.2893 37.7045 25.6357 37.8275 25.0021 38L25.0041 37.998ZM17.5993 24.7157C17.7552 24.8585 17.8471 24.9378 17.9321 25.0221C18.5157 25.5982 19.0894 26.1861 19.6841 26.7503C20.3407 27.374 21.3191 27.3581 21.9418 26.7374C22.5474 26.1326 22.5674 25.1609 21.9488 24.5303C21.0433 23.6082 20.1368 22.6851 19.1884 21.8066C17.4054 20.1548 14.559 20.1716 12.787 21.8374C11.8635 22.7059 10.972 23.6092 10.0805 24.5105C9.44588 25.152 9.45587 26.1306 10.0765 26.7444C10.7032 27.3631 11.6776 27.371 12.3342 26.7444C12.9279 26.1772 13.5026 25.5922 14.0862 25.0152C14.1702 24.9319 14.2611 24.8565 14.4121 24.7187C14.4121 24.9309 14.4121 25.0618 14.4121 25.1917C14.4121 27.3194 14.4081 29.4462 14.4141 31.574C14.4171 32.5407 15.0857 33.2378 15.9922 33.2447C16.9146 33.2517 17.5863 32.5497 17.5983 31.5631C17.6023 31.2419 17.5983 30.9196 17.5983 30.5984C17.5983 28.6699 17.5983 26.7414 17.5983 24.7147L17.5993 24.7157Z"
                        fill="#57CC99"
                        />
                        <path
                        d="M19.2313 0.720404C19.7989 0.999018 20.3496 1.20624 20.8313 1.51956C21.5579 1.9935 22.3025 2.47339 22.9222 3.06929C24.983 5.04934 27.0028 7.07103 29.0167 9.09867C29.9272 10.0148 30.5968 11.1005 31.0995 12.2854C31.1465 12.3964 31.1865 12.5114 31.2514 12.683C31.0815 12.683 30.9516 12.683 30.8217 12.683C27.5495 12.683 24.2774 12.683 21.0062 12.683C19.8509 12.683 19.2133 12.0623 19.2123 10.929C19.2103 7.66494 19.2123 4.40188 19.2123 1.13783C19.2123 1.02876 19.2223 0.918706 19.2313 0.720404Z"
                        fill="#074568"
                        />
                    </svg>
                </span>
                )
              }
            </label>
            {!formData?.resume ? (
            <input
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleResumeChange}
                disabled={uploading}
            />
            ) : (
              <input
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onClick={(e) => {
                  e.preventDefault();   // stops file dialog
                  handleDelete();       // runs only your function
                }}
                disabled={uploading}
              />
            )
          }
            
        </p>
            {formData?.resume && (
            <>
            <p style={{marginTop: "10px"}}>
            <a
                href={formData.resume_url}
                target="_blank"
                rel="noopener noreferrer"
            >
                View Resume {formData.resume_date}
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="20" viewBox="0 0 29 20" fill="none">
                    <path d="M19.0312 10C19.0312 11.2055 18.5539 12.3617 17.7041 13.2141C16.8543 14.0666 15.7018 14.5455 14.5 14.5455C13.2982 14.5455 12.1457 14.0666 11.2959 13.2141C10.4461 12.3617 9.96875 11.2055 9.96875 10C9.96875 8.79447 10.4461 7.63832 11.2959 6.78588C12.1457 5.93344 13.2982 5.45455 14.5 5.45455C15.7018 5.45455 16.8543 5.93344 17.7041 6.78588C18.5539 7.63832 19.0312 8.79447 19.0312 10Z" fill="#57CC99"/>
                    <path d="M0 10C0 10 5.4375 0 14.5 0C23.5625 0 29 10 29 10C29 10 23.5625 20 14.5 20C5.4375 20 0 10 0 10ZM14.5 16.3636C16.1825 16.3636 17.796 15.6932 18.9857 14.4998C20.1754 13.3064 20.8437 11.6877 20.8437 10C20.8437 8.31226 20.1754 6.69364 18.9857 5.50023C17.796 4.30682 16.1825 3.63636 14.5 3.63636C12.8175 3.63636 11.204 4.30682 10.0143 5.50023C8.82461 6.69364 8.15625 8.31226 8.15625 10C8.15625 11.6877 8.82461 13.3064 10.0143 14.4998C11.204 15.6932 12.8175 16.3636 14.5 16.3636Z" fill="#57CC99"/>
                    </svg>
                </span>
            </a>
            </p>
            {formData.resumeDate && (
                <span>
                Uploaded on:{" "}
                {new Date(formData.resumeDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                </span>
            )}
            </>
        )}
    </div>
    </>
  );
}
