import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiCopy,
    FiCheck,
    FiDownload,
    FiChevronDown,
    FiChevronUp,
    FiCalendar,
    FiExternalLink,
    FiLayers,
} from "react-icons/fi";
import { FaLinkedinIn, FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import "./Projectsdetails.css";

// Navigation items matching Screenshot 1 exactly
const NAV_ITEMS = [
    { id: "about-project", number: "01", label: "About The Project" },
    { id: "prerequisites", number: "02", label: "PREREQUISITES" },
    { id: "project-objectives", number: "03", label: "PROJECT OBJECTIVES" },
    { id: "project-architecture", number: "04", label: "PROJECT ARCHITECTURE" },
    { id: "implementation-guide", number: "05", label: "IMPLEMENTATION" },
    { id: "technologies", number: "06", label: "TOOLS" },
    { id: "dataset-resources", number: "07", label: "DATA SOURCES" },
    { id: "project-learnings", number: "08", label: "LEARNINGS" },
    { id: "common-mistakes", number: "09", label: "COMMON MISTAKES" },
];

// Section 03 Objectives Data matching Screenshot 3
const OBJECTIVES_DATA = [
    {
        id: "obj-1",
        num: "01",
        title: "Understand the Business Problem",
        content:
            "Understand the business problem behind customer churn and how machine learning can help identify customers at risk.",
    },
    {
        id: "obj-2",
        num: "02",
        title: "Understand the Business Problem",
        content:
            "Understand the business problem behind customer churn and how machine learning can help identify customers at risk.",
    },
    {
        id: "obj-3",
        num: "03",
        title: "Understand the Business Problem",
        content:
            "Understand the business problem behind customer churn and how machine learning can help identify customers at risk.",
    },
    {
        id: "obj-4",
        num: "04",
        title: "Understand the Business Problem",
        content:
            "Understand the business problem behind customer churn and how machine learning can help identify customers at risk.",
    },
];

// Section 04 Architecture Cards Data matching Screenshot 4
const ARCHITECTURE_STEPS = [
    { id: "arch-1", num: "01", title: "Feature\nEngineering" },
    { id: "arch-2", num: "02", title: "Feature\nEngineering" },
    { id: "arch-3", num: "03", title: "Feature\nEngineering" },
    { id: "arch-4", num: "04", title: "Feature\nEngineering" },
    { id: "arch-5", num: "05", title: "Feature\nEngineering" },
    { id: "arch-6", num: "06", title: "Feature\nEngineering" },
    { id: "arch-7", num: "07", title: "Feature\nEngineering" },
    { id: "arch-8", num: "08", title: "Feature\nEngineering" },
    { id: "arch-9", num: "09", title: "Feature\nEngineering" },
    { id: "arch-10", num: "10", title: "Feature\nEngineering" },
];

// Section 04 Architecture Breakdown Details matching Screenshot 4
const ARCHITECTURE_DETAILS = [
    {
        step: "01 · Dataset",
        desc: "Raw customer records in CSV format. This is the single source of truth for the project.",
    },
    {
        step: "02 · Data Collection",
        desc: "Load the CSV into a Pandas DataFrame and verify shape, columns and data types.",
    },
    {
        step: "03 · Data Cleaning",
        desc: "Fix missing values, duplicates and inconsistent formats so the data is reliable.",
    },
    {
        step: "04 · EDA",
        desc: "Visualize distributions and relationships to see what drives churn.",
    },
];

// Section 05 Step-by-Step Implementation Data matching Screenshot 5
const IMPLEMENTATION_STEPS = [
    {
        id: "step-1",
        num: "01",
        title: "Set Up the Environment",
        subtitle: "Install Python and required libraries.",
        whatYouDo: "Create a virtual environment and install the libraries used throughout the project.",
        matters: "A reproducible setup avoids version conflicts later.",
        output: "A working Jupyter notebook that imports every library without errors.",
        tools: ["Python", "php", "Jupyter"],
        command: "pip install pandas numpy scikit-learn matplotlib seaborn jupyter",
    },
    {
        id: "step-2",
        num: "02",
        title: "Set Up the Environment",
        subtitle: "Install Python and required libraries.",
        whatYouDo: "Create a virtual environment and install the libraries used throughout the project.",
        matters: "A reproducible setup avoids version conflicts later.",
        output: "A working Jupyter notebook that imports every library without errors.",
        tools: ["Python", "Pandas", "Jupyter"],
        command: "pip install pandas numpy scikit-learn matplotlib seaborn jupyter",
    },
    {
        id: "step-3",
        num: "03",
        title: "Set Up the Environment",
        subtitle: "Install Python and required libraries.",
        whatYouDo: "Create a virtual environment and install the libraries used throughout the project.",
        matters: "A reproducible setup avoids version conflicts later.",
        output: "A working Jupyter notebook that imports every library without errors.",
        tools: ["Python", "scikit-learn"],
        command: "pip install pandas numpy scikit-learn matplotlib seaborn jupyter",
    },
    {
        id: "step-4",
        num: "04",
        title: "Set Up the Environment",
        subtitle: "Install Python and required libraries.",
        whatYouDo: "Create a virtual environment and install the libraries used throughout the project.",
        matters: "A reproducible setup avoids version conflicts later.",
        output: "A working Jupyter notebook that imports every library without errors.",
        tools: ["Python", "Jupyter"],
        command: "pip install pandas numpy scikit-learn matplotlib seaborn jupyter",
    },
];

// Section 06 Technologies Badges Data matching Screenshot 7
const TECHNOLOGIES_DATA = [
    { name: "Python", desc: "Programming" },
    { name: "Pandas", desc: "Data handling" },
    { name: "NumPy", desc: "Computation" },
    { name: "Scikit-learn", desc: "ML models" },
    { name: "Jupyter", desc: "Development" },
];

// Section 07 Dataset Resources Data matching Screenshot 6
const DATASET_RESOURCES = [
    {
        title: "Kaggle",
        desc: "Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.",
        url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
    },
    {
        title: "Kaggle",
        desc: "Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.",
        url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
    },
    {
        title: "Kaggle",
        desc: "Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.",
        url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
    },
];

// Section 08 Learnings Data matching Screenshot 8
const TECHNICAL_LEARNINGS = [
    "Data cleaning",
    "Exploratory data analysis",
    "Feature engineering",
    "Machine learning",
    "Model evaluation",
    "Prediction",
];

const PRACTICAL_LEARNINGS = [
    "Understanding a real-world problem",
    "Working with imperfect datasets",
    "Selecting appropriate models",
    "Interpreting results",
    "Structuring an end-to-end project",
];

// Section 09/10 Common Mistakes Data matching Screenshot 9
const COMMON_MISTAKES = [
    {
        id: "mistake-1",
        num: "01",
        title: "Data Leakage",
        mistake: "Using information in training that wouldn't be available at prediction time.",
        why: "Scaling or encoding before splitting, or keeping columns that reveal the outcome.",
        avoid: "Split first, fit transformers on training data only, and use a Pipeline.",
    },
    {
        id: "mistake-2",
        num: "02",
        title: "Data Leakage",
        mistake: "Using information in training that wouldn't be available at prediction time.",
        why: "Scaling or encoding before splitting, or keeping columns that reveal the outcome.",
        avoid: "Split first, fit transformers on training data only, and use a Pipeline.",
    },
    {
        id: "mistake-3",
        num: "03",
        title: "Data Leakage",
        mistake: "Using information in training that wouldn't be available at prediction time.",
        why: "Scaling or encoding before splitting, or keeping columns that reveal the outcome.",
        avoid: "Split first, fit transformers on training data only, and use a Pipeline.",
    },
    {
        id: "mistake-4",
        num: "04",
        title: "Data Leakage",
        mistake: "Using information in training that wouldn't be available at prediction time.",
        why: "Scaling or encoding before splitting, or keeping columns that reveal the outcome.",
        avoid: "Split first, fit transformers on training data only, and use a Pipeline.",
    },
];

// Right Sidebar Related Content matching Screenshots 1, 2, 3
const RELATED_PROJECTS = [
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/projects-details/customer-segmentation-using-k-means" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/projects-details/credit-card-fraud-detection" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/projects-details/stock-price-prediction" },
];

const TUTORIALS = [
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/tutorials" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/tutorials" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/tutorials" },
];

const MINI_GUIDES = [
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/guides" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/guides" },
    { title: "Create Amazing Color Schemes Design", date: "05 Aug, 2025", link: "/guides" },
];

