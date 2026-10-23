import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiCalendar,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaLinkedinIn,
  FaXTwitter,
  FaWhatsapp,
  FaFacebookF,
} from "react-icons/fa6";
import {
  useInterviewList,
} from "../../services/interviewsServices";
import { useTutorialList } from "../../services/tutorialServices";
import { useBlogList } from "../../services/blogServices";
import "./InterviewsPage.css";

// ── Left Navigation Items ──────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "must-know", number: "01", label: "Must-Know Questions" },
  { id: "questions-answers", number: "02", label: "Questions & Answers" },
  { id: "scenario-based", number: "03", label: "Scenario-Based Questions" },
  { id: "coding-questions", number: "04", label: "Practical & Coding Questions" },
  { id: "common-mistakes", number: "05", label: "Common Interview Mistakes" },
  { id: "quick-revision", number: "06", label: "Quick Revision" },
];

// ── 1. Must-Know Questions Data ─────────────────────────────────────────
const MUST_KNOW_QUESTIONS = [
  {
    id: "mk-1",
    num: "01",
    question: "What is Machine Learning?",
    defaultOpen: true,
    explanation:
      "Machine Learning is a subset of Artificial Intelligence (AI) that provides systems the ability to automatically learn and extract representations from experience without being explicitly programmed. Instead of developing rigid, rule-based heuristics for every scenario, ML algorithms analyze patterns across historical training data to generalize and make predictions on unseen data.",
    characteristics: [
      "Data-driven learning rather than static deterministic rules.",
      "Iterative performance improvement as more diverse training samples are ingested.",
      "Generalization capability to perform accurately on new, out-of-sample data distributions.",
      "Scalability to high-dimensional spaces where manual feature programming fails.",
    ],
    highlightBox:
      "Key Takeaway / Interview Formulation: Explain that ML shifts software engineering from handcrafting logic to learning representations from data. Emphasize the end-to-end lifecycle: Problem Formulation → Data Collection → Feature Engineering → Model Training → Evaluation → Deployment & Monitoring.",
    example:
      "Example: An email spam classifier processes historical emails labeled as spam or ham, analyzes token frequency vectors, and updates classification weights so it can accurately flag newly emerging phishing schemes.",
    subQuestions: [
      "Supervised vs Unsupervised Learning?",
      "What is Overfitting and Underfitting?",
    ],
  },
  {
    id: "mk-2",
    num: "02",
    question: "What is the difference between AI, ML, and Deep Learning?",
    defaultOpen: false,
    explanation:
      "Artificial Intelligence (AI) is the broad discipline of building smart machines capable of tasks that typically require human cognition. Machine Learning (ML) is a subset of AI where systems learn statistical patterns from data. Deep Learning (DL) is a specialized branch of ML utilizing multi-layered Artificial Neural Networks (ANNs, CNNs, Transformers) to autonomously learn hierarchical representations from complex, unstructured data like raw images, audio, and text.",
    characteristics: [
      "AI is the overarching umbrella concept encompassing symbolic AI, expert systems, and learning systems.",
      "ML focuses on learning representations from structured tabular data using statistical models.",
      "DL eliminates manual feature engineering for unstructured data at the expense of high compute and data requirements.",
    ],
    highlightBox:
      "Mental Model: AI is the universe, Machine Learning is the solar system, and Deep Learning is planet Earth. DL scales with massive datasets where classical ML performance plateaus.",
    example:
      "Example: A chess program with minimax rules is AI; a spam filter using logistic regression is ML; a real-time autonomous driving vision model using convolutional networks is Deep Learning.",
  },
  {
    id: "mk-3",
    num: "03",
    question: "What are supervised and unsupervised learning?",
    defaultOpen: false,
    explanation:
      "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs. Key tasks include Classification (discrete labels, e.g. fraud detection) and Regression (continuous values, e.g. house pricing). Unsupervised Learning uncovers hidden structures, clusters, or distributions from unlabeled data X without prior target guidance (e.g., K-Means customer segmentation, PCA dimensionality reduction).",
    characteristics: [
      "Supervised: Direct error signal calculated via loss function between predictions and true labels.",
      "Unsupervised: Optimization relies on inherent data geometry, distances, or density estimations.",
      "Semi-Supervised: Combines a small set of labeled samples with a vast unlabeled dataset.",
      "Reinforcement Learning: Autonomous agents optimize long-term cumulative reward through trial and error.",
    ],
    highlightBox:
      "Interview Tip: Always highlight the data labeling cost trade-off. Supervised learning yields precise task-oriented performance but demands costly human annotations; unsupervised learning reveals latent data groupings automatically.",
  },
  {
    id: "mk-4",
    num: "04",
    question: "What is overfitting in Machine Learning and how do you prevent it?",
    defaultOpen: false,
    explanation:
      "Overfitting occurs when a model learns the training data too closely—capturing noise, outliers, and random fluctuations rather than underlying generalizable signals. This manifests as near-perfect training accuracy alongside poor validation or test performance (high variance).",
    characteristics: [
      "Symptom: Large discrepancy between low training loss and high validation loss.",
      "Underlying Cause: Excessive model capacity relative to the quantity or quality of training samples.",
    ],
    highlightBox:
      "Key Remedies: 1) Regularization (L1 Lasso for sparsity, L2 Ridge to penalize weights), 2) Cross-Validation (K-Fold CV for out-of-fold generalization), 3) Tree Pruning / Ensembling, 4) Early Stopping & Dropout, 5) Feature Selection & Data Augmentation.",
    example:
      "Example: A decision tree grown to maximum depth memorizes every single training customer, creating a complex jagged decision boundary that misclassifies future customers.",
  },
];

