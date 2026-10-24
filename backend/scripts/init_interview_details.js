import { pool, query } from '../config/db.js';

async function initInterviewDetailsTable() {
  console.log('--- Creating / Verifying interview_details Table ---');

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS interview_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        interview_id INT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT NULL,
        description LONGTEXT NULL,
        author VARCHAR(100) DEFAULT 'PrepHQ Editorial Team',
        publication_date VARCHAR(100) DEFAULT '24 Oct, 2026',
        status VARCHAR(50) DEFAULT 'published',
        level VARCHAR(50) DEFAULT 'All Levels',
        domain VARCHAR(100) DEFAULT 'Machine Learning',
        seo_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        keywords TEXT NULL,
        must_know_questions JSON NULL,
        qa_questions JSON NULL,
        scenario_questions JSON NULL,
        coding_questions JSON NULL,
        common_mistakes JSON NULL,
        quick_revision JSON NULL,
        section_headers JSON NULL,
        sections_order JSON NULL,
        sidebar_cards JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_slug (slug),
        KEY idx_interview_id (interview_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Checked table: interview_details (OK)');

    // ── Default Content Seed ───────────────────────────────────────────────
    const defaultMustKnow = [
      {
        id: "mk-1",
        num: "01",
        question: "What is Machine Learning?",
        default_open: true,
        simple_definition: "A subset of Artificial Intelligence that allows systems to autonomously learn representations from experience without being explicitly hard-coded.",
        explanation: "Machine Learning is a subset of Artificial Intelligence (AI) that provides systems the ability to automatically learn and extract representations from experience without being explicitly programmed. Instead of developing rigid, rule-based heuristics for every scenario, ML algorithms analyze patterns across historical training data to generalize and make predictions on unseen data.",
        highlight_box: "Key Takeaway / Interview Formulation: Explain that ML shifts software engineering from handcrafting logic to learning representations from data. Emphasize the end-to-end lifecycle: Problem Formulation → Data Collection → Feature Engineering → Model Training → Evaluation → Deployment & Monitoring.",
        example: "An email spam classifier processes historical emails labeled as spam or ham, analyzes token frequency vectors, and updates classification weights so it can accurately flag newly emerging phishing schemes.",
        interview_tip: "Highlight that ML models optimize an objective loss function over empirical data rather than executing human-written conditionals."
      },
      {
        id: "mk-2",
        num: "02",
        question: "What is the difference between AI, ML, and Deep Learning?",
        default_open: false,
        simple_definition: "AI is the broad field of intelligent machines; ML is the subfield focused on statistical data-driven learning; Deep Learning is specialized ML using deep neural networks.",
        explanation: "Artificial Intelligence (AI) is the broad discipline of building smart machines capable of tasks that typically require human cognition. Machine Learning (ML) is a subset of AI where systems learn statistical patterns from data. Deep Learning (DL) is a specialized branch of ML utilizing multi-layered Artificial Neural Networks (ANNs, CNNs, Transformers) to autonomously learn hierarchical representations from complex, unstructured data like raw images, audio, and text.",
        highlight_box: "Mental Model: AI is the universe, Machine Learning is the solar system, and Deep Learning is planet Earth. DL scales with massive datasets where classical ML performance plateaus.",
        example: "A chess program with minimax rules is AI; a spam filter using logistic regression is ML; a real-time autonomous driving vision model using convolutional networks is Deep Learning.",
        interview_tip: "Frame Deep Learning's primary advantage as automated feature extraction from unstructured high-dimensional spaces."
      },
      {
        id: "mk-3",
        num: "03",
        question: "What are supervised and unsupervised learning?",
        default_open: false,
        simple_definition: "Supervised learning learns input-output mappings from ground-truth labeled pairs (X, y); unsupervised learning discovers latent structures in unlabeled data (X).",
        explanation: "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs. Key tasks include Classification (discrete labels, e.g. fraud detection) and Regression (continuous values, e.g. house pricing). Unsupervised Learning uncovers hidden structures, clusters, or distributions from unlabeled data X without prior target guidance (e.g., K-Means customer segmentation, PCA dimensionality reduction).",
        highlight_box: "Interview Tip: Always highlight the data labeling cost trade-off. Supervised learning yields precise task-oriented performance but demands costly human annotations; unsupervised learning reveals latent data groupings automatically.",
        example: "Supervised: Predicting customer churn (0 or 1). Unsupervised: Clustering customers into behavioural cohorts using K-Means.",
        interview_tip: "Mention Semi-Supervised and Reinforcement Learning as natural extensions to demonstrate broader domain awareness."
      },
      {
        id: "mk-4",
        num: "04",
        question: "What is overfitting in Machine Learning and how do you prevent it?",
        default_open: false,
        simple_definition: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        explanation: "Overfitting occurs when a model learns the training data too closely—capturing noise, outliers, and random fluctuations rather than underlying generalizable signals. This manifests as near-perfect training accuracy alongside poor validation or test performance (high variance).",
        highlight_box: "Key Remedies: 1) Regularization (L1 Lasso for sparsity, L2 Ridge to penalize weights), 2) Cross-Validation (K-Fold CV for out-of-fold generalization), 3) Tree Pruning / Ensembling, 4) Early Stopping & Dropout, 5) Feature Selection & Data Augmentation.",
        example: "A decision tree grown to maximum depth memorizes every single training customer, creating a complex jagged decision boundary that misclassifies future customers.",
        interview_tip: "Connect overfitting directly to the Bias-Variance tradeoff: overfitting equals high variance and low bias."
      }
    ];

    const defaultQA = [
      {
        id: "qa-1",
        num: "01",
        difficulty: "beginner",
        question: "What is the difference between classification and regression?",
        answer: "Classification models predict discrete categorical labels or class probabilities (e.g. churn vs retain, spam vs ham). Regression models predict continuous numerical quantities (e.g. house prices, temperature).",
        explanation: "Classification evaluates using Accuracy, Precision, Recall, F1 Score, and ROC-AUC. Regression evaluates using Mean Squared Error (MSE), RMSE, Mean Absolute Error (MAE), and R² Score.",
        highlight_box: "Key Distinction: Output variable type. Discrete classes = Classification; Continuous real numbers = Regression.",
        example: "Classifying if a transaction is fraud (Yes/No) vs Predicting the dollar value of fraud loss.",
        interview_tip: "Mention that logistic regression outputs continuous probabilities that are thresholded into discrete classifications."
      },
      {
        id: "qa-2",
        num: "02",
        difficulty: "beginner",
        question: "What is a confusion matrix and what metrics are derived from it?",
        answer: "A confusion matrix is a 2x2 contingency table that cross-tabulates predicted classes against actual ground-truth classes.",
        explanation: "It contains True Positives (TP), True Negatives (TN), False Positives (FP - Type I Error), and False Negatives (FN - Type II Error). From these four cells, all major classification diagnostics are derived.",
        highlight_box: "Precision = TP / (TP + FP) | Recall = TP / (TP + FN) | F1 Score = 2*(Precision*Recall)/(Precision+Recall)",
        example: "In medical screening: TP = detected sick, FP = healthy patient alerted (Type I), FN = sick patient missed (Type II, critical).",
        interview_tip: "Always clarify which error (Type I or Type II) carries higher penalty in the company's business domain."
      },
      {
        id: "qa-3",
        num: "03",
        difficulty: "beginner",
        question: "Why do we split data into training, validation, and test sets?",
        answer: "To ensure that model evaluation is unbiased and that hyperparameter choices do not overfit to the test benchmark.",
        explanation: "The training set is used to learn model parameters (weights and biases). The validation set is used for hyperparameter tuning, feature selection, and detecting overfitting during iterative experimentation. The test set is held out until the very end to provide an unbiased evaluation of the final model's real-world generalization performance.",
        highlight_box: "Gold Standard Rule: Never expose the test set during feature engineering, imputation, or hyperparameter search.",
        example: "Standard split: 70% Train, 15% Validation, 15% Test.",
        interview_tip: "Emphasize data leakage prevention when computing scalers or encoders across splits."
      },
      {
        id: "qa-4",
        num: "04",
        difficulty: "intermediate",
        question: "How does the Bias-Variance tradeoff impact model generalization?",
        answer: "Bias is approximation error from overly simple assumptions; Variance is estimation error from hypersensitivity to training fluctuations.",
        explanation: "Total Prediction Error = Bias² + Variance + Irreducible Noise. As model complexity increases, bias monotonically decreases while variance increases. The optimal model balances both to minimize total generalization error.",
        highlight_box: "High Bias = Underfitting (e.g. Linear regression on circular data). High Variance = Overfitting (e.g. unconstrained 50-depth Decision Tree).",
        example: "Underfit linear model fails on both train and test. Overfit tree scores 100% on train but drops to 65% on test.",
        interview_tip: "State that ensembling techniques like Bagging target variance reduction, while Boosting targets bias reduction."
      },
      {
        id: "qa-5",
        num: "05",
        difficulty: "intermediate",
        question: "What is the difference between Bagging and Boosting ensemble methods?",
        answer: "Bagging trains base learners independently in parallel; Boosting trains base learners sequentially, where each learner corrects prior errors.",
        explanation: "Bagging (Bootstrap Aggregating, e.g. Random Forest) draws bootstrap resamples with replacement and averages outputs, directly slashing model variance. Boosting (e.g. XGBoost, LightGBM, CatBoost) fits trees sequentially to pseudo-residuals, driving down model bias.",
        highlight_box: "Bagging = Parallel base learners + Variance reduction. Boosting = Sequential residual correction + Bias reduction.",
        example: "Random Forest builds 500 independent trees. XGBoost builds trees iteratively, each correcting the weighted errors of earlier trees.",
        interview_tip: "Note that boosting is more sensitive to outliers and label noise than bagging."
      },
      {
        id: "qa-6",
        num: "06",
        difficulty: "intermediate",
        question: "How does Random Forest prevent overfitting compared to a single Decision Tree?",
        answer: "Through two distinct sources of randomness: Bootstrap aggregation of samples, and random feature subspace sampling at every split.",
        explanation: "A single decision tree often overfits because it splits nodes until pure leaves are achieved. Random Forest mitigates this through two layers of stochasticity: 1) Row sampling with replacement (bootstrap aggregating), and 2) Feature subspace sampling (evaluating only a random subset of sqrt(p) features at each split). This de-correlates individual trees so that averaging their predictions cancels out idiosyncratic noise.",
        highlight_box: "De-correlation Principle: If trees are correlated, averaging provides limited variance reduction. Random feature selection ensures trees remain diverse.",
        example: "With 100 features, each tree node chooses from only 10 randomly picked features, preventing dominant features from dominating every tree.",
        interview_tip: "Mention Out-Of-Bag (OOB) error as an inherent cross-validation mechanism built into Random Forest."
      },
      {
        id: "qa-7",
        num: "07",
        difficulty: "advanced",
        question: "How does XGBoost handle missing values and regularization internally?",
        answer: "XGBoost uses a default direction split-finding algorithm for missing entries and includes L1/L2 penalties directly in its objective function.",
        explanation: "During training, for any feature with missing values, XGBoost evaluates split gains by routing all missing entries to the left child and then to the right child, automatically selecting whichever branch maximizes objective loss reduction. Additionally, its objective function explicitly incorporates L1 (alpha) and L2 (lambda) penalties on leaf weights to control tree complexity.",
        highlight_box: "Key Advantage: XGBoost requires zero manual missing value imputation prior to training and automatically handles sparse feature matrices efficiently.",
        example: "If income is missing for 20% of users, XGBoost assigns missing values to the child branch that maximizes objective gain during gradient boosting.",
        interview_tip: "Highlight second-order Taylor expansion (gradients + Hessians) as another major reason for XGBoost's speed and precision."
      },
      {
        id: "qa-8",
        num: "08",
        difficulty: "advanced",
        question: "Explain Principal Component Analysis (PCA) and how eigenvectors represent maximum variance.",
        answer: "PCA is an orthogonal linear projection that transforms correlated features into uncorrelated principal components ordered by variance.",
        explanation: "PCA standardizes the feature matrix, calculates the covariance matrix, and performs eigendecomposition. The eigenvectors represent the directions (principal axes) along which the data exhibits maximum variance, while the corresponding eigenvalues indicate the magnitude of variance explained by each principal component.",
        highlight_box: "Key Formula: Covariance Matrix Sigma = (1/n) * X^T * X; Sigma * v = lambda * v, where v is eigenvector and lambda is eigenvalue.",
        example: "Compressing 200 customer sensor features into 10 principal components that retain 95% of total dataset variance.",
        interview_tip: "Remind the interviewer that PCA assumes linear relationships and requires feature standardization prior to decomposition."
      }
    ];

    const defaultScenario = [
      {
        id: "sc-1",
        num: "01",
        question: "Your model has 95% accuracy, but the business team says the model is not useful. What would you investigate?",
        default_open: true,
        problem_context: "In imbalanced classification problems (e.g., credit card fraud where 95% of transactions are legitimate and 5% are fraudulent), a naive dummy classifier predicting 'legitimate' 100% of the time achieves 95% accuracy while failing 100% of fraud detections. Raw accuracy is deceptive under class skew.",
        investigation_approach: "1. Review the full confusion matrix to check True Positives and False Negatives.\n2. Calculate Precision, Recall, and PR-AUC instead of raw accuracy.\n3. Inspect prediction distributions across critical customer sub-segments.\n4. Verify whether the training data had data leakage or temporal mismatch with production reality.",
        recommended_solution: "Align the evaluation metric with business ROI (e.g. financial cost of an undetected fraud vs customer friction of a false alert). Optimize the classification probability threshold according to a business payoff matrix and train using cost-sensitive learning or class weighting.",
        expected_outcome: "A high-recall model operating at an optimized threshold that catches 88% of fraudulent events while maintaining acceptable alert volume for fraud operations."
      },
      {
        id: "sc-2",
        num: "02",
        question: "Your model has high training accuracy (98%), but test accuracy is very low (72%). What is happening?",
        default_open: false,
        problem_context: "This is a classic manifestation of high variance / severe overfitting. The model has memorized idiosyncrasies, random noise, or spurious correlations in the training partition that do not generalize to out-of-sample data.",
        investigation_approach: "1. Verify that feature preprocessing (scaling, imputation, target encoding) was fitted strictly inside cross-validation folds without leakage.\n2. Evaluate feature importance to verify the model is not over-relying on a leaky proxy feature.\n3. Implement strong regularization (L1/L2 penalties, higher dropout rates, lower tree max_depth).\n4. Collect more training samples or apply data augmentation to improve coverage.",
        recommended_solution: "Prune trees, enforce minimum samples per leaf, add dropout or L2 weight decay, and simplify the feature set by dropping zero-importance features.",
        expected_outcome: "Generalization gap narrows: Training accuracy stabilizes around 86% while test accuracy rises to 84%."
      },
      {
        id: "sc-3",
        num: "03",
        question: "How would you handle missing data when 40% of rows have null values in a critical feature?",
        default_open: false,
        problem_context: "Dropping 40% of rows causes massive information loss and can introduce severe sample bias if data is Missing Not at Random (MNAR).",
        investigation_approach: "1. Analyze the missingness mechanism: Missing Completely at Random (MCAR) vs Missing at Random (MAR) vs Missing Not at Random (MNAR).\n2. Add a binary indicator column `is_missing` to preserve the informational signal that a value was withheld.\n3. Use gradient boosting models (XGBoost, LightGBM, CatBoost) that natively learn the optimal branch routing for missing values.\n4. Evaluate iterative model-based imputation (MICE or KNN) against median baseline on validation folds.",
        recommended_solution: "Add an `is_missing` indicator flag, then apply median/MICE imputation or pass directly into a tree-based ensemble that treats missingness as an informative signal.",
        expected_outcome: "Zero row loss, retention of latent signal behind why the feature was unrecorded, and improved validation stability."
      },
      {
        id: "sc-4",
        num: "04",
        question: "Your model latency is 350ms in production, but the API SLA is under 50ms. How do you optimize?",
        default_open: false,
        problem_context: "Real-time scoring pipelines require sub-50ms round-trip responses. Latency bottlenecks can stem from heavy neural architectures, feature preprocessing, or unoptimized inference runtimes.",
        investigation_approach: "1. Profile the latency breakdown: network serialization vs feature lookup vs model forward pass.\n2. Model Quantization: Convert 32-bit floating point weights to 8-bit integers (INT8) for 3-4x inference speedup with negligible accuracy loss.\n3. Knowledge Distillation: Train a compact student model to mimic the large teacher model's probability outputs.\n4. Export to ONNX Runtime / TensorRT: Leverage optimized C++ inference runtimes with kernel fusion.\n5. Inference Caching: Cache predictions for top 20% frequent query feature vectors using Redis to serve recurring requests in < 5ms.",
        recommended_solution: "Export model to ONNX runtime with INT8 quantization, pre-compute static features in a low-latency Redis feature store, and cache high-frequency query predictions.",
        expected_outcome: "Average inference latency drops from 350ms to 24ms, satisfying the SLA with 99.8% output parity."
      },
      {
        id: "sc-5",
        num: "05",
        question: "How do you detect and fix data drift or concept drift in a deployed ML model?",
        default_open: false,
        problem_context: "Data drift occurs when input feature distributions shift over time (P(X) changes). Concept drift occurs when the statistical relationship between features and the target variable shifts (P(y|X) changes, e.g. consumer spending patterns post-crisis).",
        investigation_approach: "1. Monitor Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) tests between training and production feature distributions.\n2. Track rolling prediction probability distributions and model confidence score drift.\n3. Establish automated alerting pipelines with Prometheus/Grafana or Evidently AI.\n4. Implement periodic retraining workflows with weighted time-decay on older data and shadow validation.",
        recommended_solution: "Establish automated continuous monitoring with PSI alerts. When drift exceeds threshold (PSI > 0.2), trigger an automated retraining pipeline on sliding window data.",
        expected_outcome: "Proactive model refresh cycles before real-world business accuracy deteriorates in production."
      }
    ];

    const defaultCoding = [
      {
        id: "code-1",
        num: "01",
        question: "Write Python code to find duplicate values in a list.",
        default_open: true,
        problem_statement: "Given a list of integers or strings, write an optimal Python function to identify and return all values that appear more than once in the collection.",
        difficulty: "Easy",
        language: "python",
        approach: "Iterate through the list while maintaining a `seen` set for O(1) average lookup. When an element is already present in `seen`, it is added to the `duplicates` set. Using a set for duplicates guarantees no repeated items in the output.",
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
        explanation: "The solution runs in a single linear pass. Memory consumption is bounded by the number of unique elements stored in the auxiliary hash sets.",
        time_complexity: "O(n) — single pass through the list",
        space_complexity: "O(n) — hash set auxiliary memory",
        sample_input: "[1, 2, 3, 2, 4, 5, 1, 6, 2]",
        sample_output: "[1, 2]"
      },
      {
        id: "code-2",
        num: "02",
        question: "Implement a linear regression gradient descent step in NumPy.",
        default_open: false,
        problem_statement: "Implement the parameter update equations for batch gradient descent in multivariable linear regression using vectorized NumPy operations.",
        difficulty: "Medium",
        language: "python",
        approach: "Vectorization replaces slow Python loops with BLAS-accelerated matrix dot products, computing gradient vectors across all training samples simultaneously.",
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
        explanation: "The code executes forward prediction, gradient computation via transpose dot product, and parameter updates along the negative gradient direction.",
        time_complexity: "O(m * n) per gradient step",
        space_complexity: "O(m) for prediction error vector",
        sample_input: "X: (1000, 10), y: (1000, 1)",
        sample_output: "Updated weights, updated bias, float loss"
      },
      {
        id: "code-3",
        num: "03",
        question: "Calculate Precision, Recall, and F1 Score from a confusion matrix in Python.",
        default_open: false,
        problem_statement: "Given the raw counts of TP, FP, TN, and FN, compute the standard classification evaluation metrics with zero-division safety.",
        difficulty: "Easy",
        language: "python",
        approach: "Calculate TP/(TP+FP) and TP/(TP+FN), guarding against 0-division before taking the harmonic mean for F1 score.",
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
        explanation: "Safeguards against ZeroDivisionError when classifiers make no positive predictions or when denominator sums equal zero.",
        time_complexity: "O(1) constant time",
        space_complexity: "O(1) constant space",
        sample_input: "tp=85, fp=15, tn=890, fn=10",
        sample_output: "{'Accuracy': 0.975, 'Precision': 0.85, 'Recall': 0.8947, 'F1_Score': 0.8718}"
      }
    ];

    const defaultMistakes = [
      {
        id: "cm-1",
        num: "01",
        title: "Memorizing Definitions Without Understanding Underlying Mechanics",
        default_open: true,
        mistake: "Reciting textbook formulas or Wikipedia definitions without being able to explain geometric intuition, trade-offs, or hyperparameter sensitivities.",
        why_it_happens: "Interviewers immediately probe deeper (e.g., 'Why would you choose L1 over L2 regularization for feature selection?'). Pure memorization unravels as soon as the interviewer alters the problem constraints.",
        how_to_avoid: "Focus on first principles: What optimization problem does this solve? What are the edge cases? When does this algorithm fail?",
        recommendation: "Practical Advice: Anchor every concept in a concrete project from your portfolio. For instance, explain L1 regularization by referencing how it zeroed out redundant sensor features in your project."
      },
      {
        id: "cm-2",
        num: "02",
        title: "Ignoring Practical Constraints and Real-World Trade-Offs",
        default_open: false,
        mistake: "Proposing massive 100-model ensembles or multi-billion parameter models for simple tabular problems without considering inference latency SLAs, memory constraints, or cloud compute costs.",
        why_it_happens: "Companies hire engineers who build maintainable, cost-effective software. A 0.2% accuracy boost is rarely worth a 10x inference latency penalty in production systems.",
        how_to_avoid: "Always analyze the full engineering lifecycle: training frequency, inference latency SLAs, cold-start latency, memory footprint, and maintenance overhead.",
        recommendation: "Practical Advice: Mention lighter baseline models first (e.g., Logistic Regression or LightGBM) before jumping into complex deep architectures."
      },
      {
        id: "cm-3",
        num: "03",
        title: "Confusing Related Concepts (Bias vs Variance, Precision vs Recall)",
        default_open: false,
        mistake: "Mixing up False Positives with False Negatives, or failing to identify when Precision is paramount (e.g. spam detection) vs Recall (e.g. cancer diagnosis or fraud).",
        why_it_happens: "Misidentifying metric trade-offs shows a lack of real-world deployment maturity.",
        how_to_avoid: "Anchor metrics to tangible real-world penalties: False Positive = An innocent user gets flagged; False Negative = A dangerous fraud slips past undetected.",
        recommendation: "Practical Advice: Explicitly state the business cost of both error types before recommending an evaluation threshold."
      },
      {
        id: "cm-4",
        num: "04",
        title: "Failing to Connect Technical Metrics to Business Value",
        default_open: false,
        mistake: "Focusing exclusively on technical scores (e.g. 'My model achieved 0.94 ROC-AUC') without explaining how it moved business KPIs (e.g. reduced customer churn by 14% or saved $120k in operational costs).",
        why_it_happens: "Stakeholders value business impact and return on investment over raw loss curve progression.",
        how_to_avoid: "Structure responses using the STAR method: Situation, Task, Action, and quantifiable Business Result.",
        recommendation: "Practical Advice: Always conclude technical project explanations with measurable outcomes and business metrics."
      }
    ];

    const defaultQuickRevision = [
      { id: "rev-1", concept: "Overfitting", explanation: "Model learns training noise and specific details, resulting in poor generalization to unseen test data." },
      { id: "rev-2", concept: "Underfitting", explanation: "Model is too simplistic to capture the underlying pattern in the dataset (high bias)." },
      { id: "rev-3", concept: "Precision", explanation: "Proportion of predicted positive instances that are actually true: TP / (TP + FP)." },
      { id: "rev-4", concept: "Recall", explanation: "Proportion of actual positive instances successfully identified: TP / (TP + FN)." },
      { id: "rev-5", concept: "F1 Score", explanation: "Harmonic mean of Precision and Recall, balancing both in imbalanced settings: 2 * (P * R) / (P + R)." },
      { id: "rev-6", concept: "Bias vs Variance", explanation: "Bias is error from erroneous model assumptions; Variance is error from sensitivity to training data fluctuations." },
      { id: "rev-7", concept: "ROC-AUC", explanation: "Area Under Receiver Operating Characteristic Curve measuring separation across all classification thresholds." },
      { id: "rev-8", concept: "Cross-Validation", explanation: "Resampling technique (e.g. K-Fold) used to evaluate generalization ability across unseen partitions." },
      { id: "rev-9", concept: "Feature Engineering", explanation: "Transforming raw variables into informative representations that maximize algorithm learning efficacy." },
      { id: "rev-10", concept: "Data Leakage", explanation: "Inadvertently sharing future, test, or target information with the training pipeline, falsely inflating validation scores." },
      { id: "rev-11", concept: "Loss Function", explanation: "Mathematical metric computing error between single prediction and true label for optimization." },
      { id: "rev-12", concept: "Cost Function", explanation: "Aggregate loss computed across entire dataset or batch to update model parameters." }
    ];

    const defaultSectionHeaders = {
      "must-know": {
        title: "01 · Must-Know Questions",
        subtitle: "Essential concepts every candidate must know before stepping into the interview."
      },
      "questions-answers": {
        title: "02 · Questions & Answers",
        subtitle: "Comprehensive questions categorized by experience level from fundamental to advanced."
      },
      "scenario-based": {
        title: "03 · Scenario-Based Interview Questions",
        subtitle: "Real-world production engineering trade-offs, debugging, and system decisions."
      },
      "coding-questions": {
        title: "04 · Practical & Coding Questions",
        subtitle: "Core algorithmic patterns and practical Python/NumPy implementations."
      },
      "common-mistakes": {
        title: "05 · Common Interview Mistakes",
        subtitle: "Pitfalls to avoid and recommended interview practices that interviewers look for."
      },
      "quick-revision": {
        title: "06 · Quick Revision",
        subtitle: "Fast memory refresher of essential terminology, formulas, and definitions."
      }
    };

    const defaultSectionsOrder = [
      "must-know",
      "questions-answers",
      "scenario-based",
      "coding-questions",
      "common-mistakes",
      "quick-revision"
    ];

    const defaultSidebarCards = {
      related_interviews: [
        {
          id: "rel-1",
          section_type: "related_interview",
          title: "Top List of Blockchain Project Ideas for Students",
          display_date: "18 Mar 2026",
          destination_url: "/interviews/blockchain-projects",
          linked_resource: "blockchain-projects",
          display_order: 1,
          status: "active",
          is_active: true
        },
        {
          id: "rel-2",
          section_type: "related_interview",
          title: "AI Project Ideas: Beginner to Final-Year Level",
          display_date: "10 Feb 2026",
          destination_url: "/interviews/ai-project-ideas",
          linked_resource: "ai-project-ideas",
          display_order: 2,
          status: "active",
          is_active: true
        },
        {
          id: "rel-3",
          section_type: "related_interview",
          title: "SQL Projects for Data Analysis: Detailed Guide",
          display_date: "12 Dec 2025",
          destination_url: "/interviews/sql-projects-for-data-analysis",
          linked_resource: "sql-projects-for-data-analysis",
          display_order: 3,
          status: "active",
          is_active: true
        }
      ],
      tutorials: [
        {
          id: "tut-1",
          section_type: "tutorial",
          title: "Python for Machine Learning Masterclass",
          display_date: "05 Aug 2025",
          destination_url: "/tutorials/python-machine-learning",
          linked_resource: "python-machine-learning",
          display_order: 1,
          status: "active",
          is_active: true
        },
        {
          id: "tut-2",
          section_type: "tutorial",
          title: "Deep Learning with PyTorch from Scratch",
          display_date: "12 Jul 2025",
          destination_url: "/tutorials/deep-learning-pytorch",
          linked_resource: "deep-learning-pytorch",
          display_order: 2,
          status: "active",
          is_active: true
        },
        {
          id: "tut-3",
          section_type: "tutorial",
          title: "Feature Engineering & Data Cleaning Guide",
          display_date: "22 Jun 2025",
          destination_url: "/tutorials/feature-engineering-guide",
          linked_resource: "feature-engineering-guide",
          display_order: 3,
          status: "active",
          is_active: true
        }
      ],
      mini_guides: [
        {
          id: "mg-1",
          section_type: "mini_guide",
          title: "ML Algorithms Cheatsheet & Formulas",
          display_date: "15 Jan 2026",
          destination_url: "/blogs/ml-cheatsheet",
          linked_resource: "ml-cheatsheet",
          display_order: 1,
          status: "active",
          is_active: true
        },
        {
          id: "mg-2",
          section_type: "mini_guide",
          title: "Model Evaluation Metrics Handbook",
          display_date: "02 Feb 2026",
          destination_url: "/blogs/evaluation-metrics",
          linked_resource: "evaluation-metrics",
          display_order: 2,
          status: "active",
          is_active: true
        },
        {
          id: "mg-3",
          section_type: "mini_guide",
          title: "System Design for ML Services Guide",
          display_date: "20 Feb 2026",
          destination_url: "/blogs/ml-system-design",
          linked_resource: "ml-system-design",
          display_order: 3,
          status: "active",
          is_active: true
        }
      ]
    };

    // Check if initial row exists
    const [existing] = await query('SELECT id FROM interview_details WHERE slug = ? LIMIT 1', [
      'machine-learning-interview-questions-answers'
    ]);

    if (!existing || existing.length === 0) {
      console.log('Seeding initial interview_details record...');
      await query(
        `INSERT INTO interview_details (
          slug, title, subtitle, description, author, publication_date, status, level, domain,
          seo_title, meta_description, keywords,
          must_know_questions, qa_questions, scenario_questions,
          coding_questions, common_mistakes, quick_revision,
          section_headers, sections_order, sidebar_cards
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'machine-learning-interview-questions-answers',
          'Machine Learning Interview Questions & Answers',
          'A practical collection of interview questions covering essential concepts, technical knowledge, real-world scenarios, and coding problems.',
          'Comprehensive interview preparation guide designed for machine learning engineers, data scientists, and AI practitioners.',
          'PrepHQ Editorial Team',
          '24 Oct, 2026',
          'published',
          'All Levels',
          'Machine Learning',
          'Machine Learning Interview Questions & Answers | PrepHQ',
          'Master machine learning interviews with top technical questions, scenario-based dilemmas, and coding problems with step-by-step answers.',
          'machine learning, interview questions, data science, ai interview, ml scenarios',
          JSON.stringify(defaultMustKnow),
          JSON.stringify(defaultQA),
          JSON.stringify(defaultScenario),
          JSON.stringify(defaultCoding),
          JSON.stringify(defaultMistakes),
          JSON.stringify(defaultQuickRevision),
          JSON.stringify(defaultSectionHeaders),
          JSON.stringify(defaultSectionsOrder),
          JSON.stringify(defaultSidebarCards)
        ]
      );
      console.log('Successfully seeded default interview_details record.');
    } else {
      console.log('Default interview_details record already exists.');
    }

    console.log('--- interview_details table setup complete ---');
  } catch (error) {
    console.error('Error initializing interview_details table:', error);
  } finally {
    await pool.end();
  }
}

initInterviewDetailsTable();
