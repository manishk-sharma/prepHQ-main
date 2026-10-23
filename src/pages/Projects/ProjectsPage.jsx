import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiEye,
  FiUser,
  FiChevronDown,
  FiX,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";
import { IoHeartOutline } from "react-icons/io5";
import {
  LuFolderCode,
  LuDatabase,
  LuBookOpen,
  LuGraduationCap,
  LuSparkles,
  LuBrain,
  LuTrendingUp,
  LuFileSpreadsheet,
  LuCircuitBoard,
  LuWifi,
  LuGlobe,
  LuLayers,
  LuLaptop,
} from "react-icons/lu";

import { useProjectList } from "../../services/projectsServices";
import authorAvatarImg from "../../assets/img/projects/Ellipse 57.svg";
import robotDashboardImg from "../../assets/img/projects/robot-dashboard.png";
import adIitrImg from "../../assets/img/projects/ad-iitr.png";
import adQuantumImg from "../../assets/img/projects/ad-quantum.png";
import dataScienceHeroImg from "../../assets/img/domains/data-science-hero-illustration.png";
import aiGenAiHeroImg from "../../assets/img/domains/ai-genai-hero-illustration.png";
import mlHeroImg from "../../assets/img/domains/machine-learning-hero-illustration.png";
import daHeroImg from "../../assets/img/domains/data-analytics-hero-illustration.png";
import embeddedHeroImg from "../../assets/img/domains/embedded-systems-hero-illustration.png";
import webDevHeroImg from "../../assets/img/domains/web-development-hero-illustration.png";
import "./ProjectsPage.css";

// ── Default Featured Projects (Used in Default View - Image 2) ───────────────────
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
    tools: ["Python", "SQL", "R", "Numpy"],
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
    tools: ["Python", "SQL", "R", "Numpy"],
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
    tools: ["Python", "Numpy"],
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
    tools: ["Python", "SQL", "Numpy"],
    image: robotDashboardImg,
  },
];

