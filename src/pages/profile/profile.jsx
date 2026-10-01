import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { useUserProfile } from "../../services/userServices";
import "./profile.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import customprofileimage from "../../assets/img/custom-image.webp";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Read token from Redux (persisted) — single source of truth
  const reduxToken    = useSelector((state) => state.auth?.user?.token);
  const reduxUserInfo = useSelector((state) => state.auth?.user?.user);

  useEffect(() => {
    const token = reduxToken;

    if (!token || token.split(".").length !== 3) {
      toast.error("Invalid or missing token");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setUserToken(decoded);
    } catch (err) {
      console.error("Token decode failed:", err.message);
      navigate("/login");
    }
  }, [navigate, reduxToken]);

  useEffect(() => {
    console.log(user, "User state updated in Profile.jsx"); // DEBUG here
  }, [user]);

  // Fetch the user via React Query (token attached by the api interceptor).
  const { data: profileData, isError: profileError } = useUserProfile({
    enabled: !!reduxToken,
  });

  useEffect(() => {
    if (profileData) {
      setUser({
        ...profileData,
        profile_image: profileData.profile_image_url,
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (profileError) {
      navigate("/login");
    }
  }, [profileError, navigate]);

  //profile progress
  const requiredFields = [
    "name",
    "lastname",
    "email",
    "username",
    "usertype",
    "phone",
    "city",
    "linkdin",
    "degreeOne",
    "instituteOne",
    "profile_image",
  ];

  const calculateProfileCompletion = (user) => {
    if (!user) return 0;

    let filledCount = 0;
    requiredFields.forEach((field) => {
      if (user[field] && user[field].toString().trim() !== "") {
        filledCount++;
      }
    });

    return Math.round((filledCount / requiredFields.length) * 100);
  };
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      setProgress(calculateProfileCompletion(user));
    }
  }, [user]);

  return (
    <>
      <section className="profile-sec">
        <div className="container">
          <div className="parts">
            <div className="left-side">
              <div className="profile">
                <div
                  className="circular-progress"
                  style={{
                    background: `conic-gradient(#57CC99 0% ${progress}%, rgba(224, 224, 224, 0.3) ${progress}% 100%)`,
                  }}
                >
                  {user && (
                    <img
                      src={user.profile_image || customprofileimage}
                      alt="profile image"
                      className="profile-image"
                    />
                  )}
                </div>
              </div>

              {user ? (
                <>
                  <p className="full-name">
                    <span>{user.name}</span>
                    <span>{user.lastname}</span>
                  </p>
                  <p className="user-name">User Name : {user.username}</p>
                </>
              ) : (
                <p className="user-name">Loading user from API...</p>
              )}

              <p className="user-name">Profile {progress}% Completed</p>

              <p className="user-type">
                {user?.usertype?.trim() ? user.usertype : "User Type"}
              </p>

              <ul className="profile-links">
                <li>
                  {user ? (
                    <a
                      href={
                        user.portfolio && user.portfolio !== ""
                          ? user.portfolio
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!user.portfolio || user.portfolio.trim() === "") {
                          e.preventDefault(); // prevent navigation
                          toast.error("Portfolio URL not available");
                        }
                      }}
                    >
                      <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M12.959 7.54163H15.6673C15.8815 7.54163 16.0907 7.56329 16.2923 7.60413V1.49996C16.2923 0.694126 15.6398 0.041626 14.834 0.041626H8.16732C7.36148 0.041626 6.70898 0.694126 6.70898 1.49996V1.70829H10.2507C10.969 1.70829 11.6582 1.99329 12.1657 2.50163C12.674 3.00913 12.959 3.69829 12.959 4.41663V7.54163Z"
                            fill="#074568"
                          />
                          <path
                            d="M1.70898 4.68746C1.91065 4.64663 2.11982 4.62496 2.33398 4.62496H7.72648C8.73565 4.62496 9.68232 5.11246 10.269 5.93329L11.3557 7.45413C11.3948 7.50913 11.4582 7.54163 11.5248 7.54163H12.1257V4.41663C12.1257 3.91913 11.9282 3.44246 11.5765 3.09079C11.2248 2.73913 10.7482 2.54163 10.2507 2.54163H3.16732C2.36148 2.54163 1.70898 3.19496 1.70898 3.99996V4.68746Z"
                            fill="#074568"
                          />
                          <path
                            d="M15.667 17.9583C16.932 17.9583 17.9587 16.9316 17.9587 15.6666V10.6666C17.9587 9.40163 16.932 8.37496 15.667 8.37496H11.5245C11.1887 8.37496 10.8728 8.21246 10.677 7.93913L9.59116 6.41829C9.16033 5.81579 8.46616 5.45829 7.72616 5.45829C6.01366 5.45829 2.33366 5.45829 2.33366 5.45829C1.06866 5.45829 0.0419922 6.48496 0.0419922 7.74996V15.6666C0.0419922 16.9316 1.06866 17.9583 2.33366 17.9583H15.667ZM4.00033 14.625H6.50033C6.84533 14.625 7.12533 14.345 7.12533 14C7.12533 13.655 6.84533 13.375 6.50033 13.375H4.00033C3.65533 13.375 3.37533 13.655 3.37533 14C3.37533 14.345 3.65533 14.625 4.00033 14.625ZM4.00033 12.5416H6.50033C6.84533 12.5416 7.12533 12.2616 7.12533 11.9166C7.12533 11.5716 6.84533 11.2916 6.50033 11.2916H4.00033C3.65533 11.2916 3.37533 11.5716 3.37533 11.9166C3.37533 12.2616 3.65533 12.5416 4.00033 12.5416Z"
                            fill="#074568"
                          />
                        </svg>
                      </span>
                      Portfolio
                    </a>
                  ) : (
                    "..."
                  )}
                </li>
                <li>
                  {user ? (
                    <a
                      href={
                        user.linkdin && user.linkdin !== "" ? user.linkdin : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!user.linkdin || user.linkdin.trim() === "") {
                          e.preventDefault(); // prevent navigation
                          toast.error("Linkdin URL not available");
                        }
                      }}
                    >
                      <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M20 20V12.675C20 9.075 19.225 6.325 15.025 6.325C13 6.325 11.65 7.425 11.1 8.475H11.05V6.65H7.075V20H11.225V13.375C11.225 11.625 11.55 9.95 13.7 9.95C15.825 9.95 15.85 11.925 15.85 13.475V19.975H20V20Z"
                            fill="#074568"
                          />
                          <path
                            d="M0.325 6.65H4.475V20H0.325V6.65Z"
                            fill="#074568"
                          />
                          <path
                            d="M2.4 0C1.075 0 0 1.075 0 2.4C0 3.725 1.075 4.825 2.4 4.825C3.725 4.825 4.8 3.725 4.8 2.4C4.8 1.075 3.725 0 2.4 0Z"
                            fill="#074568"
                          />
                        </svg>
                      </span>
                      LinkedIn
                    </a>
                  ) : (
                    "..."
                  )}
                </li>
                <li>
                  {user ? (
                    <a
                      href={
                        user.github && user.github !== "" ? user.github : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!user.github || user.github.trim() === "") {
                          e.preventDefault(); // prevent navigation
                          toast.error("Github URL not available");
                        }
                      }}
                    >
                      <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10 0C4.475 0 0 4.4 0 9.82667C0 14.1692 2.865 17.8517 6.8375 19.15C7.3375 19.2425 7.52083 18.9383 7.52083 18.6775C7.52083 18.4442 7.5125 17.8258 7.50833 17.0067C4.72667 17.5992 4.14 15.6883 4.14 15.6883C3.685 14.5542 3.0275 14.2508 3.0275 14.2508C2.12167 13.6417 3.0975 13.6542 3.0975 13.6542C4.10167 13.7225 4.62917 14.6667 4.62917 14.6667C5.52083 16.1692 6.97 15.735 7.54167 15.4842C7.63167 14.8483 7.88917 14.4158 8.175 14.17C5.95417 13.9242 3.62 13.0792 3.62 9.31417C3.62 8.24167 4.0075 7.365 4.64917 6.6775C4.53667 6.42917 4.19917 5.43 4.73667 4.07667C4.73667 4.07667 5.57417 3.81333 7.48667 5.08417C8.28667 4.86583 9.13667 4.7575 9.98667 4.7525C10.8367 4.7575 11.6867 4.86583 12.4867 5.08417C14.3867 3.81333 15.2242 4.07667 15.2242 4.07667C15.7617 5.43 15.4242 6.42917 15.3242 6.6775C15.9617 7.365 16.3492 8.24167 16.3492 9.31417C16.3492 13.0892 14.0117 13.92 11.7867 14.1617C12.1367 14.4567 12.4617 15.0592 12.4617 15.98C12.4617 17.295 12.4492 18.3517 12.4492 18.6708C12.4492 18.9283 12.6242 19.2358 13.1367 19.1375C17.1375 17.8475 20 14.1625 20 9.82667C20 4.4 15.5225 0 10 0Z"
                            fill="#074568"
                          />
                        </svg>
                      </span>
                      GitHub
                    </a>
                  ) : (
                    "..."
                  )}
                </li>
                <li>
                  {user ? (
                    <a
                      href={
                        user.codePen && user.codePen !== "" ? user.codePen : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!user.codePen || user.codePen.trim() === "") {
                          e.preventDefault(); // prevent navigation
                          toast.error("Codepen URL not available");
                        }
                      }}
                    >
                      <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M0.353446 13.7242L9.56462 19.865C9.68626 19.9487 9.83313 19.9983 9.99159 20C9.99436 20 9.99713 20 10 20"
                            fill="#074568"
                          />
                          <path
                            d="M10.0084 20C10.1669 19.9983 10.3137 19.9487 10.4354 19.865L19.6476 13.7236C19.7084 13.6842 19.7635 13.6365 19.8109 13.5821C19.9287 13.447 20 13.2703 20 13.0769V6.92308C20 6.72974 19.9287 6.55307 19.8109 6.41793C19.7887 6.39248 19.7649 6.36851 19.7396 6.34618C19.7108 6.32072 19.68 6.29738 19.6476 6.27642L10.4355 0.135026C10.3116 0.0498564 10.1616 0 10 0C9.83836 0 9.68841 0.0498564 9.56451 0.135026L0.352462 6.27642C0.32001 6.29737 0.289241 6.32072 0.26039 6.34618C0.100708 6.48713 0 6.69334 0 6.92308V13.0769C0 13.3486 0.14082 13.5874 0.353446 13.7242M9.23077 6.51139V2.20655L2.15598 6.92308L5.38462 9.07549L9.23077 6.51139ZM10.7692 6.51139L14.6154 9.07549L17.844 6.92308L10.7692 2.20655V6.51139ZM13.2286 10L10 7.84758L6.77136 10L10 12.1524L13.2286 10ZM3.99787 10L1.53846 8.36041V11.6396L3.99787 10ZM10.7692 17.7934V13.4886L14.6154 10.9245L17.844 13.0769L10.7692 17.7934ZM18.4615 11.6396V8.36041L16.0022 10L18.4615 11.6396ZM9.23077 17.7934L2.15598 13.0769L5.38462 10.9245L9.23077 13.4886V17.7934Z"
                            fill="#074568"
                          />
                        </svg>
                      </span>
                      CodePen
                    </a>
                  ) : (
                    "..."
                  )}
                </li>
              </ul>

              <div className="reset-btn">
                <Link to="/reset">Reset your Password</Link>
              </div>
              <div className="edit-profile-btn">
                <Link to="/profile/edit">
                  Edit Profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <path
                      d="M2.81541 0H11.8431C11.819 0.0135548 11.7938 0.0253251 11.768 0.0352198C11.346 0.163636 10.9627 0.395113 10.6528 0.708728C8.30488 3.05681 5.95674 5.40411 3.60834 7.75062C3.11906 8.23401 2.77366 8.84367 2.61062 9.51168C2.45908 10.1218 2.47552 10.7444 2.51625 11.3616C2.5554 11.985 3.02098 12.4468 3.64593 12.4847C4.12878 12.5161 4.61339 12.5072 5.09476 12.4581C5.96562 12.3642 6.69355 11.9588 7.31107 11.3404C9.52633 9.12281 11.7442 6.90766 13.9647 4.69498C14.4064 4.25511 14.8371 3.81563 15 3.18791V9.99734H14.8156C13.8633 9.99734 12.911 9.99734 11.9571 9.99734C11.8106 9.99604 11.6644 10.0091 11.5205 10.0365C10.6199 10.2208 10.0094 10.9679 10.0051 11.8969C10 12.8683 10.0051 13.8396 10.0051 14.8109V14.9901C9.95301 14.9937 9.91502 14.998 9.87743 14.998C7.6161 14.998 5.35476 15.0038 3.09342 14.9956C1.70569 14.9905 0.4879 14.0458 0.117472 12.7102C0.0700916 12.538 0.0391573 12.3607 0 12.1861V2.81222C0.0110265 2.78614 0.0198005 2.75917 0.0262324 2.7316C0.211447 1.53643 0.859109 0.69464 1.97431 0.229329C2.24136 0.118577 2.53465 0.0747472 2.81541 0Z"
                      fill="#074568"
                    />
                    <path
                      d="M3.73717 11.2489C3.7544 10.8153 3.74187 10.4028 3.79356 9.99656C3.86404 9.44241 4.14049 8.97906 4.53755 8.58771C5.41076 7.72127 6.2811 6.85196 7.14856 5.97978C8.606 4.52345 10.0632 3.06738 11.5201 1.61157C11.9575 1.17482 12.5084 1.0582 13.0347 1.2844C13.2245 1.36675 13.3923 1.49236 13.5247 1.65118C13.6572 1.80999 13.7506 1.9976 13.7975 2.19898C13.8444 2.40035 13.8435 2.6099 13.7948 2.81085C13.7461 3.0118 13.651 3.19857 13.5171 3.35619C13.4662 3.41528 13.411 3.47046 13.3558 3.52564C11.046 5.83459 8.73652 8.14353 6.42728 10.4525C5.89161 10.989 5.25531 11.2606 4.49683 11.2485C4.25523 11.2457 4.01088 11.2489 3.73717 11.2489Z"
                      fill="#074568"
                    />
                    <path
                      d="M11.257 14.8078V13.9519C11.257 13.278 11.257 12.6044 11.257 11.931C11.257 11.5036 11.5126 11.2497 11.9418 11.2493C12.8503 11.2493 13.7587 11.2493 14.6672 11.2493H14.8426C14.7208 11.4864 14.6288 11.7067 14.5 11.9032C14.3685 12.1027 14.2181 12.289 14.0508 12.4597C13.5257 12.9978 12.9897 13.5253 12.4583 14.0572C12.162 14.3563 11.8078 14.5921 11.4175 14.7502C11.3732 14.7679 11.3274 14.7823 11.257 14.8078Z"
                      fill="#074568"
                    />
                  </svg>
                </Link>
              </div>

              <div className="profile-details">
                <div className="head">
                  <span>Personal Details</span>
                </div>
                {user ? (
                  <>
                    <p>
                      {user.name || "Name"}&nbsp;{user.lastname}{" "}
                    </p>
                    <p>{user.email || "Email"} </p>
                    <p>
                      {user?.phone
                        ? user.countrycode
                          ? `${user.countrycode} ${user.phone}`
                          : user.phone
                        : "Phone No."}
                    </p>
                    <p>{user.city || "City"} </p>
                  </>
                ) : (
                  <p>Loading user from API...</p>
                )}
              </div>

              <div className="logout-btn">
                <Link to="/logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M5.93311 5.53997C6.13977 3.13997 7.37311 2.15997 10.0731 2.15997H10.1598C13.1398 2.15997 14.3331 3.35331 14.3331 6.33331V10.68C14.3331 13.66 13.1398 14.8533 10.1598 14.8533H10.0731C7.39311 14.8533 6.15977 13.8866 5.93977 11.5266"
                      stroke="#F13E3E"
                    />
                    <path d="M10.0002 8.5H2.41357" stroke="#F13E3E" />
                    <path
                      d="M3.89984 6.26666L1.6665 8.5L3.89984 10.7333"
                      stroke="#F13E3E"
                    />
                  </svg>
                  Logout
                </Link>
              </div>
            </div>
            <div className="right-side">
              <div className="head-part">
                <p>Online/offline Course</p>
                <p className="head">
                  Sharpen Your Skills With Professional Online/Offline Courses
                </p>
                <div className="btn-group">
                  <Link
                    to="https://www.theiotacademy.co/all-courses"
                    target="_blank"
                  >
                    Explore All Courses
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M1.3335 4.00001V2.81334C1.3335 1.34001 2.37683 0.736672 3.6535 1.47334L4.6835 2.06667L5.7135 2.66001C6.99016 3.39667 6.99016 4.60334 5.7135 5.34001L4.6835 5.93334L3.6535 6.52667C2.37683 7.26334 1.3335 6.66001 1.3335 5.18667V4.00001Z"
                          stroke="#57CC99"
                        />
                      </svg>
                    </span>
                  </Link>
                  <p>
                    Co-powered by -
                    <Link to="https://www.theiotacademy.co/" target="_blank">
                      The IoT Academy
                    </Link>
                  </p>
                </div>
                <svg
                  className="star-bg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="221"
                  height="180"
                  viewBox="0 0 221 180"
                  fill="none"
                >
                  <path
                    d="M111 45C111 45 113.207 65.5997 121.804 74.1964C130.4 82.793 151 85 151 85C151 85 130.4 87.207 121.804 95.8036C113.207 104.4 111 125 111 125C111 125 108.793 104.4 100.196 95.8036C91.5997 87.207 71 85 71 85C71 85 91.5997 82.793 100.196 74.1964C108.793 65.5997 111 45 111 45Z"
                    fill="white"
                  />
                  <path
                    d="M181 93C181 93 183.207 113.6 191.804 122.196C200.4 130.793 221 133 221 133C221 133 200.4 135.207 191.804 143.804C183.207 152.4 181 173 181 173C181 173 178.793 152.4 170.196 143.804C161.6 135.207 141 133 141 133C141 133 161.6 130.793 170.196 122.196C178.793 113.6 181 93 181 93Z"
                    fill="white"
                  />
                  <path
                    d="M40 122C40 122 42.207 152.385 50.8036 165.065C59.4003 177.745 80 181 80 181C80 181 59.4003 184.255 50.8036 196.935C42.207 209.615 40 240 40 240C40 240 37.793 209.615 29.1964 196.935C20.5997 184.255 0 181 0 181C0 181 20.5997 177.745 29.1964 165.065C37.793 152.385 40 122 40 122Z"
                    fill="white"
                  />
                  <path
                    d="M171.5 -59C171.5 -59 173.183 -28.6154 179.738 -15.9354C186.293 -3.25535 202 -3.8147e-06 202 -3.8147e-06C202 -3.8147e-06 186.293 3.25534 179.738 15.9354C173.183 28.6154 171.5 59 171.5 59C171.5 59 169.817 28.6154 163.262 15.9354C156.707 3.25534 141 -3.8147e-06 141 -3.8147e-06C141 -3.8147e-06 156.707 -3.25535 163.262 -15.9354C169.817 -28.6154 171.5 -59 171.5 -59Z"
                    fill="white"
                  />
                  <path
                    d="M40.5 20C40.5 20 42.1828 35.4498 48.7378 41.8973C55.2927 48.3447 71 50 71 50C71 50 55.2927 51.6553 48.7378 58.1027C42.1828 64.5502 40.5 80 40.5 80C40.5 80 38.8172 64.5502 32.2622 58.1027C25.7073 51.6553 10 50 10 50C10 50 25.7073 48.3447 32.2622 41.8973C38.8172 35.4498 40.5 20 40.5 20Z"
                    fill="white"
                  />
                </svg>
              </div>

              <div className="resume">
                {user?.resume ? (
                  <>
                    <p>
                      <a
                        href={user.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                        <span className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="29"
                            height="20"
                            viewBox="0 0 29 20"
                            fill="none"
                          >
                            <path
                              d="M19.0312 10C19.0312 11.2055 18.5539 12.3617 17.7041 13.2141C16.8543 14.0666 15.7018 14.5455 14.5 14.5455C13.2982 14.5455 12.1457 14.0666 11.2959 13.2141C10.4461 12.3617 9.96875 11.2055 9.96875 10C9.96875 8.79447 10.4461 7.63832 11.2959 6.78588C12.1457 5.93344 13.2982 5.45455 14.5 5.45455C15.7018 5.45455 16.8543 5.93344 17.7041 6.78588C18.5539 7.63832 19.0312 8.79447 19.0312 10Z"
                              fill="#57CC99"
                            />
                            <path
                              d="M0 10C0 10 5.4375 0 14.5 0C23.5625 0 29 10 29 10C29 10 23.5625 20 14.5 20C5.4375 20 0 10 0 10ZM14.5 16.3636C16.1825 16.3636 17.796 15.6932 18.9857 14.4998C20.1754 13.3064 20.8437 11.6877 20.8437 10C20.8437 8.31226 20.1754 6.69364 18.9857 5.50023C17.796 4.30682 16.1825 3.63636 14.5 3.63636C12.8175 3.63636 11.204 4.30682 10.0143 5.50023C8.82461 6.69364 8.15625 8.31226 8.15625 10C8.15625 11.6877 8.82461 13.3064 10.0143 14.4998C11.204 15.6932 12.8175 16.3636 14.5 16.3636Z"
                              fill="#57CC99"
                            />
                          </svg>
                        </span>
                      </a>
                    </p>
                    {user?.resume_date ? (
                      <span className="resume-date">
                        Last updated:{" "}
                        {user.resume_date && (
                          <>
                            {new Date(
                              user.resume_date.replace(" ", "T"),
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                            ,{" "}
                            {new Date(
                              user.resume_date.replace(" ", "T"),
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </>
                        )}
                      </span>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <Link to="/profile/edit">
                    <p>
                      Upload Resume
                      <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="38"
                          viewBox="0 0 32 38"
                          fill="none"
                        >
                          <path
                            d="M25.0041 37.998H7.00726C6.96328 37.9772 6.92231 37.9445 6.87633 37.9385C3.09747 37.4378 -0.0307543 34.1103 0.000228181 29.8825C0.0541976 22.6336 0.0122214 15.3836 0.0212163 8.13471C0.0212163 7.58145 0.0492004 7.01628 0.15614 6.47591C0.920707 2.6348 4.12589 0.0360489 8.12562 0.00828656C10.4493 -0.00757761 12.774 0.00332901 15.0987 0.00828656C15.3935 0.00828656 15.6883 0.0400149 16.0052 0.0588536C16.0052 0.245258 16.0052 0.392001 16.0052 0.538745C16.0052 4.02688 15.9892 7.516 16.0201 11.0041C16.0261 11.6209 16.1421 12.2693 16.36 12.8464C17.0676 14.7183 18.8455 15.8546 20.9613 15.8576C24.4724 15.8635 27.9844 15.8596 31.4954 15.8596C31.6413 15.8596 31.7872 15.8596 31.9911 15.8596C31.9911 16.1104 31.9911 16.3167 31.9911 16.5239C31.9911 21.1255 32.0181 25.7281 31.9781 30.3297C31.9501 33.4975 29.8983 36.3392 26.9 37.4735C26.2893 37.7045 25.6357 37.8275 25.0021 38L25.0041 37.998ZM17.5993 24.7157C17.7552 24.8585 17.8471 24.9378 17.9321 25.0221C18.5157 25.5982 19.0894 26.1861 19.6841 26.7503C20.3407 27.374 21.3191 27.3581 21.9418 26.7374C22.5474 26.1326 22.5674 25.1609 21.9488 24.5303C21.0433 23.6082 20.1368 22.6851 19.1884 21.8066C17.4054 20.1548 14.559 20.1716 12.787 21.8374C11.8635 22.7059 10.972 23.6092 10.0805 24.5105C9.44588 25.152 9.45587 26.1306 10.0765 26.7444C10.7032 27.3631 11.6776 27.371 12.3342 26.7444C12.9279 26.1772 13.5026 25.5922 14.0862 25.0152C14.1702 24.9319 14.2611 24.8565 14.4121 24.7187C14.4121 24.9309 14.4121 25.0618 14.4121 25.1917C14.4121 27.3194 14.4081 29.4462 14.4141 31.574C14.4171 32.5407 15.0857 33.2378 15.9922 33.2447C16.9146 33.2517 17.5863 32.5497 17.5983 31.5631C17.6023 31.2419 17.5983 30.9196 17.5983 30.5984C17.5983 28.6699 17.5983 26.7414 17.5983 24.7147L17.5993 24.7157Z"
                            fill="#57CC99"
                          />
                          <path
                            d="M19.2313 0.720404C19.7989 0.999018 20.3496 1.20624 20.8313 1.51956C21.5579 1.9935 22.3025 2.47339 22.9222 3.06929C24.983 5.04934 27.0028 7.07103 29.0167 9.09867C29.9272 10.0148 30.5968 11.1005 31.0995 12.2854C31.1465 12.3964 31.1865 12.5114 31.2514 12.683C31.0815 12.683 30.9516 12.683 30.8217 12.683C27.5495 12.683 24.2774 12.683 21.0062 12.683C19.8509 12.683 19.2133 12.0623 19.2123 10.929C19.2103 7.66494 19.2123 4.40188 19.2123 1.13783C19.2123 1.02876 19.2223 0.918706 19.2313 0.720404Z"
                            fill="#074568"
                          />
                        </svg>
                      </span>
                    </p>
                  </Link>
                )}
              </div>

              <div className="edu-and-Pro-details">
                <div className="edu-details">
                  <div className="head">
                    <span>Education Details</span>
                    {user?.degreeTwo ? (
                      ""
                    ) : (
                      <>
                        <Link to="/profile/edit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path d="M3 6H9" stroke="#9E9E9E" />
                            <path d="M6 9V3" stroke="#9E9E9E" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </div>
                  {/* Education Details One */}
                  {user?.degreeOne ? (
                    <>
                      <div className="part">
                        <label>Degree</label>
                        <p>
                          {user
                            ? user.degreeOne || <span>Ex: B-Tech</span>
                            : "Loading API..."}
                        </p>
                        <label>Institute</label>
                        <p>
                          {user
                            ? user.instituteOne || <span>Ex: IIT Roorkee</span>
                            : "Loading API..."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <Link to="/profile/edit" className="edit-details-btn">
                        Add Education Details
                      </Link> */}
                    </>
                  )}

                  {/* Education Details Two */}
                  {user?.degreeTwo ? (
                    <>
                      <div className="part">
                        <label>Degree</label>
                        <p>
                          {user
                            ? user.degreeTwo || <span>Ex: B-Tech</span>
                            : "Loading API..."}
                        </p>
                        <label>Institute</label>
                        <p>
                          {user
                            ? user.instituteTwo || <span>Ex: IIT Roorkee</span>
                            : "Loading API..."}
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="pro-details">
                  <div className="head">
                    <span>Professional Details</span>
                    {user?.organizationTwo ? (
                      ""
                    ) : (
                      <>
                        <Link to="/profile/edit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path d="M3 6H9" stroke="#9E9E9E" />
                            <path d="M6 9V3" stroke="#9E9E9E" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Professional Details One */}
                  {user?.organizationOne ? (
                    <>
                      <div className="part">
                        <label>Organization</label>
                        <p>
                          {user
                            ? user.organizationOne || (
                                <span>Ex: Company Name</span>
                              )
                            : "Loading API..."}
                        </p>
                        <label>Designation</label>
                        <p>
                          {user
                            ? user.designationOne || (
                                <span>Ex: IIT Roorkee</span>
                              )
                            : "Loading API..."}
                        </p>
                        <label>Total Experience</label>
                        <p>
                          {user
                            ? user.experienceonOne || <span>Ex: 2 years</span>
                            : "Loading API..."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <Link to="/profile/edit" className="edit-details-btn">
                        Add Organization Details
                      </Link> */}
                    </>
                  )}

                  {/* Professional Details Two */}
                  {user?.organizationTwo ? (
                    <>
                      <div className="part">
                        <label>Organization</label>
                        <p>
                          {user
                            ? user.organizationTwo || (
                                <span>Ex: Company Name</span>
                              )
                            : "Loading API..."}
                        </p>
                        <label>Designation</label>
                        <p>
                          {user
                            ? user.designationTwo || (
                                <span>Ex: IIT Roorkee</span>
                              )
                            : "Loading API..."}
                        </p>
                        <label>Total Experience</label>
                        <p>
                          {user
                            ? user.experienceonTwo || <span>Ex: 2 years</span>
                            : "Loading API..."}
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
