import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ragister.css";
import Header from "../../components/HeaderBanner";
import HeaderBannerHeading from "../../components/HeaderBannerHeading";
import FormSideImage from "../../components/FormSideImage";
import { useRegister } from "../../services/authServices";

export default function Login() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const regData = { name, lastname, email, username, password };

    try {
      const data = await registerMutation.mutateAsync(regData);

      if (data.status === 1 && data.confirm_token) {
        localStorage.setItem('prephq_reg_data', JSON.stringify(regData));
        localStorage.setItem('prephq_confirm_token', data.confirm_token);
        toast.success('Confirmation code sent to your email');
        setTimeout(() => navigate('/confirm'), 1000);
        setLoading(false);
      } else {
        toast.error(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Network error');
      setLoading(false);
    }
  };

  return (
    <>
    <Header title="Registration" highlight="Form" />
    <section>
      <div className="container">
          <div className="register-sec">
            <div className="left-part">
              <FormSideImage />
            </div>
            <div className="right-part">
              <HeaderBannerHeading title="Registration" highlight="Now" />
          <form className="register-form" onSubmit={submitHandler}>
            <div className="form-control">
              <label style={{ display: "none" }}>First Name</label>
              <input
                type="text"
                value={name}
                placeholder="First Name*"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label style={{ display: "none" }}>Last Name</label>
              <input
                type="text"
                value={lastname}
                placeholder="Last Name*"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label style={{ display: "none" }}>Email</label>
              <input
                type="email"
                value={email}
                placeholder="Email*"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label style={{ display: "none" }}>Username</label>
                  <input
                    value={username}
                    placeholder="Username*"
                    onChange={(e) => setUsername(e.target.value)}
                  />
            </div>
            <div className="form-control">
              <label style={{ display: "none" }}>Password</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Password*"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                <span
                      onClick={togglePassword}
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                  {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="14"
                          viewBox="0 0 20 14"
                          fill="none"
                        >
                          <path
                            d="M19.7361 6.17114C19.6853 6.09897 19.5107 5.85216 19.402 5.71648C18.9165 5.10882 17.7803 3.68493 16.2 2.42848C14.1732 0.816951 12.0871 0 10.0002 0C7.9133 0 5.82787 0.81695 3.8004 2.42775C2.2193 3.68421 1.08311 5.1081 0.598347 5.71503C0.489655 5.85143 0.3143 6.09753 0.263577 6.17042C-0.0878592 6.66838 -0.0878592 7.33234 0.263577 7.82958C0.315025 7.90175 0.489655 8.14856 0.598347 8.28424C1.08311 8.8919 2.2193 10.3151 3.8004 11.5722C5.82714 13.1838 7.9133 14 10.0002 14C12.0871 14 14.1725 13.183 16.2 11.5722C17.7811 10.3158 18.9173 8.8919 19.4027 8.28424C19.5114 8.14784 19.6861 7.90175 19.7368 7.82958C20.0882 7.33162 20.0875 6.66838 19.7361 6.17114ZM10.0002 11.1147C7.84808 11.1147 5.59165 9.73194 3.28738 7.00108C5.59165 4.27094 7.84736 2.88747 10.0002 2.88747C12.153 2.88747 14.4087 4.27094 16.713 7.00108C14.4087 9.73122 12.1523 11.1147 10.0002 11.1147Z"
                            fill="#074568"
                          />
                          <path
                            d="M10.0726 9.74349C11.5934 9.74349 12.8262 8.51567 12.8262 7.00108C12.8262 5.48649 11.5934 4.25867 10.0726 4.25867C8.55191 4.25867 7.31912 5.48649 7.31912 7.00108C7.31912 8.51567 8.55191 9.74349 10.0726 9.74349Z"
                            fill="#074568"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                        >
                          <path
                            d="M7.33809 18.4375H3.17323C2.29821 18.4375 1.58661 17.7367 1.58661 16.875V10.4688C1.58661 9.60703 2.29821 8.90625 3.17323 8.90625H14.5968C15.4719 8.90625 16.1835 9.60703 16.1835 10.4688V11.2891C16.1835 11.7207 16.5385 12.0703 16.9768 12.0703C17.4151 12.0703 17.7701 11.7207 17.7701 11.2891V10.4688C17.7701 8.7457 16.3465 7.34375 14.5968 7.34375H13.6433V4.58867C13.6433 2.0582 11.5081 0 8.88345 0C6.2588 0 4.12361 2.0582 4.12361 4.58867V7.34375H3.17323C1.42359 7.34375 0 8.7457 0 10.4688V16.875C0 18.598 1.42359 20 3.17323 20H7.33809C7.77639 20 8.1314 19.6504 8.1314 19.2188C8.1314 18.7871 7.77639 18.4375 7.33809 18.4375ZM5.71022 4.58867C5.71022 2.92031 7.13381 1.5625 8.88345 1.5625C10.6331 1.5625 12.0567 2.91992 12.0567 4.58867V7.34375H5.71022V4.58867Z"
                            fill="#074568"
                          />
                          <path
                            d="M7.41742 14.2969C7.85555 14.2969 8.21073 13.9471 8.21073 13.5156C8.21073 13.0842 7.85555 12.7344 7.41742 12.7344C6.97929 12.7344 6.62411 13.0842 6.62411 13.5156C6.62411 13.9471 6.97929 14.2969 7.41742 14.2969Z"
                            fill="#074568"
                          />
                          <path
                            d="M18.8553 15.7617C18.8276 15.7227 18.732 15.5891 18.6725 15.5156C18.4067 15.1867 17.7848 14.416 16.9197 13.7359C15.8102 12.8637 14.6682 12.4215 13.5259 12.4215C12.3835 12.4215 11.242 12.8637 10.1321 13.7355C9.26662 14.4156 8.64467 15.1863 8.3793 15.5148C8.31981 15.5887 8.22382 15.7219 8.19605 15.7613C8.00367 16.0309 8.00367 16.3902 8.19605 16.6594C8.22421 16.6984 8.31981 16.832 8.3793 16.9055C8.64467 17.2344 9.26662 18.0047 10.1321 18.6852C11.2416 19.5574 12.3835 19.9992 13.5259 19.9992C14.6682 19.9992 15.8098 19.557 16.9197 18.6852C17.7851 18.0051 18.4071 17.2344 18.6729 16.9055C18.7324 16.8316 18.828 16.6984 18.8557 16.6594C19.0481 16.3898 19.0481 16.0305 18.8557 15.7613L18.8553 15.7617ZM13.5259 18.4375C12.3478 18.4375 11.1126 17.6891 9.85129 16.2109C11.1126 14.7332 12.3474 13.9844 13.5259 13.9844C14.7043 13.9844 15.9391 14.7332 17.2005 16.2109C15.9391 17.6887 14.7039 18.4375 13.5259 18.4375Z"
                            fill="#074568"
                          />
                          <path
                            d="M4.44252 14.2969C4.88065 14.2969 5.23583 13.9471 5.23583 13.5156C5.23583 13.0842 4.88065 12.7344 4.44252 12.7344C4.00439 12.7344 3.64921 13.0842 3.64921 13.5156C3.64921 13.9471 4.00439 14.2969 4.44252 14.2969Z"
                            fill="#074568"
                          />
                          <path
                            d="M13.5655 17.6953C14.398 17.6953 15.0728 17.0307 15.0728 16.2109C15.0728 15.3911 14.398 14.7266 13.5655 14.7266C12.7331 14.7266 12.0583 15.3911 12.0583 16.2109C12.0583 17.0307 12.7331 17.6953 13.5655 17.6953Z"
                            fill="#074568"
                          />
                        </svg>
                      )}
                </span>
              </div>
            </div>
            <div className="btn-group">
              <button type="submit" disabled={loading}>{loading ? "Creating Your Account" : "Create an account"}</button>
            </div>
            <div className="bottom-part">
              <Link to="/login">Already Have An Account Login</Link>
            </div>
          </form>
         </div>
          </div>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
