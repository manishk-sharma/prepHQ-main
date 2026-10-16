import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = ({ phoneNumber = "919354068856" }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%2C%20I%20have%20downloaded%20the%20Brochure%20and%20would%20like%20more%20information%20about%20the%20program.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="tia-whatsapp-floating-btn"
      aria-label="Chat with support on WhatsApp (1 new notification)"
      title="Chat with The IoT Academy on WhatsApp"
    >
      <div className="tia-whatsapp-icon-wrap">
        <FaWhatsapp size={30} className="tia-whatsapp-icon" />
      </div>

      <span className="tia-whatsapp-badge" aria-label="1 unread alert">
        1
      </span>
    </a>
  );
};

export default WhatsAppButton;