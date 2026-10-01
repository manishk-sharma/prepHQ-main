import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/HeaderBanner";
import { useConfirmAccount, useResendCode } from "../../services/authServices";

export default function AccountConfirm() {
  const navigate = useNavigate();
  const confirmMutation = useConfirmAccount();
  const resendMutation = useResendCode();
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else {
      toast.error("OTP expired, please Click On Resend Code.");
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 4 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 5);
    if (/^\d{5}$/.test(paste)) {
      setOtp(paste.split(""));
      inputsRef.current[4]?.focus();
    }
    e.preventDefault();
  };

  const confirmRequest = async () => {
    setLoading(true); 
    const code = otp.join('');
    if (code.length !== 5) {
      toast.error('Please enter the 5-digit code');
      setLoading(false); 
      return;
    }

    const regDataStr = localStorage.getItem('prephq_reg_data');
    const confirmToken = localStorage.getItem('prephq_confirm_token');

    if (!regDataStr || !confirmToken) {
      toast.error('Session expired. Please register again.');
      setTimeout(() => {
        localStorage.removeItem("preq_reg_data");
        localStorage.removeItem("preq_confirm_token");
        navigate("/register");
      }, 2000);
      setLoading(false); 
      return;
    }

    const user = JSON.parse(regDataStr);

    // ===== DEBUG: /confirm payload =====
    console.log('========== /confirm DEBUG ==========');
    console.log('code (OTP):', code);
    console.log('confirmToken (header):', confirmToken);
    console.log('user (from prephq_reg_data):', user);
    const payload = { otp: code, user };
    console.log('Full body/payload being sent:', payload);
    console.log('Payload as JSON string:', JSON.stringify(payload));
    console.log('====================================');

    try {
      const data = await confirmMutation.mutateAsync({
        otp: code,
        user,
        confirmToken,
      });
      console.log('/confirm response:', data);

      if (data.status === 1) {
        toast.success('Account confirmed!');
        localStorage.removeItem('prephq_reg_data');
        localStorage.removeItem('prephq_confirm_token');

        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setTimeout(() => {
          setLoading(false); 
          navigate('/login');
        }, 800);
      } else {
        toast.error(data.error || 'Invalid or expired code');
        setLoading(false); 
      }
    } catch {
      toast.error('Server error. Please try again.');
      setLoading(false); 
    }
  };

  const resendCode = async () => {
    setTimer(60); // reset countdown to 60 seconds

    const confirmToken = localStorage.getItem('prephq_confirm_token');
    if (!confirmToken) {
      toast.error('Session expired. Please register again.');
      navigate('/register');
      return;
    }

    try {
      const data = await resendMutation.mutateAsync(confirmToken);

      if (data.status === 1) {
        toast.info('A new code has been sent to your Email.');
      } else {
        toast.error(data.error || 'Failed to resend code.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <>
      <Header title="Confirm" highlight="Your Code" />
      <section style={{ padding: "60px 0", }}>
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmRequest();
            }}
            style={{
              width: "400px",
              margin: "auto",
              border: "1px solid #57cc99",
              borderRadius: "10px",
              padding: "2rem",
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            <p>Enter the 5-digit code sent to your E-mail.</p>
            <div
              onPaste={handlePaste}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px 0",
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: "45px",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "20px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                minWidth: "100%",
                minHeight: "54px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "10px 31px",
                borderRadius: "10px",
                background: hovered ? "#074568" : "#57CC99",
                color: "#fff",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "normal",
                transition: "ease 0.5s",
                position: "relative",
                outline: "none",
                boxShadow: "none",
                border: "none",
                margin: "auto",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Verifying.." : "Confirm"}
            </button>

            <div style={{ marginTop: "1rem" }}>
              {timer > 0 ? (
                <p style={{ color: "#074568",
                    textAlign: "center",
                    fontSize:"16px",
                    fontWeight: "400",
                    border: "none",
                    cursor: "pointer", }}>Resend code in {timer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={resendCode}
                  style={{
                    color: "#074568",
                    background: "transparent",
                    textAlign: "center",
                    fontSize:"16px",
                    fontWeight: "400",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