const Projectsdetails = () => {
    const [activeSection, setActiveSection] = useState("about-project");

    // Accordion independent state groups
    const [openObjective, setOpenObjective] = useState("obj-1");
    const [openStep, setOpenStep] = useState("step-1");
    const [openMistake, setOpenMistake] = useState("mistake-1");

    // Copy feedback states
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCmd, setCopiedCmd] = useState(false);

    // Smooth scroll handler with offset for sticky header
    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    // Scrollspy: update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 130;
            for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
                const item = NAV_ITEMS[i];
                const el = document.getElementById(item.id);
                if (el && el.offsetTop <= scrollPosition) {
                    setActiveSection(item.id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Share actions
    const pageUrl = window.location.href;
    const pageTitle = "Customer Churn Prediction Using Machine Learning | PrepHQ";

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(pageUrl).then(() => {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
            });
        }
    };

    const handleCopyCommand = (cmdText) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(cmdText).then(() => {
                setCopiedCmd(true);
                setTimeout(() => setCopiedCmd(false), 2000);
            });
        }
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className="project-detail-page-wrapper">
            {/* 2. SECONDARY / BREADCRUMB BAR */}
            <div className="project-breadcrumb-bar">
                <div className="project-container">
                    <div className="breadcrumb-nav">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/projects" className="breadcrumb-link">Projects</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Customer Churn Prediction</span>
                    </div>
                </div>
            </div>

            {/* 3. MAIN THREE-COLUMN CONTENT WRAPPER */}
            <div className="project-container">
                <div className="project-main-grid">

                    {/* =========================================================
              LEFT COLUMN: "In This Project" Navigation (Screenshot 1)
              ========================================================= */}
                    <aside className="project-left-sidebar" aria-label="In This Project Navigation">
                        <div className="left-sidebar-inner">
                            <h2 className="sidebar-heading">In This Project</h2>

                            <nav className="project-nav-list" aria-label="Project section links">
                                {NAV_ITEMS.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className={`nav-item-btn ${activeSection === item.id ? "active" : ""}`}
                                        aria-current={activeSection === item.id ? "true" : undefined}
                                    >
                                        <span className="nav-item-num">{item.number}</span>
                                        <span className="nav-item-sep">·</span>
                                        <span className="nav-item-text">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="sidebar-download-box">
                                <button
                                    type="button"
                                    onClick={handleDownloadPDF}
                                    className="download-pdf-btn"
                                    title="Print or download project curriculum"
                                >
                                    <FiDownload className="download-icon" />
                                    <span>Download As PDF</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* =========================================================
              CENTER COLUMN: Main Project Content
              ========================================================= */}
                    <main className="project-center-article">

                        {/* PROJECT HEADER (Screenshot 1) */}
                        <div className="project-header-section">
                            <h1 className="project-main-title">
                                Customer Churn Prediction Using Machine Learning
                            </h1>

                            <p className="project-main-desc">
                                Build an end-to-end machine learning project to identify customers who are likely to churn using real-world customer data.
                            </p>

                            <div className="project-meta-chips">
                                <div className="meta-chip">
                                    <span className="meta-label">Level :</span>
                                    <span className="meta-val">Intermediate</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Duration :</span>
                                    <span className="meta-val">8–12 Hours</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Domain :</span>
                                    <span className="meta-val">Data Science</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Project Type :</span>
                                    <span className="meta-val">Machine Learning</span>
                                </div>
                            </div>

                            <hr className="header-divider" />
                        </div>

                        {/* SECTION 01: About the Project (Screenshot 1) */}
                        <section id="about-project" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">01 · About the Project</span>
                                <p className="section-subtitle">Understand what you'll build and why it matters.</p>
                            </div>

                            <div className="about-project-card">
                                <p className="about-card-text">
                                    Customer churn is when a customer stops using a company's service. In subscription businesses such as telecom, losing customers is far more expensive than keeping them, so knowing who is about to leave is highly valuable.
                                </p>
                                <p className="about-card-text">
                                    In this project you'll work with a real telecom dataset to find the patterns behind churn, then train classification models that flag at-risk customers before they leave.
                                </p>
                                <p className="about-card-text">
                                    By the end you'll have built a complete workflow: cleaned data, insightful visualizations, a tuned and evaluated model, and a working prediction pipeline.
                                </p>
                            </div>
                        </section>

                        {/* SECTION 02: What You Should Know Before Starting (Screenshot 2) */}
                        <section id="prerequisites" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">02 · What You Should Know Before Starting</span>
                                <p className="section-subtitle">A quick checklist so you can start with confidence.</p>
                            </div>

                            {/* 3 columns grid: Row 1 has Programming, Data, Statistics; Row 2 has Machine Learning */}
                            <div className="prereq-cards-layout">
                                {/* Programming */}
                                <div className="prereq-card">
                                    <h3 className="prereq-card-title">Programming</h3>
                                    <ul className="prereq-list">
                                        <li>Basic Python</li>
                                        <li>Functions</li>
                                        <li>Lists and dictionaries</li>
                                    </ul>
                                </div>

                                {/* Data */}
                                <div className="prereq-card">
                                    <h3 className="prereq-card-title">Data</h3>
                                    <ul className="prereq-list">
                                        <li>Pandas</li>
                                        <li>NumPy</li>
                                        <li>Basic data cleaning</li>
                                    </ul>
                                </div>

                                {/* Statistics */}
                                <div className="prereq-card">
                                    <h3 className="prereq-card-title">Statistics</h3>
                                    <ul className="prereq-list">
                                        <li>Mean</li>
                                        <li>Median</li>
                                        <li>Correlation</li>
                                        <li>Basic distributions</li>
                                    </ul>
                                </div>

                                {/* Machine Learning (Placed on next row under column 1) */}
                                <div className="prereq-card prereq-card-ml">
                                    <h3 className="prereq-card-title">Machine Learning</h3>
                                    <ul className="prereq-list">
                                        <li>Classification</li>
                                        <li>Train/test split</li>
                                        <li>Basic model evaluation</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 03: Project Objectives (Screenshot 3) */}
                        <section id="project-objectives" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">03 · Project Objectives</span>
                                <p className="section-subtitle">Understand what you will accomplish.</p>
                            </div>

                            <div className="accordion-group">
                                {OBJECTIVES_DATA.map((obj) => {
                                    const isOpen = openObjective === obj.id;
                                    return (
                                        <div key={obj.id} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="accordion-header"
                                                onClick={() => setOpenObjective(isOpen ? null : obj.id)}
                                                aria-expanded={isOpen}
                                                aria-controls={`obj-panel-${obj.id}`}
                                            >
                                                <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                    {obj.num}
                                                </span>
                                                <span className="accordion-title">{obj.title}</span>
                                                <span className="accordion-chevron">
                                                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div id={`obj-panel-${obj.id}`} className="accordion-body">
                                                    <p className="accordion-desc">{obj.content}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* SECTION 04: Project Architecture (Screenshot 4) */}
                        <section id="project-architecture" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">04 · Project Architecture</span>
                                <p className="section-subtitle">How data flows from raw records to predictions.</p>
                            </div>

                            {/* 10 Architecture Steps Grid (5 columns x 2 rows) */}
                            <div className="arch-steps-grid">
                                {ARCHITECTURE_STEPS.map((step) => (
                                    <div key={step.id} className="arch-step-card">
                                        <div className="arch-step-circle">{step.num}</div>
                                        <span className="arch-step-title">{step.title}</span>
                                    </div>
                                ))}
                            </div>

                            {/* View Architecture Details Card */}
                            <div className="arch-details-card">
                                <div className="arch-details-header">
                                    <div className="arch-icon-box">
                                        <FiLayers className="arch-details-icon" />
                                    </div>
                                    <h3 className="arch-details-title">View Architecture Details</h3>
                                </div>

                                <div className="arch-details-list">
                                    {ARCHITECTURE_DETAILS.map((detail, idx) => (
                                        <div key={idx} className="arch-detail-row">
                                            <strong className="arch-detail-num">{detail.step}</strong>
                                            <p className="arch-detail-desc">{detail.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* SECTION 05: Step-by-Step Implementation (Screenshot 5) */}
                        <section id="implementation-guide" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">05 · Step-by-Step Implementation</span>
                                <p className="section-subtitle">Follow these ten steps to build the project from start to finish.</p>
                            </div>

                            <div className="accordion-group">
                                {IMPLEMENTATION_STEPS.map((step) => {
                                    const isOpen = openStep === step.id;
                                    return (
                                        <div key={step.id} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="accordion-header implementation-accordion-header"
                                                onClick={() => setOpenStep(isOpen ? null : step.id)}
                                                aria-expanded={isOpen}
                                                aria-controls={`step-panel-${step.id}`}
                                            >
                                                <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                    {step.num}
                                                </span>
                                                <div className="accordion-title-block">
                                                    <span className="accordion-title">{step.title}</span>
                                                    <span className="accordion-sub-label">{step.subtitle}</span>
                                                </div>
                                                <span className="accordion-chevron">
                                                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div id={`step-panel-${step.id}`} className="accordion-body step-body">
                                                    <div className="step-field">
                                                        <span className="step-field-label">What you'll do</span>
                                                        <p className="step-field-text">{step.whatYouDo}</p>
                                                    </div>

                                                    <div className="step-field">
                                                        <span className="step-field-label">Why it matters</span>
                                                        <p className="step-field-text">{step.matters}</p>
                                                    </div>

                                                    <div className="step-field">
                                                        <span className="step-field-label">Expected output</span>
                                                        <p className="step-field-text">{step.output}</p>
                                                    </div>

                                                    <div className="step-field">
                                                        <span className="step-field-label">Tools used</span>
                                                        <div className="step-tools-list">
                                                            {step.tools.map((tool, tIdx) => (
                                                                <span key={tIdx} className="step-tool-badge">{tool}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {step.command && (
                                                        <div className="step-code-wrapper">
                                                            <pre className="step-code-block">{step.command}</pre>
                                                            <button
                                                                type="button"
                                                                className="step-code-copy-btn"
                                                                onClick={() => handleCopyCommand(step.command)}
                                                                title="Copy code to clipboard"
                                                                aria-label="Copy code command"
                                                            >
                                                                {copiedCmd ? <FiCheck /> : <FiCopy />}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* SECTION 06: Tools / Technologies Used */}
                        <section id="technologies" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">06 · Tools / Technologies Used</span>
                                <p className="section-subtitle">Everything you need is free and open source.</p>
                            </div>

                            <div className="tech-badges-grid">
                                {TECHNOLOGIES_DATA.map((tech, idx) => (
                                    <div key={idx} className="tech-badge-card">
                                        <span className="tech-name">{tech.name}</span>
                                        <span className="tech-sub">{tech.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECTION 07: Where to Get Data */}
                        <section id="dataset-resources" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">07 · Where to Get Data</span>
                                <p className="section-subtitle">Trusted places to download the dataset.</p>
                            </div>

                            <div className="dataset-cards-grid">
                                {DATASET_RESOURCES.map((ds, idx) => (
                                    <div key={idx} className="dataset-resource-card">
                                        <h3 className="dataset-source-title">{ds.title}</h3>
                                        <p className="dataset-source-desc">{ds.desc}</p>
                                        <a
                                            href={ds.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="dataset-btn"
                                        >
                                            <span>Get Dataset</span>
                                            <span className="arrow-sym">→</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECTION 08: Learnings From the Project */}
                        <section id="project-learnings" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">08 · Learnings From the Project</span>
                                <p className="section-subtitle">Skills you will take away.</p>
                            </div>

                            <div className="learnings-grid">
                                {/* Technical Learning */}
                                <div className="learning-card">
                                    <h3 className="learning-card-title">Technical Learnings</h3>
                                    <ul className="learning-list">
                                        {TECHNICAL_LEARNINGS.map((item, idx) => (
                                            <li key={idx}>
                                                <span className="check-bullet-circle"><FiCheck /></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Practical Learning */}
                                <div className="learning-card">
                                    <h3 className="learning-card-title">Practical Learnings</h3>
                                    <ul className="learning-list">
                                        {PRACTICAL_LEARNINGS.map((item, idx) => (
                                            <li key={idx}>
                                                <span className="check-bullet-circle"><FiCheck /></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 09: Common Mistakes to Avoid */}
                        <section id="common-mistakes" className="content-section">
                            <div className="section-pill-header">
                                <span className="section-badge">09 · Common Mistakes to Avoid</span>
                                <p className="section-subtitle">Save hours by knowing these pitfalls early.</p>
                            </div>

                            <div className="accordion-group">
                                {COMMON_MISTAKES.map((mistake) => {
                                    const isOpen = openMistake === mistake.id;
                                    return (
                                        <div key={mistake.id} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                            <button
                                                type="button"
                                                className="accordion-header"
                                                onClick={() => setOpenMistake(isOpen ? null : mistake.id)}
                                                aria-expanded={isOpen}
                                                aria-controls={`mistake-panel-${mistake.id}`}
                                            >
                                                <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                    {mistake.num}
                                                </span>
                                                <span className="accordion-title">{mistake.title}</span>
                                                <span className="accordion-chevron">
                                                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div id={`mistake-panel-${mistake.id}`} className="accordion-body mistake-body">
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">The mistake</span>
                                                        <p className="mistake-text">{mistake.mistake}</p>
                                                    </div>
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">Why it happens</span>
                                                        <p className="mistake-text">{mistake.why}</p>
                                                    </div>
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">How to avoid it</span>
                                                        <p className="mistake-text">{mistake.avoid}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* BOTTOM SHARE CARD */}
                        <div className="bottom-share-card" role="region" aria-label="Share this learning guide">
                            <span className="bottom-share-heading">Share:</span>
                            <div className="share-buttons-row">
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + " " + pageUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-icon-btn whatsapp-btn"
                                    title="Share on WhatsApp"
                                    aria-label="Share on WhatsApp"
                                >
                                    <FaWhatsapp />
                                    <span className="sr-only">Share on WhatsApp</span>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-icon-btn linkedin-btn"
                                    title="Share on LinkedIn"
                                    aria-label="Share on LinkedIn"
                                >
                                    <FaLinkedinIn />
                                    <span className="sr-only">Share on LinkedIn</span>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-icon-btn facebook-btn"
                                    title="Share on Facebook"
                                    aria-label="Share on Facebook"
                                >
                                    <FaFacebookF />
                                    <span className="sr-only">Share on Facebook</span>
                                </a>
                                <a
                                    href={`https://www.instagram.com/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-icon-btn instagram-btn"
                                    title="Share on Instagram"
                                    aria-label="Share on Instagram"
                                >
                                    <FaInstagram />
                                    <span className="sr-only">Share on Instagram</span>
                                </a>
                            </div>
                        </div>

                    </main>

                    {/* =========================================================
              RIGHT COLUMN: Share & Related Content (Screenshot 1)
              ========================================================= */}
                    <aside className="project-right-sidebar" aria-label="Project actions and related resources">
                        <div className="right-sidebar-inner">

                            {/* SHARE ACTIONS */}
                            <div className="share-section" role="region" aria-label="Share actions">
                                <span className="share-heading">Share:</span>
                                <div className="share-buttons-row">
                                    <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + " " + pageUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-icon-btn whatsapp-btn"
                                        title="Share on WhatsApp"
                                        aria-label="Share on WhatsApp"
                                    >
                                        <FaWhatsapp />
                                        <span className="sr-only">Share on WhatsApp</span>
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-icon-btn linkedin-btn"
                                        title="Share on LinkedIn"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <FaLinkedinIn />
                                        <span className="sr-only">Share on LinkedIn</span>
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-icon-btn facebook-btn"
                                        title="Share on Facebook"
                                        aria-label="Share on Facebook"
                                    >
                                        <FaFacebookF />
                                        <span className="sr-only">Share on Facebook</span>
                                    </a>
                                    <a
                                        href={`https://www.instagram.com/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-icon-btn instagram-btn"
                                        title="Share on Instagram"
                                        aria-label="Share on Instagram"
                                    >
                                        <FaInstagram />
                                        <span className="sr-only">Share on Instagram</span>
                                    </a>
                                </div>
                            </div>

                            {/* RELATED PROJECTS */}
                            <div className="sidebar-widget">
                                <h3 className="widget-title">Related Projects</h3>
                                <div className="widget-mint-box">
                                    <div className="widget-card-list">
                                        {RELATED_PROJECTS.map((proj, idx) => (
                                            <Link key={idx} to={proj.link} className="widget-item-card">
                                                <span className="widget-item-title">{proj.title}</span>
                                                <div className="widget-item-footer">
                                                    <div className="widget-item-meta">
                                                        <FiCalendar className="meta-icon" />
                                                        <span>{proj.date}</span>
                                                    </div>
                                                    <FiExternalLink className="widget-open-icon" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="widget-scrollbar-track" aria-hidden="true">
                                        <div className="widget-scrollbar-thumb" />
                                    </div>
                                </div>
                            </div>

                            {/* TUTORIALS */}
                            <div className="sidebar-widget">
                                <h3 className="widget-title">Tutorials</h3>
                                <div className="widget-mint-box">
                                    <div className="widget-card-list">
                                        {TUTORIALS.map((tut, idx) => (
                                            <Link key={idx} to={tut.link} className="widget-item-card">
                                                <span className="widget-item-title">{tut.title}</span>
                                                <div className="widget-item-footer">
                                                    <div className="widget-item-meta">
                                                        <FiCalendar className="meta-icon" />
                                                        <span>{tut.date}</span>
                                                    </div>
                                                    <FiExternalLink className="widget-open-icon" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="widget-scrollbar-track" aria-hidden="true">
                                        <div className="widget-scrollbar-thumb" />
                                    </div>
                                </div>
                            </div>

                            {/* MINI GUIDES */}
                            <div className="sidebar-widget">
                                <h3 className="widget-title">Mini Guides</h3>
                                <div className="widget-mint-box">
                                    <div className="widget-card-list">
                                        {MINI_GUIDES.map((guide, idx) => (
                                            <Link key={idx} to={guide.link} className="widget-item-card">
                                                <span className="widget-item-title">{guide.title}</span>
                                                <div className="widget-item-footer">
                                                    <div className="widget-item-meta">
                                                        <FiCalendar className="meta-icon" />
                                                        <span>{guide.date}</span>
                                                    </div>
                                                    <FiExternalLink className="widget-open-icon" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="widget-scrollbar-track" aria-hidden="true">
                                        <div className="widget-scrollbar-thumb" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Projectsdetails;
