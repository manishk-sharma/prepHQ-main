import contactSideImg from "../../src/assets/img/contact/sendus-side-image.webp";
import { useNotification } from "../context/useNotificationContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";

const schema = yup.object({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  countryCode: yup.string().required("Country code is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Only numbers allowed")
    .length(10, "Phone number must be exactly 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
});

const DomainContactForm = () => {
  const { showNotification } = useNotification();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: "+91",
    },
  });

  const handleContactUs = handleSubmit(async (data) => {
    try {
      const res = await api.post("/contactus", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res?.status === 200 && res?.data?.status === 1) {
        showNotification(res?.data?.message, "success");
        reset({
          firstname: "",
          lastname: "",
          countryCode: "+91",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        showNotification(
          res?.data?.message || "Message not sent successfully",
          "danger"
        );
      }
    } catch (error) {
      showNotification(
        error?.message || "Message not sent successfully",
        "danger"
      );
    }
  });

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-image">
            <img src={contactSideImg} alt="Contact Support" />
            {/* Contact Methods */}
            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="method-icon">
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
                <h4 className="method-title">Email Support</h4>
                <p className="method-detail">prephq@theiotacademy.co</p>
                <div className="method-footer">
                  <p>
                    <strong>Response Time:</strong>
                  </p>
                  <p>Within 24 hours</p>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon">
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
                <h4 className="method-title">Phone Support</h4>
                <p className="method-detail">+91-9354068856</p>
                <div className="method-footer">
                  <p>
                    <strong>Available:</strong>
                  </p>
                  <p>Within 24 hours</p>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.69123 0C9.14718 0 9.60249 0 10.0584 0C10.3618 0.046875 10.6664 0.0891927 10.9691 0.140625C17.5123 1.2513 20.8781 8.74544 17.314 14.3398C15.4725 17.2298 12.7746 18.6992 9.34874 18.7415C6.23271 18.7799 3.11603 18.75 0 18.75V8.69141C0.0469655 8.38737 0.0913218 8.08333 0.140897 7.77995C0.734488 4.10938 3.65092 1.02734 7.28096 0.242839C7.7467 0.142578 8.22092 0.0800781 8.69123 0Z"
                      fill="#57CC99"
                    />
                    <path
                      d="M16.0642 25C15.601 24.9186 15.1307 24.8659 14.6767 24.75C12.4889 24.1934 10.7929 22.9499 9.58422 21.043C9.5503 20.9889 9.52226 20.9316 9.47203 20.8405C12.5887 20.7546 15.269 19.6654 17.4607 17.4772C19.6551 15.2858 20.7496 12.6055 20.8383 9.48372C20.9133 9.51953 20.9708 9.53906 21.021 9.57096C23.3373 11.0553 24.6588 13.1602 24.9563 15.8991C24.9902 16.2135 24.9974 16.5319 24.998 16.849C25.0013 19.5658 25 22.2826 25 25H16.0642Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h4 className="method-title">Chat With Us</h4>
                <p className="method-detail">
                  <strong>Instant Support:</strong>
                  <br />
                  Available on our website
                </p>
                <div className="method-footer">
                  <p>
                    <strong>Quick Queries:</strong>
                  </p>
                  <p>Technical issues, course info...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <div className="contact-header">
              <span className="contact-label">Send us email</span>
              <h2 className="contact-title">
                Send Us a <span className="highlight">Message</span>
              </h2>
              <p className="contact-description">
                We'd love to hear from you! Fill out the form below, and we'll
                get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleContactUs} className="contact-form">
              <div className="form-row">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-input"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <span className="text-danger">{errors.firstname.message}</span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-input"
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <span className="text-danger">{errors.lastname.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone No"
                    className="form-input"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className="text-danger">{errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Email"
                    className="form-input"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Enter Message"
                  className="form-textarea"
                  rows="5"
                  {...register("message")}
                />
                {errors.message && (
                  <span className="text-danger">{errors.message.message}</span>
                )}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "30px" }}
              >
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
                <p className="business-hours">
                  Live agents are available during business hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomainContactForm;
