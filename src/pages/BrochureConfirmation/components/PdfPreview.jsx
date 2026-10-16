import React, { useState, useRef, useEffect } from "react";
import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "react-toastify";

import iotLogo from "../../../assets/brochure/iot-logo.svg";
import forbesTrophy from "../../../assets/brochure/forbes-trophy.svg";
import eictLogo from "../../../assets/brochure/eict-iitr-logo.webp";

const PdfPreview = ({ brochureUrl, brochureFileName, totalPages = 12 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.download = brochureFileName || "Data_Science_AI_GenAI_Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Brochure download started!");
    } catch {
      window.open(brochureUrl, "_blank");
    }
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open(brochureUrl, "_blank");
      if (printWindow) {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 800);
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Data Science, ML, AI & GenAI Program Brochure - The IoT Academy",
      text: "Download or preview the curriculum brochure for the Professional Program in Data Science, ML, AI & GenAI at The IoT Academy.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Brochure link copied to clipboard!");
      } catch {
        toast.info(`Share link: ${window.location.href}`);
      }
    }
  };

  // Scroll tracking to update current page indicator
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    if (scrollHeight <= 0) {
      setCurrentPage(1);
      return;
    }

    const progress = scrollTop / scrollHeight;
    const pageIndex = Math.min(totalPages, Math.max(1, Math.round(progress * (totalPages - 1)) + 1));
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [totalPages]);

  return (
    <div className="tia-preview-column">
      <h2 className="tia-column-heading">Brochure Preview</h2>

      <div className="tia-pdf-preview-card">
        {/* Top PDF Toolbar */}
        <div className="tia-pdf-toolbar">
          <div className="tia-pdf-toolbar-left">
            <span className="tia-toolbar-title">PDF View</span>
          </div>

          <div className="tia-pdf-toolbar-right">
            <button
              type="button"
              className="tia-toolbar-action"
              onClick={handleDownload}
              title="Download PDF"
              aria-label="Download brochure PDF"
            >
              <Download size={14} className="tia-toolbar-icon" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="tia-toolbar-action"
              onClick={handlePrint}
              title="Print Brochure"
              aria-label="Print brochure"
            >
              <Printer size={14} className="tia-toolbar-icon" />
              <span>Print</span>
            </button>

            <button
              type="button"
              className="tia-toolbar-action"
              onClick={handleShare}
              title="Share Brochure"
              aria-label="Share brochure"
            >
              <Share2 size={14} className="tia-toolbar-icon" />
              <span>Share</span>
            </button>

            <div className="tia-toolbar-separator" aria-hidden="true" />

            <span className="tia-page-indicator" aria-label={`Current page ${currentPage} of ${totalPages}`}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div
          className="tia-pdf-viewport"
          ref={scrollContainerRef}
          role="region"
          aria-label="Brochure PDF Viewer"
          tabIndex={0}
        >
          {/* Exact 2-Page Spread Matching Screenshot Proportions */}
          <div className="tia-pdf-spread-container">
            {/* Page 1 (Left Page in Spread) */}
            <div className="tia-mock-pdf-page tia-pdf-page-left">
              {/* Header Logos */}
              <div className="tia-page-header">
                <div className="tia-page-header-logos">
                  <img src={iotLogo} alt="The IoT Academy" className="tia-page-iot-logo" />
                  <img src={forbesTrophy} alt="Trophy" className="tia-page-trophy" />
                  <div className="tia-page-eict-wrap">
                    <img src={eictLogo} alt="E&ICT Academy, IIT Roorkee" className="tia-page-eict-logo" />
                    <span className="tia-page-eict-text">E&amp;ICT Academy,<br />IIT Roorkee</span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="tia-page-intro-text">
                Accelerate your career with industry-based on Data Science, Machine Learning, AI and GenAI from top experts at E&amp;ICT Academy, IIT Roorkee, enthusiasts, AI and more.
              </p>

              {/* Course Modules Badge */}
              <div className="tia-page-badge-orange">Course Modules</div>

              {/* Modules 2x2 Grid */}
              <div className="tia-modules-grid">
                <div className="tia-module-box">
                  <h4>Module 1</h4>
                  <ul>
                    <li>Introduction to Python &amp; Data Structures</li>
                    <li>Object-Oriented Programming</li>
                    <li>NumPy, Pandas &amp; Data Manipulation</li>
                    <li>Data Cleansing &amp; Analysis</li>
                  </ul>
                </div>

                <div className="tia-module-box">
                  <h4>Module 2</h4>
                  <ul>
                    <li>Exploratory Data Analysis (EDA)</li>
                    <li>Statistical Analysis &amp; Testing</li>
                    <li>Data Visualization with Seaborn &amp; Matplotlib</li>
                    <li>Feature Engineering Techniques</li>
                  </ul>
                </div>

                <div className="tia-module-box">
                  <h4>Module 3</h4>
                  <ul>
                    <li>Machine Learning Algorithms</li>
                    <li>Supervised &amp; Unsupervised Models</li>
                    <li>Model Evaluation &amp; Optimization</li>
                    <li>Real-World Business Use Cases</li>
                  </ul>
                </div>

                <div className="tia-module-box">
                  <h4>Module 4</h4>
                  <ul>
                    <li>Deep Learning with PyTorch/TensorFlow</li>
                    <li>Neural Networks &amp; Computer Vision</li>
                    <li>Natural Language Processing (NLP)</li>
                    <li>Generative AI &amp; Large Language Models</li>
                  </ul>
                </div>
              </div>

              {/* Page 1 Footer Bar */}
              <div className="tia-page-footer-bar">
                <span className="tia-doc-tag">Document: Program Brochure</span>
                <span className="tia-doc-tag">Format: PDF version</span>
                <span className="tia-doc-tag">Track: Data Programs</span>
              </div>
            </div>

            {/* Page 2 (Right Page in Spread) */}
            <div className="tia-mock-pdf-page tia-pdf-page-right">
              {/* Navy Top Banner */}
              <div className="tia-page-navy-banner">
                <div className="tia-banner-logos">
                  <div className="tia-banner-badge-iot">
                    <span className="tia-brand-name-pill">The IoT Academy</span>
                  </div>
                  <div className="tia-banner-eict">
                    <img src={eictLogo} alt="E&ICT Roorkee" className="tia-banner-eict-logo" />
                    <span>E&amp;ICT Academy,<br />IIT Roorkee</span>
                  </div>
                </div>

                <h3 className="tia-banner-title">
                  Data Science, Machine<br />Learning, AI &amp; GenAI
                </h3>

                <p className="tia-banner-sub">
                  Accelerate your career with industry-based on Data Science, Machine Learning, AI and GenAI from top experts at E&amp;ICT Academy, IIT Roorkee, enthusiasts, AI and more.
                </p>
              </div>

              {/* Key Features Badge */}
              <div className="tia-page-badge-orange">Key Features</div>

              <ul className="tia-features-bullet-list">
                <li>Specialization in Data Science, Machine Learning, AI &amp; GenAI</li>
                <li>Certification awarded directly by E&amp;ICT Academy, IIT Roorkee</li>
                <li>Live sessions led by esteemed IIT faculty &amp; industry leaders</li>
                <li>Hands-on experience with 15+ industry-grade capstone projects</li>
                <li>Dedicated career mentoring &amp; 100% placement support</li>
              </ul>

              {/* Highlights Badge */}
              <div className="tia-page-badge-orange">Highlights</div>

              <div className="tia-highlights-card">
                <p>
                  <strong>Joint Certification:</strong> Earn career-advancing certification recognized globally by tech enterprises and high-growth AI organizations.
                </p>
                <p>
                  <strong>Practical Exposure:</strong> Master Python, TensorFlow, PyTorch, Hugging Face, LangChain, and state-of-the-art GenAI toolchains.
                </p>
              </div>
            </div>
          </div>

          {/* Additional pages from actual brochure for smooth full 12-page exploration */}
          <div className="tia-extra-pages-stack">
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pageNum) => (
              <div key={pageNum} className="tia-pdf-additional-page-wrapper">
                <img
                  src={`/brochure/pages/page_${pageNum}.png`}
                  alt={`Brochure Page ${pageNum}`}
                  className="tia-additional-page-img"
                  loading="lazy"
                  onError={(e) => {
                    // Graceful fallback if image is not loaded
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;