import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiEye,
  FiUser,
  FiStar,
  FiGrid,
  FiUsers,
  FiFileText,
  FiCpu,
  FiHeart,
} from "react-icons/fi";
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";

import { useProjectList, useProjectByCategory } from "../../services/projectsServices";
import favicon from "../../assets/img/favicon.svg";
import authorAvatarImg from "../../assets/img/projects/Ellipse 57.svg";
import robotDashboardImg from "../../assets/img/projects/robot-dashboard.png";
import adIitrImg from "../../assets/img/projects/ad-iitr.png";
import adQuantumImg from "../../assets/img/projects/ad-quantum.png";
import "./ProjectsPage.css";

// Fallback high-fidelity sample projects matching the reference UI exactly
const SAMPLE_FEATURED_PROJECTS = [
  {
    id: "feat-1",
    title: "Customer Segmentation using K-Means",
    slug: "customer-segmentation-using-k-means",
    description:
      "Segment customers based on their purchasing <br /> behavior using K-means clustering algorithm.",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    views: "208K",
    likes: "1.3K",
    image: robotDashboardImg,
  },
  {
    id: "feat-2",
    title: "Customer Segmentation using K-Means",
    slug: "customer-segmentation-using-k-means-advanced",
    description:
      "Segment customers based on their purchasing <br /> behavior using K-means clustering algorithm.",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    views: "208K",
    likes: "1.3K",
    image: robotDashboardImg,
  },
  {
    id: "feat-3",
    title: "Real-Time Object Detection with YOLOv8",
    slug: "real-time-object-detection-yolov8",
    description:
      "Deploy custom computer vision models to identify and track objects with high FPS in edge devices.",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "12 Aug, 2025",
    views: "194K",
    likes: "2.1K",
    image: robotDashboardImg,
  },
  {
    id: "feat-4",
    title: "Predictive Maintenance Pipeline with IoT Sensors",
    slug: "predictive-maintenance-iot-sensors",
    description:
      "Analyze vibration, temperature and acoustic sensor streams to predict industrial motor failures.",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "18 Aug, 2025",
    views: "162K",
    likes: "1.8K",
    image: robotDashboardImg,
  },
  {
    id: "feat-5",
    title: "End-to-End LLM Agent with RAG Pipeline",
    slug: "end-to-end-llm-agent-rag",
    description:
      "Build context-aware conversational bots using LangChain, Vector DB and OpenAI embeddings.",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "22 Aug, 2025",
    views: "245K",
    likes: "3.2K",
    image: robotDashboardImg,
  },
  {
    id: "feat-6",
    title: "Full-Stack Microservices Architecture with Docker",
    slug: "full-stack-microservices-docker",
    description:
      "Containerize and scale distributed web services using React, Node.js and Redis caching.",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Intermediate",
    author: "prepHQ",
    date: "28 Aug, 2025",
    views: "178K",
    likes: "1.5K",
    image: robotDashboardImg,
  },
];

const SAMPLE_ALL_PROJECTS = [
  {
    id: "proj-1",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-2",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-2",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-3",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-3",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-4",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-4",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-5",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-5",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-6",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-6",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    image: robotDashboardImg,
  },
  {
    id: "proj-7",
    title: "Credit Card Fraud Detection with XGBoost",
    slug: "credit-card-fraud-detection-xgboost",
    category: "Machine Learning",
    categorySlug: "machine-learning",
    level: "Advanced",
    author: "prepHQ",
    date: "14 Aug, 2025",
    likes: "145K",
    image: robotDashboardImg,
  },
  {
    id: "proj-8",
    title: "AI Medical Image Segmentation with U-Net",
    slug: "ai-medical-image-segmentation-unet",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "19 Aug, 2025",
    likes: "190K",
    image: robotDashboardImg,
  },
  {
    id: "proj-9",
    title: "Sales Forecasting Dashboard with PowerBI",
    slug: "sales-forecasting-dashboard-powerbi",
    category: "Data Analytics",
    categorySlug: "data-analytics",
    level: "Beginner",
    author: "prepHQ",
    date: "25 Aug, 2025",
    likes: "88K",
    image: robotDashboardImg,
  },
  {
    id: "proj-10",
    title: "Autonomous Robot Obstacle Avoidance ROS2",
    slug: "autonomous-robot-obstacle-avoidance-ros2",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "30 Aug, 2025",
    likes: "110K",
    image: robotDashboardImg,
  },
  {
    id: "proj-11",
    title: "E-Commerce Recommendation Engine",
    slug: "ecommerce-recommendation-engine",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Intermediate",
    author: "prepHQ",
    date: "02 Sep, 2025",
    likes: "135K",
    image: robotDashboardImg,
  },
  {
    id: "proj-12",
    title: "Next.js 14 AI Portfolio & CMS Web Platform",
    slug: "nextjs-ai-portfolio-cms",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Beginner",
    author: "prepHQ",
    date: "08 Sep, 2025",
    likes: "95K",
    image: robotDashboardImg,
  },
];

const CATEGORIES = [
  { name: "All Projects", slug: "all" },
  { name: "AI/GenAI", slug: "ai-genai" },
  { name: "Data Science", slug: "data-science" },
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Data Analytics", slug: "data-analytics" },
  { name: "Embedded Systems", slug: "embedded-systems" },
  { name: "Web Development", slug: "web-development" },
];

const LEVEL_FILTERS = [
  { label: "All Level", count: "500+", value: "all" },
  { label: "Beginner", count: "150+", value: "Beginner" },
  { label: "Intermediate", count: "250+", value: "Intermediate" },
  { label: "Advanced", count: "100+", value: "Advanced" },
];

const PaginationPrevArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
    <rect x="0.5" y="0.5" width="46" height="46" rx="9.5" fill="#FFFFFF" stroke="#3FAE68" />
    <g transform="rotate(180 23.5 24.5)">
      <path
        d="M31 24.501C31 23.7613 30.7287 23.0217 30.1874 22.4563L26.2596 18.3799C25.7708 17.8729 24.9795 17.8729 24.4907 18.3825C24.0032 18.8907 24.0044 19.7123 24.492 20.2205L27.3634 23.1998L17.2501 23.1998C16.56 23.1998 16 23.7821 16 24.4997C16 25.2172 16.56 25.7995 17.2501 25.7995L27.3634 25.7995L24.492 28.7788C24.0032 29.2858 24.0019 30.1086 24.4907 30.6182C24.9782 31.1264 25.7696 31.1277 26.2596 30.6195L30.1887 26.5418C30.73 25.9789 31 25.2406 31 24.4997L31 24.501Z"
        fill="#3FAE68"
      />
    </g>
  </svg>
);

const PaginationNextArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
    <rect x="0.5" y="0.5" width="46" height="46" rx="9.5" fill="#3FAE68" stroke="#3FAE68" />
    <path
      d="M31 24.501C31 23.7613 30.7287 23.0217 30.1874 22.4563L26.2596 18.3799C25.7708 17.8729 24.9795 17.8729 24.4907 18.3825C24.0032 18.8907 24.0044 19.7123 24.492 20.2205L27.3634 23.1998L17.2501 23.1998C16.56 23.1998 16 23.7821 16 24.4997C16 25.2172 16.56 25.7995 17.2501 25.7995L27.3634 25.7995L24.492 28.7788C24.0032 29.2858 24.0019 30.1086 24.4907 30.6182C24.9782 31.1264 25.7696 31.1277 26.2596 30.6195L30.1887 26.5418C30.73 25.9789 31 25.2406 31 24.4997L31 24.501Z"
      fill="white"
    />
  </svg>
);