// ── 2. Questions & Answers Data (Filtered by Difficulty) ────────────────
const QA_QUESTIONS = [
  {
    id: "qa-1",
    num: "01",
    difficulty: "beginner",
    question: "What is the difference between classification and regression?",
    explanation:
      "Classification models predict discrete categorical labels or class probabilities (e.g. churn vs retain, spam vs ham). They are evaluated using Accuracy, Precision, Recall, F1 Score, and ROC-AUC. Regression models predict continuous numerical values (e.g. house prices, stock valuation, temperature), evaluated using Mean Squared Error (MSE), RMSE, Mean Absolute Error (MAE), and R² Score.",
    highlightBox:
      "Key Distinction: Output variable type. Discrete classes = Classification; Continuous real numbers = Regression.",
  },
  {
    id: "qa-2",
    num: "02",
    difficulty: "beginner",
    question: "What is a confusion matrix and what metrics are derived from it?",
    explanation:
      "A confusion matrix is a 2x2 contingency table that cross-tabulates predicted classes against actual ground-truth classes. It contains True Positives (TP), True Negatives (TN), False Positives (FP - Type I Error), and False Negatives (FN - Type II Error).",
    characteristics: [
      "Precision = TP / (TP + FP) — Fraction of predicted positives that were true.",
      "Recall (Sensitivity) = TP / (TP + FN) — Fraction of actual positives identified.",
      "Specificity = TN / (TN + FP) — Fraction of actual negatives identified.",
      "F1 Score = 2 * (Precision * Recall) / (Precision + Recall) — Harmonic mean.",
    ],
  },
  {
    id: "qa-3",
    num: "03",
    difficulty: "beginner",
    question: "Why do we split data into training, validation, and test sets?",
    explanation:
      "The training set is used to learn model parameters (weights and biases). The validation set is used for hyperparameter tuning, feature selection, and detecting overfitting during iterative experimentation. The test set is held out until the very end to provide an unbiased evaluation of the final model's real-world generalization performance.",
  },
  {
    id: "qa-4",
    num: "04",
    difficulty: "intermediate",
    question: "How does the Bias-Variance tradeoff impact model generalization?",
    explanation:
      "Bias is the error introduced by approximating a complex real-world problem with an overly simplified model (leading to underfitting). Variance is the error caused by the model being excessively sensitive to small fluctuations in the training dataset (leading to overfitting). Total Prediction Error = Bias² + Variance + Irreducible Noise. The goal is to find the balanced sweet spot that minimizes overall error.",
    highlightBox:
      "High Bias = Underfitting (Model too simple, e.g. linear model on non-linear data). High Variance = Overfitting (Model too complex, e.g. deep unpruned tree).",
  },
  {
    id: "qa-5",
    num: "05",
    difficulty: "intermediate",
    question: "What is the difference between Bagging and Boosting ensemble methods?",
    explanation:
      "Bagging (Bootstrap Aggregating, e.g. Random Forest) trains multiple independent base learners in parallel on random bootstrap subsets of the data and averages their outputs to reduce model variance. Boosting (e.g. XGBoost, AdaBoost, LightGBM) trains base learners sequentially where each subsequent model focuses on correcting the residual errors of preceding models, primarily reducing bias.",
    characteristics: [
      "Bagging: Parallel training, reduces variance, robust to noisy outliers.",
      "Boosting: Sequential training, reduces bias, highly competitive accuracy on tabular benchmarks.",
    ],
  },
  {
    id: "qa-6",
    num: "06",
    difficulty: "intermediate",
    question: "How does Random Forest prevent overfitting compared to a single Decision Tree?",
    explanation:
      "A single decision tree often overfits because it splits nodes until pure leaves are achieved. Random Forest mitigates this through two layers of stochasticity: 1) Row sampling with replacement (bootstrap aggregating), and 2) Feature subspace sampling (evaluating only a random subset of features at each split). This de-correlates individual trees so that averaging their predictions cancels out idiosyncratic noise.",
  },
  {
    id: "qa-7",
    num: "07",
    difficulty: "advanced",
    question: "How does XGBoost handle missing values and regularization internally?",
    explanation:
      "XGBoost employs a sparsity-aware split finding algorithm. During training, for any feature with missing values, it evaluates split gains by routing all missing entries to the left child and then to the right child, automatically selecting whichever branch maximizes objective loss reduction. Additionally, its objective function explicitly incorporates L1 (alpha) and L2 (lambda) penalties on leaf weights to control tree complexity.",
    highlightBox:
      "Key Advantage: XGBoost requires zero manual missing value imputation prior to training and automatically handles sparse feature matrices efficiently.",
  },
  {
    id: "qa-8",
    num: "08",
    difficulty: "advanced",
    question: "Explain Principal Component Analysis (PCA) and how eigenvectors represent maximum variance.",
    explanation:
      "PCA is an unsupervised orthogonal linear transformation. It standardizes the feature matrix, calculates the covariance matrix, and performs eigendecomposition. The eigenvectors represent the directions (principal axes) along which the data exhibits maximum variance, while the corresponding eigenvalues indicate the magnitude of variance explained by each principal component.",
  },
];

