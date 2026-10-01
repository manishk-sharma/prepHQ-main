import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import NewsletterForm from "./NewsletterForm";
import logo from "../../assets/img/logo.svg";
import footerBg from "../../assets/img/footer-bg.webp";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-head">
            <div className="row">
              <div className="col-4">
                <div className="part">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M4.84913 0C5.12621 0 5.40329 0 5.68102 0C5.72546 0.016276 5.76859 0.0384115 5.81434 0.047526C6.61094 0.205729 7.26966 0.578776 7.76632 1.23763C8.35903 2.02344 8.94849 2.81445 9.58499 3.56445C10.6332 4.80078 10.66 6.58659 9.60917 7.8151C9.0537 8.46484 8.50738 9.12175 7.94799 9.76758C7.84604 9.88477 7.84147 9.97656 7.90094 10.1113C9.33339 13.3288 11.6611 15.6504 14.8822 17.0833C15.0142 17.1419 15.0985 17.127 15.2063 17.0345C15.8546 16.4779 16.514 15.9329 17.1616 15.375C18.3385 14.362 20.0886 14.3268 21.3054 15.2897C22.1667 15.9714 23.0391 16.6406 23.9037 17.3184C24.018 17.4082 24.1291 17.5072 24.2239 17.6172C25.2708 18.8346 25.259 20.6335 24.1997 21.8424C23.905 22.179 23.6083 22.515 23.3142 22.8522C22.5692 23.707 21.6543 24.3138 20.5767 24.6556C20.0918 24.8092 19.5834 24.888 19.0855 25.0007H17.6177C17.3622 24.9603 17.1067 24.9232 16.8518 24.8796C15.1978 24.5924 13.6654 23.9688 12.2009 23.1712C9.30856 21.5964 6.81745 19.5228 4.657 17.0508C3.08405 15.252 1.75615 13.2917 0.868707 11.0599C0.223056 9.4375 -0.130483 7.76888 0.044653 6.00977C0.289713 3.55469 1.62414 1.80013 3.60292 0.462891C3.86562 0.285807 4.19629 0.207682 4.49886 0.0917969C4.6106 0.0488281 4.73215 0.0299479 4.84913 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.2194 0C15.7415 0.0807292 16.2735 0.119792 16.7832 0.248047C21.078 1.33008 23.7481 4.03581 24.7793 8.32943C24.9375 8.98698 24.9558 9.68229 24.995 10.362C25.0296 10.9714 24.5774 11.4349 23.9899 11.4596C23.4207 11.4837 22.9692 11.0339 22.909 10.4232C22.8424 9.74544 22.8084 9.05599 22.6522 8.39714C21.8608 5.05404 18.9371 2.50911 15.5141 2.14453C15.2312 2.11458 14.9456 2.10286 14.6607 2.0918C14.0411 2.06771 13.6353 1.75 13.5412 1.20703C13.451 0.682943 13.7242 0.263021 14.3045 0.0332031C14.3182 0.0279948 14.3274 0.0117188 14.3391 0.000651042C14.6326 0.000651042 14.926 0 15.2194 0Z"
                        fill="#57CC99"
                      />
                      <path
                        d="M20.8499 10.1276C20.8237 10.3359 20.8257 10.5521 20.7656 10.75C20.6238 11.2194 20.1343 11.5163 19.6631 11.4492C19.124 11.3717 18.7522 10.9635 18.7437 10.416C18.728 9.40234 18.4124 8.4974 17.751 7.72721C16.9257 6.76628 15.869 6.2793 14.6005 6.25C13.9751 6.23568 13.5105 5.7793 13.5216 5.19336C13.5334 4.60417 14.0124 4.15625 14.6306 4.16667C14.8665 4.17057 15.1037 4.18229 15.3377 4.21419C18.2346 4.60872 20.4055 6.7819 20.7839 9.66211C20.8041 9.8151 20.8081 9.97005 20.8198 10.1243C20.8296 10.1257 20.8401 10.1263 20.8499 10.1276Z"
                        fill="#57CC99"
                      />
                    </svg>
                  </div>
                  <p>
                    <span>Call us any time:</span>
                    <Link to="tel:+919354068856">+91-9354068856</Link>
                  </p>
                </div>
              </div>
              <div className="col-4">
                <div className="part">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M24.9673 8.98305C24.9767 9.14495 24.9915 9.28181 24.9915 9.41946C24.9955 12.8599 25.0017 16.3004 24.9994 19.7409C24.9978 22.1036 23.4549 24.1613 21.1895 24.787C20.7055 24.9208 20.1878 24.988 19.6858 24.9896C14.9032 25.0044 10.1205 24.9997 5.33793 24.9974C2.88171 24.9966 0.936918 23.581 0.221403 21.2378C0.0790814 20.7717 0.0126127 20.2649 0.0102667 19.7769C-0.00615498 16.011 0.00166487 12.2444 0.00322884 8.47859C0.00322884 8.34094 0.0219965 8.20251 0.0384181 7.96319C0.231568 8.12586 0.361378 8.21894 0.47242 8.32999C3.17105 11.0298 5.86733 13.7328 8.56674 16.4318C9.40268 17.2679 10.352 17.8975 11.5539 18.082C13.4291 18.3699 15.0212 17.8326 16.3569 16.492C18.2696 14.5727 20.1917 12.6628 22.1037 10.7428C22.4556 10.3893 22.8286 10.1046 23.3032 9.90671C23.8694 9.6713 24.3847 9.3131 24.9673 8.98305Z"
                        fill="white"
                      />
                      <path
                        d="M19.4739 10.2892C19.3581 10.4268 19.2917 10.5183 19.2127 10.5989C17.7449 12.0794 16.2771 13.5599 14.8062 15.0365C13.8772 15.9688 12.7613 16.2855 11.5172 15.8663C11.0316 15.7029 10.5577 15.3767 10.1894 15.0131C7.13258 11.9895 4.10396 8.93691 1.05734 5.90313C0.832133 5.67866 0.829005 5.52302 1.01043 5.27901C2.05516 3.87435 3.46664 3.1509 5.19483 3.13057C8.21876 3.09537 11.2427 3.12587 14.2666 3.11258C14.6256 3.11102 14.6357 3.2776 14.6123 3.54586C14.4363 5.56682 15.0736 7.29292 16.5219 8.71088C17.2616 9.43511 18.1343 9.93643 19.147 10.1797C19.2338 10.2008 19.3175 10.236 19.4739 10.2892Z"
                        fill="white"
                      />
                      <path
                        d="M20.7837 8.29793C18.383 8.23145 16.6212 6.34032 16.6861 3.90016C16.7432 1.7744 18.7365 -0.0572866 20.9307 0.00137114C23.2501 0.0631573 25.0721 2.01763 24.9978 4.36551C24.929 6.51864 22.9576 8.35737 20.7837 8.29793Z"
                        fill="#57CC99"
                      />
                    </svg>
                  </div>
                  <p>
                    <span>Email us 24/7 hours:</span>
                    <Link to="mailto:prephq@theiotacademy.co">
                      prephq@theiotacademy.co
                    </Link>
                  </p>
                </div>
              </div>
              <div className="col-4">
                <div className="part">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M17.6489 2.13542C16.2745 0.760417 14.4419 0 12.4948 0C10.5477 0 8.72553 0.760417 7.34069 2.13542C4.50854 4.97917 4.50854 9.60417 7.3511 12.4583L9.95419 15C10.6518 15.6875 11.5785 16.0312 12.4948 16.0312C13.4111 16.0312 14.3482 15.6875 15.0458 15L17.6489 12.4479C19.0337 11.0729 19.7834 9.23958 19.7834 7.29167C19.7834 5.34375 19.0337 3.51042 17.6489 2.13542ZM12.4948 10.4062C10.7768 10.4062 9.3711 9.01042 9.3711 7.28125C9.3711 5.55208 10.7768 4.15625 12.4948 4.15625C14.2128 4.15625 15.6185 5.55208 15.6185 7.28125C15.6185 9.01042 14.2232 10.4062 12.4948 10.4062Z"
                        fill="#57CC99"
                      />
                      <path
                        d="M24.9896 17.4583C24.9896 17.8229 24.8022 18.1667 24.4794 18.3542L14.2128 24.5208C13.6818 24.8438 13.0883 25 12.4948 25C11.9013 25 11.3078 24.8438 10.7768 24.5208L0.510204 18.3646C0.187422 18.1667 0 17.8333 0 17.4583C0 17.0938 0.197834 16.75 0.520616 16.5625L5.5706 13.6042C5.67472 13.7188 5.77884 13.8333 5.89338 13.9375L8.48605 16.4792C9.55852 17.5312 10.985 18.1042 12.4948 18.1042C14.0046 18.1042 15.4311 17.5208 16.5035 16.4792L19.1274 13.9167C19.2316 13.8125 19.3253 13.7083 19.4294 13.6042L24.4794 16.5625C24.8022 16.75 24.9896 17.0833 25 17.4583H24.9896Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <p>
                    C- 56/12, 3rd Floor, Sector 62, Noida, Uttar Pradesh 201309
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-main">
            <div className="footerbg">
              <img
                src={footerBg}
                alt="footer bg image"
                width="364"
                height="266"
              />
            </div>
            <div className="row">
              <div className="col-4">
                <img src={logo} alt="footer logo" width="171" height="58" />
                <p className="flogo-tagline">
                  prepHQ offers interactive modules, live sessions, and
                  certifications, empowering learners with personalized content
                  for professional and personal growth.
                </p>
              </div>
              <div className="col-2">
                <p className="fhead">
                  Category
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="4"
                    viewBox="0 0 70 4"
                    fill="none"
                  >
                    <path
                      d="M2 2H36.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M43.5 2H52.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M59.5 2H68.5"
                      stroke="#57CC99"
                    />
                  </svg>
                </p>
                <ul className="flist list-unstyled">
                  <li>
                    <Link to="/data-science" onClick={scrollToTop}>Data Science</Link>
                  </li>
                  <li>
                    <Link to="/quantum-computing" onClick={scrollToTop}> Quantum Computing</Link>
                  </li>
                  <li>
                    <Link to="/machine-learning" onClick={scrollToTop}>Machine Learning</Link>
                  </li>
                  <li>
                    <Link to="/artificial-intelligence-genai" onClick={scrollToTop}>AI/Generative AI/Agentic</Link>
                  </li>
                  <li>
                    <Link to="/data-analytics" onClick={scrollToTop}>Data Analytics</Link>
                  </li>
                  <li>
                    <Link to="/cyber-security" onClick={scrollToTop}>Cybersecurity</Link>
                  </li>
                  <li>
                    <Link to="/embedded-and-iot" onClick={scrollToTop}>Embedded and IoT</Link>
                  </li>
                </ul>
              </div>
              <div className="col-2">
                <p className="fhead">
                  Quick Links
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="4"
                    viewBox="0 0 70 4"
                    fill="none"
                  >
                    <path
                      d="M2 2H36.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M43.5 2H52.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M59.5 2H68.5"
                      stroke="#57CC99"
                    />
                  </svg>
                </p>
                <ul className="flist list-unstyled">
                  <li>
                    <Link to="/privacy-policy" onClick={scrollToTop}>Privacy Policy</Link>
                  </li>
                  {/* <li>
                    <Link to="/" onClick={scrollToTop}>Discussion</Link>
                  </li> */}
                  <li>
                    <Link to="/terms-and-conditions" onClick={scrollToTop}>Terms & Conditions</Link>
                  </li>
                  {/* <li>
                    <Link to="/" onClick={scrollToTop}>Customer Support</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={scrollToTop}>Course FAQ’s</Link>
                  </li> */}
                </ul>
              </div>
              <div className="col-4">
                <p className="fhead">
                  Subscribe
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="70"
                    height="4"
                    viewBox="0 0 70 4"
                    fill="none"
                  >
                    <path
                      d="M2 2H36.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M43.5 2H52.5"
                      stroke="#57CC99"
                    />
                    <path
                      d="M59.5 2H68.5"
                      stroke="#57CC99"
                    />
                  </svg>
                </p>
                <div className="subscribe">
                  <NewsletterForm />
                </div>
                <div className="social">
                  <span>- Follow On</span>
                  <ul>
                    <li>
                      <Link to="https://www.linkedin.com/company/prephqbytia" target="_blank"
                        className="linkdin"
                        style={{
                          background:
                            "linear-gradient(225deg, #007AB5 14.64%, #0046E5 85.36%)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="14"
                          viewBox="0 0 15 14"
                          fill="none"
                        >
                          <path
                            d="M1.13002 4.9H3.96002V14H1.13002V4.9ZM2.54002 0.380005C3.45002 0.380005 4.18003 1.11001 4.18003 2.02001C4.18003 2.93001 3.45002 3.66 2.54002 3.66C1.63002 3.66 0.900024 2.92001 0.900024 2.02001C0.900024 1.12001 1.63002 0.380005 2.54002 0.380005Z"
                            fill="white"
                          />
                          <path
                            d="M8.44003 4.9V6.14001H8.48002C8.86002 5.42001 9.78002 4.67 11.16 4.67C14.02 4.67 14.55 6.55 14.55 9V13.99H11.72V9.57C11.72 8.51 11.7 7.16 10.25 7.16C8.80002 7.16 8.55002 8.31 8.55002 9.5V14H5.72003V4.9H8.44003Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.instagram.com/prephq.tia/"
                       target="_blank"
                        className="instagram"
                        style={{
                          background:
                            "linear-gradient(225deg, #FBE18A 14.64%, #FCBB45 29.49%, #F75274 41.51%, #D53692 51.41%, #8F39CE 66.97%, #5B4FE9 85.36%)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M13.89 3.09003C13.33 3.09003 12.88 3.54003 12.88 4.10003C12.88 4.66003 13.33 5.11003 13.89 5.11003C14.45 5.11003 14.9 4.66003 14.9 4.10003C14.9 3.54003 14.45 3.09003 13.89 3.09003Z"
                            fill="white"
                          />
                          <path
                            d="M9.42003 4.38003C7.09003 4.38003 5.20003 6.27003 5.20003 8.60003C5.20003 10.93 7.09003 12.82 9.42003 12.82C11.75 12.82 13.64 10.93 13.64 8.60003C13.64 6.27003 11.75 4.38003 9.42003 4.38003ZM9.42003 11.31C7.93003 11.31 6.72003 10.1 6.72003 8.61003C6.72003 7.12003 7.93003 5.91003 9.42003 5.91003C10.91 5.91003 12.12 7.12003 12.12 8.61003C12.12 10.1 10.91 11.31 9.42003 11.31Z"
                            fill="white"
                          />
                          <path
                            d="M12.77 17.17H5.93003C3.09003 17.17 0.780029 14.86 0.780029 12.02V5.18003C0.780029 2.34003 3.09003 0.0300293 5.93003 0.0300293H12.77C15.61 0.0300293 17.92 2.34003 17.92 5.18003V12.02C17.92 14.86 15.61 17.17 12.77 17.17ZM5.92003 1.64003C3.97003 1.64003 2.38003 3.23003 2.38003 5.18003V12.02C2.38003 13.97 3.97003 15.56 5.92003 15.56H12.76C14.71 15.56 16.3 13.97 16.3 12.02V5.18003C16.3 3.23003 14.71 1.64003 12.76 1.64003H5.92003Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.facebook.com/profile.php?id=61579814723823"
                       target="_blank"
                        className="facebook"
                        style={{
                          background:
                            "linear-gradient(135deg, #4676ED 14.68%, #436DE4 28.16%, #3B54CD 49.44%, #2F2DA8 76.39%, #2B1E99 85.61%)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="25"
                          viewBox="0 0 13 25"
                          fill="none"
                        >
                          <path
                            d="M11.95 13.85L12.6 9.61996H8.54001V6.87996C8.54001 5.71996 9.11001 4.59996 10.92 4.59996H12.76V0.999961C12.76 0.999961 11.09 0.709961 9.49001 0.709961C6.15001 0.709961 3.97001 2.72996 3.97001 6.39996V9.61996H0.26001V13.85H3.97001V24.07C4.71001 24.19 5.48001 24.25 6.25001 24.25C7.02001 24.25 7.79001 24.19 8.53001 24.07V13.85H11.94H11.95Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.youtube.com/@prepHQ-b2k1r"
                       target="_blank"
                        className="youtube"
                        style={{
                          background:
                            "linear-gradient(225deg, #F00 14.64%, #850000 85.36%)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="12"
                          viewBox="0 0 17 12"
                          fill="none"
                        >
                          <path
                            d="M16.1801 3.49999C16.1801 1.55999 14.6101 -0.0100098 12.6701 -0.0100098H3.69005C1.75005 -0.0100098 0.180054 1.55999 0.180054 3.49999V7.67999C0.180054 9.61999 1.75005 11.19 3.69005 11.19H12.6701C14.6101 11.19 16.1801 9.61999 16.1801 7.67999V3.49999ZM10.9001 5.89999L6.87005 7.88999C6.71005 7.97999 6.18005 7.85999 6.18005 7.67999V3.58999C6.18005 3.40999 6.72005 3.28999 6.88005 3.37999L10.7301 5.47999C10.8901 5.56999 11.0601 5.80999 10.9001 5.88999V5.89999Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://x.com/Prephq_tia"
                       target="_blank"
                        className="twiter"
                        style={{
                          background:
                            "linear-gradient(135deg, #22004A 14.66%, #010003 82.52%, #000 85.34%)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="15"
                          viewBox="0 0 14 15"
                          fill="none"
                        >
                          <path
                            d="M7.82997 6.56994L12.67 0.939941H11.52L7.31997 5.82994L3.95997 0.939941H0.0899658L5.16997 8.32994L0.0899658 14.2299H1.23997L5.67997 9.06994L9.22997 14.2299H13.1L7.82997 6.56994ZM6.25997 8.39994L5.74997 7.65994L1.65997 1.80994H3.41997L6.71997 6.53994L7.22997 7.27994L11.52 13.4199H9.75997L6.25997 8.40994V8.39994Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="copyright">
              <p>
                &copy; 2024 - {currentYear} PrepHQ - The IoT Academy. All Rights
                Reserved.
              </p>
              <ul>
                <li>
                  <Link to="/terms-and-conditions" onClick={scrollToTop}>Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" onClick={scrollToTop}>Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button className="gototop" onClick={scrollToTop}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.9993 9.98902C20.004 10.7781 19.3681 11.4217 18.5795 11.4264C18.1959 11.4284 17.8271 11.2764 17.5573 11.0038L10.0029 3.43026L2.44856 11.0038C1.84943 11.5169 0.947726 11.4472 0.434953 10.8477C-0.022928 10.3125 -0.022928 9.52351 0.434953 8.989L9.00349 0.415449C9.56044 -0.138482 10.4601 -0.138482 11.0171 0.415449L19.5856 8.989C19.8494 9.25491 19.998 9.6146 20 9.98902L19.9993 9.98902Z" fill="white"/>
            <path d="M19.9993 18.5626C20.004 19.3516 19.3687 19.9953 18.5802 20C18.1966 20.002 17.8277 19.8499 17.558 19.5773L10.0036 12.0038L2.44856 19.5773C1.88826 20.1373 0.980528 20.1373 0.420226 19.5773C-0.140076 19.0174 -0.140076 18.1084 0.420226 17.5485L8.98876 8.97493C9.54572 8.421 10.4454 8.421 11.0024 8.97493L19.5709 17.5485C19.8434 17.8157 19.998 18.1814 19.9993 18.5632L19.9993 18.5626Z" fill="white"/>
          </svg>
        </button>
      </footer>
    </>
  );
};

export default Footer;
