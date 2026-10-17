import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjectDetails, useUpdateProjectDetails } from "../../services/projectsServices";
import { useNotification } from "../../context/useNotificationContext";
import EditableSectionHeader from "./components/EditableSectionHeader";
import {
    FiCopy,
    FiCheck,
    FiDownload,
    FiChevronDown,
    FiChevronUp,
    FiLayers,
} from "react-icons/fi";
import { FolderGit2 } from "lucide-react";
import "./Projectsdetails.css";

// Custom SVG Icons
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none" className="meta-icon">
        <path d="M17 14.6288C16.867 14.9181 16.6395 15.0004 16.3317 15C12.1039 14.9932 7.87605 14.9915 3.64824 14.9951C3.19279 14.9951 3.02028 14.8211 3.02028 14.3609V12.9959H3.22649C6.61288 12.9959 9.99913 12.997 13.3852 12.9991C13.8788 12.9991 14.2868 12.8393 14.6398 12.4961C15.6079 11.5549 16.3135 10.4369 16.8625 9.21124C16.9069 9.11644 16.9512 9.02387 16.9982 8.93041L17 14.6288Z" fill="#37AB79" />
        <path d="M17 2.99834H3.0358C3.02918 2.95931 3.02474 2.91993 3.0225 2.8804C3.0225 2.43046 3.02028 1.98096 3.0225 1.53101C3.0225 1.20479 3.22649 1.00051 3.55112 0.999624C4.30503 0.999624 5.05539 0.999624 5.80797 0.999624H6.0102C6.0102 0.83629 6.0102 0.683194 6.0102 0.530097C6.0133 0.218562 6.21952 4.25311e-05 6.50734 4.25311e-05C6.79515 4.25311e-05 7.00093 0.218117 7.00536 0.529651C7.00536 0.679188 7.00536 0.82828 7.00536 0.988497H9.49548C9.49548 0.832285 9.49548 0.676963 9.49548 0.524756C9.49947 0.215891 9.70924 -0.00262777 9.9975 4.25311e-05C10.2858 0.00271283 10.4853 0.217227 10.4902 0.51808C10.4933 0.672513 10.4902 0.826945 10.4902 0.990278H13.0158C13.0158 0.842076 13.0158 0.68898 13.0158 0.536328C13.0189 0.222122 13.2198 0.00226778 13.5067 4.25311e-05C13.8016 -0.00351787 14.0083 0.216781 14.0114 0.539887C14.0114 0.684083 14.0114 0.82828 14.0114 0.999624H14.1888C14.9081 0.999624 15.6274 1.00941 16.3463 0.994728C16.6519 0.988497 16.8714 1.08374 16.9982 1.3659L17 2.99834Z" fill="#37AB79" />
        <path d="M16.9778 4.01039C16.9516 5.14276 16.7786 6.26689 16.4634 7.35449C16.0102 8.90193 15.2993 10.3118 14.2083 11.5135C14.2042 11.5174 14.2004 11.5216 14.1968 11.5259C13.9249 11.882 13.5866 12.011 13.1231 12.0088C8.94646 11.9901 4.76979 11.9972 0.592684 11.9995C0.370946 11.9995 0.187347 11.947 0.0698252 11.7471C0.0117753 11.651 -0.0111218 11.5375 0.00506168 11.4263C0.0212452 11.315 0.0755006 11.2129 0.158521 11.1374C1.62199 9.69589 2.40739 7.90724 2.78612 5.92054C2.89655 5.3393 2.92803 4.74338 2.99589 4.15414C3.00076 4.10963 3.00476 4.06513 3.01052 4.01217L16.9778 4.01039Z" fill="#37AB79" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="widget-open-icon">
        <path d="M20 2.08333V8.33333H17.5V4.2675L7.9675 13.8L6.2 12.0325L15.7325 2.5H11.6667V0H17.9167C19.065 0 20 0.935 20 2.08333ZM13.3333 17.5H2.5V7.08333C2.5 6.85333 2.68667 6.66667 2.91667 6.66667H9.16667L11.6667 4.16667H2.91667C1.30833 4.16667 0 5.475 0 7.08333V20H15.8333V8.33333L13.3333 10.8333V17.5Z" fill="#37AB79" />
    </svg>
);

// Navigation items matching Screenshot 1 exactly
const NAV_ITEMS = [
    { id: "about-project", number: "01", label: "About the project" },
    { id: "prerequisites", number: "02", label: "Prerequisites" },
    { id: "project-objectives", number: "03", label: "Project objectives" },
    { id: "project-architecture", number: "04", label: "Project architecture" },
    { id: "implementation-guide", number: "05", label: "Implementation" },
    { id: "technologies", number: "06", label: "Tools" },
    { id: "dataset-resources", number: "07", label: "Data sources" },
    { id: "project-learnings", number: "08", label: "Learnings" },
    { id: "common-mistakes", number: "09", label: "Common mistakes" },
];

// Default Prerequisites Data matching Screenshot 2
const DEFAULT_PREREQUISITES = [
    {
        category: "Programming",
        items: ["Basic Python", "Functions", "Lists and dictionaries"],
    },
    {
        category: "Data",
        items: ["Pandas", "NumPy", "Basic data cleaning"],
    },
    {
        category: "Statistics",
        items: ["Mean", "Median", "Correlation", "Basic distributions"],
    },
    {
        category: "Machine Learning",
        items: ["Classification", "Train/test split", "Basic model evaluation"],
    },
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
    { id: "arch-1", num: "01", title: "Raw\nDataset" },
    { id: "arch-2", num: "02", title: "Data\nCollection" },
    { id: "arch-3", num: "03", title: "Data\nCleaning" },
    { id: "arch-4", num: "04", title: "Exploratory\nAnalysis" },
    { id: "arch-5", num: "05", title: "Feature\nEngineering" },
    { id: "arch-6", num: "06", title: "Train-Test\nSplit" },
    { id: "arch-7", num: "07", title: "Model\nTraining" },
    { id: "arch-8", num: "08", title: "Model\nEvaluation" },
    { id: "arch-9", num: "09", title: "Hyperparameter\nTuning" },
    { id: "arch-10", num: "10", title: "Deployment &\nPrediction" },
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
        id: "ds-1",
        title: "Kaggle",
        providerTitle: "Kaggle",
        desc: "Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.",
        description: "Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.",
        url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
        externalUrl: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn",
    },
    {
        id: "ds-2",
        title: "IBM Community",
        providerTitle: "IBM Community",
        desc: "The original enterprise telecom customer dataset with 21 customer attributes and payment histories.",
        description: "The original enterprise telecom customer dataset with 21 customer attributes and payment histories.",
        url: "https://github.com/IBM/telco-customer-churn-on-icp4d",
        externalUrl: "https://github.com/IBM/telco-customer-churn-on-icp4d",
    },
    {
        id: "ds-3",
        title: "UCI Machine Learning Repository",
        providerTitle: "UCI ML Repo",
        desc: "Standard benchmark repository containing customer attrition and retention records for classification research.",
        description: "Standard benchmark repository containing customer attrition and retention records for classification research.",
        url: "https://archive.ics.uci.edu/dataset/193/churn",
        externalUrl: "https://archive.ics.uci.edu/dataset/193/churn",
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
        why: "Scaling, encoding, or imputing before train-test split, or keeping target-proxy columns.",
        avoid: "Split first, fit transformers on training data only, and use scikit-learn Pipeline.",
    },
    {
        id: "mistake-2",
        num: "02",
        title: "Optimizing for Accuracy on Imbalanced Data",
        mistake: "Relying on raw accuracy when the majority of customers do not churn.",
        why: "A model predicting 'no churn' for everyone can score 80% accuracy while failing completely.",
        avoid: "Use ROC-AUC, Precision-Recall, F1-Score, and consider SMOTE or class weights.",
    },
    {
        id: "mistake-3",
        num: "03",
        title: "Ignoring Feature Multicollinearity",
        mistake: "Feeding strongly correlated features without inspection or pruning.",
        why: "Features like 'TotalCharges' and 'Tenure' are collinear and destabilize model coefficients.",
        avoid: "Check correlation heatmaps, compute Variance Inflation Factor (VIF), or use regularized models.",
    },
    {
        id: "mistake-4",
        num: "04",
        title: "Evaluating Without Cross-Validation",
        mistake: "Evaluating model generalization on a single fixed train/test split.",
        why: "A single split can result in overly optimistic or pessimistic performance estimates.",
        avoid: "Apply Stratified 5-Fold Cross-Validation to assess true stability across folds.",
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

export const DEFAULT_SECTION_HEADERS = {
    "about-project": {
        title: "01 · About the Project",
        subtitle: "Understand what you'll build and why it matters.",
    },
    "prerequisites": {
        title: "02 · What You Should Know Before Starting",
        subtitle: "A quick checklist so you can start with confidence.",
    },
    "project-objectives": {
        title: "03 · Project Objectives",
        subtitle: "Understand what you will accomplish.",
    },
    "project-architecture": {
        title: "04 · Project Architecture",
        subtitle: "How data flows from raw records to predictions.",
    },
    "implementation-guide": {
        title: "05 · Step-by-Step Implementation",
        subtitle: "Follow these ten steps to build the project from start to finish.",
    },
    "technologies": {
        title: "06 · Tools / Technologies Used",
        subtitle: "Everything you need is free and open source.",
    },
    "dataset-resources": {
        title: "07 · Where to Get Data",
        subtitle: "Trusted places to download the dataset.",
    },
    "project-learnings": {
        title: "08 · Learnings From the Project",
        subtitle: "Skills you will take away.",
    },
    "common-mistakes": {
        title: "09 · Common Mistakes to Avoid",
        subtitle: "Save hours by knowing these pitfalls early.",
    },
};

const Projectsdetails = () => {
    const { postSlug } = useParams();
    const activeSlug = postSlug || "customer-churn-prediction-using-machine-learning";
    const { data: dbData } = useProjectDetails(activeSlug);
    const { mutateAsync: updateDetails } = useUpdateProjectDetails();
    const { showNotification } = useNotification();

    const [sectionHeaders, setSectionHeaders] = useState(DEFAULT_SECTION_HEADERS);

    useEffect(() => {
        if (dbData?.sectionHeaders || dbData?.section_headers) {
            const raw = dbData.sectionHeaders || dbData.section_headers;
            if (raw && typeof raw === "object") {
                setSectionHeaders((prev) => ({
                    ...DEFAULT_SECTION_HEADERS,
                    ...raw,
                }));
            }
        }
    }, [dbData]);

    const handleSaveSectionHeader = async (sectionId, newTitle, newSubtitle) => {
        const updated = {
            ...sectionHeaders,
            [sectionId]: {
                title: newTitle,
                subtitle: newSubtitle,
            },
        };
        setSectionHeaders(updated);

        try {
            await updateDetails({
                slugOrId: dbData?.id || activeSlug,
                data: {
                    section_headers: updated,
                    sectionHeaders: updated,
                },
            });
            showNotification("Section heading updated successfully!", "success");
            return true;
        } catch (error) {
            setSectionHeaders((prev) => ({
                ...prev,
                [sectionId]: sectionHeaders[sectionId] || DEFAULT_SECTION_HEADERS[sectionId],
            }));
            showNotification(error?.message || "Failed to save section heading", "danger");
            throw error;
        }
    };

    const projectTitle = dbData?.title || "Customer Churn Prediction Using Machine Learning";
    const projectDesc = dbData?.subtitle || dbData?.description || "Build an end-to-end machine learning project to identify customers who are likely to churn using real-world customer data.";
    const projectLevel = dbData?.level || "Intermediate";
    const projectDuration = dbData?.duration || "8–12 Hours";
    const projectDomain = dbData?.domain || "Data Science";
    const projectType = dbData?.project_type || "Machine Learning";

    const aboutP1 = dbData?.about_text_1 || dbData?.about_p1 || "Customer churn is when a customer stops using a company's service. In subscription businesses such as telecom, losing customers is far more expensive than keeping them, so knowing who is about to leave is highly valuable.";
    const aboutP2 = dbData?.about_text_2 || dbData?.about_p2 || "In this project you'll work with a real telecom dataset to find the patterns behind churn, then train classification models that flag at-risk customers before they leave.";
    const aboutP3 = dbData?.about_text_3 || dbData?.about_p3 || "By the end you'll have built a complete workflow: cleaned data, insightful visualizations, a tuned and evaluated model, and a working prediction pipeline.";

    const section2Design = dbData?.section_2_design || dbData?.section_headers?.section_2_design || "grid";

    let prerequisites = DEFAULT_PREREQUISITES;
    if (dbData?.prerequisites) {
        if (Array.isArray(dbData.prerequisites) && dbData.prerequisites.length > 0) {
            const categoryTitles = dbData?.prerequisites?.category_titles || dbData?.prereq_category_titles || {};
            prerequisites = dbData.prerequisites.map((p) => {
                const key = p.key || (
                    p.category?.toLowerCase().includes("program") ? "programming" :
                    p.category?.toLowerCase().includes("data") ? "data" :
                    p.category?.toLowerCase().includes("stat") ? "statistics" :
                    p.category?.toLowerCase().includes("machine") || p.category?.toLowerCase().includes("ml") ? "machineLearning" : null
                );
                return {
                    ...p,
                    key: key || p.key,
                    category: (key && categoryTitles[key]) ? categoryTitles[key] : p.category,
                };
            });
        } else if (typeof dbData.prerequisites === "object") {
            const pObj = dbData.prerequisites;
            const defaultOrder = ["programming", "data", "statistics", "machineLearning"];
            const categoryOrder = Array.isArray(pObj.category_order) && pObj.category_order.length > 0
                ? [...new Set([...pObj.category_order, ...defaultOrder])]
                : defaultOrder;

            const categoryTitles = pObj.category_titles || dbData?.prereq_category_titles || {};

            const catMap = {
                programming: {
                    key: "programming",
                    category: categoryTitles.programming || "Programming Prerequisites",
                    items: pObj.programming || []
                },
                data: {
                    key: "data",
                    category: categoryTitles.data || "Data Handling Prerequisites",
                    items: pObj.data || []
                },
                statistics: {
                    key: "statistics",
                    category: categoryTitles.statistics || "Statistics Prerequisites",
                    items: pObj.statistics || []
                },
                machineLearning: {
                    key: "machineLearning",
                    category: categoryTitles.machineLearning || "Machine Learning Prerequisites",
                    items: pObj.machineLearning || []
                },
            };
            const converted = categoryOrder
                .map((key) => catMap[key])
                .filter((c) => c && c.items && c.items.length > 0);
            if (converted.length > 0) {
                prerequisites = converted;
            }
        }
    }

    const objectives = (dbData?.objectives && Array.isArray(dbData.objectives) && dbData.objectives.length > 0)
        ? dbData.objectives
        : OBJECTIVES_DATA;

    const archSteps = (dbData?.architecture_steps && Array.isArray(dbData.architecture_steps) && dbData.architecture_steps.length > 0)
        ? dbData.architecture_steps
        : ARCHITECTURE_STEPS;

    const archDetails = (dbData?.architecture_details && Array.isArray(dbData.architecture_details) && dbData.architecture_details.length > 0)
        ? dbData.architecture_details
        : ARCHITECTURE_DETAILS;

    const implSteps = (dbData?.implementation_steps && Array.isArray(dbData.implementation_steps) && dbData.implementation_steps.length > 0)
        ? dbData.implementation_steps
        : IMPLEMENTATION_STEPS;

    const rawTech = (dbData?.technologies && Array.isArray(dbData.technologies) && dbData.technologies.length > 0)
        ? dbData.technologies
        : TECHNOLOGIES_DATA;
    const techData = rawTech.map((t, idx) => ({
        id: t.id || `tech-${idx + 1}`,
        toolName: t.toolName || t.name || "",
        categoryUsage: t.categoryUsage || t.desc || "",
        name: t.name || t.toolName || "",
        desc: t.desc || t.categoryUsage || "",
    }));

    const rawDatasets = (dbData?.datasetResources && Array.isArray(dbData.datasetResources) && dbData.datasetResources.length > 0)
        ? dbData.datasetResources
        : ((dbData?.dataset_resources && Array.isArray(dbData.dataset_resources) && dbData.dataset_resources.length > 0)
            ? dbData.dataset_resources
            : ((dbData?.datasets && Array.isArray(dbData.datasets) && dbData.datasets.length > 0)
                ? dbData.datasets
                : DATASET_RESOURCES));
    const datasets = rawDatasets.map((ds, idx) => ({
        id: ds.id || `ds-${idx + 1}`,
        providerTitle: ds.providerTitle || ds.title || "",
        externalUrl: ds.externalUrl || ds.url || "",
        description: ds.description || ds.desc || "",
        title: ds.title || ds.providerTitle || "",
        url: ds.url || ds.externalUrl || "",
        desc: ds.desc || ds.description || "",
    }));

    const technicalLearnings = (dbData?.technical_learnings && Array.isArray(dbData.technical_learnings) && dbData.technical_learnings.length > 0)
        ? dbData.technical_learnings
        : ((dbData?.technicalLearnings && Array.isArray(dbData.technicalLearnings) && dbData.technicalLearnings.length > 0)
            ? dbData.technicalLearnings
            : TECHNICAL_LEARNINGS);

    const practicalLearnings = (dbData?.practical_learnings && Array.isArray(dbData.practical_learnings) && dbData.practical_learnings.length > 0)
        ? dbData.practical_learnings
        : ((dbData?.practicalLearnings && Array.isArray(dbData.practicalLearnings) && dbData.practicalLearnings.length > 0)
            ? dbData.practicalLearnings
            : PRACTICAL_LEARNINGS);

    const DEFAULT_LEARNINGS_ORDER = ["technical_learnings", "practical_learnings"];
    const rawLearningsOrder = dbData?.learnings_order || dbData?.section_headers?.learnings_order;
    const learningsOrder = Array.isArray(rawLearningsOrder) && rawLearningsOrder.length > 0
        ? [...new Set([...rawLearningsOrder, ...DEFAULT_LEARNINGS_ORDER])]
        : DEFAULT_LEARNINGS_ORDER;

    const learningCategoryTitles = dbData?.section_headers?.learning_category_titles ||
        dbData?.learning_category_titles || {};

    const rawMistakes = (dbData?.common_mistakes && Array.isArray(dbData.common_mistakes) && dbData.common_mistakes.length > 0)
        ? dbData.common_mistakes
        : ((dbData?.commonMistakes && Array.isArray(dbData.commonMistakes) && dbData.commonMistakes.length > 0)
            ? dbData.commonMistakes
            : COMMON_MISTAKES);
    const commonMistakes = rawMistakes.map((m, idx) => ({
        id: m.id || `mistake-${idx + 1}`,
        num: m.num || String(idx + 1).padStart(2, "0"),
        title: m.title || "",
        mistake: m.mistake || "",
        why: m.why || "",
        avoid: m.avoid || "",
    }));

    const DEFAULT_SECTION_ORDER = [
        "about-project",
        "prerequisites",
        "project-objectives",
        "project-architecture",
        "implementation-guide",
        "technologies",
        "dataset-resources",
        "project-learnings",
        "common-mistakes",
    ];

    const sectionsOrder = dbData?.section_headers?.sections_order ||
        dbData?.sections_order ||
        DEFAULT_SECTION_ORDER;

    // Dynamic right-sidebar cards retrieved from database
    const rawSidebar = dbData?.sidebar_cards || dbData?.sidebarCards;
    const getActiveSortedCards = (cardsArray, fallbackArray) => {
        if (rawSidebar && Array.isArray(cardsArray)) {
            return [...cardsArray]
                .filter((c) => c.status !== "inactive" && c.is_active !== false)
                .sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
        }
        return fallbackArray;
    };

    const activeRelatedProjects = getActiveSortedCards(rawSidebar?.related_projects, RELATED_PROJECTS);
    const activeTutorials = getActiveSortedCards(rawSidebar?.tutorials, TUTORIALS);
    const activeMiniGuides = getActiveSortedCards(rawSidebar?.mini_guides, MINI_GUIDES);

    const renderSidebarCard = (card, idx) => {
        const title = card.title || "Untitled";
        const date = card.display_date || card.date || "";
        const rawUrl = (card.destination_url || card.link || "").trim();
        const isExternal = /^https?:\/\//i.test(rawUrl);

        const cardContent = (
            <>
                <span className="widget-item-title">{title}</span>
                <div className="widget-item-footer">
                    <div className="widget-item-meta">
                        <CalendarIcon />
                        <span>{date}</span>
                    </div>
                    <ExternalLinkIcon />
                </div>
            </>
        );

        if (isExternal) {
            return (
                <a
                    key={card.id || `ext-${idx}`}
                    href={rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="widget-item-card"
                >
                    {cardContent}
                </a>
            );
        }

        if (!rawUrl || rawUrl === "#" || rawUrl === "#0") {
            return (
                <a
                    key={card.id || `empty-${idx}`}
                    href="#0"
                    onClick={(e) => e.preventDefault()}
                    className="widget-item-card"
                >
                    {cardContent}
                </a>
            );
        }

        return (
            <Link
                key={card.id || `lnk-${idx}`}
                to={rawUrl}
                className="widget-item-card"
            >
                {cardContent}
            </Link>
        );
    };

    const [activeSection, setActiveSection] = useState("about-project");

    // Dynamic sidebar nav items ordered matching custom sections_order
    const navItems = sectionsOrder
        .map((secId) => NAV_ITEMS.find((n) => n.id === secId))
        .filter(Boolean)
        .map((item, idx) => {
            const customHeader = sectionHeaders[item.id];
            const defaultNum = String(idx + 1).padStart(2, "0");
            if (customHeader?.title) {
                const parts = customHeader.title.split(/[·•\-:]/).map((s) => s.trim());
                if (parts.length > 1 && parts[0].length <= 4) {
                    return {
                        ...item,
                        number: parts[0],
                        label: parts.slice(1).join(" · "),
                    };
                }
                return {
                    ...item,
                    number: defaultNum,
                    label: customHeader.title,
                };
            }
            return {
                ...item,
                number: defaultNum,
            };
        });

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
            for (let i = navItems.length - 1; i >= 0; i--) {
                const item = navItems[i];
                const el = document.getElementById(item.id);
                if (el && el.offsetTop <= scrollPosition) {
                    setActiveSection(item.id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    // Share actions
    const pageUrl = window.location.href;
    const pageTitle = `${projectTitle} | PrepHQ`;

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

    const renderContentSection = (sectionId) => {
        switch (sectionId) {
            case "about-project":
                return (
                    <section key="about-project" id="about-project" className="content-section">
                        <EditableSectionHeader
                            sectionId="about-project"
                            title={sectionHeaders["about-project"]?.title}
                            subtitle={sectionHeaders["about-project"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["about-project"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["about-project"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="about-project-card">
                            {aboutP1 && <p className="about-card-text">{aboutP1}</p>}
                            {aboutP2 && <p className="about-card-text">{aboutP2}</p>}
                            {aboutP3 && <p className="about-card-text">{aboutP3}</p>}
                        </div>
                    </section>
                );

            case "prerequisites":
                return (
                    <section id="prerequisites" className="content-section" key="prerequisites">
                        <EditableSectionHeader
                            sectionId="prerequisites"
                            title={sectionHeaders["prerequisites"]?.title}
                            subtitle={sectionHeaders["prerequisites"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["prerequisites"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["prerequisites"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        {section2Design === "single_column" ? (
                            /* DESIGN 2 — Single Column Layout */
                            <div className="prereq-single-container">
                                {prerequisites.map((p, idx) => (
                                    <div key={idx} className="prereq-single-category">
                                        <h3 className="prereq-category-title">{p.category}</h3>
                                        <ul className="prereq-list">
                                            {(p.items || []).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* DESIGN 1 — Grid Card Layout (Default) */
                            <div className="prereq-cards-layout">
                                {prerequisites.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className={`prereq-card ${p.key === "machineLearning" || p.category?.toLowerCase().includes("machine") || p.category?.toLowerCase().includes("ml") ? "prereq-card-ml" : ""}`}
                                    >
                                        <h3 className="prereq-card-title">{p.category}</h3>
                                        <ul className="prereq-list">
                                            {(p.items || []).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );

            case "project-objectives":
                return (
                    <section key="project-objectives" id="project-objectives" className="content-section">
                        <EditableSectionHeader
                            sectionId="project-objectives"
                            title={sectionHeaders["project-objectives"]?.title}
                            subtitle={sectionHeaders["project-objectives"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["project-objectives"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["project-objectives"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="accordion-group">
                            {objectives.map((obj, idx) => {
                                const objKey = obj.id || `obj-${idx + 1}`;
                                const isOpen = openObjective === objKey;
                                const displayNum = obj.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                                return (
                                    <div key={objKey} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                        <button
                                            type="button"
                                            className="accordion-header"
                                            onClick={() => setOpenObjective(isOpen ? null : objKey)}
                                            aria-expanded={isOpen}
                                            aria-controls={`obj-panel-${objKey}`}
                                        >
                                            <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                {displayNum}
                                            </span>
                                            <span className="accordion-title">{obj.title}</span>
                                            <span className="accordion-chevron">
                                                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div id={`obj-panel-${objKey}`} className="accordion-body">
                                                <p className="accordion-desc">{obj.content}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case "project-architecture":
                return (
                    <section key="project-architecture" id="project-architecture" className="content-section">
                        <EditableSectionHeader
                            sectionId="project-architecture"
                            title={sectionHeaders["project-architecture"]?.title}
                            subtitle={sectionHeaders["project-architecture"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["project-architecture"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["project-architecture"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="arch-steps-grid">
                            {archSteps.map((step, idx) => {
                                const stepKey = step.id || `arch-${idx + 1}`;
                                const displayNum = step.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                                return (
                                    <div key={stepKey} className="arch-step-card">
                                        <div className="arch-step-circle">{displayNum}</div>
                                        <span className="arch-step-title" style={{ whiteSpace: "pre-line" }}>{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {archDetails.length > 0 && (
                            <div className="arch-details-card">
                                <div className="arch-details-header">
                                    <div className="arch-icon-box">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M16.25 3.33333H6.66667V2.5C6.66667 1.12167 5.545 0 4.16667 0H3.33333C1.495 0 0 1.495 0 3.33333V16.6667C0 18.505 1.495 20 3.33333 20H7.91667C8.6075 20 9.16667 19.4408 9.16667 18.75C9.16667 18.0592 8.6075 17.5 7.91667 17.5H3.33333C2.87417 17.5 2.5 17.1258 2.5 16.6667C2.5 16.2075 2.87417 15.8333 3.33333 15.8333H4.16667C5.545 15.8333 6.66667 14.7117 6.66667 13.3333V5.83333H16.25C16.9392 5.83333 17.5 6.39417 17.5 7.08333V8.33333C17.5 9.02417 18.0592 9.58333 18.75 9.58333C19.4408 9.58333 20 9.02417 20 8.33333V7.08333C20 5.01583 18.3175 3.33333 16.25 3.33333ZM4.16667 13.3333H3.33333C3.04583 13.3333 2.76667 13.37 2.5 13.4383V3.33333C2.5 2.87417 2.87417 2.5 3.33333 2.5H4.16667V13.3333ZM19.2008 13.2325L16.7008 11.2758C15.9467 10.6858 14.8875 10.6858 14.1333 11.2758L11.6333 13.2325C11.1292 13.6275 10.8342 14.2325 10.8342 14.8733V17.9167C10.8342 19.0675 11.7667 20 12.9175 20H17.9175C19.0683 20 20.0008 19.0675 20.0008 17.9167V14.8733C20.0008 14.2325 19.705 13.6275 19.2008 13.2325ZM16.6667 16.6667C16.6667 17.1267 16.2933 17.5 15.8333 17.5H15C14.54 17.5 14.1667 17.1267 14.1667 16.6667V15.8333C14.1667 15.3733 14.54 15 15 15H15.8333C16.2933 15 16.6667 15.3733 16.6667 15.8333V16.6667ZM10.4167 12.0833C9.72583 12.0833 9.16667 11.5242 9.16667 10.8333V8.75C9.16667 8.05917 9.72583 7.5 10.4167 7.5H13.75C14.4408 7.5 15 8.05917 15 8.75C15 9.44083 14.4408 10 13.75 10H11.6667V10.8333C11.6667 11.5242 11.1075 12.0833 10.4167 12.0833Z" fill="white" />
                                        </svg>
                                    </div>
                                    <h3 className="arch-details-title">View Architecture Details</h3>
                                </div>

                                <div className="arch-details-list">
                                    {archDetails.map((detail, idx) => (
                                        <div key={idx} className="arch-detail-row">
                                            <strong className="arch-detail-num">{detail.step}</strong>
                                            <p className="arch-detail-desc">{detail.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                );

            case "implementation-guide":
                return (
                    <section key="implementation-guide" id="implementation-guide" className="content-section">
                        <EditableSectionHeader
                            sectionId="implementation-guide"
                            title={sectionHeaders["implementation-guide"]?.title}
                            subtitle={sectionHeaders["implementation-guide"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["implementation-guide"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["implementation-guide"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="accordion-group">
                            {implSteps.map((step, idx) => {
                                const stepKey = step.id || `step-${idx + 1}`;
                                const isOpen = openStep === stepKey;
                                const displayNum = step.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                                return (
                                    <div key={stepKey} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                        <button
                                            type="button"
                                            className="accordion-header implementation-accordion-header"
                                            onClick={() => setOpenStep(isOpen ? null : stepKey)}
                                            aria-expanded={isOpen}
                                            aria-controls={`step-panel-${stepKey}`}
                                        >
                                            <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                {displayNum}
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
                                            <div id={`step-panel-${stepKey}`} className="accordion-body step-body">
                                                {step.whatYouDo && (
                                                    <div className="step-field">
                                                        <span className="step-field-label">What you'll do</span>
                                                        <p className="step-field-text">{step.whatYouDo}</p>
                                                    </div>
                                                )}

                                                {step.matters && (
                                                    <div className="step-field">
                                                        <span className="step-field-label">Why it matters</span>
                                                        <p className="step-field-text">{step.matters}</p>
                                                    </div>
                                                )}

                                                {step.output && (
                                                    <div className="step-field">
                                                        <span className="step-field-label">Expected output</span>
                                                        <p className="step-field-text">{step.output}</p>
                                                    </div>
                                                )}

                                                {step.tools && step.tools.length > 0 && (
                                                    <div className="step-field">
                                                        <span className="step-field-label">Tools used</span>
                                                        <div className="step-tools-list">
                                                            {step.tools.map((tool, tIdx) => (
                                                                <span key={tIdx} className="step-tool-badge">{tool}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

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
                );

            case "technologies":
                return (
                    <section key="technologies" id="technologies" className="content-section">
                        <EditableSectionHeader
                            sectionId="technologies"
                            title={sectionHeaders["technologies"]?.title}
                            subtitle={sectionHeaders["technologies"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["technologies"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["technologies"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="tech-badges-grid">
                            {techData.map((tech, idx) => (
                                <div key={tech.id || idx} className="tech-badge-card">
                                    <span className="tech-name">{tech.toolName || tech.name}</span>
                                    <span className="tech-sub">{tech.categoryUsage || tech.desc}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case "dataset-resources":
                return (
                    <section key="dataset-resources" id="dataset-resources" className="content-section">
                        <EditableSectionHeader
                            sectionId="dataset-resources"
                            title={sectionHeaders["dataset-resources"]?.title}
                            subtitle={sectionHeaders["dataset-resources"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["dataset-resources"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["dataset-resources"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="dataset-cards-grid">
                            {datasets.map((ds, idx) => (
                                <div key={ds.id || idx} className="dataset-resource-card">
                                    <h3 className="dataset-source-title">{ds.providerTitle || ds.title}</h3>
                                    <p className="dataset-source-desc">{ds.description || ds.desc}</p>
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
                );

            case "project-learnings":
                return (
                    <section key="project-learnings" id="project-learnings" className="content-section">
                        <EditableSectionHeader
                            sectionId="project-learnings"
                            title={sectionHeaders["project-learnings"]?.title}
                            subtitle={sectionHeaders["project-learnings"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["project-learnings"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["project-learnings"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="learnings-grid">
                            {learningsOrder.map((catKey) => {
                                const isTech = catKey === "technical_learnings" || catKey === "technicalLearnings";
                                const defaultTitle = isTech ? "Technical Learnings" : "Practical Learnings";
                                const title = learningCategoryTitles[catKey] ||
                                    (isTech
                                        ? (learningCategoryTitles.technical_learnings || learningCategoryTitles.technicalLearnings)
                                        : (learningCategoryTitles.practical_learnings || learningCategoryTitles.practicalLearnings)
                                    ) || defaultTitle;
                                const items = isTech ? technicalLearnings : practicalLearnings;
                                return (
                                    <div key={catKey} className="learning-card">
                                        <h3 className="learning-card-title">{title}</h3>
                                        <ul className="learning-list">
                                            {items.map((item, idx) => (
                                                <li key={idx}>
                                                    <span className="check-bullet-circle"><FiCheck /></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case "common-mistakes":
                return (
                    <section key="common-mistakes" id="common-mistakes" className="content-section">
                        <EditableSectionHeader
                            sectionId="common-mistakes"
                            title={sectionHeaders["common-mistakes"]?.title}
                            subtitle={sectionHeaders["common-mistakes"]?.subtitle}
                            defaultTitle={DEFAULT_SECTION_HEADERS["common-mistakes"].title}
                            defaultSubtitle={DEFAULT_SECTION_HEADERS["common-mistakes"].subtitle}
                            onSave={handleSaveSectionHeader}
                        />

                        <div className="accordion-group">
                            {commonMistakes.map((mistake, idx) => {
                                const mistakeKey = mistake.id || `mistake-${idx + 1}`;
                                const isOpen = openMistake === mistakeKey;
                                const displayNum = mistake.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);
                                return (
                                    <div key={mistakeKey} className={`accordion-card ${isOpen ? "open" : ""}`}>
                                        <button
                                            type="button"
                                            className="accordion-header"
                                            onClick={() => setOpenMistake(isOpen ? null : mistakeKey)}
                                            aria-expanded={isOpen}
                                            aria-controls={`mistake-panel-${mistakeKey}`}
                                        >
                                            <span className={`accordion-badge ${isOpen ? "active-badge" : "default-badge"}`}>
                                                {displayNum}
                                            </span>
                                            <span className="accordion-title">{mistake.title}</span>
                                            <span className="accordion-chevron">
                                                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div id={`mistake-panel-${mistakeKey}`} className="accordion-body mistake-body">
                                                {mistake.mistake && (
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">The mistake</span>
                                                        <p className="mistake-text">{mistake.mistake}</p>
                                                    </div>
                                                )}
                                                {mistake.why && (
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">Why it happens</span>
                                                        <p className="mistake-text">{mistake.why}</p>
                                                    </div>
                                                )}
                                                {mistake.avoid && (
                                                    <div className="mistake-field">
                                                        <span className="mistake-label">How to avoid it</span>
                                                        <p className="mistake-text">{mistake.avoid}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            default:
                return null;
        }
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
                        <span className="breadcrumb-current">{projectTitle}</span>
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
                                {navItems.map((item) => (
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
                                {projectTitle}
                            </h1>

                            <p className="project-main-desc">
                                {projectDesc}
                            </p>

                            <div className="project-meta-chips">
                                <div className="meta-chip">
                                    <span className="meta-label">Level :</span>
                                    <span className="meta-val">{projectLevel}</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Duration :</span>
                                    <span className="meta-val">{projectDuration}</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Domain :</span>
                                    <span className="meta-val">{projectDomain}</span>
                                </div>
                                <div className="meta-chip">
                                    <span className="meta-label">Project Type :</span>
                                    <span className="meta-val">{projectType}</span>
                                </div>
                            </div>

                            <hr className="header-divider" />
                        </div>

                        {/* DYNAMIC SECTIONS ORDERED BY USER PREFERENCE */}
                        {sectionsOrder.map((sectionId) => renderContentSection(sectionId))}


                        {/* BOTTOM SHARE CARD
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M20.0005 9.41476V10.5892C19.9883 10.6586 19.9736 10.7281 19.9638 10.7981C19.9036 11.2165 19.8727 11.6407 19.7807 12.0518C19.1596 14.8253 17.6374 16.9774 15.2341 18.4855C13.2199 19.7495 11.0115 20.206 8.65422 19.909C7.37199 19.7501 6.13558 19.3317 5.02044 18.6793C4.96078 18.6422 4.89348 18.6192 4.82362 18.6119C4.75375 18.6046 4.68315 18.6132 4.61712 18.6372C3.5403 18.9607 2.46054 19.2768 1.38225 19.5948L0 20.001C0.0239838 19.9105 0.0386689 19.8488 0.0562896 19.7886C0.488487 18.3235 0.918233 16.8585 1.3563 15.3954C1.38192 15.323 1.39083 15.2458 1.38235 15.1696C1.37387 15.0933 1.34823 15.0199 1.30736 14.955C0.575621 13.6884 0.140521 12.2726 0.0347501 10.8138C-0.142436 8.51683 0.383249 6.38824 1.66907 4.47495C3.25249 2.11881 5.45214 0.670385 8.25237 0.155118C8.62191 0.0871004 8.99734 0.0508906 9.36982 0H10.5445L10.9684 0.0489333C12.6062 0.229986 14.1264 0.749657 15.493 1.67547C17.8522 3.2751 19.3196 5.47172 19.8458 8.28146C19.9143 8.65434 19.9491 9.03601 20.0005 9.41476ZM1.72977 18.2594C1.81248 18.2389 1.85067 18.2316 1.88738 18.2208C2.86631 17.9321 3.84523 17.6424 4.82416 17.3517C4.881 17.3317 4.94182 17.3257 5.00147 17.3342C5.06112 17.3428 5.11783 17.3656 5.16679 17.4007C7.2661 18.7253 9.53183 19.1324 11.9566 18.5956C16.2791 17.6385 19.2638 13.4752 18.7822 9.0781C18.5957 7.37424 17.9952 5.82355 16.8899 4.51067C14.5939 1.78264 11.6625 0.701212 8.15545 1.37502C5.83148 1.82178 4.0097 3.10971 2.68374 5.06508C1.41749 6.93188 0.965711 9.00519 1.25841 11.2351C1.42836 12.5236 1.88805 13.7569 2.60297 14.8424C2.6361 14.889 2.65731 14.9429 2.66473 14.9996C2.67215 15.0562 2.66557 15.1138 2.64556 15.1673C2.44977 15.801 2.26524 16.4396 2.07729 17.0733C1.96324 17.4564 1.85164 17.8406 1.72977 18.2594Z" fill="#57CC99" />
                                        <path d="M13.2983 15.3861C10.6963 15.252 8.49515 14.2293 6.78838 12.224C5.63912 10.8725 4.97737 9.28802 4.76836 7.523C4.67537 6.73517 4.70131 5.95077 4.98617 5.19377C5.21377 4.58847 5.65233 4.14954 6.16578 3.80065C6.64595 3.47426 7.24554 3.57702 7.68312 4.00568C8.29838 4.60609 8.90678 5.21139 9.50687 5.82893C10.0301 6.36719 10.0179 7.08406 9.49806 7.62869C9.36297 7.77011 9.21906 7.90272 9.08495 8.04463C8.77169 8.37395 8.76043 8.77862 9.07271 9.10941C9.67573 9.74913 10.2846 10.3831 10.8994 11.0114C11.2166 11.3364 11.7095 11.3364 12.0423 11.0261C12.2283 10.8534 12.3991 10.6635 12.5929 10.5006C13.0599 10.1091 13.6972 10.1165 14.1705 10.5035C14.2216 10.5444 14.2706 10.5878 14.3173 10.6337C14.8982 11.2131 15.4785 11.7932 16.0583 12.3742C16.6232 12.9433 16.6256 13.6705 16.0686 14.245C15.7147 14.61 15.3687 14.9883 14.8587 15.1395C14.6357 15.21 14.408 15.2649 14.1773 15.3039C13.8959 15.3464 13.6091 15.3587 13.2983 15.3861ZM13.2885 14.2014C14.0418 14.2205 14.7299 14.0859 15.2228 13.4405C15.2938 13.347 15.3261 13.2937 15.2312 13.2002C14.648 12.6235 14.0679 12.0436 13.4906 11.4607C13.4059 11.3755 13.3438 11.3824 13.264 11.4656C13.1172 11.6207 12.9644 11.7743 12.8049 11.9177C12.055 12.5925 10.8593 12.6028 10.1383 11.8981C9.4447 11.2209 8.77707 10.5158 8.12511 9.79839C7.61753 9.24055 7.52258 8.36514 7.90338 7.72216C8.09182 7.4036 8.37376 7.13985 8.62094 6.85751C8.69338 6.77383 8.7438 6.71658 8.64297 6.61626C8.05561 6.03396 7.47412 5.44676 6.88579 4.86592C6.85152 4.83216 6.74727 4.81014 6.72524 4.83216C6.46044 5.0964 6.15012 5.32149 6.03999 5.71296C5.81973 6.47974 5.87259 7.24848 6.03363 8.01282C6.45408 10.0044 7.46629 11.6261 9.1383 12.8049C10.3525 13.6727 11.7979 14.159 13.2899 14.2014H13.2885Z" fill="#57CC99" />
                                    </svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                        <path d="M15.4606 30.4354H9.5625V15.4595H15.4606V30.4354ZM10.5453 29.469H14.4774V16.426H10.5453V29.469Z" fill="#57CC99" />
                                        <path d="M32.1712 30.4354H26.2731V22.2228C26.2731 21.4223 25.6128 20.7733 24.7985 20.7733C23.9841 20.7733 23.3238 21.4223 23.3238 22.2228V30.4354H17.4257V15.4595H23.3238V16.4319C24.2139 15.7992 25.2848 15.4591 26.3834 15.4595C29.5721 15.4595 32.1707 18.0019 32.1707 21.1298L32.1712 30.4354ZM27.2563 29.469H31.1884V21.1298C31.182 18.5275 29.0318 16.4223 26.3843 16.4255C25.174 16.4255 24.0376 16.9266 23.1895 17.8323L22.3415 18.7443V16.4255H18.4094V29.469H22.3415V22.2228C22.3415 20.8885 23.4419 19.8073 24.7989 19.8073C26.1559 19.8073 27.2563 20.8885 27.2563 22.2228V29.469Z" fill="#57CC99" />
                                        <path d="M12.5113 14.4935C10.8826 14.4935 9.5625 13.1956 9.5625 11.5947C9.5625 9.99379 10.8826 8.69629 12.5113 8.69629C14.1401 8.69629 15.4601 9.99424 15.4601 11.5947C15.4569 13.1942 14.1387 14.4904 12.5113 14.4935ZM12.5113 9.66272C11.4256 9.66272 10.5453 10.528 10.5453 11.5951C10.5453 12.6623 11.4256 13.5276 12.5113 13.5276C13.597 13.5276 14.4774 12.6623 14.4774 11.5951C14.4774 10.528 13.597 9.66272 12.5113 9.66272Z" fill="#57CC99" />
                                    </svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                        <path d="M21.0998 31.305H17.4197C16.8048 31.305 16.3047 30.8131 16.3047 30.2081V22.0416H14.1579C13.543 22.0416 13.043 21.5497 13.043 20.9447V17.4452C13.043 16.8403 13.543 16.3484 14.1579 16.3484H16.3052V14.5962C16.3052 12.8586 16.86 11.3806 17.9089 10.3217C18.9624 9.25842 20.4346 8.69629 22.1671 8.69629L24.9738 8.7007C25.5873 8.70159 26.0864 9.1935 26.0864 9.79758V13.0467C26.0864 13.6517 25.5864 14.1436 24.972 14.1436L23.0823 14.1445C22.506 14.1445 22.3592 14.2579 22.3278 14.2928C22.2762 14.3507 22.2147 14.5141 22.2147 14.9649V16.3492H24.8301C25.0272 16.3492 25.2179 16.3969 25.3818 16.487C25.7354 16.6813 25.9554 17.0491 25.9554 17.4461L25.954 20.9456C25.954 21.5501 25.454 22.042 24.8391 22.042H22.2147V30.2086C22.2147 30.8135 21.7147 31.305 21.0998 31.305ZM17.6522 29.9794H20.8673V21.4481C20.8673 21.0445 21.2012 20.716 21.6114 20.716H24.6066L24.6079 17.6744H21.6114C21.2012 17.6744 20.8673 17.3459 20.8673 16.9423V14.9645C20.8673 14.4465 20.9207 13.8579 21.3179 13.415C21.7982 12.8798 22.5545 12.818 23.0819 12.818L24.739 12.8171V10.0259L22.1658 10.0219C19.382 10.0219 17.6517 11.775 17.6517 14.5971V16.9427C17.6517 17.3463 17.3178 17.6749 16.9075 17.6749H14.3904V20.7164H16.908C17.3182 20.7164 17.6522 21.045 17.6522 21.4486V29.9794Z" fill="#57CC99" />
                                    </svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                        <path d="M25.303 9.56592H15.5611C12.2539 9.56592 9.5625 12.2574 9.5625 15.5649V25.3061C9.5625 28.6148 12.2539 31.305 15.5611 31.305H25.3017C28.6103 31.305 31.3016 28.6135 31.3016 25.3061V15.5649C31.3016 12.2574 28.6103 9.56592 25.3017 9.56592H25.303ZM29.3728 25.3073C29.3728 27.5526 27.5469 29.3774 25.3017 29.3774H15.5611C13.3173 29.3774 11.4913 27.5513 11.4913 25.3073V15.5649C11.4913 13.3209 13.3173 11.4949 15.5611 11.4949H25.3017C27.5456 11.4949 29.3728 13.3209 29.3728 15.5649V25.3073Z" fill="#57CC99" />
                                        <path d="M20.4321 14.8345C17.3434 14.8345 14.8308 17.3473 14.8308 20.4361C14.8308 23.525 17.3434 26.0378 20.4321 26.0378C23.5208 26.0378 26.0334 23.525 26.0334 20.4361C26.0334 17.3473 23.5208 14.8345 20.4321 14.8345ZM20.4321 24.1088C18.4068 24.1088 16.7596 22.4615 16.7596 20.4361C16.7596 18.4107 18.4068 16.7634 20.4321 16.7634C22.4573 16.7634 24.1045 18.4107 24.1045 20.4361C24.1045 22.4615 22.4573 24.1088 20.4321 24.1088Z" fill="#57CC99" />
                                        <path d="M26.2687 13.1988C25.8971 13.1988 25.5319 13.3492 25.2696 13.6128C25.0059 13.8752 24.8542 14.2404 24.8542 14.6133C24.8542 14.9862 25.0059 15.3502 25.2696 15.6138C25.5319 15.8761 25.8971 16.0279 26.2687 16.0279C26.6403 16.0279 27.0055 15.8761 27.2691 15.6138C27.5327 15.3502 27.6832 14.9849 27.6832 14.6133C27.6832 14.2417 27.5327 13.8752 27.2691 13.6128C27.0068 13.3492 26.6416 13.1988 26.2687 13.1988Z" fill="#57CC99" />
                                    </svg>
                                    <span className="sr-only">Share on Instagram</span>
                                </a>
                            </div>
                        </div> */}

                    </main>

                    {/* =========================================================
              RIGHT COLUMN: Share, Related Content & Image Banner Space
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M20.0005 9.41476V10.5892C19.9883 10.6586 19.9736 10.7281 19.9638 10.7981C19.9036 11.2165 19.8727 11.6407 19.7807 12.0518C19.1596 14.8253 17.6374 16.9774 15.2341 18.4855C13.2199 19.7495 11.0115 20.206 8.65422 19.909C7.37199 19.7501 6.13558 19.3317 5.02044 18.6793C4.96078 18.6422 4.89348 18.6192 4.82362 18.6119C4.75375 18.6046 4.68315 18.6132 4.61712 18.6372C3.5403 18.9607 2.46054 19.2768 1.38225 19.5948L0 20.001C0.0239838 19.9105 0.0386689 19.8488 0.0562896 19.7886C0.488487 18.3235 0.918233 16.8585 1.3563 15.3954C1.38192 15.323 1.39083 15.2458 1.38235 15.1696C1.37387 15.0933 1.34823 15.0199 1.30736 14.955C0.575621 13.6884 0.140521 12.2726 0.0347501 10.8138C-0.142436 8.51683 0.383249 6.38824 1.66907 4.47495C3.25249 2.11881 5.45214 0.670385 8.25237 0.155118C8.62191 0.0871004 8.99734 0.0508906 9.36982 0H10.5445L10.9684 0.0489333C12.6062 0.229986 14.1264 0.749657 15.493 1.67547C17.8522 3.2751 19.3196 5.47172 19.8458 8.28146C19.9143 8.65434 19.9491 9.03601 20.0005 9.41476ZM1.72977 18.2594C1.81248 18.2389 1.85067 18.2316 1.88738 18.2208C2.86631 17.9321 3.84523 17.6424 4.82416 17.3517C4.881 17.3317 4.94182 17.3257 5.00147 17.3342C5.06112 17.3428 5.11783 17.3656 5.16679 17.4007C7.2661 18.7253 9.53183 19.1324 11.9566 18.5956C16.2791 17.6385 19.2638 13.4752 18.7822 9.0781C18.5957 7.37424 17.9952 5.82355 16.8899 4.51067C14.5939 1.78264 11.6625 0.701212 8.15545 1.37502C5.83148 1.82178 4.0097 3.10971 2.68374 5.06508C1.41749 6.93188 0.965711 9.00519 1.25841 11.2351C1.42836 12.5236 1.88805 13.7569 2.60297 14.8424C2.6361 14.889 2.65731 14.9429 2.66473 14.9996C2.67215 15.0562 2.66557 15.1138 2.64556 15.1673C2.44977 15.801 2.26524 16.4396 2.07729 17.0733C1.96324 17.4564 1.85164 17.8406 1.72977 18.2594Z" fill="#57CC99" />
                                            <path d="M13.2983 15.3861C10.6963 15.252 8.49515 14.2293 6.78838 12.224C5.63912 10.8725 4.97737 9.28802 4.76836 7.523C4.67537 6.73517 4.70131 5.95077 4.98617 5.19377C5.21377 4.58847 5.65233 4.14954 6.16578 3.80065C6.64595 3.47426 7.24554 3.57702 7.68312 4.00568C8.29838 4.60609 8.90678 5.21139 9.50687 5.82893C10.0301 6.36719 10.0179 7.08406 9.49806 7.62869C9.36297 7.77011 9.21906 7.90272 9.08495 8.04463C8.77169 8.37395 8.76043 8.77862 9.07271 9.10941C9.67573 9.74913 10.2846 10.3831 10.8994 11.0114C11.2166 11.3364 11.7095 11.3364 12.0423 11.0261C12.2283 10.8534 12.3991 10.6635 12.5929 10.5006C13.0599 10.1091 13.6972 10.1165 14.1705 10.5035C14.2216 10.5444 14.2706 10.5878 14.3173 10.6337C14.8982 11.2131 15.4785 11.7932 16.0583 12.3742C16.6232 12.9433 16.6256 13.6705 16.0686 14.245C15.7147 14.61 15.3687 14.9883 14.8587 15.1395C14.6357 15.21 14.408 15.2649 14.1773 15.3039C13.8959 15.3464 13.6091 15.3587 13.2983 15.3861ZM13.2885 14.2014C14.0418 14.2205 14.7299 14.0859 15.2228 13.4405C15.2938 13.347 15.3261 13.2937 15.2312 13.2002C14.648 12.6235 14.0679 12.0436 13.4906 11.4607C13.4059 11.3755 13.3438 11.3824 13.264 11.4656C13.1172 11.6207 12.9644 11.7743 12.8049 11.9177C12.055 12.5925 10.8593 12.6028 10.1383 11.8981C9.4447 11.2209 8.77707 10.5158 8.12511 9.79839C7.61753 9.24055 7.52258 8.36514 7.90338 7.72216C8.09182 7.4036 8.37376 7.13985 8.62094 6.85751C8.69338 6.77383 8.7438 6.71658 8.64297 6.61626C8.05561 6.03396 7.47412 5.44676 6.88579 4.86592C6.85152 4.83216 6.74727 4.81014 6.72524 4.83216C6.46044 5.0964 6.15012 5.32149 6.03999 5.71296C5.81973 6.47974 5.87259 7.24848 6.03363 8.01282C6.45408 10.0044 7.46629 11.6261 9.1383 12.8049C10.3525 13.6727 11.7979 14.159 13.2899 14.2014H13.2885Z" fill="#57CC99" />
                                        </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                            <path d="M15.4606 30.4354H9.5625V15.4595H15.4606V30.4354ZM10.5453 29.469H14.4774V16.426H10.5453V29.469Z" fill="#57CC99" />
                                            <path d="M32.1712 30.4354H26.2731V22.2228C26.2731 21.4223 25.6128 20.7733 24.7985 20.7733C23.9841 20.7733 23.3238 21.4223 23.3238 22.2228V30.4354H17.4257V15.4595H23.3238V16.4319C24.2139 15.7992 25.2848 15.4591 26.3834 15.4595C29.5721 15.4595 32.1707 18.0019 32.1707 21.1298L32.1712 30.4354ZM27.2563 29.469H31.1884V21.1298C31.182 18.5275 29.0318 16.4223 26.3843 16.4255C25.174 16.4255 24.0376 16.9266 23.1895 17.8323L22.3415 18.7443V16.4255H18.4094V29.469H22.3415V22.2228C22.3415 20.8885 23.4419 19.8073 24.7989 19.8073C26.1559 19.8073 27.2563 20.8885 27.2563 22.2228V29.469Z" fill="#57CC99" />
                                            <path d="M12.5113 14.4935C10.8826 14.4935 9.5625 13.1956 9.5625 11.5947C9.5625 9.99379 10.8826 8.69629 12.5113 8.69629C14.1401 8.69629 15.4601 9.99424 15.4601 11.5947C15.4569 13.1942 14.1387 14.4904 12.5113 14.4935ZM12.5113 9.66272C11.4256 9.66272 10.5453 10.528 10.5453 11.5951C10.5453 12.6623 11.4256 13.5276 12.5113 13.5276C13.597 13.5276 14.4774 12.6623 14.4774 11.5951C14.4774 10.528 13.597 9.66272 12.5113 9.66272Z" fill="#57CC99" />
                                        </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                            <path d="M21.0998 31.305H17.4197C16.8048 31.305 16.3047 30.8131 16.3047 30.2081V22.0416H14.1579C13.543 22.0416 13.043 21.5497 13.043 20.9447V17.4452C13.043 16.8403 13.543 16.3484 14.1579 16.3484H16.3052V14.5962C16.3052 12.8586 16.86 11.3806 17.9089 10.3217C18.9624 9.25842 20.4346 8.69629 22.1671 8.69629L24.9738 8.7007C25.5873 8.70159 26.0864 9.1935 26.0864 9.79758V13.0467C26.0864 13.6517 25.5864 14.1436 24.972 14.1436L23.0823 14.1445C22.506 14.1445 22.3592 14.2579 22.3278 14.2928C22.2762 14.3507 22.2147 14.5141 22.2147 14.9649V16.3492H24.8301C25.0272 16.3492 25.2179 16.3969 25.3818 16.487C25.7354 16.6813 25.9554 17.0491 25.9554 17.4461L25.954 20.9456C25.954 21.5501 25.454 22.042 24.8391 22.042H22.2147V30.2086C22.2147 30.8135 21.7147 31.305 21.0998 31.305ZM17.6522 29.9794H20.8673V21.4481C20.8673 21.0445 21.2012 20.716 21.6114 20.716H24.6066L24.6079 17.6744H21.6114C21.2012 17.6744 20.8673 17.3459 20.8673 16.9423V14.9645C20.8673 14.4465 20.9207 13.8579 21.3179 13.415C21.7982 12.8798 22.5545 12.818 23.0819 12.818L24.739 12.8171V10.0259L22.1658 10.0219C19.382 10.0219 17.6517 11.775 17.6517 14.5971V16.9427C17.6517 17.3463 17.3178 17.6749 16.9075 17.6749H14.3904V20.7164H16.908C17.3182 20.7164 17.6522 21.045 17.6522 21.4486V29.9794Z" fill="#57CC99" />
                                        </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#E6FFF4" stroke="#57CC99" />
                                            <path d="M25.303 9.56592H15.5611C12.2539 9.56592 9.5625 12.2574 9.5625 15.5649V25.3061C9.5625 28.6148 12.2539 31.305 15.5611 31.305H25.3017C28.6103 31.305 31.3016 28.6135 31.3016 25.3061V15.5649C31.3016 12.2574 28.6103 9.56592 25.3017 9.56592H25.303ZM29.3728 25.3073C29.3728 27.5526 27.5469 29.3774 25.3017 29.3774H15.5611C13.3173 29.3774 11.4913 27.5513 11.4913 25.3073V15.5649C11.4913 13.3209 13.3173 11.4949 15.5611 11.4949H25.3017C27.5456 11.4949 29.3728 13.3209 29.3728 15.5649V25.3073Z" fill="#57CC99" />
                                            <path d="M20.4321 14.8345C17.3434 14.8345 14.8308 17.3473 14.8308 20.4361C14.8308 23.525 17.3434 26.0378 20.4321 26.0378C23.5208 26.0378 26.0334 23.525 26.0334 20.4361C26.0334 17.3473 23.5208 14.8345 20.4321 14.8345ZM20.4321 24.1088C18.4068 24.1088 16.7596 22.4615 16.7596 20.4361C16.7596 18.4107 18.4068 16.7634 20.4321 16.7634C22.4573 16.7634 24.1045 18.4107 24.1045 20.4361C24.1045 22.4615 22.4573 24.1088 20.4321 24.1088Z" fill="#57CC99" />
                                            <path d="M26.2687 13.1988C25.8971 13.1988 25.5319 13.3492 25.2696 13.6128C25.0059 13.8752 24.8542 14.2404 24.8542 14.6133C24.8542 14.9862 25.0059 15.3502 25.2696 15.6138C25.5319 15.8761 25.8971 16.0279 26.2687 16.0279C26.6403 16.0279 27.0055 15.8761 27.2691 15.6138C27.5327 15.3502 27.6832 14.9849 27.6832 14.6133C27.6832 14.2417 27.5327 13.8752 27.2691 13.6128C27.0068 13.3492 26.6416 13.1988 26.2687 13.1988Z" fill="#57CC99" />
                                        </svg>
                                        <span className="sr-only">Share on Instagram</span>
                                    </a>
                                </div>
                            </div>

                            {/* RELATED PROJECTS */}
                            <div className="sidebar-widget">
                                <h3 className="widget-title">Related Projects</h3>
                                <div className="widget-mint-box">
                                    <div className="widget-card-list">
                                        {activeRelatedProjects.length > 0 ? (
                                            activeRelatedProjects.map((proj, idx) => renderSidebarCard(proj, idx))
                                        ) : (
                                            <div style={{ padding: "14px", fontSize: "13px", color: "#64748b" }}>
                                                No related projects available.
                                            </div>
                                        )}
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
                                        {activeTutorials.length > 0 ? (
                                            activeTutorials.map((tut, idx) => renderSidebarCard(tut, idx))
                                        ) : (
                                            <div style={{ padding: "14px", fontSize: "13px", color: "#64748b" }}>
                                                No tutorials available.
                                            </div>
                                        )}
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
                                        {activeMiniGuides.length > 0 ? (
                                            activeMiniGuides.map((guide, idx) => renderSidebarCard(guide, idx))
                                        ) : (
                                            <div style={{ padding: "14px", fontSize: "13px", color: "#64748b" }}>
                                                No mini guides available.
                                            </div>
                                        )}
                                    </div>
                                    <div className="widget-scrollbar-track" aria-hidden="true">
                                        <div className="widget-scrollbar-thumb" />
                                    </div>
                                </div>
                            </div>

                            {/* SIDEBAR BANNER PLACEHOLDER (Space for img banner) */}
                            <div className="sidebar-banner-placeholder" role="region" aria-label="Advertisement Banner">
                                {/* Space for img banner */}
                            </div>

                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Projectsdetails;
