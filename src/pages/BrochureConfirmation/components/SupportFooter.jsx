import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

const SupportFooter = () => {
  const handleShareClick = async () => {
    const shareData = {
      title: "Data Science, Machine Learning, AI & GenAI Brochure - The IoT Academy",
      text: "Check out this program brochure from The IoT Academy!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied to clipboard!");
      } catch {
        toast.info(`Share link: ${window.location.href}`);
      }
    }
  };

  return (
    <footer className="tia-support-footer">
      <div className="tia-support-left">
        <span>Need help? </span>
        <Link to="/contact" className="tia-contact-link">
          Contact support
        </Link>
      </div>

      <div className="tia-support-right">
        <button
          type="button"
          className="tia-share-action-btn"
          onClick={handleShareClick}
          aria-label="Share this brochure confirmation page"
        >
          <Share2 size={16} className="tia-share-icon" />
          <span className="tia-share-text">Share</span>
        </button>
      </div>
    </footer>
  );
};

export default SupportFooter;