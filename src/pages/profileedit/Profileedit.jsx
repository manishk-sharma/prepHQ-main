import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import './profileedit.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useUserProfile,
  useUpdateProfile,
  useUploadProfileImage,
} from "../../services/userServices";
import ResumeUploader from "./ResumeUploader";

import customprofileimage from '../../assets/img/custom-image.webp'

export default function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSecondEdu, setShowSecondEdu] = useState(false);
  const [showSecondPro, setShowSecondPro] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    usertype: 'User Type',
    countrycode: '+91',
    phone: '', 
    city: '', 
    portfolio: '', 
    linkdin: '', 
    github: '', 
    codePen: '', 
    degreeOne: '', 
    instituteOne: '', 
    degreeTwo: '', 
    instituteTwo: '', 
    organizationOne: '',
    designationOne: '',
    experienceonOne: '',
    organizationTwo: '',
    designationTwo: '',
    experienceonTwo: '',
    profile_image: '',
  });
  const [loading, setLoading] = useState(false);

  // Redux token is the source of truth (login persists it here).
  const reduxToken = useSelector((state) => state.auth?.user?.token);
  const updateProfileMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();

  // Fetch user data — token is attached by the api interceptor.
  const { data: userData, isError: userError, refetch } = useUserProfile({
    enabled: !!reduxToken,
  });

  // Re-fetch when returning to this route (e.g. after a save/navigation).
  useEffect(() => {
    if (reduxToken) refetch();
  }, [location.key, reduxToken, refetch]);

  useEffect(() => {
    if (!userData) return;
    const { password, ...safeUser } = userData;
    setFormData(prev => ({
      ...prev,
      ...safeUser,
      profile_image: safeUser.profile_image_url,
    }));
    if (safeUser.instituteTwo || safeUser.degreeTwo) {
      setShowSecondEdu(true);
    }
    if (safeUser.organizationTwo || safeUser.designationTwo || safeUser.experienceonTwo) {
      setShowSecondPro(true);
    }
  }, [userData]);

  useEffect(() => {
    if (userError) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    }
  }, [userError, navigate]);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate token
  useEffect(() => {
    const token = reduxToken;
    if (!token || token.split('.').length !== 3) {
      console.warn('Invalid or missing token');
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired');
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate, reduxToken]);

  // Save Changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const { 
        name, 
        lastname, 
        username, 
        email, 
        usertype, 
        countrycode, 
        phone, 
        city, 
        portfolio, 
        linkdin, 
        github, 
        codePen, 
        degreeOne, 
        instituteOne, 
        degreeTwo, 
        instituteTwo, 
        organizationOne,
        designationOne,
        experienceonOne,
        organizationTwo,
        designationTwo,
        experienceonTwo,
      } = formData;

      if (!name || !lastname || !username || !email) {
        toast.error('All fields are required.');
        setLoading(false);
        return;
      }

      const dataToSend = { 
        name, 
        lastname, 
        username, 
        email, 
        usertype, 
        countrycode: countrycode || "+91",
        phone, 
        city, 
        portfolio, 
        linkdin, 
        github, 
        codePen, 
        degreeOne, 
        instituteOne, 
        degreeTwo, 
        instituteTwo, 
        organizationOne,
        designationOne,
        experienceonOne,
        organizationTwo,
        designationTwo,
        experienceonTwo,
       };

      const result = await updateProfileMutation.mutateAsync(dataToSend);

      if (result.status) {
        toast.success("Profile updated successfully!");
        if (result.user) {
          const { password, ...safeUser } = result.user;
          setFormData(prev => ({
            ...prev,
            ...safeUser,
            profile_image: safeUser.profile_image_url,
          }));
          if (safeUser.instituteTwo || safeUser.degreeTwo) {
            setShowSecondEdu(true);
          }
          if (safeUser.organizationTwo || safeUser.designationTwo || safeUser.experienceonTwo) {
            setShowSecondPro(true);
          }
        }
        setTimeout(() => {
          navigate("/profile", { replace: true });
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Edit error:', err);
      toast.error(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  //profile progress
  const requiredFields = [
    'name', 
    'lastname', 
    'email', 
    'username',     
    'usertype', 
    'phone', 
    'city',   
    'linkdin', 
    'degreeOne', 
    'instituteOne', 
    'profile_image'
  ];

  const calculateProfileCompletion = (formData) => {
    if (!formData) return 0;

    let filledCount = 0;
    requiredFields.forEach((field) => {
      if (formData[field] && formData[field].toString().trim() !== '') {
        filledCount++;
      }
    });

    return Math.round((filledCount / requiredFields.length) * 100);
  };
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formData) {
      setProgress(calculateProfileCompletion(formData));
    }
  }, [formData]);

  //profile image upoad
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      uploadProfileImage(e.target.files[0]);
    }
  };

  const uploadProfileImage = async (file) => {
  setUploading(true);

  try {
    const data = await uploadImageMutation.mutateAsync(file);

    const imageUrl = data.image.startsWith('http')
      ? data.image
      : `https://prephq.theiotacademy.co/${data.image}`;

    setFormData(prev => ({
      ...prev,
      profile_image: imageUrl
    }));
    toast.success('Profile image updated successfully!');
  } catch (err) {
    toast.error(err?.message || 'Error uploading image');
    console.error(err);
  } finally {
    setUploading(false);
  }
};


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className="edit-profile-sec">
        <div className="container">
          <div className="parts">
            <div className="left-side">
              <div className="profile">
                <div className="circular-progress" 
                  style={{
                    background: `conic-gradient(#57CC99 0% ${progress}%, rgba(224, 224, 224, 0.3) ${progress}% 100%)`,
                  }}>
                  <img
                      src={formData.profile_image || customprofileimage}
                      alt="profile image"
                      className="profile-image"
                  />
                  <label htmlFor="profile-image-upload" style={{ cursor: 'pointer' }}>
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M12.4776 9.37972C12.3678 9.4764 12.2585 9.57355 12.1497 9.6712C12.9757 10.3474 13.7323 11.1039 14.4086 11.9298C14.5062 11.821 14.6034 11.7117 14.7001 11.602C15.0083 11.2449 15.1155 10.5316 14.8466 10.1273C14.6073 9.77527 14.3036 9.47163 13.9515 9.23238C13.5469 8.96433 12.835 9.07243 12.4776 9.37972Z" fill="#57CA97"/>
                      <path d="M9.47048 14.9986C10.0485 14.9576 10.6799 14.8973 11.3098 14.8542C11.4238 14.8495 11.5331 14.8071 11.6206 14.7338C12.4339 13.9962 13.2088 13.2313 13.9545 12.4287C13.2398 11.6104 12.4706 10.8413 11.6523 10.1267C10.8495 10.8723 10.0846 11.6471 9.34684 12.4603C9.27359 12.5478 9.23126 12.6571 9.22643 12.7711C9.18336 13.4009 9.12272 14.0308 9.08199 14.6102C9.06353 14.8466 9.23405 15.0171 9.47048 14.9986Z" fill="#57CA97"/>
                      <path d="M9.04098 6.68144C9.82703 6.68144 10.4642 6.04429 10.4642 5.25833C10.4642 4.47237 9.82703 3.83522 9.04098 3.83522C8.25492 3.83522 7.6177 4.47237 7.6177 5.25833C7.6177 6.04429 8.25492 6.68144 9.04098 6.68144Z" fill="#57CA97"/>
                      <path d="M0.263703 10.2723C0.534119 11.8035 1.89294 13.1619 3.42432 13.4326H3.42989C4.48665 13.6083 5.60464 13.6944 6.84949 13.6962C7.36454 13.6962 7.85821 13.6804 8.33488 13.6502C8.36037 13.3423 8.38644 13.0257 8.40783 12.7128C8.42516 12.4151 8.54171 12.1318 8.73889 11.9081C9.48949 11.0805 10.2817 10.2785 11.0935 9.52442L11.0988 9.51973L11.5969 9.06538L11.5992 9.06304L11.6018 9.06069C11.666 9.00211 11.7272 8.9482 11.7873 8.89518C11.6246 8.66356 11.4612 8.43126 11.2972 8.19827C10.7305 7.39972 9.66059 7.37511 9.15082 8.17103C9.09222 8.26243 9.03362 8.35383 8.97503 8.44522C8.63401 8.96988 7.90919 8.96842 7.55557 8.4379C6.90545 7.46387 6.26384 6.48896 5.66148 5.52108C5.16342 4.7196 4.15178 4.74127 3.5919 5.55272C2.80731 6.69519 1.9987 7.8318 1.21382 8.95084C1.14702 8.2885 1.11333 7.59306 1.11333 6.84899C1.1148 5.66814 1.19566 4.61033 1.3609 3.6155C1.45318 3.09934 1.73649 2.5823 2.15955 2.15929C2.5826 1.73628 3.0997 1.45271 3.61622 1.36073C4.61234 1.19551 5.6688 1.11437 6.84891 1.11319C8.02901 1.11202 9.08753 1.19551 10.0828 1.36073C10.599 1.45271 11.1161 1.73599 11.5391 2.159C11.9622 2.582 12.2458 3.09904 12.3375 3.61521C12.5027 4.61121 12.5839 5.66814 12.5851 6.84752C12.5851 7.39444 12.5666 7.91471 12.5312 8.41447C12.7999 8.31228 13.085 8.25968 13.3726 8.25921C13.4673 8.25912 13.562 8.26519 13.6559 8.27737C13.6837 7.81804 13.6978 7.34289 13.6984 6.84752C13.6969 5.60428 13.6105 4.48612 13.4347 3.42978V3.42421C13.1637 1.893 11.8052 0.534343 10.2738 0.263665H10.2682C9.21117 0.0879001 8.09317 0.00148243 6.84862 1.77205e-05C5.60406 -0.00144699 4.48665 0.0879001 3.43047 0.263665H3.42491C1.89352 0.534636 0.534705 1.8933 0.263703 3.4245V3.43007C0.087918 4.48466 0.00178321 5.60428 2.53583e-05 6.84899C-0.00173249 8.09369 0.087918 9.21127 0.263703 10.267V10.2723Z" fill="#57CA97"/>
                    </svg>
                  </label>
                </div>
              </div>

              {formData ? (
                <>
                  <p className="full-name">
                    <span>{formData.name}</span>
                    <span>{formData.lastname}</span>
                  </p>
                  <p className="user-name">User Name : {formData.username}</p>
                </>
              ) : (
                <p>Loading user from API...</p>
              )}

              <p className="user-name">Profile {progress}% Completed</p>

              <select
                className="user-type"
                name="usertype"
                value={formData.usertype ?? ""}
                onChange={handleChange}
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
              </select>

              <div className="reset-btn">
                <Link to="/reset">Reset your Password</Link>
              </div>

              <div className="save-profile-btn">
                <button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
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
                    <path
                      d="M10.0002 8.5H2.41357"
                      stroke="#F13E3E"
                    />
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
              <div className="profile-details">
                <div className="head">
                  <span>Personal Details</span>
                </div>
                <div className='part'>
                  <div>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="name"
                      disabled={loading}
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>User Name</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Phone No.</label>
                    <div className="phone">
                      <select
                        name="countrycode"
                        value={formData.countrycode || "+91"}
                        onChange={handleChange}
                      >
                        <option value="+91">+91</option>
                        <option value="+92">+92</option>
                      </select>
                      <input
                        type="text"
                        name="phone"
                        pattern="[0-9]*"
                        maxLength={15}
                        value={formData.phone || ""}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          if (onlyNums.length <= 15) {
                            handleChange({ target: { name: 'phone', value: onlyNums } });
                          }
                        }}
                        placeholder="Phone No."
                      />
                    </div>
                  </div>
                  <div>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder='City'
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <div className="head">
                  <span>Quick Links</span>
                </div>

                <div className='part'>
                  <div>
                    <label>Portfolio URL</label>
                    <input
                      type="url"
                      name="portfolio"
                      placeholder='Portfolio URL'
                      value={formData.portfolio || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Linkdin URL</label>
                    <input
                      type="url"
                      name="linkdin"
                      placeholder='Linkdin URL'
                      value={formData.linkdin || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>GitHub URL</label>
                    <input
                      type="url"
                      name="github"
                      placeholder='GitHub URL'
                      value={formData.github || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>CodePen URL</label>
                    <input
                      type="url"
                      name="codePen"
                      placeholder='CodePen URL'
                      value={formData.codePen || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <ResumeUploader formData={formData} setFormData={setFormData} />
              
              <div className="edu-and-Pro-details">
                <div className="edu-details">
                  <div className="head">
                    <span>Education Details</span>
                    {/* Show button only if second part is NOT shown */}
                    {!showSecondEdu && !formData.instituteTwo &&(
                      <button
                        type="button"
                        onClick={() => setShowSecondEdu(true)}
                        aria-label="Add second education"
                      >
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
                      </button>
                    )}
                  </div>

                  {/* First part: always visible */}
                  <div className="part">
                    <label>Degree
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            degreeOne: '',
                            instituteOne: ''
                          }));
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none">
                          <path d="M4.96437 0.58305C4.9644 0.428562 5.02649 0.280407 5.13698 0.171141C5.24747 0.0618747 5.39734 0.000436847 5.55364 0.000328132L11.446 0C11.6023 0.000358237 11.7521 0.0619662 11.8626 0.17132C11.9731 0.280674 12.0351 0.428853 12.0353 0.583378V2.02376H4.96437V0.58305ZM14.6525 20.1661C14.6375 20.3932 14.5352 20.6061 14.3666 20.7611C14.198 20.9161 13.9758 21.0016 13.7456 21H3.18634C2.95614 20.9994 2.73469 20.9127 2.56647 20.7574C2.39825 20.602 2.29571 20.3896 2.27945 20.1626L1.37587 7.09808H15.6169L14.6527 20.1659L14.6525 20.1661ZM17 5.91483H0V4.56129C0.000252722 4.2023 0.144626 3.85808 0.40142 3.60421C0.658215 3.35034 1.00644 3.20757 1.36964 3.20725L15.6302 3.2068C15.9934 3.20735 16.3415 3.35025 16.5982 3.60414C16.8549 3.85804 16.9993 4.20221 16.9996 4.56116V5.91471L17 5.91483ZM5.76275 17.8856C5.76275 17.9632 5.77823 18.0402 5.8083 18.1119C5.83838 18.1837 5.88247 18.2489 5.93804 18.3038C5.99361 18.3588 6.05959 18.4023 6.1322 18.4321C6.20481 18.4618 6.28264 18.4771 6.36123 18.4771C6.43983 18.4771 6.51765 18.4618 6.59026 18.4321C6.66287 18.4023 6.72885 18.3588 6.78442 18.3038C6.84 18.2489 6.88408 18.1837 6.91416 18.1119C6.94424 18.0402 6.95972 17.9632 6.95972 17.8856V9.59008C6.95846 9.43407 6.89489 9.28487 6.78285 9.17498C6.67081 9.06508 6.51939 9.00339 6.36154 9.00334C6.2037 9.00328 6.05223 9.06487 5.94011 9.17469C5.828 9.28451 5.76432 9.43366 5.76296 9.58967V17.8856H5.76275ZM10.0329 17.8856C10.0329 18.0425 10.096 18.1929 10.2082 18.3039C10.3205 18.4148 10.4727 18.4772 10.6315 18.4772C10.7902 18.4772 10.9425 18.4148 11.0547 18.3039C11.167 18.1929 11.23 18.0425 11.23 17.8856V9.59008C11.2288 9.43405 11.1652 9.28483 11.0531 9.17492C10.9411 9.06501 10.7896 9.00331 10.6318 9.00325C10.4739 9.0032 10.3224 9.0648 10.2103 9.17463C10.0982 9.28447 10.0345 9.43364 10.0331 9.58967L10.0329 17.8856Z" fill="#FC0005"/>
                        </svg>
                      </button>
                    </label>
                    <input
                      type="text"
                      name="degreeOne"
                      placeholder="Ex: B-Tech"
                      value={formData.degreeOne || ''}
                      onChange={handleChange}
                    />
                    <label>Institute</label>
                    <input
                      type="text"
                      name="instituteOne"
                      placeholder="Ex: IIT Roorkee"
                      value={formData.instituteOne || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Second part: only visible if showSecondEdu is true */}
                  {(showSecondEdu || formData.instituteTwo) && (
                    <div className="part">
                      <label>
                        Degree 
                        <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            degreeTwo: '',
                            instituteTwo: ''
                          }));
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none">
                          <path d="M4.96437 0.58305C4.9644 0.428562 5.02649 0.280407 5.13698 0.171141C5.24747 0.0618747 5.39734 0.000436847 5.55364 0.000328132L11.446 0C11.6023 0.000358237 11.7521 0.0619662 11.8626 0.17132C11.9731 0.280674 12.0351 0.428853 12.0353 0.583378V2.02376H4.96437V0.58305ZM14.6525 20.1661C14.6375 20.3932 14.5352 20.6061 14.3666 20.7611C14.198 20.9161 13.9758 21.0016 13.7456 21H3.18634C2.95614 20.9994 2.73469 20.9127 2.56647 20.7574C2.39825 20.602 2.29571 20.3896 2.27945 20.1626L1.37587 7.09808H15.6169L14.6527 20.1659L14.6525 20.1661ZM17 5.91483H0V4.56129C0.000252722 4.2023 0.144626 3.85808 0.40142 3.60421C0.658215 3.35034 1.00644 3.20757 1.36964 3.20725L15.6302 3.2068C15.9934 3.20735 16.3415 3.35025 16.5982 3.60414C16.8549 3.85804 16.9993 4.20221 16.9996 4.56116V5.91471L17 5.91483ZM5.76275 17.8856C5.76275 17.9632 5.77823 18.0402 5.8083 18.1119C5.83838 18.1837 5.88247 18.2489 5.93804 18.3038C5.99361 18.3588 6.05959 18.4023 6.1322 18.4321C6.20481 18.4618 6.28264 18.4771 6.36123 18.4771C6.43983 18.4771 6.51765 18.4618 6.59026 18.4321C6.66287 18.4023 6.72885 18.3588 6.78442 18.3038C6.84 18.2489 6.88408 18.1837 6.91416 18.1119C6.94424 18.0402 6.95972 17.9632 6.95972 17.8856V9.59008C6.95846 9.43407 6.89489 9.28487 6.78285 9.17498C6.67081 9.06508 6.51939 9.00339 6.36154 9.00334C6.2037 9.00328 6.05223 9.06487 5.94011 9.17469C5.828 9.28451 5.76432 9.43366 5.76296 9.58967V17.8856H5.76275ZM10.0329 17.8856C10.0329 18.0425 10.096 18.1929 10.2082 18.3039C10.3205 18.4148 10.4727 18.4772 10.6315 18.4772C10.7902 18.4772 10.9425 18.4148 11.0547 18.3039C11.167 18.1929 11.23 18.0425 11.23 17.8856V9.59008C11.2288 9.43405 11.1652 9.28483 11.0531 9.17492C10.9411 9.06501 10.7896 9.00331 10.6318 9.00325C10.4739 9.0032 10.3224 9.0648 10.2103 9.17463C10.0982 9.28447 10.0345 9.43364 10.0331 9.58967L10.0329 17.8856Z" fill="#FC0005"/>
                        </svg>
                      </button>
                      </label>
                      <input
                        type="text"
                        name="degreeTwo"
                        placeholder="Ex: B-Tech"
                        value={formData.degreeTwo || ''}
                        onChange={handleChange}
                      />
                      <label>Institute</label>
                      <input
                        type="text"
                        name="instituteTwo"
                        placeholder="Ex: IIT Roorkee"
                        value={formData.instituteTwo || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
                <div className="pro-details">
                  <div className="head">
                    <span>Professional Details</span>
                    {!showSecondPro && !formData.organizationTwo &&(
                      <button
                        type="button"
                        onClick={() => setShowSecondPro(true)}
                        aria-label="Add second professional detail"
                      >
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
                      </button>
                    )}
                  </div>

                  {/* First professional detail part: always visible */}
                  <div className="part">
                    <label>Organization
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            organizationOne: '',
                            designationOne: '',
                            experienceonOne: ''
                          }));
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none">
                          <path d="M4.96437 0.58305C4.9644 0.428562 5.02649 0.280407 5.13698 0.171141C5.24747 0.0618747 5.39734 0.000436847 5.55364 0.000328132L11.446 0C11.6023 0.000358237 11.7521 0.0619662 11.8626 0.17132C11.9731 0.280674 12.0351 0.428853 12.0353 0.583378V2.02376H4.96437V0.58305ZM14.6525 20.1661C14.6375 20.3932 14.5352 20.6061 14.3666 20.7611C14.198 20.9161 13.9758 21.0016 13.7456 21H3.18634C2.95614 20.9994 2.73469 20.9127 2.56647 20.7574C2.39825 20.602 2.29571 20.3896 2.27945 20.1626L1.37587 7.09808H15.6169L14.6527 20.1659L14.6525 20.1661ZM17 5.91483H0V4.56129C0.000252722 4.2023 0.144626 3.85808 0.40142 3.60421C0.658215 3.35034 1.00644 3.20757 1.36964 3.20725L15.6302 3.2068C15.9934 3.20735 16.3415 3.35025 16.5982 3.60414C16.8549 3.85804 16.9993 4.20221 16.9996 4.56116V5.91471L17 5.91483ZM5.76275 17.8856C5.76275 17.9632 5.77823 18.0402 5.8083 18.1119C5.83838 18.1837 5.88247 18.2489 5.93804 18.3038C5.99361 18.3588 6.05959 18.4023 6.1322 18.4321C6.20481 18.4618 6.28264 18.4771 6.36123 18.4771C6.43983 18.4771 6.51765 18.4618 6.59026 18.4321C6.66287 18.4023 6.72885 18.3588 6.78442 18.3038C6.84 18.2489 6.88408 18.1837 6.91416 18.1119C6.94424 18.0402 6.95972 17.9632 6.95972 17.8856V9.59008C6.95846 9.43407 6.89489 9.28487 6.78285 9.17498C6.67081 9.06508 6.51939 9.00339 6.36154 9.00334C6.2037 9.00328 6.05223 9.06487 5.94011 9.17469C5.828 9.28451 5.76432 9.43366 5.76296 9.58967V17.8856H5.76275ZM10.0329 17.8856C10.0329 18.0425 10.096 18.1929 10.2082 18.3039C10.3205 18.4148 10.4727 18.4772 10.6315 18.4772C10.7902 18.4772 10.9425 18.4148 11.0547 18.3039C11.167 18.1929 11.23 18.0425 11.23 17.8856V9.59008C11.2288 9.43405 11.1652 9.28483 11.0531 9.17492C10.9411 9.06501 10.7896 9.00331 10.6318 9.00325C10.4739 9.0032 10.3224 9.0648 10.2103 9.17463C10.0982 9.28447 10.0345 9.43364 10.0331 9.58967L10.0329 17.8856Z" fill="#FC0005"/>
                        </svg>
                      </button>
                    </label>
                    <input
                      type="text"
                      name="organizationOne"
                      placeholder="Ex: Company Name"
                      value={formData.organizationOne || ''}
                      onChange={handleChange}
                    />
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designationOne"
                      placeholder="Ex: Senior Developer"
                      value={formData.designationOne || ''}
                      onChange={handleChange}
                    />
                    <label>Total Experience</label>
                    <input
                      type="text"
                      name="experienceonOne"
                      placeholder="Ex: 2 years"
                      value={formData.experienceonOne || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Second professional detail part: conditionally rendered */}
                  {(showSecondPro || formData.organizationTwo) && (
                    <div className="part">
                      <label>Organization
                        <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            organizationTwo: '',
                            designationTwo: '',
                            experienceonTwo: ''
                          }));
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none">
                          <path d="M4.96437 0.58305C4.9644 0.428562 5.02649 0.280407 5.13698 0.171141C5.24747 0.0618747 5.39734 0.000436847 5.55364 0.000328132L11.446 0C11.6023 0.000358237 11.7521 0.0619662 11.8626 0.17132C11.9731 0.280674 12.0351 0.428853 12.0353 0.583378V2.02376H4.96437V0.58305ZM14.6525 20.1661C14.6375 20.3932 14.5352 20.6061 14.3666 20.7611C14.198 20.9161 13.9758 21.0016 13.7456 21H3.18634C2.95614 20.9994 2.73469 20.9127 2.56647 20.7574C2.39825 20.602 2.29571 20.3896 2.27945 20.1626L1.37587 7.09808H15.6169L14.6527 20.1659L14.6525 20.1661ZM17 5.91483H0V4.56129C0.000252722 4.2023 0.144626 3.85808 0.40142 3.60421C0.658215 3.35034 1.00644 3.20757 1.36964 3.20725L15.6302 3.2068C15.9934 3.20735 16.3415 3.35025 16.5982 3.60414C16.8549 3.85804 16.9993 4.20221 16.9996 4.56116V5.91471L17 5.91483ZM5.76275 17.8856C5.76275 17.9632 5.77823 18.0402 5.8083 18.1119C5.83838 18.1837 5.88247 18.2489 5.93804 18.3038C5.99361 18.3588 6.05959 18.4023 6.1322 18.4321C6.20481 18.4618 6.28264 18.4771 6.36123 18.4771C6.43983 18.4771 6.51765 18.4618 6.59026 18.4321C6.66287 18.4023 6.72885 18.3588 6.78442 18.3038C6.84 18.2489 6.88408 18.1837 6.91416 18.1119C6.94424 18.0402 6.95972 17.9632 6.95972 17.8856V9.59008C6.95846 9.43407 6.89489 9.28487 6.78285 9.17498C6.67081 9.06508 6.51939 9.00339 6.36154 9.00334C6.2037 9.00328 6.05223 9.06487 5.94011 9.17469C5.828 9.28451 5.76432 9.43366 5.76296 9.58967V17.8856H5.76275ZM10.0329 17.8856C10.0329 18.0425 10.096 18.1929 10.2082 18.3039C10.3205 18.4148 10.4727 18.4772 10.6315 18.4772C10.7902 18.4772 10.9425 18.4148 11.0547 18.3039C11.167 18.1929 11.23 18.0425 11.23 17.8856V9.59008C11.2288 9.43405 11.1652 9.28483 11.0531 9.17492C10.9411 9.06501 10.7896 9.00331 10.6318 9.00325C10.4739 9.0032 10.3224 9.0648 10.2103 9.17463C10.0982 9.28447 10.0345 9.43364 10.0331 9.58967L10.0329 17.8856Z" fill="#FC0005"/>
                        </svg>
                      </button>
                      </label>
                      <input
                        type="text"
                        name="organizationTwo"
                        placeholder="Ex: Company Name"
                        value={formData.organizationTwo || ''}
                        onChange={handleChange}
                      />
                      <label>Designation</label>
                      <input
                        type="text"
                        name="designationTwo"
                        placeholder="Ex: Project Manager"
                        value={formData.designationTwo || ''}
                        onChange={handleChange}
                      />
                      <label>Total Experience</label>
                      <input
                        type="text"
                        name="experienceonTwo"
                        placeholder="Ex: 3 years"
                        value={formData.experienceonTwo || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          <div className='btn-group-bottom'>
            <button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button onClick={() => navigate('/profile')} disabled={loading}>Cancel</button>

            <Link to="/" onClick={scrollToTop}>Go To Home</Link>
          </div>

        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