// ── 3. Scenario-Based Questions Data ────────────────────────────────────
const SCENARIO_QUESTIONS = [
  {
    id: "sc-1",
    num: "01",
    question:
      "Your model has 95% accuracy, but the business team says the model is not useful. What would you investigate?",
    defaultOpen: true,
    problemUnderstanding:
      "In imbalanced classification problems (e.g., credit card fraud where 95% of transactions are legitimate and 5% are fraudulent), a naive dummy classifier predicting 'legitimate' 100% of the time achieves 95% accuracy while failing 100% of fraud detections. Raw accuracy is deceptive under class skew.",
    investigationSteps: [
      "Review the full confusion matrix to check True Positives and False Negatives.",
      "Calculate Precision, Recall, and PR-AUC instead of raw accuracy.",
      "Inspect prediction distributions across critical customer sub-segments.",
      "Verify whether the training data had data leakage or temporal mismatch with production reality.",
    ],
    highlightBox:
      "Recommended Solution: Align the evaluation metric with business ROI (e.g. financial cost of an undetected fraud vs customer friction of a false alert). Optimize the classification probability threshold according to a business payoff matrix and train using cost-sensitive learning or class weighting.",
    followUp: [
      "How would you tune the probability threshold for high-recall requirements?",
      "Would you apply SMOTE oversampling or threshold shifting in production?",
    ],
  },
  {
    id: "sc-2",
    num: "02",
    question:
      "Your model has high training accuracy (98%), but test accuracy is very low (72%). What is happening?",
    defaultOpen: false,
    problemUnderstanding:
      "This is a classic manifestation of high variance / severe overfitting. The model has memorized idiosyncrasies, random noise, or spurious correlations in the training partition that do not generalize to out-of-sample data.",
    investigationSteps: [
      "Verify that feature preprocessing (scaling, imputation, target encoding) was fitted strictly inside cross-validation folds without leakage.",
      "Evaluate feature importance to verify the model is not over-relying on a leaky proxy feature.",
      "Implement strong regularization (L1/L2 penalties, higher dropout rates, lower tree max_depth).",
      "Collect more training samples or apply data augmentation to improve coverage.",
    ],
  },
  {
    id: "sc-3",
    num: "03",
    question:
      "How would you handle missing data when 40% of rows have null values in a critical feature?",
    defaultOpen: false,
    problemUnderstanding:
      "Dropping 40% of rows causes massive information loss and can introduce severe sample bias if data is Missing Not at Random (MNAR).",
    investigationSteps: [
      "Analyze the missingness mechanism: Missing Completely at Random (MCAR) vs Missing at Random (MAR) vs Missing Not at Random (MNAR).",
      "Add a binary indicator column `is_missing` to preserve the informational signal that a value was withheld.",
      "Use gradient boosting models (XGBoost, LightGBM, CatBoost) that natively learn the optimal branch routing for missing values.",
      "Evaluate iterative model-based imputation (MICE or KNN) against median baseline on validation folds.",
    ],
  },
  {
    id: "sc-4",
    num: "04",
    question:
      "Your model latency is 350ms in production, but the API SLA is under 50ms. How do you optimize?",
    defaultOpen: false,
    problemUnderstanding:
      "Real-time scoring pipelines require sub-50ms round-trip responses. Latency bottlenecks can stem from heavy neural architectures, feature preprocessing, or unoptimized inference runtimes.",
    investigationSteps: [
      "Model Quantization: Convert 32-bit floating point weights to 8-bit integers (INT8) for 3-4x inference speedup with negligible accuracy loss.",
      "Knowledge Distillation: Train a compact student model to mimic the large teacher model's probability outputs.",
      "Export to ONNX Runtime / TensorRT: Leverage optimized C++ inference runtimes with kernel fusion.",
      "Inference Caching: Cache predictions for top 20% frequent query feature vectors using Redis to serve recurring requests in < 5ms.",
    ],
  },
  {
    id: "sc-5",
    num: "05",
    question:
      "How do you detect and fix data drift or concept drift in a deployed ML model?",
    defaultOpen: false,
    problemUnderstanding:
      "Data drift occurs when input feature distributions shift over time (P(X) changes). Concept drift occurs when the statistical relationship between features and the target variable shifts (P(y|X) changes, e.g. consumer spending patterns post-crisis).",
    investigationSteps: [
      "Monitor Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) tests between training and production feature distributions.",
      "Track rolling prediction probability distributions and model confidence score drift.",
      "Establish automated alerting pipelines with Prometheus/Grafana or Evidently AI.",
      "Implement periodic retraining workflows with weighted time-decay on older data and shadow validation.",
    ],
  },
];

