import React from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { toast } from "react-toastify";

const BrochureDetailsCard = ({ brochureUrl, brochureFileName }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.download = brochureFileName || "Professional_Program_Data_Science_Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Brochure download started!");
    } catch {
      window.open(brochureUrl, "_blank");
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleViewPrograms = () => {
    navigate("/practice");
  };

  return (
    <div className="tia-details-column">
      <h2 className="tia-column-heading">What&apos;s Next?</h2>

      <div className="tia-brochure-card">
        <div className="tia-card-info">
          <h3 className="tia-program-title">
            Professional Program In Data Science, Machine Learning, AI &amp; GenAI
          </h3>

          <div className="tia-metadata-list">
            <p className="tia-metadata-item">
              <strong>Document:</strong> Program Brochure
            </p>
            <p className="tia-metadata-item">
              <strong>Format:</strong> PDF
            </p>
          </div>
        </div>

        <div className="tia-card-actions">
          <button
            type="button"
            className="tia-btn tia-btn-download"
            onClick={handleDownload}
            aria-label="Download Program Brochure PDF"
          >
            <span>Download Brochure</span>
            <Download size={18} className="tia-btn-icon" />
          </button>

          <button
            type="button"
            className="tia-btn tia-btn-return-home"
            onClick={handleReturnHome}
            aria-label="Return to Homepage"
          >
            Return to Home
          </button>

          <button
            type="button"
            className="tia-btn tia-btn-view-programs"
            onClick={handleViewPrograms}
            aria-label="View other educational programs"
          >
            View Other Programs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrochureDetailsCard;