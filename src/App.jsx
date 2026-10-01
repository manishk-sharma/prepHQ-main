// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./common/navigation/Navbar";
import Footer from "./common/footer/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Practice from "./pages/practice/Practice";
import TermsAndConditions from "./pages/terms-and-conditions/TermsAndConditions";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy";
import Search from "./pages/search/Search";
import Error404 from "./pages/error/Error404";
import AccountConfirm from "./pages/confirm/Confirm";
import Login from "./pages/login/login";
import Logout from "./pages/logout/logout";
import Profile from "./pages/profile/profile";
import Register from "./pages/register/register";
import ResetPassword from "./pages/reset/reset";
import ProfileEdit from "./pages/profileedit/Profileedit";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLogout } from "./redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Domain from "./pages/domain/Domain";
import {
  aIData,
  bWData,
  cSData,
  dAData,
  dMData,
  dSData,
  dTTData,
  eCData,
  eNIData,
  eRData,
  fGData,
  mLData,
  qCData,
  rAData,
  sampleData,
  sDData,
} from "./utils/domains/data";
import InterviewsPage from "./pages/Interview/InterviewsPage";
import TutorialsPage from "./pages/Tutorials/TutorialsPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import BlogsPage from "./pages/Blogs/BlogsPage";
import PostDetailPage from "./pages/posts/PostDetailPage";
import AddTutorial from "./pages/admin/NewAdminPage/Tutorials/AddTutorial";
import ListTutorial from "./pages/admin/NewAdminPage/Tutorials/ListTutorial";
import EditTutorial from "./pages/admin/NewAdminPage/Tutorials/EditTutorial";
import AddProject from "./pages/admin/NewAdminPage/Projects/AddProject";
import ListProject from "./pages/admin/NewAdminPage/Projects/ListProject";
import EditProject from "./pages/admin/NewAdminPage/Projects/EditProject";
import AddInterview from "./pages/admin/NewAdminPage/Interviews/AddInterview";
import ListInterview from "./pages/admin/NewAdminPage/Interviews/ListInterview";
import EditInterview from "./pages/admin/NewAdminPage/Interviews/EditInterview";
import AddBlog from "./pages/admin/NewAdminPage/Blogs/AddBlog";
import ListBlog from "./pages/admin/NewAdminPage/Blogs/ListBlog";
import EditBlog from "./pages/admin/NewAdminPage/Blogs/EditBlog";
import AdminLayout from "./pages/admin/NewAdminPage/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import UserProfileView from "./pages/user/UserProfile/UserProfileView";
import UserProfileEdit from "./pages/user/UserProfile/UserProfileEdit";
import PrepCodeProfile from "./pages/user/PrepCodeProfile/PrepCodeProfile";
import AddCodingQuestion from "./pages/admin/NewAdminPage/CodingQuestions/AddCodingQuestion";
import ListCodingQuestion from "./pages/admin/NewAdminPage/CodingQuestions/ListCodingQuestion";
import EditCodingQuestion from "./pages/admin/NewAdminPage/CodingQuestions/EditCodingQuestion";
import AdminDashboard from "./pages/admin/NewAdminPage/Dashboard/AdminDashboard";
import SubmissionsDashboard from "./pages/admin/NewAdminPage/Dashboard/SubmissionsDashboard";
import CategoryPage from "./pages/Category/CategoryPage";

/* Coding Pages */
import CodingLayout from "./pages/coding/layout/CodingLayout";

import CodingHome from "./pages/coding/home/CodingHome";


import Leaderboard from "./pages/coding/leaderboard/Leaderboard";
import Submissions from "./pages/coding/submissions/Submissions";
import CodingProfile from "./pages/coding/profile/CodingProfile";

import ProblemWorkspace from "./pages/coding/problem/ProblemWorkspace";
import Problemset from "./pages/coding/problemset/Problemset";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn") === "true",
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("adminLoggedIn", isLoggedIn);
  }, [isLoggedIn]);


  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    dispatch(adminLogout());
  };

  // Hide global layout for admin + fullscreen coding workspace
const hideLayout =
  location.pathname.startsWith("/admin") ||
  location.pathname.startsWith("/user") ||
  location.pathname.startsWith("/prepcode/problems/");

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        {/* Static Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/practice" element={<Practice />} />

            {/* Domain Pages */}
        <Route path="/data-science" element={<Domain data={dSData} />} />
        <Route path="/embedded-and-iot" element={<Domain data={eNIData} />} />
        <Route
          path="/artificial-intelligence-genai"
          element={<Domain data={aIData} />}
        />
        <Route path="/machine-learning" element={<Domain data={mLData} />} />
        <Route path="/cyber-security" element={<Domain data={cSData} />} />
        <Route path="/database-management" element={<Domain data={dMData} />} />
        <Route path="/system-design" element={<Domain data={sDData} />} />
        <Route path="/data-analytics" element={<Domain data={dAData} />} />
        <Route path="/quantum-computing" element={<Domain data={qCData} />} />
        <Route path="/blockchain-and-web3" element={<Domain data={bWData} />} />
        <Route path="/edge-computing" element={<Domain data={eCData} />} />
        <Route path="/extended-reality" element={<Domain data={eRData} />} />
        <Route path="/5g" element={<Domain data={fGData} />} />
        <Route
          path="/digital-twin-technologies"
          element={<Domain data={dTTData} />}
        />
        <Route
          path="/robotics-and-automation"
          element={<Domain data={rAData} />}
        />
            {/*Domain Pages End  */}

        {/* Static Pages Ends */}
        
        {/* Authentication Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/confirm" element={<AccountConfirm />} />
        <Route path="/reset" element={<ResetPassword />} />
      {/* Authentication Routes Ends */}
        
        {/* Blog Pages */}
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/:type/:postSlug" element={<PostDetailPage />} />
        <Route path="/:type/category/:slug" element={<CategoryPage />} />
        {/* Blog Pages Ends*/}

       {/* CODING PLATFORM  */}
        {/* <Route path="/coding" element={<CodingLayout />}>
          <Route index element={<CodingHome />} />

          <Route path="problemset" element={<Problemset />} />

          <Route path="problemset/:domainSlug" element={<Problemset />} />

          <Route path="leaderboard" element={<Leaderboard />} />

          <Route path="submissions" element={<Submissions />} />

          <Route path="profile" element={<CodingProfile />} />
        </Route> */}

        <Route path="/prepcode" element={<CodingLayout />}>
          <Route index element={<Problemset />} />
          <Route
          path="problems/:problemSlug"
          element={<ProblemWorkspace />}
         />
        </Route>
        

         
        {/* CODING PLATFORM Ends */}

        
        {/* User Profile Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <ProfileEdit />
            </PrivateRoute>
          }
        />
        {/* User Profile Routes Ends */}
       
       
       {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <AdminLayout onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        >
          {/* Dashboard */}
          <Route index element={<AddTutorial />} />
          {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
          <Route path="submissions-dashboard" element={<SubmissionsDashboard />} />

          {/* Tutorial */}
          <Route path="tutorials/add" element={<AddTutorial />} />
          <Route path="tutorials/list" element={<ListTutorial />} />
          {/* <Route path="tutorial/edit" element={<EditTutorial />} /> */}

          {/* Projects */}
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/list" element={<ListProject />} />
          {/* <Route path="projects/edit" element={<EditProject />} /> */}

          {/* Interview */}
          <Route path="interviews/add" element={<AddInterview />} />
          <Route path="interviews/list" element={<ListInterview />} />
          {/* <Route path="interview/edit" element={<EditInterview />} /> */}

          {/* Blogs */}
          <Route path="blogs/add" element={<AddBlog />} />
          <Route path="blogs/list" element={<ListBlog />} />
          {/* <Route path="blogs/edit" element={<EditBlog />} /> */}

          <Route path="tutorials/edit/:id" element={<EditTutorial />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
          <Route path="interviews/edit/:id" element={<EditInterview />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />

          {/* Coding Questions */}
          <Route path="coding-questions/add"        element={<AddCodingQuestion />}   />
          <Route path="coding-questions/list"       element={<ListCodingQuestion />}  />
          <Route path="coding-questions/edit/:slug" element={<EditCodingQuestion />}  />
        </Route>
      {/* Admin Routes */}

  

        {/* User Dashboard Routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserProfileView />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="profile/edit" element={<UserProfileEdit />} />
          <Route path="prepcode-profile" element={<PrepCodeProfile />} />
        </Route>
        {/* User Dashboard Routes End */}

        <Route path="*" element={<Error404 />} />

      </Routes>
      {!hideLayout && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;