// ── 4. Practical & Coding Questions Data ─────────────────────────────────
const CODING_QUESTIONS = [
  {
    id: "code-1",
    num: "01",
    question: "Write Python code to find duplicate values in a list.",
    defaultOpen: true,
    problemStatement:
      "Given a list of integers or strings, write an optimal Python function to identify and return all values that appear more than once in the collection.",
    language: "python",
    code: `def find_duplicates(nums):
    """
    Finds all duplicate values in a list in O(n) time.
    Uses a hash set for O(1) membership lookups.
    """
    seen = set()
    duplicates = set()
    
    for item in nums:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
            
    return list(duplicates)

# Example Execution:
input_data = [1, 2, 3, 2, 4, 5, 1, 6, 2]
result = find_duplicates(input_data)
print("Duplicate values:", result)  # Output: [1, 2]`,
    explanation:
      "Approach: We iterate through the list while maintaining a `seen` set for O(1) average lookup. When an element is already present in `seen`, it is added to the `duplicates` set. Using a set for duplicates guarantees no repeated items in the output.",
    timeComplexity: "O(n) — single pass through the list",
    spaceComplexity: "O(n) — hash set auxiliary memory",
  },
  {
    id: "code-2",
    num: "02",
    question: "Implement a linear regression gradient descent step in NumPy.",
    defaultOpen: false,
    problemStatement:
      "Implement the parameter update equations for batch gradient descent in multivariable linear regression using vectorized NumPy operations.",
    language: "python",
    code: `import numpy as np

def gradient_descent_step(X, y, weights, bias, learning_rate):
    """
    Performs one parameter update step for Linear Regression.
    X: shape (m, n), y: shape (m, 1)
    """
    m = len(y)
    
    # 1. Forward pass: compute predictions
    y_pred = np.dot(X, weights) + bias
    error = y_pred - y
    
    # 2. Compute gradients
    dw = (1 / m) * np.dot(X.T, error)
    db = (1 / m) * np.sum(error)
    
    # 3. Update parameters
    weights -= learning_rate * dw
    bias -= learning_rate * db
    
    # 4. Compute Mean Squared Error (MSE) loss
    loss = (1 / (2 * m)) * np.sum(error ** 2)
    return weights, bias, loss`,
    explanation:
      "Vectorization replaces slow Python loops with BLAS-accelerated matrix dot products, computing gradient vectors across all training samples simultaneously.",
    timeComplexity: "O(m * n) per step",
    spaceComplexity: "O(m) for predictions and error vectors",
  },
  {
    id: "code-3",
    num: "03",
    question: "Calculate Precision, Recall, and F1 Score from a confusion matrix in Python.",
    defaultOpen: false,
    problemStatement:
      "Given the raw counts of TP, FP, TN, and FN, compute the standard classification evaluation metrics with zero-division safety.",
    language: "python",
    code: `def calculate_metrics(tp, fp, tn, fn):
    """
    Computes precision, recall, and F1-score with division safety.
    """
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    
    if (precision + recall) > 0:
        f1 = 2 * (precision * recall) / (precision + recall)
    else:
        f1 = 0.0
        
    accuracy = (tp + tn) / (tp + tn + fp + fn) if (tp + tn + fp + fn) > 0 else 0.0
    
    return {
        "Accuracy": round(accuracy, 4),
        "Precision": round(precision, 4),
        "Recall": round(recall, 4),
        "F1_Score": round(f1, 4),
    }

# Example:
print(calculate_metrics(tp=85, fp=15, tn=890, fn=10))
# Output: {'Accuracy': 0.975, 'Precision': 0.85, 'Recall': 0.8947, 'F1_Score': 0.8718}`,
    explanation:
      "Always include safeguards for cases where (TP + FP) or (Precision + Recall) equal zero to avoid runtime ZeroDivisionError exceptions in production evaluation scripts.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
  },
];

