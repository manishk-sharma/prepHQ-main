import React from 'react'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./terms-and-conditions.css";

import Header from "../../components/HeaderBanner";

const TermsAndConditions = () => {
  return (
    <>
        <Header title="Terms &" highlight="Conditions" />

        <section className='terms-and-conditions'>
            <div className='container'>
                <h2 className='heading'>1. Introduction and Acceptance</h2>
                <p>Welcome to PrepHQ, operated by The IoT Academy. These Terms and Conditions ("<strong>Terms</strong>") govern your use of our website at <a href="https://prephq.theiotacademy.co/">https://prephq.theiotacademy.co/</a> and all related services, content, and materials ("<strong>Service</strong>"). By accessing or using our Service, you agree to be bound by these Terms.</p>
                <p>If you do not agree to these Terms, you must not use our Service. We reserve the right to modify these Terms at any time, and such changes will be effective immediately upon posting.</p>

                <h2 className='heading'>2. User Accounts and Registration</h2>
                <p><strong>Account Creation:</strong></p>
                <ul>
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One person may not maintain multiple accounts</li>
                </ul>
                <p><strong>Account Security:</strong></p>
                <ul>
                <li>You are solely responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                </ul>

                <h3 className='heading'>3. Acceptable Use Policy</h3>
                <p><strong>Permitted Uses:</strong></p>
                <ul>
                <li>Access course materials and practice problems for personal learning</li>
                <li>Participate in community discussions and forums</li>
                <li>Use our tools for legitimate career development purposes</li>
                <li>Share your own learning experiences and insights</li>
                </ul>
                <p><strong>Prohibited Activities:</strong></p>
                <ul>
                <li>Copying, distributing, or selling our proprietary content without permission</li>
                <li>Creating multiple accounts or sharing account credentials</li>
                <li>Using automated tools or bots to access our Service</li>
                <li>Posting spam, offensive, or inappropriate content</li>
                <li>Attempting to hack, disrupt, or compromise our systems</li>
                <li>Using the Service for illegal activities or commercial purposes beyond personal use</li>
                </ul>

                <h3 className='heading'>4. Intellectual Property Rights</h3>
                <p><strong>Our Content:</strong></p>
                <ul>
                <li>All content, including text, videos, problems, solutions, and software, is owned by PrepHQ/The IoT Academy or our licensors</li>
                <li>We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes</li>
                <li>You may not reproduce, distribute, modify, or create derivative works from our content</li>
                </ul>
                <p><strong>User-Generated Content:</strong></p>
                <ul>
                <li>You retain ownership of content you submit to our platform</li>
                <li>By submitting content, you grant us a worldwide, royalty-free license to use, display, and distribute your content</li>
                <li>You represent that your submissions do not infringe on third-party rights</li>
                </ul>

                <h3 className='heading'>5. Service Availability and Modifications</h3>
                <p><strong>Service Availability:</strong></p>
                <ul>
                <li>We strive to maintain 99% uptime but cannot guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance when possible</li>
                <li>We reserve the right to modify or discontinue features with reasonable notice</li>
                </ul>
                <p><strong>Content Updates:</strong></p>
                <ul>
                <li>Course content and practice problems are regularly updated</li>
                <li>We may remove or modify content to maintain quality and relevance</li>
                </ul>

                <h4 className='heading'>6. Privacy and Data Protection</h4>
                <p>Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your information. By using our Service, you consent to our privacy practices as described in our Privacy Policy.</p>

                <h4 className='heading'>7. Disclaimers and Limitations of Liability</h4>
                <p><strong>Educational Purpose:</strong></p>
                <ul>
                <li>Our Service is provided for educational purposes only</li>
                <li>We do not guarantee job placement or specific career outcomes</li>
                <li>Salary predictions are estimates based on available data and may not reflect actual offers</li>
                </ul>
                <p><strong>Service Limitations:</strong></p>
                <ul>
                <li>Our Service is provided "as is" without warranties of any kind</li>
                <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                </ul>

                <h4 className='heading'>8. Indemnification</h4>
                <p>You agree to indemnify and hold harmless PrepHQ, The IoT Academy, and our affiliates from any claims, damages, or expenses arising from your use of our Service or violation of these Terms.</p>

                <h4 className='heading'>9. Governing Law and Dispute Resolution</h4>
                <p>These Terms are governed by the laws of India. Any disputes will be resolved through binding arbitration in accordance with Indian arbitration laws, conducted in the jurisdiction where The IoT Academy is headquartered.</p>

                <h4 className='heading'>10. Contact Information</h4>
                <p>For questions about these Terms, contact us at:</p>
                <ul>
                <li><strong>Email: </strong><a href="mailto:prephq@theiotacademy.co">prephq@theiotacademy.co</a></li>
                <li><strong>Phone: </strong><a href="tel:+919354068856">+91-9354068856</a></li>
                <li><strong>Address: </strong>C-56/12, Third Floor, Sector 62, Industrial Area, Gautam Buddha Nagar, Noida, Uttar Pradesh 201309</li>
                </ul>
            </div>
        </section>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  )
}

export default TermsAndConditions
