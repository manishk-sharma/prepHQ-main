import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContactUs } from "../services/contactServices";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    countryCode: '+91',
    phone: '',
    email: '',
    message: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const contactMutation = useContactUs();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, countryCode, phone, email, message } = formData;

    // Basic validation
    if (!firstname || !lastname || !countryCode || !phone || !email || !message) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    try {
      const data = await contactMutation.mutateAsync(formData);

      if (data.status === 1) {
        toast.success("Message sent successfully!");
        setSuccess('Message sent successfully!');
        setError('');
        setFormData({
          firstname: '',
          lastname: '',
          countryCode: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        toast.error("Something went wrong");
        setError(data.message || 'Something went wrong');
        setSuccess('');
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
      setError('Something went wrong');
      setSuccess('');
    }
  };

  const styles = {
    contactForm: {
      position: "relative",
      maxWidth: "410px",
      minHidth: "432px",
      background: "rgba(0, 37, 65, 0.9)",
      padding: "30px 32px",
      paddingTop: "80px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      color: "#fff",
    },
    ribbon: {
      position: "absolute",
      top: "20px",
      right: "-34px",
      background: "#57CC99",
      padding: "6px 30px",
      color: "#FFF",
      fontSize: "16px",
      fontWeight: "700",
      textTransform: "capitalize",
      transform: "rotate(45deg)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    formRow: {
      display: "flex",
      gap: "20px",
    },
    formControl: {
      marginBottom: "0",
      display: "flex",
      gap: "5px",
    },
    input: {
      flex: 1,
      border: " 1px solid #D9D9D9",
      background: "transparent",
      minHeight: "48px",
      borderRadius: "10px",
      padding: "0 15px",
      color: "#fff",
      fontSize: "16px",
      outline: "none",
      width: "100%",
    },
    textarea: {
      flex: 1,
      border: " 1px solid #D9D9D9",
      background: "transparent",
      fontFamily: "Merriweather Sans",
      minHeight: "48px",
      borderRadius: "10px",
      padding: "15px",
      color: "#fff",
      fontSize: "16px",
      outline: "none",
      width: "100%",
      resize: "vertical",
    },
    button: {
      backgroundColor: "#57CC99",
      color: "white",
      fontSize: "20px",
      minHeight: "50px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      display: "inline-flex",
      gap: "10px",
      width: "146px",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "400",
      textTransform: "capitalize",
      fontFamily: "Merriweather Sans",
      position: "relative",
      overflow: "hidden",
      zIndex: "1",
    },
    arrowIcon: {
      fontSize: "18px",
    },
  };

  return (
    <>
    <div className="contactform" style={styles.contactForm}>
      <div className="ribbon" style={styles.ribbon}>Contact Us</div>
      <form  onSubmit={handleSubmit} style={styles.form}>
        <div className="form-row" style={styles.formRow}>
          <div className="formcontrol" style={styles.formControl}>
            <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                style={styles.input}
            />
          </div>
          <div className="formcontrol" style={styles.formControl}>
            <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                style={styles.input}
            />
          </div>
        </div>
        <div className="form-row" style={styles.formRow}>
          <div className="formcontrol" style={styles.formControl}>
            <select
              name="countryCode"
              value={formData.countryCode || '+91'}
              onChange={(e) => handleChange({ target: { name: 'countryCode', value: e.target.value } })}
              style={{
                padding: '0 5px',
                minHeight: '48px',
                borderRadius: '10px',
                border: '1px solid rgb(217, 217, 217)',
                background: 'transparent',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxShadow: 'none',
              }}
            >
              <option value="+91" style={{color: '#000',}}>+91</option>
              <option value="+92" style={{color: '#000',}}>+92</option>              
            </select>
              <input
                type="text"
                name="phone"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="15"
                value={formData.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                  if (onlyNums.length <= 15) {
                    handleChange({ target: { name: 'phone', value: onlyNums } });
                  }
                }}
                placeholder="Phone No."
                style={styles.input}
              />
          </div>
          <div className="formcontrol" style={styles.formControl}>
              <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
              />
          </div>
        </div>
        <div className="formcontrol" style={styles.formControl}>
            <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                style={styles.textarea}
                required
            />
        </div>

        <button className="submit-btn" type="submit" style={styles.button}>
            
                submit
                <svg
                    style={styles.arrowIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                >
                    <path
                    d="M9.15656 8.28434C4.35013 12.7288 4.04882 20.2257 8.48305 25.0415C12.9243 29.8547 20.427 30.1562 25.2402 25.715C30.0534 21.2738 30.355 13.771 25.9137 8.95784C21.4725 4.14466 13.9697 3.84311 9.15656 8.28434ZM23.8998 24.2623C19.8887 27.9635 13.6369 27.7122 9.93572 23.7011C6.2346 19.69 6.48587 13.4381 10.497 9.73701C14.5104 6.04188 20.7571 6.29294 24.4611 10.2983C28.1622 14.3094 27.9109 20.5612 23.8998 24.2623Z"
                    fill="white"
                    />
                    <path
                    d="M22.1362 14.4606L22.07 20.5726L20.0383 20.431L20.0882 15.7593L13.5514 21.791L12.13 20.2505L18.6669 14.2189L14.0062 13.8938L14.0282 11.8572L20.1257 12.2818C21.248 12.3607 22.1476 13.3356 22.1362 14.4606Z"
                    fill="white"
                    />
                </svg>
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: '#57cc99' }}>{success}</p>}
      </form>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default ContactForm;