// ── 5. Common Interview Mistakes Data ───────────────────────────────────
const COMMON_MISTAKES = [
  {
    id: "cm-1",
    num: "01",
    title: "Memorizing Definitions Without Understanding Underlying Mechanics",
    defaultOpen: true,
    mistake:
      "Reciting textbook formulas or Wikipedia definitions without being able to explain geometric intuition, trade-offs, or hyperparameter sensitivities.",
    whyItMatters:
      "Interviewers immediately probe deeper (e.g., 'Why would you choose L1 over L2 regularization for feature selection?'). Pure memorization unravels as soon as the interviewer alters the problem constraints.",
    howToAvoid:
      "Focus on first principles: What optimization problem does this solve? What are the edge cases? When does this algorithm fail?",
    recommendation:
      "Practical Advice: Anchor every concept in a concrete project from your portfolio. For instance, explain L1 regularization by referencing how it zeroed out redundant sensor features in your IoT project.",
  },
  {
    id: "cm-2",
    num: "02",
    title: "Ignoring Practical Constraints and Real-World Trade-Offs",
    defaultOpen: false,
    mistake:
      "Proposing massive 100-model ensembles or multi-billion parameter models for simple tabular problems without considering inference latency SLAs, memory constraints, or cloud compute costs.",
    whyItMatters:
      "Companies hire engineers who build maintainable, cost-effective software. A 0.2% accuracy boost is rarely worth a 10x inference latency penalty in production systems.",
    howToAvoid:
      "Always analyze the full engineering lifecycle: training frequency, inference latency SLAs, cold-start latency, memory footprint, and maintenance overhead.",
    recommendation:
      "Practical Advice: Mention lighter baseline models first (e.g., Logistic Regression or LightGBM) before jumping into complex deep architectures.",
  },
  {
    id: "cm-3",
    num: "03",
    title: "Confusing Related Concepts (Bias vs Variance, Precision vs Recall)",
    defaultOpen: false,
    mistake:
      "Mixing up False Positives with False Negatives, or failing to identify when Precision is paramount (e.g. spam detection) vs Recall (e.g. cancer diagnosis or fraud).",
    whyItMatters:
      "Misidentifying metric trade-offs shows a lack of real-world deployment maturity.",
    howToAvoid:
      "Anchor metrics to tangible real-world penalties: False Positive = An innocent user gets flagged; False Negative = A dangerous fraud slips past undetected.",
    recommendation:
      "Practical Advice: Explicitly state the business cost of both error types before recommending an evaluation threshold.",
  },
  {
    id: "cm-4",
    num: "04",
    title: "Failing to Connect Technical Metrics to Business Value",
    defaultOpen: false,
    mistake:
      "Focusing exclusively on technical scores (e.g. 'My model achieved 0.94 ROC-AUC') without explaining how it moved business KPIs (e.g. reduced customer churn by 14% or saved $120k in operational costs).",
    whyItMatters:
      "Stakeholders value business impact and return on investment over raw loss curve progression.",
    howToAvoid:
      "Structure responses using the STAR method: Situation, Task, Action, and quantifiable Business Result.",
    recommendation:
      "Practical Advice: Always conclude technical project explanations with measurable outcomes and business metrics.",
  },
];

// ── 6. Quick Revision Table Data ────────────────────────────────────────
const QUICK_REVISION_DATA = [
  {
    concept: "Overfitting",
    explanation:
      "Model learns training noise and specific details, resulting in poor generalization to unseen test data.",
  },
  {
    concept: "Underfitting",
    explanation:
      "Model is too simplistic to capture the underlying pattern in the dataset (high bias).",
  },
  {
    concept: "Precision",
    explanation:
      "Proportion of predicted positive instances that are actually true: TP / (TP + FP).",
  },
  {
    concept: "Recall",
    explanation:
      "Proportion of actual positive instances successfully identified: TP / (TP + FN).",
  },
  {
    concept: "F1 Score",
    explanation:
      "Harmonic mean of Precision and Recall, balancing both in imbalanced settings: 2 * (P * R) / (P + R).",
  },
  {
    concept: "Cross-Validation",
    explanation:
      "Resampling technique (e.g. K-Fold) used to evaluate generalization ability across unseen partitions.",
  },
  {
    concept: "Feature Engineering",
    explanation:
      "Transforming raw variables into informative representations that maximize algorithm learning efficacy.",
  },
  {
    concept: "Data Leakage",
    explanation:
      "Inadvertently sharing future, test, or target information with the training pipeline, falsely inflating validation scores.",
  },
  {
    concept: "Bias and Variance",
    explanation:
      "Bias is error from erroneous model assumptions; Variance is error from sensitivity to training data fluctuations.",
  },
];

// ── Default Fallback Cards for Right Sidebar ────────────────────────────
const DEFAULT_RELATED_INTERVIEWS = [
  {
    title: "Top List of Blockchain Project Ideas for Students",
    date: "18 Mar 2026",
    link: "/interviews/blockchain-projects",
  },
  {
    title: "AI Project Ideas: Beginner to Final-Year Level",
    date: "10 Feb 2026",
    link: "/interviews/ai-project-ideas",
  },
  {
    title: "SQL Projects for Data Analysis: Detailed Guide",
    date: "12 Dec 2025",
    link: "/interviews/sql-projects-for-data-analysis",
  },
];

const DEFAULT_TUTORIALS = [
  {
    title: "Python for Machine Learning Masterclass",
    date: "05 Aug 2025",
    link: "/tutorials",
  },
  {
    title: "Deep Learning with PyTorch from Scratch",
    date: "12 Jul 2025",
    link: "/tutorials",
  },
  {
    title: "Feature Engineering & Data Cleaning Guide",
    date: "22 Jun 2025",
    link: "/tutorials",
  },
];

const DEFAULT_MINI_GUIDES = [
  {
    title: "ML Algorithms Cheatsheet & Formulas",
    date: "15 Jan 2026",
    link: "/blogs",
  },
  {
    title: "Model Evaluation Metrics Handbook",
    date: "02 Feb 2026",
    link: "/blogs",
  },
  {
    title: "System Design for ML Services Guide",
    date: "20 Feb 2026",
    link: "/blogs",
  },
];

