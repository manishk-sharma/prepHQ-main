import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./privacy-policy.css";

import Header from "../../components/HeaderBanner";

const PrivacyPolicy = () => {
  return (
    <>
      <Header title="Privacy" highlight="Policy" />

      <section className="privacy-policy">
        <div className="container">
          <h2 className='heading'>1. Introduction</h2>
          <p>
            PrepHQ, operated by The IoT Academy ("we," "our," or "us"), is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our website and services.
          </p>

          <h2 className='heading'>2. Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong>
          </p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Educational background and professional experience</li>
            <li>Learning preferences and progress data</li>
            <li>Resume and portfolio information (if provided)</li>
          </ul>
          <p>
            <strong>Technical Information:</strong>
          </p>
          <ul>
            <li>IP address, browser type, and device information</li>
            <li>Usage patterns and interaction data</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Performance and error logs</li>
          </ul>
          <p>
            <strong>Educational Data:</strong>
          </p>
          <ul>
            <li>Problem-solving attempts and solutions</li>
            <li>Course progress and completion status</li>
            <li>Quiz and assessment results</li>
            <li>Learning path preferences</li>
          </ul>

          <h3 className='heading'>3. How We Use Your Information</h3>
          <p>
            <strong>Primary Uses:</strong>
          </p>
          <ul>
            <li>Provide and improve our educational services</li>
            <li>Personalize your learning experience</li>
            <li>Track progress and provide recommendations</li>
            <li>Communicate about courses, updates, and opportunities</li>
            <li>Process payments and manage subscriptions</li>
          </ul>
          <p>
            <strong>Secondary Uses:</strong>
          </p>
          <ul>
            <li>Analyze usage patterns to improve our platform</li>
            <li>Conduct research on learning effectiveness</li>
            <li>Provide customer support and technical assistance</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h3 className='heading'>4. Information Sharing and Disclosure</h3>
          <p>
            <strong>We Do Not Sell Your Data:</strong>
          </p>
          <ul>
            <li>We never sell your personal information to third parties</li>
            <li>We do not use your data for advertising purposes</li>
          </ul>
          <p>
            <strong>Limited Sharing:</strong>
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party services for email
              delivery and analytics
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of a merger,
              acquisition, or sale of assets
            </li>
            <li>
              <strong>Consent:</strong> When you explicitly authorize sharing
            </li>
          </ul>

          <h3 className='heading'>5. Data Security</h3>
          <p>
            <strong>Security Measures:</strong>
          </p>
          <ul>
            <li>
              Industry-standard encryption for data transmission and storage
            </li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure payment processing through certified providers</li>
          </ul>
          <p>
            <strong>Data Breach Response:</strong>
          </p>
          <ul>
            <li>Immediate investigation and containment procedures</li>
            <li>Notification to affected users within 72 hours</li>
            <li>Cooperation with relevant authorities as required</li>
          </ul>

          <h4 className='heading'>6. Your Privacy Rights</h4>
          <p>
            <strong>Access and Control:</strong>
          </p>
          <ul>
            <li>View and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability upon request</li>
          </ul>
          <p>
            <strong>How to Exercise Rights:</strong>
          </p>
          <ul>
            <li>Contact us at privacy@prephq.theiotacademy.co</li>
            <li>Use account settings for basic changes</li>
            <li>Submit formal requests through our support system</li>
          </ul>

          <h4 className='heading'>7. Cookies and Tracking Technologies</h4>
          <p>
            <strong>Essential Cookies:</strong>
          </p>
          <ul>
            <li>Authentication and session management</li>
            <li>Security and fraud prevention</li>
            <li>Basic functionality and preferences</li>
          </ul>
          <p>
            <strong>Analytics Cookies:</strong>
          </p>
          <ul>
            <li>Usage statistics and performance monitoring</li>
            <li>Feature usage and improvement insights</li>
            <li>Error tracking and debugging</li>
          </ul>
          <p>
            <strong>Cookie Management:</strong>
          </p>
          <ul>
            <li>Most browsers allow you to control cookies</li>
            <li>Disabling cookies may limit functionality</li>
            <li>
              We respect "Do Not Track" signals where technically feasible
            </li>
          </ul>

          <h4 className='heading'>8. Children's Privacy</h4>
          <p>
            <strong>Age Restrictions:</strong>
          </p>
          <ul>
            <li>Our Service is designed for users 13 years and older</li>
            <li>We do not knowingly collect data from children under 13</li>
            <li>
              If we discover such collection, we will promptly delete the
              information
            </li>
          </ul>
          <p>
            <strong>Parental Controls:</strong>
          </p>
          <ul>
            <li>
              Parents may contact us to review or delete their child's
              information
            </li>
            <li>We provide additional protections for users under 18</li>
          </ul>

          <h4 className='heading'>9. International Data Transfers</h4>
          <p>
            <strong>Data Location:</strong>
          </p>
          <ul>
            <li>
              Your data may be processed and stored in India or other countries
            </li>
            <li>
              We ensure appropriate safeguards for international transfers
            </li>
            <li>Data protection agreements are in place with all processors</li>
          </ul>

          <h4 className='heading'>10. Data Retention</h4>
          <p>
            <strong>Retention Periods:</strong>
          </p>
          <ul>
            <li>
              <strong>Account data: </strong>Retained while your account is
              active
            </li>
            <li>
              <strong>Learning progress: </strong>Kept for educational
              continuity
            </li>
            <li>
              <strong>Marketing data: </strong>Until you opt-out or we determine
              it's no longer needed
            </li>
          </ul>
          <p>
            <strong>Deletion Process:</strong>
          </p>
          <ul>
            <li>Automated deletion of expired data</li>
            <li>Manual deletion upon user request</li>
            <li>Secure destruction of all copies</li>
          </ul>

          <h5 className='heading'>11. Third-Party Services</h5>
          <p>
            <strong>Integrated Services:</strong>
          </p>
          <ul>
            <li>Email services (SendGrid, Mailchimp, etc.)</li>
            <li>Analytics platforms (Google Analytics, etc.)</li>
            <li>Cloud storage providers (AWS, Google Cloud, etc.)</li>
          </ul>
          <p>
            <strong>Third-Party Responsibility:</strong>
          </p>
          <ul>
            <li>Each service has its own privacy policy</li>
            <li>We select partners with strong privacy practices</li>
            <li>We limit data sharing to what's necessary for functionality</li>
          </ul>

          <h5 className='heading'>12. Changes to This Privacy Policy</h5>
          <p>
            <strong>Updates:</strong>
          </p>
          <ul>
            <li>
              We may update this policy to reflect changes in practices or laws
            </li>
            <li>
              Material changes will be communicated via email or prominent
              website notice
            </li>
            <li>Continued use after changes constitutes acceptance</li>
          </ul>

          <h5 className='heading'>13. Compliance and Certifications</h5>
          <p>
            <strong>Legal Compliance:</strong>
          </p>
          <ul>
            <li>Indian Information Technology Act, 2000</li>
            <li>Personal Data Protection Bill (when enacted)</li>
            <li>International standards where applicable</li>
          </ul>

          <h5 className='heading'>14. Contact Us</h5>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li>
              <strong>Email:</strong> prephq@theiotacademy.co
            </li>
            <li>
              <strong>Phone: </strong>+91-9354068856&nbsp;
            </li>
            <li>
              <strong>Address: </strong>C-56/12, Third Floor, Sector 62,
              Industrial Area, Gautam Buddha Nagar, Noida, Uttar Pradesh 201309.
            </li>
            <li>
              <strong>Response Time:</strong> We respond to privacy inquiries
              within 3 days
            </li>
          </ul>

          <h5 className='heading'>15. Data Protection Officer</h5>
          <p>
            For complex privacy matters, you may contact our Data Protection
            Officer at:
          </p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:prephq@theiotacademy.co">prephq@theiotacademy.co</a>
            </li>
          </ul>
          <p>
            <strong>Note:</strong> Both documents should be reviewed by a legal
            professional familiar with Indian privacy and education laws before
            implementation. Regular updates may be necessary as laws evolve and
            your services expand.
          </p>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default PrivacyPolicy;
