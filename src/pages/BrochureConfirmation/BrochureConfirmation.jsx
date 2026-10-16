import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AnnouncementBar from "./components/AnnouncementBar";
import BrochureNavbar from "./components/BrochureNavbar";
import BrochureDetailsCard from "./components/BrochureDetailsCard";
import PdfPreview from "./components/PdfPreview";
import SupportFooter from "./components/SupportFooter";
import WhatsAppButton from "./components/WhatsAppButton";
import "./BrochureConfirmation.css";

const BrochureConfirmation = () => {
  const brochureUrl = "/brochure/Professional_Program_Brochure.pdf";
  const brochureFileName = "Professional_Program_in_Data_Science_ML_AI_GenAI_Brochure.pdf";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="tia-brochure-page-wrapper">
      <Helmet>
        <title>Thank You! Your Brochure is Ready | The IoT Academy</title>
        <meta
          name="description"
          content="Thank you for requesting the curriculum brochure. Download or preview the syllabus for the Professional Program in Data Science, Machine Learning, AI & GenAI."
        />
      </Helmet>

      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <BrochureNavbar />

      {/* 3. Main Confirmation Section */}
      <main className="tia-confirmation-main" id="main-content">
        <div className="tia-confirmation-container">
          {/* Main Page Heading */}
          <header className="tia-confirmation-header">
            <h1 className="tia-main-title">
              Thank You! Your Brochure is Ready
              <span className="tia-checkmark-badge" aria-label="Success checkmark">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tia-checkmark-svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="11" fill="#22c55e" />
                  <path
                    d="M7 12.5L10.5 16L17 8.5"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="tia-subtitle">
              We&apos;ve also emailed a copy to you. Feel free to download or browse the curriculum below.
            </p>
          </header>

          {/* Two-Column Layout */}
          <section className="tia-two-column-layout" aria-label="Brochure information and viewer">
            {/* Left Column: What's Next? */}
            <BrochureDetailsCard
              brochureUrl={brochureUrl}
              brochureFileName={brochureFileName}
            />

            {/* Right Column: Brochure Preview */}
            <PdfPreview
              brochureUrl={brochureUrl}
              brochureFileName={brochureFileName}
              totalPages={12}
            />
          </section>

          {/* Bottom Support Area */}
          <SupportFooter />
        </div>
      </main>

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton phoneNumber="919354068856" />
    </div>
  );
};

export default BrochureConfirmation;