// ==========================================================================
// MASTER INTERVIEWS PAGE COMPONENT
// ==========================================================================
const InterviewsPage = () => {
  const [activeSection, setActiveSection] = useState("must-know");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Accordion open/close states (keyed by item id)
  const [openAccordions, setOpenAccordions] = useState({
    "mk-1": true,
    "sc-1": true,
    "code-1": true,
    "cm-1": true,
  });

  // Difficulty filter for Section 2 (Questions & Answers)
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Dynamic data from API hooks
  const { data: apiInterviews } = useInterviewList();
  const { data: apiTutorials } = useTutorialList();
  const { data: apiBlogs } = useBlogList();

  // Related interviews from API or fallback
  const relatedInterviews =
    apiInterviews && apiInterviews.length > 0
      ? apiInterviews.slice(0, 3).map((item) => ({
          title: item.post_title,
          date: item.post_date ? new Date(item.post_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "18 Mar 2026",
          link: `/interviews/${item.post_name || item.ID}`,
        }))
      : DEFAULT_RELATED_INTERVIEWS;

  const tutorialsList =
    apiTutorials && apiTutorials.length > 0
      ? apiTutorials.slice(0, 3).map((item) => ({
          title: item.post_title || item.title,
          date: item.post_date ? new Date(item.post_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "05 Aug 2025",
          link: `/tutorials/${item.post_name || item.slug || ""}`,
        }))
      : DEFAULT_TUTORIALS;

  const miniGuidesList =
    apiBlogs && apiBlogs.length > 0
      ? apiBlogs.slice(0, 3).map((item) => ({
          title: item.post_title || item.title,
          date: item.post_date ? new Date(item.post_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "15 Jan 2026",
          link: `/blogs/${item.post_name || item.slug || ""}`,
        }))
      : DEFAULT_MINI_GUIDES;

  // Toggle accordion item
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered Q&A questions based on selected difficulty
  const filteredQaQuestions =
    selectedDifficulty === "all"
      ? QA_QUESTIONS
      : QA_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);

  // Smooth scroll handler with offset for sticky navbar
  const handleScrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Share click handlers
  const handleCopyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent("Machine Learning Interview Questions & Answers | PrepHQ");

  // Scrollspy to update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="interview-page-wrapper">
      <div className="container">
        <div className="interview-main-grid">

          {/* =========================================================
              LEFT COLUMN: "In This Project" Navigation
              ========================================================= */}
          <aside className="interview-left-sidebar" aria-label="Section Navigation">
            <div className="left-sidebar-inner">
              <h3 className="sidebar-nav-title">
                <FiLayers aria-hidden="true" />
                <span>In This Project</span>
              </h3>

              <nav className="sidebar-nav-list" role="navigation">
                {NAV_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`sidebar-nav-btn ${activeSection === sec.id ? "active" : ""}`}
                    onClick={() => handleScrollToSection(sec.id)}
                  >
                    <span className="nav-num-badge">{sec.number}</span>
                    <span className="nav-label-text">{sec.label}</span>
                  </button>
                ))}
              </nav>

              <button
                type="button"
                className="download-pdf-btn"
                onClick={() => window.print()}
                title="Download this interview preparation guide as PDF"
              >
                <FiDownload aria-hidden="true" />
                <span>Download PDF</span>
              </button>
            </div>
          </aside>

          {/* =========================================================
              CENTER COLUMN: Main Interview Content
              ========================================================= */}
          <main className="interview-center-content">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <header className="interview-page-header">
              <div className="header-text-col">
                <h1 className="interview-page-title">
                  Machine Learning Interview Questions & Answers
                </h1>
                <p className="interview-page-desc">
                  Prepare for Machine Learning interviews with essential concepts, practical examples, and frequently asked questions to help you build confidence.
                </p>
              </div>

              {/* Share Controls */}
              <div className="header-share-col" aria-label="Share Controls">
                <span className="share-label">Share</span>
                <div className="share-buttons-group">
                  <button
                    type="button"
                    className="share-icon-btn copy-btn"
                    onClick={handleCopyPageLink}
                    title="Copy Link to Clipboard"
                    aria-label="Copy Link"
                  >
                    {copiedLink ? <FiCheck /> : <FiCopy />}
                    {copiedLink && <span className="copy-feedback-tooltip">Copied!</span>}
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-icon-btn whatsapp-btn"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-icon-btn linkedin-btn"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-icon-btn twitter-btn"
                    title="Share on X (Twitter)"
                    aria-label="Share on X"
                  >
                    <FaXTwitter />
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-icon-btn facebook-btn"
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF />
                  </a>
                </div>
              </div>
            </header>

            {/* ── SECTION 01: Must-Know Questions ────────────────────── */}
            <section id="must-know" className="interview-section" aria-labelledby="heading-must-know">
              <div className="section-header-wrap">
                <h2 id="heading-must-know" className="section-main-heading">
                  Must-Know Questions
                </h2>
                <p className="section-sub-desc">
                  Essential interview questions candidates should prepare first.
                </p>
              </div>

              <div className="interview-accordion-group" role="region">
                {MUST_KNOW_QUESTIONS.map((item) => {
                  const isOpen = !!openAccordions[item.id];
                  return (
                    <article
                      key={item.id}
                      className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="accordion-header-btn"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-title-wrap">
                          <span className="accordion-num-badge">{item.num}</span>
                          <h3 className="accordion-title-text">{item.question}</h3>
                        </div>
                        <FiChevronDown
                          className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="accordion-body-content">
                          <div className="content-block">
                            <h4 className="content-subtitle">Detailed Explanation</h4>
                            <p>{item.explanation}</p>
                          </div>

                          {item.characteristics && (
                            <div className="content-block">
                              <h4 className="content-subtitle">Key Characteristics</h4>
                              <ul className="content-bullet-list">
                                {item.characteristics.map((char, idx) => (
                                  <li key={idx}>{char}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.highlightBox && (
                            <div className="mint-callout-box" role="note">
                              <strong>{item.highlightBox}</strong>
                            </div>
                          )}

                          {item.example && (
                            <div className="example-box">
                              {item.example}
                            </div>
                          )}

                          {item.subQuestions && (
                            <div className="sub-question-pills-wrap">
                              {item.subQuestions.map((sub, idx) => (
                                <div key={idx} className="sub-question-pill">
                                  <span>{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 02: Questions & Answers (Difficulty Filtered) ── */}
            <section id="questions-answers" className="interview-section" aria-labelledby="heading-qa">
              <div className="section-header-wrap">
                <h2 id="heading-qa" className="section-main-heading">
                  Questions & Answers
                </h2>
                <p className="section-sub-desc">
                  Explore comprehensive questions grouped by complexity level.
                </p>
              </div>

              {/* Difficulty Filter Bar */}
              <div className="difficulty-filters-bar" role="group" aria-label="Filter Questions by Difficulty">
                {["all", "beginner", "intermediate", "advanced"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`difficulty-filter-btn ${selectedDifficulty === diff ? "active" : ""}`}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>

              <div className="interview-accordion-group">
                {filteredQaQuestions.map((item) => {
                  const isOpen = !!openAccordions[item.id];
                  return (
                    <article
                      key={item.id}
                      className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="accordion-header-btn"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-title-wrap">
                          <span className="accordion-num-badge">{item.num}</span>
                          <h3 className="accordion-title-text">{item.question}</h3>
                        </div>
                        <FiChevronDown
                          className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="accordion-body-content">
                          <p>{item.explanation}</p>

                          {item.characteristics && (
                            <ul className="content-bullet-list">
                              {item.characteristics.map((char, idx) => (
                                <li key={idx}>{char}</li>
                              ))}
                            </ul>
                          )}

                          {item.highlightBox && (
                            <div className="mint-callout-box" role="note">
                              <strong>{item.highlightBox}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 03: Scenario-Based Interview Questions ──────── */}
            <section id="scenario-based" className="interview-section" aria-labelledby="heading-scenarios">
              <div className="section-header-wrap">
                <h2 id="heading-scenarios" className="section-main-heading">
                  Scenario-Based Interview Questions
                </h2>
                <p className="section-sub-desc">
                  Real-world interview situations and practical problem solving.
                </p>
              </div>

              <div className="interview-accordion-group">
                {SCENARIO_QUESTIONS.map((item) => {
                  const isOpen = !!openAccordions[item.id];
                  return (
                    <article
                      key={item.id}
                      className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="accordion-header-btn"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-title-wrap">
                          <span className="accordion-num-badge">{item.num}</span>
                          <h3 className="accordion-title-text">{item.question}</h3>
                        </div>
                        <FiChevronDown
                          className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="accordion-body-content">
                          <div className="content-block">
                            <h4 className="content-subtitle">1. Problem Understanding</h4>
                            <p>{item.problemUnderstanding}</p>
                          </div>

                          <div className="content-block">
                            <h4 className="content-subtitle">2. Investigation Steps</h4>
                            <ul className="content-bullet-list">
                              {item.investigationSteps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>

                          {item.highlightBox && (
                            <div className="mint-callout-box" role="note">
                              <strong>{item.highlightBox}</strong>
                            </div>
                          )}

                          {item.followUp && (
                            <div className="content-block">
                              <h4 className="content-subtitle">3. Practical Considerations & Follow-Ups</h4>
                              <ul className="content-bullet-list">
                                {item.followUp.map((fu, idx) => (
                                  <li key={idx}>{fu}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 04: Practical & Coding Questions ────────────── */}
            <section id="coding-questions" className="interview-section" aria-labelledby="heading-coding">
              <div className="section-header-wrap">
                <h2 id="heading-coding" className="section-main-heading">
                  Practical & Coding Questions
                </h2>
                <p className="section-sub-desc">
                  Implementation and coding exercises with algorithmic explanations.
                </p>
              </div>

              <div className="interview-accordion-group">
                {CODING_QUESTIONS.map((item) => {
                  const isOpen = !!openAccordions[item.id];
                  return (
                    <article
                      key={item.id}
                      className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="accordion-header-btn"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-title-wrap">
                          <span className="accordion-num-badge">{item.num}</span>
                          <h3 className="accordion-title-text">{item.question}</h3>
                        </div>
                        <FiChevronDown
                          className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="accordion-body-content">
                          <div className="content-block">
                            <h4 className="content-subtitle">Problem Statement</h4>
                            <p>{item.problemStatement}</p>
                          </div>

                          {/* Dark Teal Code Container */}
                          <div className="interview-code-container" role="region" aria-label="Code snippet">
                            <div className="code-header-bar">
                              <span className="code-lang-label">{item.language || "Python"}</span>
                              <button
                                type="button"
                                className="code-copy-btn"
                                onClick={() => handleCopyCode(item.code, item.id)}
                                title="Copy code snippet"
                              >
                                {copiedCodeId === item.id ? (
                                  <>
                                    <FiCheck aria-hidden="true" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <FiCopy aria-hidden="true" /> Copy Code
                                  </>
                                )}
                              </button>
                            </div>

                            <pre className="interview-code-pre">
                              <code>{item.code}</code>
                            </pre>
                          </div>

                          <div className="content-block">
                            <h4 className="content-subtitle">Approach & Complexity</h4>
                            <p>{item.explanation}</p>
                            <div className="complexity-meta-bar">
                              <div>Time Complexity: <span>{item.timeComplexity}</span></div>
                              <div>Space Complexity: <span>{item.spaceComplexity}</span></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 05: Common Interview Mistakes ──────────────── */}
            <section id="common-mistakes" className="interview-section" aria-labelledby="heading-mistakes">
              <div className="section-header-wrap">
                <h2 id="heading-mistakes" className="section-main-heading">
                  Common Interview Mistakes
                </h2>
                <p className="section-sub-desc">
                  Frequent mistakes candidates should avoid during technical interviews.
                </p>
              </div>

              <div className="interview-accordion-group">
                {COMMON_MISTAKES.map((item) => {
                  const isOpen = !!openAccordions[item.id];
                  return (
                    <article
                      key={item.id}
                      className={`interview-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="accordion-header-btn"
                        onClick={() => toggleAccordion(item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-title-wrap">
                          <span className="accordion-num-badge">{item.num}</span>
                          <h3 className="accordion-title-text">{item.title}</h3>
                        </div>
                        <FiChevronDown
                          className={`accordion-chevron-icon ${isOpen ? "rotate" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="accordion-body-content">
                          <div className="content-block">
                            <h4 className="content-subtitle">What the Mistake Is</h4>
                            <p>{item.mistake}</p>
                          </div>

                          <div className="content-block">
                            <h4 className="content-subtitle">Why It Matters</h4>
                            <p>{item.whyItMatters}</p>
                          </div>

                          <div className="content-block">
                            <h4 className="content-subtitle">How to Avoid It</h4>
                            <p>{item.howToAvoid}</p>
                          </div>

                          {item.recommendation && (
                            <div className="mint-callout-box" role="note">
                              <strong>{item.recommendation}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 06: Quick Revision ──────────────────────────── */}
            <section id="quick-revision" className="interview-section" aria-labelledby="heading-revision">
              <div className="section-header-wrap">
                <h2 id="heading-revision" className="section-main-heading">
                  Quick Revision
                </h2>
                <p className="section-sub-desc">
                  Quick-reference summary table before entering your interview.
                </p>
              </div>

              <div className="revision-table-container">
                <table className="revision-table">
                  <thead>
                    <tr>
                      <th scope="col">Concept</th>
                      <th scope="col">Concise Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUICK_REVISION_DATA.map((row, idx) => (
                      <tr key={idx}>
                        <td className="concept-name-cell">{row.concept}</td>
                        <td>{row.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </main>

          {/* =========================================================
              RIGHT COLUMN: Related Content Widgets Sidebar
              ========================================================= */}
          <aside className="interview-right-sidebar" aria-label="Related Resources">

            {/* 1. Related Interview Questions */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Related Interview Questions</h3>
              <div className="widget-mint-box">
                {relatedInterviews.map((item, idx) => (
                  <Link key={idx} to={item.link} className="widget-card-item">
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Tutorials */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Tutorials</h3>
              <div className="widget-mint-box">
                {tutorialsList.map((item, idx) => (
                  <Link key={idx} to={item.link} className="widget-card-item">
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Mini Guides */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Mini Guides</h3>
              <div className="widget-mint-box">
                {miniGuidesList.map((item, idx) => (
                  <Link key={idx} to={item.link} className="widget-card-item">
                    <div className="widget-card-info">
                      <h4 className="widget-card-title">{item.title}</h4>
                      <div className="widget-card-meta">
                        <FiCalendar aria-hidden="true" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div className="widget-action-icon-wrap" aria-hidden="true">
                      <FiExternalLink />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Promotional Banner */}
            <div className="sidebar-promo-banner" role="region" aria-label="Promotion">
              <span>Advertisement / Promotional Banner</span>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default InterviewsPage;