// ── Complete Catalogue of Projects Across All Domains ───────────────────────────
// Provides 9 matching cards on Page 1 of AI/GenAI matching Image 1 exactly,
// plus multi-domain coverage for Data Science, ML, Analytics, Embedded & Web.
const SAMPLE_ALL_PROJECTS = [
  // ── 9 AI/GenAI Cards matching Image 1 ─────────────────────────────────────────
  {
    id: "proj-ai-1",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-1",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Numpy", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-2",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-2",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Numpy", "Excel"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-3",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-3",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Numpy", "R"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-4",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-4",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Tableau", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-5",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-5",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Power Bi", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-6",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-6",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Numpy", "Excel"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-7",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-7",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "SQL", "Tableau"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-8",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-8",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Power Bi", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-9",
    title: "Smart Plant Monitoring System",
    slug: "smart-plant-monitoring-system-9",
    category: "AI/GenAI, Embedded Systems",
    categorySlug: "ai-genai",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "120K",
    views: "200K",
    tools: ["Python", "Numpy", "R"],
    image: robotDashboardImg,
  },

  // ── Additional AI/GenAI Projects ──────────────────────────────────────────────
  {
    id: "proj-ai-10",
    title: "Real-Time Object Detection with YOLOv8",
    slug: "real-time-object-detection-yolov8",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "12 Aug, 2025",
    likes: "194K",
    views: "250K",
    tools: ["Python", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-11",
    title: "End-to-End LLM Agent with RAG Pipeline",
    slug: "end-to-end-llm-agent-rag",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "22 Aug, 2025",
    likes: "245K",
    views: "310K",
    tools: ["Python", "SQL", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-12",
    title: "AI Medical Image Segmentation with U-Net",
    slug: "ai-medical-image-segmentation-unet",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "19 Aug, 2025",
    likes: "190K",
    views: "230K",
    tools: ["Python", "Numpy", "R"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-13",
    title: "Generative AI Image Synthesis with Stable Diffusion",
    slug: "generative-ai-image-synthesis",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "22 Sep, 2025",
    likes: "175K",
    views: "220K",
    tools: ["Python", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ai-14",
    title: "Autonomous Drone Navigation with Computer Vision",
    slug: "autonomous-drone-navigation-cv",
    category: "AI/GenAI",
    categorySlug: "ai-genai",
    level: "Advanced",
    author: "prepHQ",
    date: "08 Oct, 2025",
    likes: "195K",
    views: "240K",
    tools: ["Python", "Numpy", "R"],
    image: robotDashboardImg,
  },

  // ── Data Science Projects ─────────────────────────────────────────────────────
  {
    id: "proj-ds-1",
    title: "Customer Segmentation using K-Means",
    slug: "customer-segmentation-using-k-means",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Intermediate",
    author: "prepHQ",
    date: "05 Aug, 2025",
    likes: "208K",
    views: "260K",
    tools: ["Python", "R", "SQL", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ds-2",
    title: "E-Commerce Recommendation Engine",
    slug: "ecommerce-recommendation-engine",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Intermediate",
    author: "prepHQ",
    date: "02 Sep, 2025",
    likes: "135K",
    views: "180K",
    tools: ["Python", "SQL", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ds-3",
    title: "Stock Price Prediction with LSTM Networks",
    slug: "stock-price-prediction-lstm",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Advanced",
    author: "prepHQ",
    date: "12 Sep, 2025",
    likes: "140K",
    views: "190K",
    tools: ["Python", "R", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ds-4",
    title: "Automated ETL Pipeline with Apache Airflow",
    slug: "automated-etl-pipeline-airflow",
    category: "Data Science",
    categorySlug: "data-science",
    level: "Advanced",
    author: "prepHQ",
    date: "25 Sep, 2025",
    likes: "130K",
    views: "175K",
    tools: ["Python", "SQL", "Docker"],
    image: robotDashboardImg,
  },

  // ── Machine Learning Projects ─────────────────────────────────────────────────
  {
    id: "proj-ml-1",
    title: "Credit Card Fraud Detection with XGBoost",
    slug: "credit-card-fraud-detection-xgboost",
    category: "Machine Learning",
    categorySlug: "machine-learning",
    level: "Advanced",
    author: "prepHQ",
    date: "14 Aug, 2025",
    likes: "145K",
    views: "185K",
    tools: ["Python", "SQL", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ml-2",
    title: "Sentiment Analysis on Twitter Feed API",
    slug: "sentiment-analysis-twitter-api",
    category: "Machine Learning",
    categorySlug: "machine-learning",
    level: "Beginner",
    author: "prepHQ",
    date: "15 Sep, 2025",
    likes: "98K",
    views: "140K",
    tools: ["Python", "Numpy", "Excel"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ml-3",
    title: "Retail Demand Forecasting with LightGBM",
    slug: "retail-demand-forecasting-lightgbm",
    category: "Machine Learning",
    categorySlug: "machine-learning",
    level: "Intermediate",
    author: "prepHQ",
    date: "02 Oct, 2025",
    likes: "115K",
    views: "150K",
    tools: ["Python", "Excel", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-ml-4",
    title: "Customer Churn Prediction with Random Forest",
    slug: "customer-churn-prediction-rf",
    category: "Machine Learning",
    categorySlug: "machine-learning",
    level: "Beginner",
    author: "prepHQ",
    date: "20 Sep, 2025",
    likes: "85K",
    views: "120K",
    tools: ["Python", "R", "SQL"],
    image: robotDashboardImg,
  },

  // ── Data Analytics Projects ───────────────────────────────────────────────────
  {
    id: "proj-da-1",
    title: "Sales Forecasting Dashboard with PowerBI",
    slug: "sales-forecasting-dashboard-powerbi",
    category: "Data Analytics",
    categorySlug: "data-analytics",
    level: "Beginner",
    author: "prepHQ",
    date: "25 Aug, 2025",
    likes: "88K",
    views: "130K",
    tools: ["Power Bi", "Excel", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-da-2",
    title: "Interactive Financial Analytics Tableau Dashboard",
    slug: "financial-analytics-tableau-dashboard",
    category: "Data Analytics",
    categorySlug: "data-analytics",
    level: "Beginner",
    author: "prepHQ",
    date: "05 Oct, 2025",
    likes: "78K",
    views: "110K",
    tools: ["Tableau", "Excel", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-da-3",
    title: "Data Analytics with Python & Power BI",
    slug: "data-analytics-python-power-bi",
    category: "Data Analytics",
    categorySlug: "data-analytics",
    level: "Intermediate",
    author: "prepHQ",
    date: "13 Oct, 2026",
    likes: "125K",
    views: "165K",
    tools: ["Python", "Power Bi", "SQL", "Excel"],
    image: robotDashboardImg,
  },
  {
    id: "proj-da-4",
    title: "SQL Projects for Data Analysis & Reporting",
    slug: "sql-projects-for-data-analysis",
    category: "Data Analytics",
    categorySlug: "data-analytics",
    level: "Intermediate",
    author: "prepHQ",
    date: "18 Oct, 2025",
    likes: "105K",
    views: "145K",
    tools: ["SQL", "Excel", "Tableau"],
    image: robotDashboardImg,
  },

  // ── Embedded Systems Projects ─────────────────────────────────────────────────
  {
    id: "proj-es-1",
    title: "IoT Smart Home Automation with ESP32",
    slug: "iot-smart-home-automation-esp32",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "18 Sep, 2025",
    likes: "125K",
    views: "170K",
    tools: ["Python", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-es-2",
    title: "Autonomous Robot Obstacle Avoidance ROS2",
    slug: "autonomous-robot-obstacle-avoidance-ros2",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "30 Aug, 2025",
    likes: "110K",
    views: "155K",
    tools: ["Python", "Numpy"],
    image: robotDashboardImg,
  },
  {
    id: "proj-es-3",
    title: "Wearable Health Monitor with Heart Rate Sensor",
    slug: "wearable-health-monitor-sensor",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Beginner",
    author: "prepHQ",
    date: "30 Sep, 2025",
    likes: "92K",
    views: "125K",
    tools: ["Python", "Excel"],
    image: robotDashboardImg,
  },
  {
    id: "proj-es-4",
    title: "Predictive Maintenance Pipeline with IoT Sensors",
    slug: "predictive-maintenance-iot-sensors-embedded",
    category: "Embedded Systems",
    categorySlug: "embedded-systems",
    level: "Intermediate",
    author: "prepHQ",
    date: "18 Aug, 2025",
    likes: "162K",
    views: "210K",
    tools: ["Python", "Numpy", "SQL"],
    image: robotDashboardImg,
  },

  // ── Web Development Projects ──────────────────────────────────────────────────
  {
    id: "proj-web-1",
    title: "Next.js 14 AI Portfolio & CMS Web Platform",
    slug: "nextjs-ai-portfolio-cms",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Beginner",
    author: "prepHQ",
    date: "08 Sep, 2025",
    likes: "95K",
    views: "135K",
    tools: ["SQL", "Docker", "Git"],
    image: robotDashboardImg,
  },
  {
    id: "proj-web-2",
    title: "Real-Time Chat Application with WebSockets",
    slug: "real-time-chat-app-websockets",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Intermediate",
    author: "prepHQ",
    date: "10 Sep, 2025",
    likes: "105K",
    views: "148K",
    tools: ["Docker", "Git", "SQL"],
    image: robotDashboardImg,
  },
  {
    id: "proj-web-3",
    title: "Microservices Orchestration with Kubernetes",
    slug: "microservices-orchestration-k8s",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Advanced",
    author: "prepHQ",
    date: "28 Sep, 2025",
    likes: "160K",
    views: "215K",
    tools: ["Docker", "Git"],
    image: robotDashboardImg,
  },
  {
    id: "proj-web-4",
    title: "Full-Stack Microservices Architecture with Docker",
    slug: "full-stack-microservices-docker",
    category: "Web Development",
    categorySlug: "web-development",
    level: "Intermediate",
    author: "prepHQ",
    date: "28 Aug, 2025",
    likes: "178K",
    views: "230K",
    tools: ["Docker", "SQL", "Git"],
    image: robotDashboardImg,
  },
];

// ── Category Filter Options (Image 1 Bar) ───────────────────────────────────────
const CATEGORIES = [
  { name: "All Projects", slug: "all" },
  { name: "AI/GenAI", slug: "ai-genai" },
  { name: "Data Science", slug: "data-science" },
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Data Analytics", slug: "data-analytics" },
  { name: "Embedded Systems", slug: "embedded-systems" },
  { name: "Web Development", slug: "web-development" },
];

// ── Category-Specific Hero Configurations (Matching Image 1 Design System) ──────
const CATEGORY_HERO_CONFIG = {
  "ai-genai": {
    accent: "AI & Generative AI",
    suffix: "Projects",
    description:
      "Explore hands-on AI and Generative AI projects with practical examples, source code, and step-by-step guides. Build intelligent applications using modern AI technologies.",
    badges: [
      { label: "AI Projects", icon: LuSparkles },
      { label: "Beginner to Advanced", icon: LuGraduationCap },
      { label: "Real-World Applications", icon: LuLayers },
      { label: "Step-by-step Guides", icon: LuBookOpen },
    ],
    image: aiGenAiHeroImg,
    alt: "AI & Generative AI Projects Illustration",
    themeClass: "ai-genai-hero",
  },
  "data-science": {
    accent: "Data Science",
    suffix: "Projects",
    description:
      "Explore 150+ hands-on Data Science projects with source code and step-by-step guides. Work on real-world datasets and build job-ready skills.",
    badges: [
      { label: "150+ Projects", icon: LuFolderCode },
      { label: "Beginner to Advanced", icon: LuGraduationCap },
      { label: "Real Datasets", icon: LuDatabase },
      { label: "Step-by-step Guides", icon: LuBookOpen },
    ],
    image: dataScienceHeroImg,
    alt: "Data Science Projects Illustration",
    themeClass: "data-science-hero",
  },
  "machine-learning": {
    accent: "Machine Learning",
    suffix: "Projects",
    description:
      "Explore practical Machine Learning projects covering data preparation, model training, evaluation, and real-world prediction tasks.",
    badges: [
      { label: "ML Projects", icon: LuBrain },
      { label: "Beginner to Advanced", icon: LuGraduationCap },
      { label: "Real Datasets", icon: LuDatabase },
      { label: "Model Training Guides", icon: LuTrendingUp },
    ],
    image: mlHeroImg,
    alt: "Machine Learning Projects Illustration",
    themeClass: "machine-learning-hero",
  },
  "data-analytics": {
    accent: "Data Analytics",
    suffix: "Projects",
    description:
      "Build practical Data Analytics projects using real datasets, SQL, spreadsheets, dashboards, and visualization tools to develop job-ready analytical skills.",
    badges: [
      { label: "Analytics Projects", icon: FiBarChart2 },
      { label: "SQL & Excel", icon: LuFileSpreadsheet },
      { label: "Real Datasets", icon: LuDatabase },
      { label: "Dashboard Guides", icon: LuBookOpen },
    ],
    image: daHeroImg,
    alt: "Data Analytics Projects Illustration",
    themeClass: "data-analytics-hero",
  },
  "embedded-systems": {
    accent: "Embedded Systems",
    suffix: "Projects",
    description:
      "Explore hands-on Embedded Systems and IoT projects using microcontrollers, sensors, hardware interfaces, and practical engineering applications.",
    badges: [
      { label: "Hardware Projects", icon: LuCircuitBoard },
      { label: "Beginner to Advanced", icon: LuGraduationCap },
      { label: "IoT Applications", icon: LuWifi },
      { label: "Step-by-step Guides", icon: LuBookOpen },
    ],
    image: embeddedHeroImg,
    alt: "Embedded Systems Projects Illustration",
    themeClass: "embedded-systems-hero",
  },
  "web-development": {
    accent: "Web Development",
    suffix: "Projects",
    description:
      "Build practical web applications using modern frontend and backend technologies, reusable components, APIs, and responsive design techniques.",
    badges: [
      { label: "Web Projects", icon: LuGlobe },
      { label: "Frontend & Backend", icon: LuLayers },
      { label: "Real Applications", icon: LuLaptop },
      { label: "Step-by-step Guides", icon: LuBookOpen },
    ],
    image: webDevHeroImg,
    alt: "Web Development Projects Illustration",
    themeClass: "web-development-hero",
  },
};

// Aliases for display names
CATEGORY_HERO_CONFIG["AI/GenAI"] = CATEGORY_HERO_CONFIG["ai-genai"];
CATEGORY_HERO_CONFIG["Data Science"] = CATEGORY_HERO_CONFIG["data-science"];
CATEGORY_HERO_CONFIG["Machine Learning"] = CATEGORY_HERO_CONFIG["machine-learning"];
CATEGORY_HERO_CONFIG["Data Analytics"] = CATEGORY_HERO_CONFIG["data-analytics"];
CATEGORY_HERO_CONFIG["Embedded Systems"] = CATEGORY_HERO_CONFIG["embedded-systems"];
CATEGORY_HERO_CONFIG["Web Development"] = CATEGORY_HERO_CONFIG["web-development"];

// ── Filter by Level / Tools Checkboxes (Image 1 Right Sidebar) ───────────────────
const LEVEL_SKILLS = [
  { label: "SQL", value: "SQL" },
  { label: "Excel", value: "Excel" },
  { label: "R", value: "R" },
  { label: "Python", value: "Python" },
  { label: "Tableau", value: "Tableau" },
  { label: "Power Bi", value: "Power Bi" },
  { label: "Numpy", value: "Numpy" },
  { label: "Pandas", value: "Pandas" },
  { label: "Scikit-Learn", value: "Scikit-Learn" },
  { label: "TensorFlow", value: "TensorFlow" },
  { label: "Docker", value: "Docker" },
  { label: "Git", value: "Git" },
];

// ── Default View Level Pills (Image 2) ──────────────────────────────────────────
const DEFAULT_LEVEL_FILTERS = [
  { label: "All Level", count: "500+", value: "all" },
  { label: "Beginner", count: "150+", value: "Beginner" },
  { label: "Intermediate", count: "250+", value: "Intermediate" },
  { label: "Advanced", count: "100+", value: "Advanced" },
];

// ── Pagination Arrow Components ─────────────────────────────────────────────────
const PaginationPrevArrow = ({ isGreen = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 47 47" fill="none">
    <rect
      x="0.5"
      y="0.5"
      width="46"
      height="46"
      rx="8"
      fill={isGreen ? "#3FAE68" : "#FFFFFF"}
      stroke="#3FAE68"
    />
    <g transform="rotate(180 23.5 24.5)">
      <path
        d="M31 24.501C31 23.7613 30.7287 23.0217 30.1874 22.4563L26.2596 18.3799C25.7708 17.8729 24.9795 17.8729 24.4907 18.3825C24.0032 18.8907 24.0044 19.7123 24.492 20.2205L27.3634 23.1998L17.2501 23.1998C16.56 23.1998 16 23.7821 16 24.4997C16 25.2172 16.56 25.7995 17.2501 25.7995L27.3634 25.7995L24.492 28.7788C24.0032 29.2858 24.0019 30.1086 24.4907 30.6182C24.9782 31.1264 25.7696 31.1277 26.2596 30.6195L30.1887 26.5418C30.73 25.9789 31 25.2406 31 24.4997L31 24.501Z"
        fill={isGreen ? "white" : "#3FAE68"}
      />
    </g>
  </svg>
);

const PaginationNextArrow = ({ isGreen = true }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 47 47" fill="none">
    <rect
      x="0.5"
      y="0.5"
      width="46"
      height="46"
      rx="8"
      fill={isGreen ? "#3FAE68" : "#FFFFFF"}
      stroke="#3FAE68"
    />
    <path
      d="M31 24.501C31 23.7613 30.7287 23.0217 30.1874 22.4563L26.2596 18.3799C25.7708 17.8729 24.9795 17.8729 24.4907 18.3825C24.0032 18.8907 24.0044 19.7123 24.492 20.2205L27.3634 23.1998L17.2501 23.1998C16.56 23.1998 16 23.7821 16 24.4997C16 25.2172 16.56 25.7995 17.2501 25.7995L27.3634 25.7995L24.492 28.7788C24.0032 29.2858 24.0019 30.1086 24.4907 30.6182C24.9782 31.1264 25.7696 31.1277 26.2596 30.6195L30.1887 26.5418C30.73 25.9789 31 25.2406 31 24.4997L31 24.501Z"
      fill={isGreen ? "white" : "#3FAE68"}
    />
  </svg>
);

// ── Resilient Category Normalization & Matching ──────────────────────────────────
const matchesCategory = (item, targetSlug) => {
  if (!targetSlug || targetSlug === "all") return true;

  const catStr = (item.category || "").toLowerCase();
  const slugStr = (item.categorySlug || "").toLowerCase();
  const titleStr = (item.title || "").toLowerCase();

  switch (targetSlug) {
    case "ai-genai":
      return (
        catStr.includes("ai") ||
        catStr.includes("genai") ||
        catStr.includes("generative") ||
        catStr.includes("agentic") ||
        slugStr.includes("ai") ||
        slugStr.includes("genai") ||
        titleStr.includes("ai") ||
        titleStr.includes("genai") ||
        titleStr.includes("yolo") ||
        titleStr.includes("u-net") ||
        titleStr.includes("llm") ||
        titleStr.includes("diffusion") ||
        titleStr.includes("plant monitoring")
      );
    case "data-science":
      return (
        catStr.includes("data science") ||
        slugStr.includes("data-science") ||
        catStr.includes("datascience") ||
        titleStr.includes("data science") ||
        titleStr.includes("k-means") ||
        titleStr.includes("clustering") ||
        titleStr.includes("recommendation")
      );
    case "machine-learning":
      return (
        catStr.includes("machine learning") ||
        slugStr.includes("machine-learning") ||
        catStr.includes("ml") ||
        titleStr.includes("machine learning") ||
        titleStr.includes("xgboost") ||
        titleStr.includes("random forest") ||
        titleStr.includes("lightgbm") ||
        titleStr.includes("sentiment analysis")
      );
    case "data-analytics":
      return (
        catStr.includes("data analytics") ||
        catStr.includes("data analysis") ||
        catStr.includes("analytics") ||
        catStr.includes("sql") ||
        slugStr.includes("data-analytics") ||
        slugStr.includes("data-analysis") ||
        titleStr.includes("data analysis") ||
        titleStr.includes("analytics") ||
        titleStr.includes("dashboard") ||
        titleStr.includes("power bi") ||
        titleStr.includes("powerbi") ||
        titleStr.includes("tableau") ||
        titleStr.includes("churn")
      );
    case "embedded-systems":
      return (
        catStr.includes("embedded") ||
        catStr.includes("iot") ||
        slugStr.includes("embedded") ||
        slugStr.includes("iot") ||
        titleStr.includes("embedded") ||
        titleStr.includes("iot") ||
        titleStr.includes("esp32") ||
        titleStr.includes("robot") ||
        titleStr.includes("sensor") ||
        titleStr.includes("plant monitoring")
      );
    case "web-development":
      return (
        catStr.includes("web") ||
        slugStr.includes("web") ||
        catStr.includes("frontend") ||
        catStr.includes("full-stack") ||
        catStr.includes("full stack") ||
        titleStr.includes("web") ||
        titleStr.includes("react") ||
        titleStr.includes("next.js") ||
        titleStr.includes("microservices") ||
        titleStr.includes("docker") ||
        titleStr.includes("chat application")
      );
    default:
      return (
        catStr.includes(targetSlug.toLowerCase().replace("-", " ")) ||
        slugStr.includes(targetSlug.toLowerCase())
      );
  }
};

// ── Skills / Level Filter Matching Helper ─────────────────────────────────────────
const matchesSkills = (item, selectedSkills) => {
  if (!selectedSkills || selectedSkills.length === 0) return true;
  const itemTools = Array.isArray(item.tools)
    ? item.tools.map((t) => t.toLowerCase())
    : [];
  const text = `${item.title || ""} ${item.description || ""} ${
    item.tech_stack || ""
  } ${item.category || ""}`.toLowerCase();

  return selectedSkills.some((skill) => {
    const s = skill.toLowerCase();
    return itemTools.includes(s) || text.includes(s);
  });
};

// ── Search Matching Helper ───────────────────────────────────────────────────────
const matchesSearch = (item, query) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const title = (item.title || "").toLowerCase();
  const desc =
    typeof item.description === "string" ? item.description.toLowerCase() : "";
  const cat = (item.category || "").toLowerCase();
  const tech = (item.tech_stack || "").toLowerCase();
  const tools = Array.isArray(item.tools)
    ? item.tools.join(" ").toLowerCase()
    : "";
  return (
    title.includes(q) ||
    desc.includes(q) ||
    cat.includes(q) ||
    tech.includes(q) ||
    tools.includes(q)
  );
};

// ── Sorting Helper ───────────────────────────────────────────────────────────────
const sortProjects = (list, sortBy) => {
  const cloned = [...list];
  if (sortBy === "oldest") {
    return cloned.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  }
  if (sortBy === "popular") {
    const getNum = (v) => {
      if (typeof v === "number") return v;
      if (!v) return 0;
      const str = String(v).replace(/[^0-9.]/g, "");
      const val = parseFloat(str) || 0;
      return String(v).toLowerCase().includes("k") ? val * 1000 : val;
    };
    return cloned.sort(
      (a, b) => getNum(b.likes || b.views) - getNum(a.likes || a.views)
    );
  }
  // Default: latest
  return cloned.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
};

// =================================================================================
// MAIN COMPONENT
// =================================================================================
const ProjectsPage = () => {
  // State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Default state level filter (Image 2)
  const [defaultLevel, setDefaultLevel] = useState("all");

  // Pagination states
  const [filteredGridPage, setFilteredGridPage] = useState(1);
  const filteredPageSize = 9; // 3x3 grid as shown in Image 1

  const [featuredPage, setFeaturedPage] = useState(1);
  const featuredPageSize = 2; // 2 cards as shown in Image 2

  const [defaultAllPage, setDefaultAllPage] = useState(1);
  const defaultAllPageSize = 6; // 6 cards (3x2 grid) as shown in Image 2

  // API hooks
  const { data: apiProjects, isLoading } = useProjectList();

// Helper to safely resolve project image URL or fallback
const resolveProjectImage = (img) => {
  if (!img || typeof img !== "string") return robotDashboardImg;
  const trimmed = img.trim();
  if (!trimmed) return robotDashboardImg;
  if (trimmed.includes("prephq.theiotacademy.co/project/wp-content/uploads/")) {
    return robotDashboardImg;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

// Helper to safely format card description and remove raw Gutenberg/HTML artifacts
const formatCardDescription = (desc) => {
  if (!desc || typeof desc !== "string") return "";
  // Strip WordPress Gutenberg comment markers like <!-- wp:paragraph -->
  let text = desc.replace(/<!--[\s\S]*?-->/g, "");
  // Replace closing paragraphs and linebreaks with spaces
  text = text.replace(/<\/p>|<br\s*\/?>/gi, " ");
  // Strip any remaining HTML tags so raw tags aren't printed as literal text
  text = text.replace(/<[^>]*>/g, "");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
  // Normalize extra whitespace
  return text.replace(/\s+/g, " ").trim();
};

  // Normalize API data or map to unified item schema
  const normalizedApiList = useMemo(() => {
    if (apiProjects && Array.isArray(apiProjects) && apiProjects.length > 0) {
      return apiProjects.map((item) => ({
        id: item.ID || item.id,
        title: item.post_title || item.title || "Project Title",
        slug: item.post_name || item.slug || String(item.ID),
        description:
          typeof item.post_excerpt === "string" && item.post_excerpt.trim()
            ? item.post_excerpt.trim()
            : typeof item.description === "string" && item.description.trim()
            ? item.description.trim()
            : typeof item.project_description === "string" && item.project_description.trim()
            ? item.project_description.trim()
            : typeof item.post_content === "string" && item.post_content.trim()
            ? item.post_content.trim()
            : "Hands-on engineering project.",
        category: item.category_name || "Data Science",
        categorySlug: item.category_slug || "data-science",
        level: item.level || "Intermediate",
        author:
          item.author_name ||
          (typeof item.author === "string" ? item.author : item.author?.name) ||
          "prepHQ",
        authorImage: item.author_image || authorAvatarImg,
        date: item.post_date
          ? new Date(item.post_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "05 Aug, 2025",
        views: item.views ? `${item.views}K` : "208K",
        likes: item.likes ? `${item.likes}K` : "120K",
        tools: item.tech_stack
          ? item.tech_stack.split(",").map((s) => s.trim())
          : ["Python", "SQL"],
        image: resolveProjectImage(item.featured_image),
        is_featured: Boolean(item.is_featured),
      }));
    }
    return null;
  }, [apiProjects]);

  // Combined master list: API projects given precedence, complemented by catalogue
  const masterProjectList = useMemo(() => {
    const apiList = normalizedApiList || [];
    const apiSlugs = new Set(apiList.map((p) => p.slug));
    const sampleItems = SAMPLE_ALL_PROJECTS.filter((s) => !apiSlugs.has(s.slug));
    return [...apiList, ...sampleItems];
  }, [normalizedApiList]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim().toLowerCase());
    setFilteredGridPage(1);
    setFeaturedPage(1);
    setDefaultAllPage(1);
  };

  // Clear single search query
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setFilteredGridPage(1);
  };

  // Toggle skill checkbox in "Filter by Level"
  const handleSkillToggle = (skillValue) => {
    setSelectedSkills((prev) => {
      const exists = prev.includes(skillValue);
      if (exists) {
        return prev.filter((s) => s !== skillValue);
      } else {
        return [...prev, skillValue];
      }
    });
    setFilteredGridPage(1);
  };

  // Reset all filters
  const handleClearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedSkills([]);
    setSearchInput("");
    setSearchQuery("");
    setDefaultLevel("all");
    setFilteredGridPage(1);
  };

  // ── Determine Mode: Filtered (Image 1) vs Default (Image 2) ───────────────────
  // Whenever category !== 'all' or search or skill filter is active,
  // we enter the unified Filtered Mode matching Image 1!
  const isFilteredMode =
    selectedCategory !== "all" || searchQuery !== "" || selectedSkills.length > 0;

  // ── Master Filtered List for Filtered Mode ──────────────────────────────────────
  const filteredProjects = useMemo(() => {
    return masterProjectList.filter((item) => {
      if (!matchesCategory(item, selectedCategory)) return false;
      if (!matchesSkills(item, selectedSkills)) return false;
      if (!matchesSearch(item, searchQuery)) return false;
      return true;
    });
  }, [masterProjectList, selectedCategory, selectedSkills, searchQuery]);

  // Sorted list for Filtered Mode
  const sortedFilteredProjects = useMemo(() => {
    return sortProjects(filteredProjects, sortBy);
  }, [filteredProjects, sortBy]);

  // Filtered Pagination calculations
  const totalFilteredCount = sortedFilteredProjects.length;
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredCount / filteredPageSize));
  const paginatedFilteredProjects = useMemo(() => {
    const start = (filteredGridPage - 1) * filteredPageSize;
    return sortedFilteredProjects.slice(start, start + filteredPageSize);
  }, [sortedFilteredProjects, filteredGridPage, filteredPageSize]);

  // Result count text calculation
  const startIdx = totalFilteredCount === 0 ? 0 : (filteredGridPage - 1) * filteredPageSize + 1;
  const endIdx = Math.min(filteredGridPage * filteredPageSize, totalFilteredCount);
  const activeCategoryObj =
    CATEGORIES.find((c) => c.slug === selectedCategory) || CATEGORIES[0];
  const activeCategoryName = activeCategoryObj.name;

  // Determine if a category hero configuration exists for the active category
  const activeCategoryHero =
    selectedCategory !== "all"
      ? CATEGORY_HERO_CONFIG[selectedCategory] ||
        CATEGORY_HERO_CONFIG[activeCategoryName] ||
        null
      : null;

  // ── Default Mode Lists (Image 2) ───────────────────────────────────────────────
  const defaultFeaturedList = useMemo(() => {
    const apiFeatured = (normalizedApiList || []).filter((p) => p.is_featured);
    if (apiFeatured.length > 0) {
      return apiFeatured;
    }
    return SAMPLE_FEATURED_PROJECTS;
  }, [normalizedApiList]);

  const totalFeaturedPages = Math.max(
    1,
    Math.ceil(defaultFeaturedList.length / featuredPageSize)
  );
  const paginatedFeatured = useMemo(() => {
    const start = (featuredPage - 1) * featuredPageSize;
    return defaultFeaturedList.slice(start, start + featuredPageSize);
  }, [defaultFeaturedList, featuredPage, featuredPageSize]);

  const defaultAllList = useMemo(() => {
    return masterProjectList.filter((item) => {
      if (defaultLevel !== "all") {
        if ((item.level || "").toLowerCase() !== defaultLevel.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [masterProjectList, defaultLevel]);

  const totalDefaultAllPages = Math.max(
    4,
    Math.ceil(defaultAllList.length / defaultAllPageSize)
  );
  const paginatedDefaultAll = useMemo(() => {
    const start = (defaultAllPage - 1) * defaultAllPageSize;
    return defaultAllList.slice(start, start + defaultAllPageSize);
  }, [defaultAllList, defaultAllPage, defaultAllPageSize]);

  // Visible skills in sidebar (7 default, or full list when expanded)
  const visibleSkills = showMoreSkills ? LEVEL_SKILLS : LEVEL_SKILLS.slice(0, 7);

  return (
    <div className="projects-page-wrapper">
      {/* =========================================================
          HERO SECTION (Displayed only in Default View - Image 2)
          ========================================================= */}
      {!isFilteredMode && (
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
                  <div className="hero-stat-item">
                    <div className="stat-svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M16.25 8.75C16.94 8.75 17.5 9.30875 17.5 10C17.5 10.6912 16.94 11.25 16.25 11.25H6.25C5.56 11.25 5 10.6912 5 10C5 9.30875 5.56 8.75 6.25 8.75H16.25ZM29.54 25.93C29.3088 26.3312 28.8888 26.5563 28.455 26.5563C28.2437 26.5563 28.0288 26.5025 27.8325 26.3888L26.6112 25.685C25.855 26.5 24.87 27.0925 23.75 27.3487V28.75C23.75 29.4412 23.19 30 22.5 30C21.81 30 21.25 29.4412 21.25 28.75V27.3487C20.13 27.0925 19.1438 26.5013 18.3888 25.685L17.1675 26.3888C16.9713 26.5025 16.7563 26.5563 16.545 26.5563C16.1125 26.5563 15.6912 26.3312 15.46 25.93C15.1163 25.3312 15.3212 24.5675 15.92 24.2237L17.1488 23.5163C16.9875 22.9937 16.8763 22.45 16.8763 21.875C16.8763 21.3 16.9875 20.7563 17.1488 20.2337L15.92 19.5263C15.3212 19.1825 15.1163 18.4175 15.46 17.82C15.805 17.2212 16.5713 17.0163 17.1675 17.3612L18.3888 18.065C19.145 17.25 20.13 16.6575 21.25 16.4013V15C21.25 14.3088 21.81 13.75 22.5 13.75C23.19 13.75 23.75 14.3088 23.75 15V16.4013C24.87 16.6575 25.8562 17.2487 26.6112 18.065L27.8325 17.3612C28.43 17.0163 29.1938 17.2225 29.54 17.82C29.8838 18.4187 29.6787 19.1825 29.08 19.5263L27.8512 20.2337C28.0125 20.7563 28.1238 21.3 28.1238 21.875C28.1238 22.45 28.0125 22.9937 27.8512 23.5163L29.08 24.2237C29.6787 24.5675 29.8838 25.3325 29.54 25.93ZM25.625 21.875C25.625 20.1513 24.2225 18.75 22.5 18.75C20.7775 18.75 19.375 20.1513 19.375 21.875C19.375 23.5987 20.7775 25 22.5 25C24.2225 25 25.625 23.5987 25.625 21.875ZM13.75 27.5H6.25C4.1825 27.5 2.5 25.8175 2.5 23.75V8.75C2.5 6.6825 4.1825 5 6.25 5H7.5C8.19 5 8.75 4.44125 8.75 3.75C8.75 3.05875 9.31125 2.5 10 2.5H12.5C13.1888 2.5 13.75 3.06 13.75 3.75C13.75 4.44 14.31 5 15 5H16.25C18.3175 5 20 6.6825 20 8.75V10C20 10.6912 20.56 11.25 21.25 11.25C21.94 11.25 22.5 10.6912 22.5 10V8.75C22.5 5.30375 19.6963 2.5 16.25 2.5H16.0363C15.52 1.045 14.13 0 12.5 0H10C8.37 0 6.98 1.045 6.46375 2.5H6.25C2.80375 2.5 0 5.30375 0 8.75V23.75C0 27.1963 2.80375 30 6.25 30H13.75C14.44 30 15 29.4412 15 28.75C15 28.0588 14.44 27.5 13.75 27.5ZM13.75 13.75H6.25C5.56 13.75 5 14.3088 5 15C5 15.6912 5.56 16.25 6.25 16.25H13.75C14.44 16.25 15 15.6912 15 15C15 14.3088 14.44 13.75 13.75 13.75ZM11.25 21.25C11.94 21.25 12.5 20.6912 12.5 20C12.5 19.3088 11.94 18.75 11.25 18.75H6.25C5.56 18.75 5 19.3088 5 20C5 20.6912 5.56 21.25 6.25 21.25H11.25Z"
                          fill="#57CC99"
                        />
                      </svg>
                    </div>
                    <span className="stat-value">500+</span>
                    <span className="stat-label">Projects</span>
                  </div>

                  <div className="stat-divider" />

                  <div className="hero-stat-item">
                    <div className="stat-svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M10 0H6.25C2.80375 0 0 2.80375 0 6.25V10C0 11.3787 1.12125 12.5 2.5 12.5H10C11.3787 12.5 12.5 11.3787 12.5 10V2.5C12.5 1.12125 11.3787 0 10 0ZM2.5 10V6.25C2.5 4.1825 4.1825 2.5 6.25 2.5H10V10H2.5ZM17.5 12.5H25C26.3787 12.5 27.5 11.3787 27.5 10V6.25C27.5 2.80375 24.6963 0 21.25 0H17.5C16.1213 0 15 1.12125 15 2.5V10C15 11.3787 16.1213 12.5 17.5 12.5ZM17.5 2.5H21.25C23.3175 2.5 25 4.1825 25 6.25V10H17.5V2.5ZM10 15H2.5C1.12125 15 0 16.1213 0 17.5V21.25C0 24.6963 2.80375 27.5 6.25 27.5H10C11.3787 27.5 12.5 26.3787 12.5 25V17.5C12.5 16.1213 11.3787 15 10 15ZM6.25 25C4.1825 25 2.5 23.3175 2.5 21.25V17.5H10V25H6.25ZM29.6338 27.8662L26.4587 24.6912C27.1138 23.7025 27.5 22.5212 27.5 21.25C27.5 17.8037 24.6963 15 21.25 15C17.8037 15 15 17.8037 15 21.25C15 24.6963 17.8037 27.5 21.25 27.5C22.5212 27.5 23.7025 27.1138 24.6912 26.4587L27.8662 29.6338C28.11 29.8775 28.43 30 28.75 30C29.07 30 29.39 29.8775 29.6338 29.6338C30.1225 29.145 30.1225 28.355 29.6338 27.8662ZM17.5 21.25C17.5 19.1825 19.1825 17.5 21.25 17.5C23.3175 17.5 25 19.1825 25 21.25C25 23.3175 23.3175 25 21.25 25C19.1825 25 17.5 23.3175 17.5 21.25Z"
                          fill="#E5AA00"
                        />
                      </svg>
                    </div>
                    <span className="stat-value">10+</span>
                    <span className="stat-label">Domains</span>
                  </div>

                  <div className="stat-divider" />

                  <div className="hero-stat-item">
                    <div className="stat-svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="30"
                        viewBox="0 0 23 30"
                        fill="none"
                      >
                        <path
                          d="M21.9942 15.002C21.9697 14.5356 21.7092 14.1129 21.3028 13.8824C21.1883 13.817 18.4473 12.2992 15.4171 13.0138C13.6593 13.4297 12.042 14.4265 11.086 15.1098C10.1301 14.4279 8.51271 13.4297 6.7549 13.0138C3.72204 12.3005 0.985096 13.817 0.869182 13.8824C0.462799 14.1129 0.202333 14.5356 0.177787 15.002C-0.0894983 20.3627 -0.0554054 23.4924 0.280064 24.3038C1.53194 27.3176 8.60135 29.3918 10.7383 29.955C10.8515 29.985 10.9687 30 11.086 30C11.2033 30 11.3206 29.985 11.4338 29.955C13.5707 29.3918 20.6401 27.3176 21.892 24.3024C22.2274 23.491 22.2615 20.3614 21.9942 15.002ZM2.82745 23.3397C2.66926 22.6919 2.72108 19.1736 2.86154 15.9716C3.59794 15.6975 4.85391 15.3661 6.12624 15.6675C7.59358 16.0139 9.01182 16.9603 9.72231 17.4894V26.8185C6.44807 25.7807 3.22565 24.2874 2.82745 23.3397ZM19.3718 23.2579C18.9505 24.2738 15.7253 25.7793 12.4497 26.8185V17.4894C13.1602 16.9603 14.5784 16.0139 16.0458 15.6675C17.3195 15.3661 18.5754 15.6961 19.3105 15.9716C19.4523 19.1736 19.5068 22.6851 19.3732 23.2592L19.3718 23.2579Z"
                          fill="#57CC99"
                        />
                        <path
                          d="M11.0948 11.8983C14.8314 11.8983 16.926 9.7709 16.9955 5.92527C16.9314 2.18328 14.7809 0.0231829 11.0785 0C7.39374 0.0231829 5.17773 2.22692 5.17773 5.973C5.17773 9.62362 7.18373 11.8983 11.0948 11.8983ZM11.0771 2.7274C13.2454 2.74103 14.23 3.74199 14.2681 5.9239C14.2272 8.24765 13.3313 9.15723 11.0948 9.17087C8.85017 9.15723 7.95286 8.2531 7.90513 5.94845C7.9515 3.67517 8.87745 2.74103 11.0771 2.7274Z"
                          fill="#57CC99"
                        />
                      </svg>
                    </div>
                    <span className="stat-value">50k+</span>
                    <span className="stat-label">Learners</span>
                  </div>

                  <div className="stat-divider" />

                  <div className="hero-stat-item">
                    <div className="stat-svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="31"
                        height="30"
                        viewBox="0 0 31 30"
                        fill="none"
                      >
                        <path
                          d="M30.7826 11.1109C30.5184 10.2701 29.9904 9.53659 29.2769 9.01892C28.5633 8.50124 27.702 8.22684 26.8204 8.23631H21.1761L19.4617 2.89524C19.1921 2.05452 18.6624 1.3211 17.9489 0.800744C17.2353 0.280392 16.3749 0 15.4917 0C14.6085 0 13.7481 0.280392 13.0345 0.800744C12.321 1.3211 11.7913 2.05452 11.5217 2.89524L9.80734 8.23631H4.16303C3.2842 8.23756 2.42825 8.51638 1.71743 9.03296C1.00661 9.54953 0.477286 10.2774 0.205057 11.1127C-0.0671712 11.9479 -0.0683761 12.8478 0.201615 13.6838C0.471605 14.5197 0.998981 15.249 1.70841 15.7675L6.30241 19.1251L4.55576 24.532C4.2735 25.3706 4.26992 26.2779 4.54557 27.1187C4.82122 27.9595 5.36132 28.6887 6.08537 29.1977C6.79702 29.723 7.65942 30.0044 8.54406 29.9999C9.4287 29.9955 10.2882 29.7055 10.9946 29.1731L15.4917 25.8647L19.9901 29.1693C20.7005 29.6915 21.5582 29.9752 22.44 29.9795C23.3218 29.9838 24.1823 29.7085 24.8977 29.1932C25.6131 28.6778 26.1467 27.949 26.4216 27.1114C26.6965 26.2739 26.6986 25.3708 26.4276 24.532L24.681 19.1251L29.2802 15.7675C29.9977 15.2556 30.5313 14.5263 30.8019 13.6876C31.0725 12.8489 31.0657 11.9454 30.7826 11.1109ZM27.7557 13.682L22.4021 17.5935C22.1822 17.7538 22.0186 17.9795 21.9346 18.2383C21.8506 18.4971 21.8505 18.7758 21.9344 19.0347L23.9692 25.3236C24.0721 25.6426 24.0712 25.9859 23.9666 26.3044C23.8621 26.6228 23.6591 26.8999 23.3871 27.0958C23.115 27.2917 22.7878 27.3963 22.4525 27.3946C22.1172 27.3929 21.7911 27.285 21.521 27.0863L16.2565 23.2122C16.0348 23.0494 15.7668 22.9616 15.4917 22.9616C15.2166 22.9616 14.9486 23.0494 14.7269 23.2122L9.4624 27.0863C9.1925 27.2876 8.86546 27.3978 8.5287 27.4009C8.19194 27.4039 7.86295 27.2997 7.58944 27.1033C7.31593 26.9069 7.11211 26.6285 7.00753 26.3085C6.90295 25.9885 6.90304 25.6435 7.00779 25.3236L9.04899 19.0347C9.13286 18.7758 9.1328 18.4971 9.04882 18.2383C8.96483 17.9795 8.80122 17.7538 8.58133 17.5935L3.22769 13.682C2.95807 13.4846 2.75774 13.2072 2.6553 12.8893C2.55286 12.5713 2.55356 12.2292 2.6573 11.9116C2.76103 11.5941 2.96249 11.3175 3.23291 11.1213C3.50333 10.925 3.82887 10.8193 4.16303 10.819H10.7517C11.0252 10.819 11.2917 10.7322 11.5127 10.5712C11.7337 10.4101 11.8979 10.1831 11.9816 9.92282L13.9841 3.68427C14.0868 3.36502 14.2883 3.08661 14.5595 2.88911C14.8306 2.69161 15.1575 2.5852 15.493 2.5852C15.8285 2.5852 16.1554 2.69161 16.4265 2.88911C16.6977 3.08661 16.8991 3.36502 17.0019 3.68427L19.0044 9.92282C19.0881 10.1831 19.2523 10.4101 19.4733 10.5712C19.6943 10.7322 19.9608 10.819 20.2343 10.819H26.823C27.1571 10.8193 27.4827 10.925 27.7531 11.1213C28.0235 11.3175 28.225 11.5941 28.3287 11.9116C28.4324 12.2292 28.4331 12.5713 28.3307 12.8893C28.2283 13.2072 28.0279 13.4846 27.7583 13.682H27.7557Z"
                          fill="#E5AA00"
                        />
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
      )}

      {/* =========================================================
          CATEGORY-SPECIFIC HERO SECTION
          Rendered dynamically for each category via CATEGORY_HERO_CONFIG.
          Completely hidden when "All Projects" is selected or when no config exists.
          ========================================================= */}
      {activeCategoryHero && (
        <section
          className={`category-hero-section ${activeCategoryHero.themeClass || ""}`}
          aria-label={`${activeCategoryHero.accent} ${activeCategoryHero.suffix} Overview`}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              {/* Left Column: Heading, Description, 4 Badges */}
              <div className="col-lg-8 col-md-12">
                <div className="category-hero-content">
                  <h1 className="category-hero-title">
                    <span className="category-title-mint">
                      {activeCategoryHero.accent}
                    </span>{" "}
                    {activeCategoryHero.suffix}
                  </h1>
                  <p className="category-hero-description">
                    {activeCategoryHero.description}
                  </p>
                  <div className="category-hero-badges" role="list">
                    {activeCategoryHero.badges.map((badge, idx) => {
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          key={idx}
                          className="category-hero-badge"
                          role="listitem"
                        >
                          {BadgeIcon && (
                            <BadgeIcon
                              className="hero-badge-icon"
                              size={16}
                              aria-hidden="true"
                            />
                          )}
                          <span>{badge.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Illustration */}
              <div className="col-lg-4 col-md-12">
                <div className="category-hero-media">
                  <img
                    src={activeCategoryHero.image}
                    alt={activeCategoryHero.alt}
                    className="category-hero-illustration"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          MAIN PROJECT CONTAINER
          ========================================================= */}
      <section
        className={`main-project-container ${
          isFilteredMode ? "filtered-mode-active" : ""
        }`}
      >
        <div className="container">
          {/* ── 1. Top Horizontal Category Filter Tabs (Always Present) ───── */}
          <div className="category-filter-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className={`category-tab-btn ${
                  selectedCategory === cat.slug ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setFilteredGridPage(1);
                  setFeaturedPage(1);
                  setDefaultAllPage(1);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* ── 2. FILTERED MODE VIEW (Image 1 - Target Design) ───────────── */}
          {isFilteredMode ? (
            <div className="row g-4">
              {/* Left Column: Result Header + 3x3 Project Grid + Pagination */}
              <div className="col-lg-8 col-md-12">
                {/* Result Header Row: Count on Left, Sort Dropdown on Right */}
                <div className="target-result-header">
                  <div className="target-result-count">
                    Showing {startIdx}–{endIdx} of{" "}
                    {totalFilteredCount >= 9
                      ? activeCategoryObj.slug === "ai-genai"
                        ? "150+"
                        : `${totalFilteredCount}+`
                      : totalFilteredCount}{" "}
                    {activeCategoryName !== "All Projects"
                      ? `${activeCategoryName} `
                      : ""}
                    projects
                  </div>

                  <div className="target-sort-wrapper">
                    <span className="target-sort-label">Sort By:</span>
                    <div className="sort-select-container">
                      <select
                        className="target-sort-select"
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setFilteredGridPage(1);
                        }}
                      >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Popular</option>
                      </select>
                      <FiChevronDown className="sort-chevron-icon" />
                    </div>
                  </div>
                </div>

                {/* Main 3x3 Project Grid */}
                {paginatedFilteredProjects.length > 0 ? (
                  <div className="target-project-grid">
                    {paginatedFilteredProjects.map((item) => (
                      <div className="target-project-card" key={item.id}>
                        {/* Thumbnail */}
                        <div className="target-card-thumb-wrapper">
                          <img
                            src={item.image || robotDashboardImg}
                            alt={item.title}
                            className="target-card-thumb"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = robotDashboardImg;
                            }}
                          />
                        </div>

                        {/* Card Body */}
                        <div className="target-card-body">
                          {/* Author & Level row */}
                          <div className="target-card-author-row">
                            <div className="target-card-author">
                              <img
                                src={item.authorImage || authorAvatarImg}
                                alt={item.author || "prepHQ"}
                                className="author-avatar"
                              />
                              <span className="author-name-text">
                                {item.author || "prepHQ"}
                              </span>
                            </div>

                            <div className="target-card-level-badge">
                              <FiUser size={12} className="level-badge-icon" />
                              <span>{item.level || "Intermediate"}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="target-card-title">{item.title}</h3>

                          {/* Metadata row: Date + Likes */}
                          <div className="target-card-meta-row">
                            <div className="meta-stat-item">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 17 15"
                                fill="none"
                              >
                                <path
                                  d="M17 14.6288C16.867 14.9181 16.6395 15.0004 16.3317 15C12.1039 14.9932 7.87605 14.9915 3.64824 14.9951C3.19279 14.9951 3.02028 14.8211 3.02028 14.3609V12.9959H3.22649C6.61288 12.9959 9.99913 12.997 13.3852 12.9991C13.8788 12.9991 14.2868 12.8393 14.6398 12.4961C15.6079 11.5549 16.3135 10.4369 16.8625 9.21124C16.9069 9.11644 16.9512 9.02387 16.9982 8.93041L17 14.6288Z"
                                  fill="#37AB79"
                                />
                                <path
                                  d="M17 2.99834H3.0358C3.02918 2.95931 3.02474 2.91993 3.0225 2.8804C3.0225 2.43046 3.02028 1.98096 3.0225 1.53101C3.0225 1.20479 3.22649 1.00051 3.55112 0.999624C4.30503 0.999624 5.05539 0.999624 5.80797 0.999624H6.0102C6.0102 0.83629 6.0102 0.683194 6.0102 0.530097C6.0133 0.218562 6.21952 4.25311e-05 6.50734 4.25311e-05C6.79515 4.25311e-05 7.00093 0.218117 7.00536 0.529651C7.00536 0.679188 7.00536 0.82828 7.00536 0.988497H9.49548C9.49548 0.832285 9.49548 0.676963 9.49548 0.524756C9.49947 0.215891 9.70924 -0.00262777 9.9975 4.25311e-05C10.2858 0.00271283 10.4853 0.217227 10.4902 0.51808C10.4933 0.672513 10.4902 0.826945 10.4902 0.990278H13.0158C13.0158 0.842076 13.0158 0.68898 13.0158 0.536328C13.0189 0.222122 13.2198 0.00226778 13.5067 4.25311e-05C13.8016 -0.00351787 14.0083 0.216781 14.0114 0.539887C14.0114 0.684083 14.0114 0.82828 14.0114 0.999624H14.1888C14.9081 0.999624 15.6274 1.00941 16.3463 0.994728C16.6519 0.988497 16.8714 1.08374 16.9982 1.3659L17 2.99834Z"
                                  fill="#37AB79"
                                />
                                <path
                                  d="M16.9778 4.01039C16.9516 5.14276 16.7786 6.26689 16.4634 7.35449C16.0102 8.90193 15.2993 10.3118 14.2083 11.5135C14.2042 11.5174 14.2004 11.5216 14.1968 11.5259C13.9249 11.882 13.5866 12.011 13.1231 12.0088C8.94646 11.9901 4.76979 11.9972 0.592684 11.9995C0.370946 11.9995 0.187347 11.947 0.0698252 11.7471C0.0117753 11.651 -0.0111218 11.5375 0.00506168 11.4263C0.0212452 11.315 0.0755006 11.2129 0.158521 11.1374C1.62199 9.69589 2.40739 7.90724 2.78612 5.92054C2.89655 5.3393 2.92803 4.74338 2.99589 4.15414C3.00076 4.10963 3.00476 4.06513 3.01052 4.01217L16.9778 4.01039Z"
                                  fill="#37AB79"
                                />
                              </svg>
                              <span>{item.date}</span>
                            </div>

                            <div className="meta-stat-item likes-stat">
                              <IoHeartOutline className="meta-icon-green" size={15} />
                              <span className="likes-value">{item.likes}</span>
                            </div>
                          </div>

                          {/* Read More button */}
                          <div className="target-card-footer">
                            <Link
                              to={`/projects-details/${item.slug}`}
                              state={{ id: item.id }}
                              className="target-btn-read-more"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single Clean Empty State */
                  <div className="target-empty-state">
                    <p className="empty-state-text">
                      No projects found for selected filters.
                    </p>
                    <button
                      type="button"
                      className="btn-clear-filters"
                      onClick={handleClearAllFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination (operates on the filtered result set) */}
                {totalFilteredPages > 1 && (
                  <div className="projects-pagination">
                    <button
                      type="button"
                      className={`page-btn page-arrow ${
                        filteredGridPage <= 1 ? "disabled" : ""
                      }`}
                      onClick={() =>
                        setFilteredGridPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={filteredGridPage <= 1}
                      aria-label="Previous Page"
                    >
                      <PaginationPrevArrow isGreen={filteredGridPage > 1} />
                    </button>

                    {[...Array(Math.min(totalFilteredPages, 4))].map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={`target-page-${p}`}
                          type="button"
                          className={`page-btn ${
                            filteredGridPage === p ? "active" : ""
                          }`}
                          onClick={() => setFilteredGridPage(p)}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      className={`page-btn page-arrow ${
                        filteredGridPage >= totalFilteredPages ? "disabled" : ""
                      }`}
                      onClick={() =>
                        setFilteredGridPage((prev) =>
                          Math.min(totalFilteredPages, prev + 1)
                        )
                      }
                      disabled={filteredGridPage >= totalFilteredPages}
                      aria-label="Next Page"
                    >
                      <PaginationNextArrow
                        isGreen={filteredGridPage < totalFilteredPages}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Search + Filter by Level + EICT Banner */}
              <div className="col-lg-4 col-md-12">
                <aside className="projects-sidebar">
                  {/* Search Box */}
                  <form
                    className="sidebar-search-box"
                    onSubmit={handleSearchSubmit}
                  >
                    <input
                      type="text"
                      className="sidebar-search-input"
                      placeholder="Search here"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="sidebar-search-clear"
                        onClick={handleClearSearch}
                        title="Clear search"
                      >
                        <FiX size={15} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="sidebar-search-btn"
                      aria-label="Search"
                    >
                      <FiSearch size={18} />
                    </button>
                  </form>

                  {/* Filter by Level (Checkboxes matching Image 1) */}
                  <div className="sidebar-filter-section">
                    <h3 className="sidebar-filter-title">Filter by Level</h3>
                    <div className="level-filter-card">
                      <div className="level-checkbox-list">
                        {visibleSkills.map((skill) => (
                          <label
                            key={skill.value}
                            className="level-checkbox-label"
                          >
                            <input
                              type="checkbox"
                              className="level-checkbox-input"
                              checked={selectedSkills.includes(skill.value)}
                              onChange={() => handleSkillToggle(skill.value)}
                            />
                            <span className="level-checkbox-text">
                              {skill.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn-show-more-toggle"
                        onClick={() => setShowMoreSkills(!showMoreSkills)}
                      >
                        {showMoreSkills ? "Show Less ∧" : "Show More ∨"}
                      </button>
                    </div>
                  </div>

                  {/* Promotional Banner: IIT Roorkee */}
                  <div className="sidebar-ad-card">
                    <img
                      src={adIitrImg}
                      alt="Learn Data Science & AI - IIT Roorkee"
                      className="sidebar-ad-img"
                    />
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            /* ── 3. DEFAULT MODE VIEW (Image 2 - All Projects View) ───────────── */
            <div className="row g-4">
              {/* Left Column (8 cols): Featured + All Projects Sections */}
              <div className="col-lg-8 col-md-12">
                {/* 3.1 FEATURED PROJECTS SECTION */}
                <div className="section-header-block">
                  <h2 className="section-main-title">Featured Projects</h2>
                  <p className="section-sub-title">
                    Handpicked Projects By Our Experts
                  </p>
                </div>

                <div className="featured-projects-list">
                  {paginatedFeatured.map((item) => (
                    <div className="featured-project-card" key={item.id}>
                      <div className="featured-card-thumb-wrapper">
                        <img
                          src={item.image || robotDashboardImg}
                          alt={item.title}
                          className="featured-card-thumb"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = robotDashboardImg;
                          }}
                        />
                      </div>

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
                              <span className="author-name-text">
                                {item.author || "prepHQ"}
                              </span>
                            </div>
                          </div>

                          <p className="featured-card-desc">
                            {formatCardDescription(item.description)}
                          </p>

                          <div className="featured-card-tags">
                            <span className="tag-badge">
                              {item.category || "Data Science"}
                            </span>
                            <span className="tag-badge">
                              {item.level || "Intermediate"}
                            </span>
                          </div>
                        </div>

                        <div className="featured-card-footer">
                          <Link
                            to={`/projects-details/${item.slug}`}
                            state={{ id: item.id }}
                            className="btn-read-more"
                          >
                            Read More
                          </Link>

                          <div className="featured-meta-stats">
                            <div className="meta-stat-item">
                              <FiCalendar />
                              <span>{item.date}</span>
                            </div>
                            <div className="meta-stat-item">
                              <FiEye />
                              <span>{item.views}</span>
                            </div>
                            <div className="meta-stat-item">
                              <IoHeartOutline
                                className="meta-icon-green"
                                size={15}
                              />
                              <span>{item.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured Pagination */}
                <div className="projects-pagination">
                  <button
                    type="button"
                    className={`page-btn page-arrow ${
                      featuredPage <= 1 ? "disabled" : ""
                    }`}
                    onClick={() => setFeaturedPage((prev) => Math.max(1, prev - 1))}
                    disabled={featuredPage <= 1}
                    aria-label="Previous Featured Page"
                  >
                    <PaginationPrevArrow isGreen={featuredPage > 1} />
                  </button>

                  {[...Array(Math.min(totalFeaturedPages, 4))].map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={`feat-page-${p}`}
                        type="button"
                        className={`page-btn ${
                          featuredPage === p ? "active" : ""
                        }`}
                        onClick={() => setFeaturedPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`page-btn page-arrow ${
                      featuredPage >= totalFeaturedPages ? "disabled" : ""
                    }`}
                    onClick={() =>
                      setFeaturedPage((prev) =>
                        Math.min(totalFeaturedPages, prev + 1)
                      )
                    }
                    disabled={featuredPage >= totalFeaturedPages}
                    aria-label="Next Featured Page"
                  >
                    <PaginationNextArrow
                      isGreen={featuredPage < totalFeaturedPages}
                    />
                  </button>
                </div>

                {/* 3.2 ALL PROJECTS SECTION */}
                <div className="section-header-block mt-4">
                  <h2 className="section-main-title">All Projects</h2>
                  <p className="section-sub-title">
                    Browse All Projects Across Different Domains
                  </p>
                </div>

                <div className="all-projects-grid">
                  {paginatedDefaultAll.map((item) => (
                    <div className="grid-project-card" key={item.id}>
                      <div className="grid-card-thumb-wrapper">
                        <img
                          src={item.image || robotDashboardImg}
                          alt={item.title}
                          className="grid-card-thumb"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = robotDashboardImg;
                          }}
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
                            <span className="author-name-text">
                              {item.author || "prepHQ"}
                            </span>
                          </div>

                          <div className="grid-card-level-badge">
                            <FiUser size={11} />
                            <span>{item.level || "Intermediate"}</span>
                          </div>
                        </div>

                        <h4 className="grid-card-title">{item.title}</h4>

                        <div className="grid-card-meta-row">
                          <div className="meta-stat-item">
                            <FiCalendar />
                            <span>{item.date}</span>
                          </div>

                          <div className="meta-stat-item">
                            <IoHeartOutline
                              className="meta-icon-green"
                              size={15}
                            />
                            <span>{item.likes}</span>
                          </div>
                        </div>

                        <Link
                          to={`/projects-details/${item.slug}`}
                          state={{ id: item.id }}
                          className="grid-card-btn-read-more"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* All Projects Pagination */}
                <div className="projects-pagination">
                  <button
                    type="button"
                    className={`page-btn page-arrow ${
                      defaultAllPage <= 1 ? "disabled" : ""
                    }`}
                    onClick={() =>
                      setDefaultAllPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={defaultAllPage <= 1}
                    aria-label="Previous All Projects Page"
                  >
                    <PaginationPrevArrow isGreen={defaultAllPage > 1} />
                  </button>

                  {[...Array(Math.min(totalDefaultAllPages, 4))].map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={`default-all-page-${p}`}
                        type="button"
                        className={`page-btn ${
                          defaultAllPage === p ? "active" : ""
                        }`}
                        onClick={() => setDefaultAllPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`page-btn page-arrow ${
                      defaultAllPage >= totalDefaultAllPages ? "disabled" : ""
                    }`}
                    onClick={() =>
                      setDefaultAllPage((prev) =>
                        Math.min(totalDefaultAllPages, prev + 1)
                      )
                    }
                    disabled={defaultAllPage >= totalDefaultAllPages}
                    aria-label="Next All Projects Page"
                  >
                    <PaginationNextArrow
                      isGreen={defaultAllPage < totalDefaultAllPages}
                    />
                  </button>
                </div>
              </div>

              {/* Right Column (4 cols - Default Sidebar) */}
              <div className="col-lg-4 col-md-12">
                <aside className="projects-sidebar">
                  {/* Search Box */}
                  <form
                    className="sidebar-search-box"
                    onSubmit={handleSearchSubmit}
                  >
                    <input
                      type="text"
                      className="sidebar-search-input"
                      placeholder="Search here"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="sidebar-search-btn"
                      aria-label="Search"
                    >
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

                  {/* Filter By Tools (Default View Pills) */}
                  <div className="sidebar-filter-section">
                    <h3 className="sidebar-filter-title">Filter by Tools</h3>
                    <div className="sidebar-filter-card">
                      <div className="sidebar-tools-grid">
                        {DEFAULT_LEVEL_FILTERS.map((filter) => (
                          <button
                            key={filter.value}
                            type="button"
                            className={`tool-filter-btn ${
                              defaultLevel === filter.value ? "active" : ""
                            }`}
                            onClick={() => {
                              setDefaultLevel(filter.value);
                              setDefaultAllPage(1);
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
          )}
        </div>
      </section>

      {/* Spacing area */}
      <div className="large-spacing-area" />
    </div>
  );
};

export default ProjectsPage;
