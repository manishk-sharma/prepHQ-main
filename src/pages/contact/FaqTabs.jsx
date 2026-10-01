import React, { useState } from "react";
import "./faqtabs.css";
import Accordion from "./Accordion";

const faqDataOne = [
  {
    title: "How do I get started with PrepHQ?",
    content:
      "Simply create a free account on our homepage and browse our resources. You can start with our beginner-friendly content and progress at your own pace.",
  },
  {
    title: "What makes PrepHQ different from other platforms?",
    content:
      "We focus on real-world applications with 700+ practice problems, industry-relevant projects, and direct job placement support through our integrated portal.",
  },
  {
    title: "Do you offer refunds?",
    content:
      "Yes, we offer a 30-day money-back guarantee for all premium courses. Contact our support team for refund requests.",
  },
];
const faqDataTwo = [
  {
    title: "I'm having trouble accessing my account. What should I do?",
    content:
      "Try resetting your password first. If issues persist, contact our technical support team with your registered email address.",
  },
  {
    title: "Can I download course materials for offline access?",
    content:
      "Selected materials are available for download in your student dashboard. Premium members get access to additional offline resources.",
  },
  {
    title: "Which browsers are supported for the best experience?",
    content:
      "We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for optimal performance.",
  },
];
const faqDataThree = [
  {
    title: "How often is the content updated?",
    content:
      "We update our problem sets weekly and review all course content quarterly to ensure it reflects current industry standards.",
  },
  {
    title: "Do you provide certificates upon completion?",
    content:
      "Yes, you'll receive verified certificates for completed courses that you can add to your LinkedIn profile and resume.",
  },
  {
    title: "Can I suggest new topics or improvements?",
    content:
      "Absolutely! We value user feedback. Use the contact form above or email us your suggestions.",
  },
];
const faqDataFour = [
  {
    title: "Do you help with job placements?",
    content:
      "Yes, our integrated job portal connects you with opportunities from partner companies. We also provide resume review and interview coaching.",
  },
  {
    title: "What's the success rate for job placements?",
    content:
      "Over 85% of our active users who complete their chosen learning paths successfully transition to new roles within 6 months.",
  },
  {
    title: "Do you offer mentorship programs?",
    content:
      "Yes, we have both peer mentorship and industry expert mentorship programs available for premium members.",
  },
];

const FaqTabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  return (
    <div className="tabs-container">
      {/* Tab headers */}
      <div className="tab-buttons">
        <button
          className={activeTab === "tab1" ? "active" : ""}
          onClick={() => setActiveTab("tab1")}
        >
          General Questions
        </button>
        <button
          className={activeTab === "tab2" ? "active" : ""}
          onClick={() => setActiveTab("tab2")}
        >
          Technical Support
        </button>
        <button
          className={activeTab === "tab3" ? "active" : ""}
          onClick={() => setActiveTab("tab3")}
        >
          Courses & Content
        </button>
        <button
          className={activeTab === "tab4" ? "active" : ""}
          onClick={() => setActiveTab("tab4")}
        >
          Career Support
        </button>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === "tab1" && <Accordion items={faqDataOne} />}
        {activeTab === "tab2" && <Accordion items={faqDataTwo} />}
        {activeTab === "tab3" && <Accordion items={faqDataThree} />}
        {activeTab === "tab4" && <Accordion items={faqDataFour} />}
      </div>
    </div>
  );
};

export default FaqTabs;