const ProjectsPage = () => {
  // State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Pagination states
  const [featuredPage, setFeaturedPage] = useState(1);
  const featuredPageSize = 2; // 2 featured cards per page as shown in screenshot

  const [allProjectsPage, setAllProjectsPage] = useState(1);
  const allProjectsPageSize = 6; // 6 cards (3x2 grid) as shown in screenshot

  // API hooks
  const { data: apiProjects, isLoading } = useProjectList();

  // Normalize API data or use fallback sample data
  const normalizedApiList = useMemo(() => {
    if (apiProjects && Array.isArray(apiProjects) && apiProjects.length > 0) {
      return apiProjects.map((item) => ({
        id: item.ID || item.id,
        title: item.post_title || item.title || "Project Title",
        slug: item.post_name || item.slug || String(item.ID),
        description: item.excerpt || item.post_content || "Hands-on engineering project.",
        category: item.category_name || "Data Science",
        categorySlug: item.category_slug || "data-science",
        level: item.level || "Intermediate",
        author: item.author_name || "prepHQ",
        authorImage: item.author_image || authorAvatarImg,
        date: item.post_date ? new Date(item.post_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "05 Aug, 2025",
        views: item.views ? `${item.views}K` : "208K",
        likes: item.likes ? `${item.likes}K` : "1.3K",
        image: item.featured_image || robotDashboardImg,
      }));
    }
    return null;
  }, [apiProjects]);

  // Featured source list
  const featuredSourceList = useMemo(() => {
    return normalizedApiList && normalizedApiList.length > 0
      ? normalizedApiList
      : SAMPLE_FEATURED_PROJECTS;
  }, [normalizedApiList]);

  // All projects source list
  const allProjectsSourceList = useMemo(() => {
    return normalizedApiList && normalizedApiList.length > 0
      ? normalizedApiList
      : SAMPLE_ALL_PROJECTS;
  }, [normalizedApiList]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim().toLowerCase());
    setFeaturedPage(1);
    setAllProjectsPage(1);
  };

  // Filter Helper
  const applyFilter = (list) => {
    return list.filter((item) => {
      // Category filter
      if (selectedCategory !== "all") {
        const itemCat = (item.category || "").toLowerCase();
        const itemSlug = (item.categorySlug || "").toLowerCase();
        const targetSlug = selectedCategory.toLowerCase();
        if (
          !itemCat.includes(targetSlug.replace("-", " ")) &&
          !itemSlug.includes(targetSlug) &&
          !itemCat.includes(targetSlug)
        ) {
          return false;
        }
      }

      // Level filter
      if (selectedLevel !== "all") {
        if ((item.level || "").toLowerCase() !== selectedLevel.toLowerCase()) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery) {
        const title = (item.title || "").toLowerCase();
        const desc = typeof item.description === "string" ? item.description.toLowerCase() : "";
        const cat = (item.category || "").toLowerCase();
        if (
          !title.includes(searchQuery) &&
          !desc.includes(searchQuery) &&
          !cat.includes(searchQuery)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  // Filtered lists
  const filteredFeatured = useMemo(() => applyFilter(featuredSourceList), [
    featuredSourceList,
    selectedCategory,
    selectedLevel,
    searchQuery,
  ]);

  const filteredAll = useMemo(() => applyFilter(allProjectsSourceList), [
    allProjectsSourceList,
    selectedCategory,
    selectedLevel,
    searchQuery,
  ]);

  // Pagination for Featured Projects
  const totalFeaturedPages = Math.max(1, Math.ceil(filteredFeatured.length / featuredPageSize));
  const paginatedFeatured = useMemo(() => {
    const start = (featuredPage - 1) * featuredPageSize;
    return filteredFeatured.slice(start, start + featuredPageSize);
  }, [filteredFeatured, featuredPage]);

  // Pagination for All Projects
  const totalAllPages = Math.max(1, Math.ceil(filteredAll.length / allProjectsPageSize));
  const paginatedAll = useMemo(() => {
    const start = (allProjectsPage - 1) * allProjectsPageSize;
    return filteredAll.slice(start, start + allProjectsPageSize);
  }, [filteredAll, allProjectsPage, allProjectsPageSize]);

  return (
    <div className="projects-page-wrapper">
      {/* =========================================================
          2. HERO SECTION
          ========================================================= */}
      <section className="projects-hero">
        <div className="container">
          <div className="row align-items-center justify-content-between g-4">
            {/* Left Content */}
            <div className="col-lg-6 col-md-12">
              <div className="hero-left-content">
                <span className="hero-small-label">ALL IN ONE PLACE</span>
                <h1 className="hero-main-heading">
                  Explore <span className="highlight-green">Projects.</span>
                  <br />
                  Build Real Skills.
                </h1>
                <p className="hero-description">
                  Curated hands-on projects across domains to help you learn,
                  build and showcase your skills.
                </p>
              </div>
            </div>

            {/* Right Statistics */}
            <div className="col-lg-6 col-md-12">
              <div className="hero-stats-wrapper">
                {/* 500+ Projects */}
                <div className="hero-stat-item">
                  <div className="stat-svg-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M16.25 8.75C16.94 8.75 17.5 9.30875 17.5 10C17.5 10.6912 16.94 11.25 16.25 11.25H6.25C5.56 11.25 5 10.6912 5 10C5 9.30875 5.56 8.75 6.25 8.75H16.25ZM29.54 25.93C29.3088 26.3312 28.8888 26.5563 28.455 26.5563C28.2437 26.5563 28.0288 26.5025 27.8325 26.3888L26.6112 25.685C25.855 26.5 24.87 27.0925 23.75 27.3487V28.75C23.75 29.4412 23.19 30 22.5 30C21.81 30 21.25 29.4412 21.25 28.75V27.3487C20.13 27.0925 19.1438 26.5013 18.3888 25.685L17.1675 26.3888C16.9713 26.5025 16.7563 26.5563 16.545 26.5563C16.1125 26.5563 15.6912 26.3312 15.46 25.93C15.1163 25.3312 15.3212 24.5675 15.92 24.2237L17.1488 23.5163C16.9875 22.9937 16.8763 22.45 16.8763 21.875C16.8763 21.3 16.9875 20.7563 17.1488 20.2337L15.92 19.5263C15.3212 19.1825 15.1163 18.4175 15.46 17.82C15.805 17.2212 16.5713 17.0163 17.1675 17.3612L18.3888 18.065C19.145 17.25 20.13 16.6575 21.25 16.4013V15C21.25 14.3088 21.81 13.75 22.5 13.75C23.19 13.75 23.75 14.3088 23.75 15V16.4013C24.87 16.6575 25.8562 17.2487 26.6112 18.065L27.8325 17.3612C28.43 17.0163 29.1938 17.2225 29.54 17.82C29.8838 18.4187 29.6787 19.1825 29.08 19.5263L27.8512 20.2337C28.0125 20.7563 28.1238 21.3 28.1238 21.875C28.1238 22.45 28.0125 22.9937 27.8512 23.5163L29.08 24.2237C29.6787 24.5675 29.8838 25.3325 29.54 25.93ZM25.625 21.875C25.625 20.1513 24.2225 18.75 22.5 18.75C20.7775 18.75 19.375 20.1513 19.375 21.875C19.375 23.5987 20.7775 25 22.5 25C24.2225 25 25.625 23.5987 25.625 21.875ZM13.75 27.5H6.25C4.1825 27.5 2.5 25.8175 2.5 23.75V8.75C2.5 6.6825 4.1825 5 6.25 5H7.5C8.19 5 8.75 4.44125 8.75 3.75C8.75 3.05875 9.31125 2.5 10 2.5H12.5C13.1888 2.5 13.75 3.06 13.75 3.75C13.75 4.44 14.31 5 15 5H16.25C18.3175 5 20 6.6825 20 8.75V10C20 10.6912 20.56 11.25 21.25 11.25C21.94 11.25 22.5 10.6912 22.5 10V8.75C22.5 5.30375 19.6963 2.5 16.25 2.5H16.0363C15.52 1.045 14.13 0 12.5 0H10C8.37 0 6.98 1.045 6.46375 2.5H6.25C2.80375 2.5 0 5.30375 0 8.75V23.75C0 27.1963 2.80375 30 6.25 30H13.75C14.44 30 15 29.4412 15 28.75C15 28.0588 14.44 27.5 13.75 27.5ZM13.75 13.75H6.25C5.56 13.75 5 14.3088 5 15C5 15.6912 5.56 16.25 6.25 16.25H13.75C14.44 16.25 15 15.6912 15 15C15 14.3088 14.44 13.75 13.75 13.75ZM11.25 21.25C11.94 21.25 12.5 20.6912 12.5 20C12.5 19.3088 11.94 18.75 11.25 18.75H6.25C5.56 18.75 5 19.3088 5 20C5 20.6912 5.56 21.25 6.25 21.25H11.25Z" fill="#57CC99" />
                    </svg>
                  </div>
                  <span className="stat-value">500+</span>
                  <span className="stat-label">Projects</span>
                </div>

                <div className="stat-divider" />

                {/* 10+ Domains */}
                <div className="hero-stat-item">
                  <div className="stat-svg-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path d="M10 0H6.25C2.80375 0 0 2.80375 0 6.25V10C0 11.3787 1.12125 12.5 2.5 12.5H10C11.3787 12.5 12.5 11.3787 12.5 10V2.5C12.5 1.12125 11.3787 0 10 0ZM2.5 10V6.25C2.5 4.1825 4.1825 2.5 6.25 2.5H10V10H2.5ZM17.5 12.5H25C26.3787 12.5 27.5 11.3787 27.5 10V6.25C27.5 2.80375 24.6963 0 21.25 0H17.5C16.1213 0 15 1.12125 15 2.5V10C15 11.3787 16.1213 12.5 17.5 12.5ZM17.5 2.5H21.25C23.3175 2.5 25 4.1825 25 6.25V10H17.5V2.5ZM10 15H2.5C1.12125 15 0 16.1213 0 17.5V21.25C0 24.6963 2.80375 27.5 6.25 27.5H10C11.3787 27.5 12.5 26.3787 12.5 25V17.5C12.5 16.1213 11.3787 15 10 15ZM6.25 25C4.1825 25 2.5 23.3175 2.5 21.25V17.5H10V25H6.25ZM29.6338 27.8662L26.4587 24.6912C27.1138 23.7025 27.5 22.5212 27.5 21.25C27.5 17.8037 24.6963 15 21.25 15C17.8037 15 15 17.8037 15 21.25C15 24.6963 17.8037 27.5 21.25 27.5C22.5212 27.5 23.7025 27.1138 24.6912 26.4587L27.8662 29.6338C28.11 29.8775 28.43 30 28.75 30C29.07 30 29.39 29.8775 29.6338 29.6338C30.1225 29.145 30.1225 28.355 29.6338 27.8662ZM17.5 21.25C17.5 19.1825 19.1825 17.5 21.25 17.5C23.3175 17.5 25 19.1825 25 21.25C25 23.3175 23.3175 25 21.25 25C19.1825 25 17.5 23.3175 17.5 21.25Z" fill="#E5AA00" />
                    </svg>
                  </div>
                  <span className="stat-value">10+</span>
                  <span className="stat-label">Domains</span>
                </div>

                <div className="stat-divider" />

                {/* 50k+ Learners */}
                <div className="hero-stat-item">
                  <div className="stat-svg-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="30" viewBox="0 0 23 30" fill="none">
                      <path d="M21.9942 15.002C21.9697 14.5356 21.7092 14.1129 21.3028 13.8824C21.1883 13.817 18.4473 12.2992 15.4171 13.0138C13.6593 13.4297 12.042 14.4265 11.086 15.1098C10.1301 14.4279 8.51271 13.4297 6.7549 13.0138C3.72204 12.3005 0.985096 13.817 0.869182 13.8824C0.462799 14.1129 0.202333 14.5356 0.177787 15.002C-0.0894983 20.3627 -0.0554054 23.4924 0.280064 24.3038C1.53194 27.3176 8.60135 29.3918 10.7383 29.955C10.8515 29.985 10.9687 30 11.086 30C11.2033 30 11.3206 29.985 11.4338 29.955C13.5707 29.3918 20.6401 27.3176 21.892 24.3024C22.2274 23.491 22.2615 20.3614 21.9942 15.002ZM2.82745 23.3397C2.66926 22.6919 2.72108 19.1736 2.86154 15.9716C3.59794 15.6975 4.85391 15.3661 6.12624 15.6675C7.59358 16.0139 9.01182 16.9603 9.72231 17.4894V26.8185C6.44807 25.7807 3.22565 24.2874 2.82745 23.3397ZM19.3718 23.2579C18.9505 24.2738 15.7253 25.7793 12.4497 26.8185V17.4894C13.1602 16.9603 14.5784 16.0139 16.0458 15.6675C17.3195 15.3661 18.5754 15.6961 19.3105 15.9716C19.4523 19.1736 19.5068 22.6851 19.3732 23.2592L19.3718 23.2579Z" fill="#57CC99" />
                      <path d="M11.0948 11.8983C14.8314 11.8983 16.926 9.7709 16.9955 5.92527C16.9314 2.18328 14.7809 0.0231829 11.0785 0C7.39374 0.0231829 5.17773 2.22692 5.17773 5.973C5.17773 9.62362 7.18373 11.8983 11.0948 11.8983ZM11.0771 2.7274C13.2454 2.74103 14.23 3.74199 14.2681 5.9239C14.2272 8.24765 13.3313 9.15723 11.0948 9.17087C8.85017 9.15723 7.95286 8.2531 7.90513 5.94845C7.9515 3.67517 8.87745 2.74103 11.0771 2.7274Z" fill="#57CC99" />
                    </svg>
                  </div>
                  <span className="stat-value">50k+</span>
                  <span className="stat-label">Learners</span>
                </div>

                <div className="stat-divider" />

                {/* Top Rated By Our Learners */}
                <div className="hero-stat-item">
                  <div className="stat-svg-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                      <path d="M30.7826 11.1109C30.5184 10.2701 29.9904 9.53659 29.2769 9.01892C28.5633 8.50124 27.702 8.22684 26.8204 8.23631H21.1761L19.4617 2.89524C19.1921 2.05452 18.6624 1.3211 17.9489 0.800744C17.2353 0.280392 16.3749 0 15.4917 0C14.6085 0 13.7481 0.280392 13.0345 0.800744C12.321 1.3211 11.7913 2.05452 11.5217 2.89524L9.80734 8.23631H4.16303C3.2842 8.23756 2.42825 8.51638 1.71743 9.03296C1.00661 9.54953 0.477286 10.2774 0.205057 11.1127C-0.0671712 11.9479 -0.0683761 12.8478 0.201615 13.6838C0.471605 14.5197 0.998981 15.249 1.70841 15.7675L6.30241 19.1251L4.55576 24.532C4.2735 25.3706 4.26992 26.2779 4.54557 27.1187C4.82122 27.9595 5.36132 28.6887 6.08537 29.1977C6.79702 29.723 7.65942 30.0044 8.54406 29.9999C9.4287 29.9955 10.2882 29.7055 10.9946 29.1731L15.4917 25.8647L19.9901 29.1693C20.7005 29.6915 21.5582 29.9752 22.44 29.9795C23.3218 29.9838 24.1823 29.7085 24.8977 29.1932C25.6131 28.6778 26.1467 27.949 26.4216 27.1114C26.6965 26.2739 26.6986 25.3708 26.4276 24.532L24.681 19.1251L29.2802 15.7675C29.9977 15.2556 30.5313 14.5263 30.8019 13.6876C31.0725 12.8489 31.0657 11.9454 30.7826 11.1109ZM27.7557 13.682L22.4021 17.5935C22.1822 17.7538 22.0186 17.9795 21.9346 18.2383C21.8506 18.4971 21.8505 18.7758 21.9344 19.0347L23.9692 25.3236C24.0721 25.6426 24.0712 25.9859 23.9666 26.3044C23.8621 26.6228 23.6591 26.8999 23.3871 27.0958C23.115 27.2917 22.7878 27.3963 22.4525 27.3946C22.1172 27.3929 21.7911 27.285 21.521 27.0863L16.2565 23.2122C16.0348 23.0494 15.7668 22.9616 15.4917 22.9616C15.2166 22.9616 14.9486 23.0494 14.7269 23.2122L9.4624 27.0863C9.1925 27.2876 8.86546 27.3978 8.5287 27.4009C8.19194 27.4039 7.86295 27.2997 7.58944 27.1033C7.31593 26.9069 7.11211 26.6285 7.00753 26.3085C6.90295 25.9885 6.90304 25.6435 7.00779 25.3236L9.04899 19.0347C9.13286 18.7758 9.1328 18.4971 9.04882 18.2383C8.96483 17.9795 8.80122 17.7538 8.58133 17.5935L3.22769 13.682C2.95807 13.4846 2.75774 13.2072 2.6553 12.8893C2.55286 12.5713 2.55356 12.2292 2.6573 11.9116C2.76103 11.5941 2.96249 11.3175 3.23291 11.1213C3.50333 10.925 3.82887 10.8193 4.16303 10.819H10.7517C11.0252 10.819 11.2917 10.7322 11.5127 10.5712C11.7337 10.4101 11.8979 10.1831 11.9816 9.92282L13.9841 3.68427C14.0868 3.36502 14.2883 3.08661 14.5595 2.88911C14.8306 2.69161 15.1575 2.5852 15.493 2.5852C15.8285 2.5852 16.1554 2.69161 16.4265 2.88911C16.6977 3.08661 16.8991 3.36502 17.0019 3.68427L19.0044 9.92282C19.0881 10.1831 19.2523 10.4101 19.4733 10.5712C19.6943 10.7322 19.9608 10.819 20.2343 10.819H26.823C27.1571 10.8193 27.4827 10.925 27.7531 11.1213C28.0235 11.3175 28.225 11.5941 28.3287 11.9116C28.4324 12.2292 28.4331 12.5713 28.3307 12.8893C28.2283 13.2072 28.0279 13.4846 27.7583 13.682H27.7557Z" fill="#E5AA00" />
                    </svg>
                  </div>
                  <span className="stat-value">Top Rated</span>
                  <span className="stat-label">By Our Learners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. MAIN PROJECT AREA
          ========================================================= */}
      <section className="main-project-container">
        <div className="container">
          {/* 3.1 Category Filter Tabs */}
          <div className="category-filter-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className={`category-tab-btn ${selectedCategory === cat.slug ? "active" : ""
                  }`}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setFeaturedPage(1);
                  setAllProjectsPage(1);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid Layout: Left Content & Right Sidebar */}
          <div className="row g-4">
            {/* Left Content Area (Columns 8) */}
            <div className="col-lg-8 col-md-12">
              {/* 3.2 FEATURED PROJECTS SECTION */}
              <div className="section-header-block">
                <h2 className="section-main-title">Featured Projects</h2>
                <p className="section-sub-title">Handpicked Projects By Our Experts</p>
              </div>

              {/* Left: Featured Project List */}
              <div className="featured-projects-list">
                {paginatedFeatured.length > 0 ? (
                  paginatedFeatured.map((item) => (
                    <div className="featured-project-card" key={item.id}>
                      {/* Left thumbnail */}
                      <div className="featured-card-thumb-wrapper">
                        <img
                          src={item.image || robotDashboardImg}
                          alt={item.title}
                          className="featured-card-thumb"
                          loading="lazy"
                        />
                      </div>

                      {/* Right card content */}
                      <div className="featured-card-content">
                        <div>
                          <div className="featured-card-header">
                            <h3 className="featured-card-title">{item.title}</h3>
                            <div className="featured-card-author">
                              <img
                                src={item.authorImage || authorAvatarImg}
                                alt={item.author}
                                className="author-avatar"
                              />
                              <span className="author-name-text">{item.author || "prepHQ"}</span>
                            </div>
                          </div>

                          <p className="featured-card-desc">
                            {typeof item.description === "string" && item.description.includes("<br") ? (
                              item.description.split(/<br\s*\/?>/i).map((part, idx, arr) => (
                                <React.Fragment key={idx}>
                                  {part}
                                  {idx < arr.length - 1 && <br />}
                                </React.Fragment>
                              ))
                            ) : (
                              item.description
                            )}
                          </p>

                          <div className="featured-card-tags">
                            <span className="tag-badge">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M9.99958 8.75026C9.50273 8.75026 9.40523 9.18149 9.40211 9.19212C9.21774 9.79272 7.69405 10.6252 5.31228 10.6252C2.83238 10.6252 1.24995 9.70022 1.24995 9.06275V7.8703C2.27491 8.4509 3.79797 8.75026 5.31228 8.75026C5.4229 8.75026 5.53289 8.74839 5.64164 8.74589C5.98663 8.73651 6.25849 8.44902 6.24974 8.10404C6.24037 7.75905 5.966 7.47156 5.60852 7.49594C5.51102 7.49844 5.41227 7.49969 5.3129 7.49969C2.68426 7.49969 1.25057 6.58535 1.25057 6.116V4.74543C2.27553 5.32603 3.79859 5.62539 5.3129 5.62539C5.42352 5.62539 5.53352 5.62414 5.64226 5.62102C5.98725 5.61164 6.25911 5.32478 6.25036 4.97979C6.24099 4.63481 5.96663 4.34732 5.60914 4.37169C5.51165 4.37419 5.4129 4.37544 5.31353 4.37544C2.68489 4.37544 1.2512 3.46111 1.2512 2.99175V2.63489C1.2512 2.16553 2.68489 1.2512 5.31353 1.2512C5.71476 1.2512 6.11037 1.27432 6.48973 1.31932C6.83159 1.35432 7.14345 1.11495 7.18408 0.772468C7.2247 0.429982 6.97971 0.118745 6.63722 0.0781217C3.69485 -0.272489 0 0.6106 0 2.63427V12.3664C0 14.0957 2.67239 15 5.31228 15C7.95217 15 10.6246 14.0957 10.6246 12.3664V9.37523C10.6246 9.36399 10.5927 8.75026 9.99958 8.75026ZM5.31228 13.7501C2.68364 13.7501 1.24995 12.8357 1.24995 12.3664V10.912C2.20928 11.5083 3.64672 11.8751 5.31228 11.8751C6.95346 11.8751 8.39902 11.5201 9.37461 10.9345V12.3664C9.37461 12.8357 7.94092 13.7501 5.31228 13.7501ZM14.9994 0.763093V2.67551C14.9994 2.92425 14.7981 3.12549 14.5494 3.12549H14.1163H14.115C14.1144 3.12549 14.1138 3.12549 14.1132 3.12549H12.6376C12.4557 3.12549 12.2914 3.01612 12.222 2.84801C12.152 2.67989 12.1907 2.48615 12.3195 2.3574L12.8457 1.83117C12.4051 1.46556 11.8458 1.25057 11.2502 1.25057C10.2558 1.25057 9.35649 1.8393 8.95775 2.75051C8.82026 3.06612 8.45465 3.21174 8.13529 3.073C7.81905 2.93488 7.67468 2.56614 7.8128 2.24991C8.41027 0.883088 9.75959 0 11.2502 0C12.1839 0 13.062 0.346861 13.7351 0.941211L14.2319 0.443731C14.3607 0.314987 14.5538 0.276863 14.7225 0.346236C14.8906 0.415608 15 0.579976 15 0.761843L14.9994 0.763093ZM14.6869 5.25103C14.09 6.61785 12.7407 7.50094 11.2495 7.50094C10.3158 7.50094 9.43773 7.15408 8.76464 6.55973L8.26778 7.05658C8.13904 7.18533 7.94592 7.22345 7.77718 7.15408C7.60906 7.0847 7.49969 6.92034 7.49969 6.73847V4.82605C7.49969 4.57731 7.70093 4.37607 7.94967 4.37607H9.86209C10.044 4.37607 10.2083 4.48544 10.2777 4.65356C10.3477 4.82167 10.3089 5.01542 10.1802 5.14416L9.65397 5.67039C10.0946 6.036 10.6539 6.25099 11.2495 6.25099C12.2439 6.25099 13.1432 5.66226 13.5419 4.75105C13.6801 4.43607 14.0457 4.2917 14.3644 4.42857C14.6806 4.56668 14.825 4.93542 14.6869 5.25166V5.25103Z" fill="#676767" />
                              </svg>
                              {item.category || "Data Science"}
                            </span>
                            <span className="tag-badge">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none">
                                <path d="M11.25 15H10V11.8481C9.9995 11.3581 9.80463 10.8883 9.45815 10.5419C9.11167 10.1954 8.64188 10.0005 8.15187 10H3.09812C2.60812 10.0005 2.13833 10.1954 1.79185 10.5419C1.44537 10.8883 1.2505 11.3581 1.25 11.8481V15H0V11.8481C0.000992392 11.0268 0.32772 10.2393 0.908516 9.65852C1.48931 9.07772 2.27676 8.75099 3.09812 8.75H8.15187C8.97324 8.75099 9.76069 9.07772 10.3415 9.65852C10.9223 10.2393 11.249 11.0268 11.25 11.8481V15Z" fill="#676767" />
                                <path d="M5.625 7.5C4.88332 7.5 4.1583 7.28007 3.54161 6.86801C2.92493 6.45596 2.44428 5.87029 2.16045 5.18506C1.87662 4.49984 1.80236 3.74584 1.94706 3.01841C2.09175 2.29098 2.4489 1.6228 2.97335 1.09835C3.4978 0.573904 4.16598 0.216751 4.89341 0.0720569C5.62084 -0.0726377 6.37484 0.00162482 7.06006 0.285453C7.74529 0.569282 8.33096 1.04993 8.74301 1.66661C9.15507 2.2833 9.375 3.00832 9.375 3.75C9.37401 4.74426 8.9786 5.69751 8.27556 6.40056C7.57251 7.1036 6.61926 7.49901 5.625 7.5ZM5.625 1.25C5.13055 1.25 4.6472 1.39662 4.23608 1.67133C3.82495 1.94603 3.50452 2.33648 3.3153 2.79329C3.12608 3.25011 3.07658 3.75277 3.17304 4.23773C3.2695 4.72268 3.5076 5.16814 3.85723 5.51777C4.20687 5.8674 4.65232 6.1055 5.13728 6.20197C5.62223 6.29843 6.1249 6.24892 6.58171 6.0597C7.03853 5.87048 7.42897 5.55005 7.70368 5.13893C7.97838 4.7278 8.125 4.24445 8.125 3.75C8.125 3.08696 7.86161 2.45108 7.39277 1.98223C6.92393 1.51339 6.28804 1.25 5.625 1.25Z" fill="#676767" />
                              </svg>
                              {item.level || "Intermediate"}
                            </span>
                          </div>
                        </div>

                        <div className="featured-card-footer">
                          <Link
                            to={`/projects/${item.slug}`}
                            state={{ id: item.id }}
                            className="btn-read-more"
                          >
                            Read More
                          </Link>

                          <div className="featured-meta-stats">
                            <div className="meta-stat-item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                                <path d="M17 14.6288C16.867 14.9181 16.6395 15.0004 16.3317 15C12.1039 14.9932 7.87605 14.9915 3.64824 14.9951C3.19279 14.9951 3.02028 14.8211 3.02028 14.3609V12.9959H3.22649C6.61288 12.9959 9.99913 12.997 13.3852 12.9991C13.8788 12.9991 14.2868 12.8393 14.6398 12.4961C15.6079 11.5549 16.3135 10.4369 16.8625 9.21124C16.9069 9.11644 16.9512 9.02387 16.9982 8.93041L17 14.6288Z" fill="#37AB79" />
                                <path d="M17 2.99834H3.0358C3.02918 2.95931 3.02474 2.91993 3.0225 2.8804C3.0225 2.43046 3.02028 1.98096 3.0225 1.53101C3.0225 1.20479 3.22649 1.00051 3.55112 0.999624C4.30503 0.999624 5.05539 0.999624 5.80797 0.999624H6.0102C6.0102 0.83629 6.0102 0.683194 6.0102 0.530097C6.0133 0.218562 6.21952 4.25311e-05 6.50734 4.25311e-05C6.79515 4.25311e-05 7.00093 0.218117 7.00536 0.529651C7.00536 0.679188 7.00536 0.82828 7.00536 0.988497H9.49548C9.49548 0.832285 9.49548 0.676963 9.49548 0.524756C9.49947 0.215891 9.70924 -0.00262777 9.9975 4.25311e-05C10.2858 0.00271283 10.4853 0.217227 10.4902 0.51808C10.4933 0.672513 10.4902 0.826945 10.4902 0.990278H13.0158C13.0158 0.842076 13.0158 0.68898 13.0158 0.536328C13.0189 0.222122 13.2198 0.00226778 13.5067 4.25311e-05C13.8016 -0.00351787 14.0083 0.216781 14.0114 0.539887C14.0114 0.684083 14.0114 0.82828 14.0114 0.999624H14.1888C14.9081 0.999624 15.6274 1.00941 16.3463 0.994728C16.6519 0.988497 16.8714 1.08374 16.9982 1.3659L17 2.99834Z" fill="#37AB79" />
                                <path d="M16.9778 4.01039C16.9516 5.14276 16.7786 6.26689 16.4634 7.35449C16.0102 8.90193 15.2993 10.3118 14.2083 11.5135C14.2042 11.5174 14.2004 11.5216 14.1968 11.5259C13.9249 11.882 13.5866 12.011 13.1231 12.0088C8.94646 11.9901 4.76979 11.9972 0.592684 11.9995C0.370946 11.9995 0.187347 11.947 0.0698252 11.7471C0.0117753 11.651 -0.0111218 11.5375 0.00506168 11.4263C0.0212452 11.315 0.0755006 11.2129 0.158521 11.1374C1.62199 9.69589 2.40739 7.90724 2.78612 5.92054C2.89655 5.3393 2.92803 4.74338 2.99589 4.15414C3.00076 4.10963 3.00476 4.06513 3.01052 4.01217L16.9778 4.01039Z" fill="#37AB79" />
                              </svg>
                              <span>{item.date}</span>
                            </div>
                            <div className="meta-stat-item">
                              <FiEye />
                              <span>{item.views}</span>
                            </div>
                            <div className="meta-stat-item">
                              <IoHeartOutline className="meta-icon-green" size={15} />
                              <span>{item.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted border rounded-3 bg-light">
                    No featured projects found for selected filters.
                  </div>
                )}
              </div>

              {/* 3.3 Featured Pagination */}
              <div className="projects-pagination">
                <button
                  type="button"
                  className={`page-btn page-arrow ${featuredPage <= 1 ? "disabled" : ""}`}
                  onClick={() => setFeaturedPage((prev) => Math.max(1, prev - 1))}
                  disabled={featuredPage <= 1}
                  aria-label="Previous Featured Page"
                >
                  <PaginationPrevArrow />
                </button>

                {[...Array(Math.min(totalFeaturedPages, 4))].map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <button
                      key={`feat-page-${p}`}
                      type="button"
                      className={`page-btn ${featuredPage === p ? "active" : ""}`}
                      onClick={() => setFeaturedPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={`page-btn page-arrow ${featuredPage >= totalFeaturedPages ? "disabled" : ""
                    }`}
                  onClick={() =>
                    setFeaturedPage((prev) => Math.min(totalFeaturedPages, prev + 1))
                  }
                  disabled={featuredPage >= totalFeaturedPages}
                  aria-label="Next Featured Page"
                >
                  <PaginationNextArrow />
                </button>
              </div>

              {/* 3.4 ALL PROJECTS SECTION */}
              <div className="section-header-block mt-4">
                <h2 className="section-main-title">All Projects</h2>
                <p className="section-sub-title">Browse All Projects Across Different Domains</p>
              </div>

              {/* All Projects Grid (3 columns) */}
              <div className="all-projects-grid">
                {paginatedAll.length > 0 ? (
                  paginatedAll.map((item) => (
                    <div className="grid-project-card" key={item.id}>
                      <div className="grid-card-thumb-wrapper">
                        <img
                          src={item.image || robotDashboardImg}
                          alt={item.title}
                          className="grid-card-thumb"
                          loading="lazy"
                        />
                      </div>

                      <div className="grid-card-body">
                        <div className="grid-card-top-row">
                          <div className="grid-card-author">
                            <img
                              src={item.authorImage || authorAvatarImg}
                              alt={item.author}
                              className="author-avatar"
                            />
                            <span className="author-name-text">{item.author || "prepHQ"}</span>
                          </div>

                          <div className="grid-card-level-badge">
                            <FiUser size={11} />
                            <span>{item.level || "Intermediate"}</span>
                          </div>
                        </div>

                        <h4 className="grid-card-title">{item.title}</h4>

                        <div className="grid-card-meta-row">
                          <div className="meta-stat-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                              <path d="M17 14.6288C16.867 14.9181 16.6395 15.0004 16.3317 15C12.1039 14.9932 7.87605 14.9915 3.64824 14.9951C3.19279 14.9951 3.02028 14.8211 3.02028 14.3609V12.9959H3.22649C6.61288 12.9959 9.99913 12.997 13.3852 12.9991C13.8788 12.9991 14.2868 12.8393 14.6398 12.4961C15.6079 11.5549 16.3135 10.4369 16.8625 9.21124C16.9069 9.11644 16.9512 9.02387 16.9982 8.93041L17 14.6288Z" fill="#37AB79" />
                              <path d="M17 2.99834H3.0358C3.02918 2.95931 3.02474 2.91993 3.0225 2.8804C3.0225 2.43046 3.02028 1.98096 3.0225 1.53101C3.0225 1.20479 3.22649 1.00051 3.55112 0.999624C4.30503 0.999624 5.05539 0.999624 5.80797 0.999624H6.0102C6.0102 0.83629 6.0102 0.683194 6.0102 0.530097C6.0133 0.218562 6.21952 4.25311e-05 6.50734 4.25311e-05C6.79515 4.25311e-05 7.00093 0.218117 7.00536 0.529651C7.00536 0.679188 7.00536 0.82828 7.00536 0.988497H9.49548C9.49548 0.832285 9.49548 0.676963 9.49548 0.524756C9.49947 0.215891 9.70924 -0.00262777 9.9975 4.25311e-05C10.2858 0.00271283 10.4853 0.217227 10.4902 0.51808C10.4933 0.672513 10.4902 0.826945 10.4902 0.990278H13.0158C13.0158 0.842076 13.0158 0.68898 13.0158 0.536328C13.0189 0.222122 13.2198 0.00226778 13.5067 4.25311e-05C13.8016 -0.00351787 14.0083 0.216781 14.0114 0.539887C14.0114 0.684083 14.0114 0.82828 14.0114 0.999624H14.1888C14.9081 0.999624 15.6274 1.00941 16.3463 0.994728C16.6519 0.988497 16.8714 1.08374 16.9982 1.3659L17 2.99834Z" fill="#37AB79" />
                              <path d="M16.9778 4.01039C16.9516 5.14276 16.7786 6.26689 16.4634 7.35449C16.0102 8.90193 15.2993 10.3118 14.2083 11.5135C14.2042 11.5174 14.2004 11.5216 14.1968 11.5259C13.9249 11.882 13.5866 12.011 13.1231 12.0088C8.94646 11.9901 4.76979 11.9972 0.592684 11.9995C0.370946 11.9995 0.187347 11.947 0.0698252 11.7471C0.0117753 11.651 -0.0111218 11.5375 0.00506168 11.4263C0.0212452 11.315 0.0755006 11.2129 0.158521 11.1374C1.62199 9.69589 2.40739 7.90724 2.78612 5.92054C2.89655 5.3393 2.92803 4.74338 2.99589 4.15414C3.00076 4.10963 3.00476 4.06513 3.01052 4.01217L16.9778 4.01039Z" fill="#37AB79" />
                            </svg>
                            <span>{item.date}</span>
                          </div>

                          <div className="meta-stat-item">
                            <IoHeartOutline className="meta-icon-green" size={15} />
                            <span>{item.likes}</span>
                          </div>
                        </div>

                        <Link
                          to={`/projects/${item.slug}`}
                          state={{ id: item.id }}
                          className="grid-card-btn-read-more"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 p-4 text-center text-muted border rounded-3 bg-light">
                    No projects found for selected filters.
                  </div>
                )}
              </div>

              {/* 3.5 All Projects Pagination */}
              <div className="projects-pagination">
                <button
                  type="button"
                  className={`page-btn page-arrow ${allProjectsPage <= 1 ? "disabled" : ""}`}
                  onClick={() => setAllProjectsPage((prev) => Math.max(1, prev - 1))}
                  disabled={allProjectsPage <= 1}
                  aria-label="Previous All Projects Page"
                >
                  <PaginationPrevArrow />
                </button>

                {[...Array(Math.min(totalAllPages, 4))].map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <button
                      key={`all-page-${p}`}
                      type="button"
                      className={`page-btn ${allProjectsPage === p ? "active" : ""}`}
                      onClick={() => setAllProjectsPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={`page-btn page-arrow ${allProjectsPage >= totalAllPages ? "disabled" : ""
                    }`}
                  onClick={() =>
                    setAllProjectsPage((prev) => Math.min(totalAllPages, prev + 1))
                  }
                  disabled={allProjectsPage >= totalAllPages}
                  aria-label="Next All Projects Page"
                >
                  <PaginationNextArrow />
                </button>
              </div>
            </div>

            {/* Right: Sidebar (Columns 4) */}
            <div className="col-lg-4 col-md-12">
              <aside className="projects-sidebar">
                {/* Search Box */}
                <form className="sidebar-search-box" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="sidebar-search-input"
                    placeholder="Search here"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="sidebar-search-btn" aria-label="Search">
                    <FiSearch size={18} />
                  </button>
                </form>

                {/* Advertisement 1 */}
                <div className="sidebar-ad-card">
                  <img
                    src={adIitrImg}
                    alt="Learn Data Science & AI - IIT Roorkee"
                    className="sidebar-ad-img"
                  />
                </div>

                {/* Filter By Tools / Level */}
                <div className="sidebar-filter-section">
                  <h3 className="sidebar-filter-title">Filter by Tools</h3>
                  <div className="sidebar-filter-card">
                    <div className="sidebar-tools-grid">
                      {LEVEL_FILTERS.map((filter) => (
                        <button
                          key={filter.value}
                          type="button"
                          className={`tool-filter-btn ${selectedLevel === filter.value ? "active" : ""
                            }`}
                          onClick={() => {
                            setSelectedLevel(filter.value);
                            setFeaturedPage(1);
                            setAllProjectsPage(1);
                          }}
                        >
                          {filter.label} ({filter.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advertisement 2 */}
                <div className="sidebar-ad-card">
                  <img
                    src={adQuantumImg}
                    alt="AI Meets Quantum Computing Masterclass"
                    className="sidebar-ad-img"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. LARGE EMPTY / SPACING AREA
          ========================================================= */}
      <div className="large-spacing-area" />

      {/* =========================================================
          5. FOOTER (Rendered globally in App.jsx)
          ========================================================= */}
    </div>
  );
};

export default ProjectsPage;
