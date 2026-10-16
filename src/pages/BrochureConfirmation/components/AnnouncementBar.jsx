import React from "react";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const AnnouncementBar = () => {
  return (
    <aside className="tia-announcement-bar" aria-label="Announcement & Social Links">
      <div className="tia-announcement-left">
        <span className="tia-follow-label">Follow Us:</span>
        <div className="tia-social-icons">
          <a
            href="https://www.instagram.com/theiotacademy/"
            target="_blank"
            rel="noopener noreferrer"
            className="tia-social-circle"
            aria-label="Follow The IoT Academy on Instagram"
          >
            <FaInstagram size={13} />
          </a>
          <a
            href="https://www.facebook.com/theiotacademy/"
            target="_blank"
            rel="noopener noreferrer"
            className="tia-social-circle"
            aria-label="Follow The IoT Academy on Facebook"
          >
            <FaFacebookF size={12} />
          </a>
          <a
            href="https://www.youtube.com/@TheIoTAcademy"
            target="_blank"
            rel="noopener noreferrer"
            className="tia-social-circle"
            aria-label="Subscribe to The IoT Academy on YouTube"
          >
            <FaYoutube size={12} />
          </a>
          <a
            href="https://www.linkedin.com/school/theiotacademy/"
            target="_blank"
            rel="noopener noreferrer"
            className="tia-social-circle"
            aria-label="Follow The IoT Academy on LinkedIn"
          >
            <FaLinkedinIn size={12} />
          </a>
        </div>
      </div>

      <div className="tia-announcement-right">
        <div className="tia-promo-message">
          <span className="tia-promo-text">
            ... a 50% scholarship on courses. No registration fee required! 🚀
          </span>
          <a
            href="https://www.theiotacademy.co/scholarship"
            target="_blank"
            rel="noopener noreferrer"
            className="tia-register-pill-btn"
          >
            Register now! 🚀
          </a>
        </div>

        <div className="tia-scholarship-note">
          <span className="tia-trophy-emoji" role="img" aria-label="Trophy">🏆</span>
          <span>Take a free 20-minute scholarship test</span>
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBar;