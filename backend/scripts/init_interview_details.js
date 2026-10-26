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
        simple_explanation: "Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself.",
        simple_definition: "Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself.",
        technical_explanation: "ML algorithms fit a function f(x) to data by minimising a loss, then generalise to unseen inputs. Learning is driven by data, an objective, and an optimisation procedure.",
        explanation: "ML algorithms fit a function f(x) to data by minimising a loss, then generalise to unseen inputs. Learning is driven by data, an objective, and an optimisation procedure.",
        interview_answer: "Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.",
        highlight_box: "Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.",
        example: "A spam filter learns from thousands of labelled emails which words and senders suggest spam.",
        follow_up_questions: [
          {
            id: "fu-1-1",
            question: "How is ML different from traditional programming?",
            hint: "Try answering this aloud first, then link it back to the main question above."
          },
          {
            id: "fu-1-2",
            question: "What are the main types of ML?",
            hint: "Try answering this aloud first, then link it back to the main question above."
          }
        ]
      },
      {
        id: "mk-2",
        num: "02",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "AI is the broad field of intelligent machines; ML is the subfield focused on statistical data-driven learning; Deep Learning is specialized ML using deep neural networks.",
        simple_definition: "AI is the broad field of intelligent machines; ML is the subfield focused on statistical data-driven learning; Deep Learning is specialized ML using deep neural networks.",
        technical_explanation: "Artificial Intelligence encompasses rule-based and data-driven systems. Machine Learning applies statistical optimization over structured representations. Deep Learning utilizes multi-layered Artificial Neural Networks to autonomously learn hierarchical representations from complex, unstructured data.",
        explanation: "Artificial Intelligence encompasses rule-based and data-driven systems. Machine Learning applies statistical optimization over structured representations. Deep Learning utilizes multi-layered Artificial Neural Networks to autonomously learn hierarchical representations from complex, unstructured data.",
        interview_answer: "AI is the overarching discipline of creating intelligent agents, Machine Learning is the branch that learns models from data, and Deep Learning is a specialized ML paradigm utilizing neural architectures with representation learning.",
        highlight_box: "AI is the overarching discipline of creating intelligent agents, Machine Learning is the branch that learns models from data, and Deep Learning is a specialized ML paradigm utilizing neural architectures with representation learning.",
        example: "A chess engine using minimax rules is AI; a churn predictor using gradient boosting is ML; self-driving perception using convolutional vision models is Deep Learning.",
        follow_up_questions: [
          {
            id: "fu-2-1",
            question: "When should you choose classical ML over Deep Learning?",
            hint: "Focus on dataset size, training compute budget, and model explainability constraints."
          }
        ]
      },
      {
        id: "mk-3",
        num: "03",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "Supervised learning learns input-output mappings from ground-truth labeled pairs; unsupervised learning discovers latent structures in unlabeled data.",
        simple_definition: "Supervised learning learns input-output mappings from ground-truth labeled pairs; unsupervised learning discovers latent structures in unlabeled data.",
        technical_explanation: "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs (Classification & Regression). Unsupervised Learning discovers latent clustering, distributions, or manifold representations from unlabeled data X without supervisor guidance.",
        explanation: "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs (Classification & Regression). Unsupervised Learning discovers latent clustering, distributions, or manifold representations from unlabeled data X without supervisor guidance.",
        interview_answer: "Supervised learning minimizes empirical risk over labeled target pairs, while unsupervised learning optimizes data density or reconstruction loss without target annotations.",
        highlight_box: "Supervised learning minimizes empirical risk over labeled target pairs, while unsupervised learning optimizes data density or reconstruction loss without target annotations.",
        example: "Supervised: Predicting customer churn (0/1). Unsupervised: Segmenting customers into behavioural cohorts using K-Means.",
        follow_up_questions: [
          {
            id: "fu-3-1",
            question: "How do you evaluate clustering without ground-truth labels?",
            hint: "Discuss Silhouette Score, Davies-Bouldin index, and domain inspection."
          }
        ]
      },
      {
        id: "mk-4",
        num: "04",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        simple_definition: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        technical_explanation: "Overfitting occurs when high model capacity fits sample-specific noise rather than the underlying data generating distribution, causing low training error but high generalization error (high variance).",
        explanation: "Overfitting occurs when high model capacity fits sample-specific noise rather than the underlying data generating distribution, causing low training error but high generalization error (high variance).",
        interview_answer: "Overfitting reflects high variance where the model learns spurious correlations in training data. We prevent it via L1/L2 regularization, cross-validation, tree pruning, early stopping, and dataset expansion.",
        highlight_box: "Overfitting reflects high variance where the model learns spurious correlations in training data. We prevent it via L1/L2 regularization, cross-validation, tree pruning, early stopping, and dataset expansion.",
        example: "A decision tree grown without depth limits isolates every single training outlier, creating erratic decision boundaries that fail in production.",
        follow_up_questions: [
          {
            id: "fu-4-1",
            question: "How do L1 and L2 regularization differ in preventing overfitting?",
            hint: "Explain the geometric weight penalty: L1 (Lasso) enforces sparsity, L2 (Ridge) shrinks weight magnitudes."
          }
        ]
      }
    ];

    const defaultQA = [
      {
        id: "qa-1",
        num: "01",
        difficulty: "beginner",
        question: "What is Machine Learning?",
        default_open: true,
        simple_explanation: "Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself.",
        simple_definition: "Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself.",
        answer: "Instead of writing rules by hand, you show a computer many examples and let it work out the rules itself.",
        technical_explanation: "ML algorithms fit a function f(x) to data by minimising a loss, then generalise to unseen inputs. Learning is driven by data, an objective, and an optimisation procedure.",
        explanation: "ML algorithms fit a function f(x) to data by minimising a loss, then generalise to unseen inputs. Learning is driven by data, an objective, and an optimisation procedure.",
        interview_answer: "Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.",
        highlight_box: "Machine learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed for every outcome.",
        example: "A spam filter learns from thousands of labelled emails which words and senders suggest spam.",
        follow_up_questions: [
          {
            id: "qa-fu-1-1",
            question: "How is ML different from traditional programming?",
            hint: "Try answering this aloud first, then link it back to the main question above."
          },
          {
            id: "qa-fu-1-2",
            question: "What are the main types of ML?",
            hint: "Try answering this aloud first, then link it back to the main question above."
          }
        ]
      },
      {
        id: "qa-2",
        num: "02",
        difficulty: "beginner",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "AI is the broad vision of smart machines, ML is the method of learning from data, and Deep Learning is a specialized ML technique using deep neural networks.",
        simple_definition: "AI is the broad vision of smart machines, ML is the method of learning from data, and Deep Learning is a specialized ML technique using deep neural networks.",
        answer: "AI is the broad vision of smart machines, ML is the method of learning from data, and Deep Learning is a specialized ML technique using deep neural networks.",
        technical_explanation: "AI encompasses any technique enabling computers to mimic human intelligence (including symbolic logic, expert systems, and heuristics). Machine Learning is a subset where statistical models learn patterns directly from data. Deep Learning is a specialized sub-branch of ML based on multi-layered artificial neural networks (ANNs) that perform hierarchical representation learning directly from raw perceptual data without manual feature engineering.",
        explanation: "AI encompasses any technique enabling computers to mimic human intelligence (including symbolic logic, expert systems, and heuristics). Machine Learning is a subset where statistical models learn patterns directly from data. Deep Learning is a specialized sub-branch of ML based on multi-layered artificial neural networks (ANNs) that perform hierarchical representation learning directly from raw perceptual data without manual feature engineering.",
        interview_answer: "AI is the overarching umbrella for intelligent systems; ML provides statistical learning algorithms that train on data; Deep Learning powers multi-layer neural networks that extract high-level abstract representations from raw sensory inputs.",
        highlight_box: "AI is the overarching umbrella for intelligent systems; ML provides statistical learning algorithms that train on data; Deep Learning powers multi-layer neural networks that extract high-level abstract representations from raw sensory inputs.",
        example: "AI: A chess-playing system. ML: Spam email detection. Deep Learning: Autonomous self-driving vision or GPT language models.",
        follow_up_questions: [
          {
            id: "qa-fu-2-1",
            question: "When should you choose classical ML over Deep Learning?",
            hint: "Focus on dataset size, training compute budget, and model explainability constraints."
          }
        ]
      },
      {
        id: "qa-3",
        num: "03",
        difficulty: "beginner",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "Supervised learning learns input-output mappings from ground-truth labeled pairs; unsupervised learning discovers latent structures in unlabeled data.",
        simple_definition: "Supervised learning learns input-output mappings from ground-truth labeled pairs; unsupervised learning discovers latent structures in unlabeled data.",
        answer: "Supervised learning learns input-output mappings from ground-truth labeled pairs; unsupervised learning discovers latent structures in unlabeled data.",
        technical_explanation: "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs (Classification & Regression). Unsupervised Learning discovers latent clustering, distributions, or manifold representations from unlabeled data X without supervisor guidance.",
        explanation: "Supervised Learning trains models on labeled ground truth (X, y) to map inputs to target outputs (Classification & Regression). Unsupervised Learning discovers latent clustering, distributions, or manifold representations from unlabeled data X without supervisor guidance.",
        interview_answer: "Supervised learning minimizes empirical risk over labeled target pairs, while unsupervised learning optimizes data density or reconstruction loss without target annotations.",
        highlight_box: "Supervised learning minimizes empirical risk over labeled target pairs, while unsupervised learning optimizes data density or reconstruction loss without target annotations.",
        example: "Supervised: Predicting customer churn (0/1). Unsupervised: Segmenting customers into behavioural cohorts using K-Means.",
        follow_up_questions: [
          {
            id: "qa-fu-3-1",
            question: "How do you evaluate clustering without ground-truth labels?",
            hint: "Discuss Silhouette Score, Davies-Bouldin index, and domain inspection."
          }
        ]
      },
      {
        id: "qa-4",
        num: "04",
        difficulty: "beginner",
        question: "What is the difference between AI, ML and Deep Learning?",
        default_open: false,
        simple_explanation: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        simple_definition: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        answer: "Overfitting happens when a model memorizes training noise instead of general patterns, performing excellently on training data but poorly on test data.",
        technical_explanation: "Overfitting occurs when high model capacity fits sample-specific noise rather than the underlying data generating distribution, causing low training error but high generalization error (high variance).",
        explanation: "Overfitting occurs when high model capacity fits sample-specific noise rather than the underlying data generating distribution, causing low training error but high generalization error (high variance).",
        interview_answer: "Overfitting reflects high variance where the model learns spurious correlations in training data. We prevent it via L1/L2 regularization, cross-validation, tree pruning, early stopping, and dataset expansion.",
        highlight_box: "Overfitting reflects high variance where the model learns spurious correlations in training data. We prevent it via L1/L2 regularization, cross-validation, tree pruning, early stopping, and dataset expansion.",
        example: "A decision tree grown without depth limits isolates every single training outlier, creating erratic decision boundaries that fail in production.",
        follow_up_questions: [
          {
            id: "qa-fu-4-1",
            question: "How do L1 and L2 regularization differ in preventing overfitting?",
            hint: "Explain the geometric weight penalty: L1 (Lasso) enforces sparsity, L2 (Ridge) shrinks weight magnitudes."
          }
        ]
      },
      {
        id: "qa-5",
        num: "05",
        difficulty: "intermediate",
        question: "How does the Bias-Variance tradeoff impact model generalization?",
        default_open: true,
        simple_explanation: "Bias is error from assumptions being too simplistic; variance is error from the model being hypersensitive to small training changes.",
        simple_definition: "Bias is error from assumptions being too simplistic; variance is error from the model being hypersensitive to small training changes.",
        answer: "Bias is approximation error from overly simple assumptions; Variance is estimation error from hypersensitivity to training fluctuations.",
        technical_explanation: "Total Prediction Error = Bias² + Variance + Irreducible Noise. As model complexity increases, bias monotonically decreases while variance increases. The optimal model balances both to minimize total generalization error.",
        explanation: "Total Prediction Error = Bias² + Variance + Irreducible Noise. As model complexity increases, bias monotonically decreases while variance increases. The optimal model balances both to minimize total generalization error.",
        interview_answer: "High Bias causes underfitting because the model cannot capture signal. High Variance causes overfitting because the model memorizes sample noise. We balance both through cross-validation and regularized capacity.",
        highlight_box: "High Bias = Underfitting (e.g. Linear regression on circular data). High Variance = Overfitting (e.g. unconstrained 50-depth Decision Tree).",
        example: "Underfit linear model fails on both train and test. Overfit tree scores 100% on train but drops to 65% on test.",
        follow_up_questions: [
          {
            id: "qa-fu-5-1",
            question: "Do Bagging and Boosting reduce bias or variance?",
            hint: "Remember: Bagging averages independent models to reduce variance, while Boosting builds sequentially on residuals to reduce bias."
          }
        ]
      },
      {
        id: "qa-6",
        num: "06",
        difficulty: "intermediate",
        question: "What is the difference between Bagging and Boosting ensemble methods?",
        default_open: false,
        simple_explanation: "Bagging trains multiple models independently in parallel and averages them; Boosting trains models sequentially, each correcting the previous one's errors.",
        simple_definition: "Bagging trains base learners independently in parallel; Boosting trains base learners sequentially, where each learner corrects prior errors.",
        answer: "Bagging trains base learners independently in parallel; Boosting trains base learners sequentially, where each learner corrects prior errors.",
        technical_explanation: "Bagging (Bootstrap Aggregating, e.g. Random Forest) draws bootstrap resamples with replacement and averages outputs, directly slashing model variance. Boosting (e.g. XGBoost, LightGBM, CatBoost) fits trees sequentially to pseudo-residuals, driving down model bias.",
        explanation: "Bagging (Bootstrap Aggregating, e.g. Random Forest) draws bootstrap resamples with replacement and averages outputs, directly slashing model variance. Boosting (e.g. XGBoost, LightGBM, CatBoost) fits trees sequentially to pseudo-residuals, driving down model bias.",
        interview_answer: "Bagging targets variance reduction through parallel independent bootstrap aggregation. Boosting targets bias reduction through iterative sequential residual correction.",
        highlight_box: "Bagging = Parallel base learners + Variance reduction. Boosting = Sequential residual correction + Bias reduction.",
        example: "Random Forest builds 500 independent trees. XGBoost builds trees iteratively, each correcting the weighted errors of earlier trees.",
        follow_up_questions: [
          {
            id: "qa-fu-6-1",
            question: "Why is Boosting generally more vulnerable to outliers than Bagging?",
            hint: "Explain how large outlier residuals receive disproportionately high weights in subsequent boosting rounds."
          }
        ]
      },
      {
        id: "qa-7",
        num: "07",
        difficulty: "advanced",
        question: "How does XGBoost handle missing values and regularization internally?",
        default_open: true,
        simple_explanation: "XGBoost automatically learns the best direction (left or right branch) to send missing values during splitting, and includes penalty terms directly in its loss equation.",
        simple_definition: "XGBoost uses a default direction split-finding algorithm for missing entries and includes L1/L2 penalties directly in its objective function.",
        answer: "XGBoost uses a default direction split-finding algorithm for missing entries and includes L1/L2 penalties directly in its objective function.",
        technical_explanation: "During training, for any feature with missing values, XGBoost evaluates split gains by routing all missing entries to the left child and then to the right child, automatically selecting whichever branch maximizes objective loss reduction. Additionally, its objective function explicitly incorporates L1 (alpha) and L2 (lambda) penalties on leaf weights to control tree complexity.",
        explanation: "During training, for any feature with missing values, XGBoost evaluates split gains by routing all missing entries to the left child and then to the right child, automatically selecting whichever branch maximizes objective loss reduction. Additionally, its objective function explicitly incorporates L1 (alpha) and L2 (lambda) penalties on leaf weights to control tree complexity.",
        interview_answer: "XGBoost handles missing data organically by finding the optimal default direction split per feature, while adding explicit L1/L2 shrinkage on leaf weights to prevent leaf overfitting.",
        highlight_box: "Key Advantage: XGBoost requires zero manual missing value imputation prior to training and automatically handles sparse feature matrices efficiently.",
        example: "If income is missing for 20% of users, XGBoost assigns missing values to the child branch that maximizes objective gain during gradient boosting.",
        follow_up_questions: [
          {
            id: "qa-fu-7-1",
            question: "Why does XGBoost use second-order Taylor expansion for its objective?",
            hint: "Explain that computing gradients (first-order) and Hessians (second-order) allows exact analytic solutions for optimal leaf weights."
          }
        ]
      },
      {
        id: "qa-8",
        num: "08",
        difficulty: "advanced",
        question: "Explain Principal Component Analysis (PCA) and how eigenvectors represent maximum variance.",
        default_open: false,
        simple_explanation: "PCA rotates your data onto new axes ordered by how spread out the data is, allowing you to drop low-variance axes with minimal information loss.",
        simple_definition: "PCA is an orthogonal linear projection that transforms correlated features into uncorrelated principal components ordered by variance.",
        answer: "PCA is an orthogonal linear projection that transforms correlated features into uncorrelated principal components ordered by variance.",
        technical_explanation: "PCA standardizes the feature matrix, calculates the covariance matrix, and performs eigendecomposition. The eigenvectors represent the directions (principal axes) along which the data exhibits maximum variance, while the corresponding eigenvalues indicate the magnitude of variance explained by each principal component.",
        explanation: "PCA standardizes the feature matrix, calculates the covariance matrix, and performs eigendecomposition. The eigenvectors represent the directions (principal axes) along which the data exhibits maximum variance, while the corresponding eigenvalues indicate the magnitude of variance explained by each principal component.",
        interview_answer: "PCA finds orthogonal directions of maximal variance by computing eigenvectors of the feature covariance matrix, allowing dimensional compression while preserving dominant signal.",
        highlight_box: "Key Formula: Covariance Matrix Sigma = (1/n) * X^T * X; Sigma * v = lambda * v, where v is eigenvector and lambda is eigenvalue.",
        example: "Compressing 200 customer sensor features into 10 principal components that retain 95% of total dataset variance.",
        follow_up_questions: [
          {
            id: "qa-fu-8-1",
            question: "Why is feature scaling essential before running PCA?",
            hint: "Unscaled variables with large numerical magnitudes will artificially dominate the first principal component regardless of their true information content."
          }
        ]
      }
    ];

    const defaultScenario = [
      {
        id: "sc-1",
        num: "01",
        question: "Your model has 95% accuracy, but the business team says the model is not useful. What would you investigate?",
        default_open: true,
        interviewer_testing: "Understanding of model evaluation and business context.",
        testing_criteria: "Understanding of model evaluation and business context.",
        problem_context: "Understanding of model evaluation and business context.",
        approach: "Check class balance, then look at the confusion matrix, precision/recall for the class that matters, and the cost of each error type. Ask what decision the model supports.",
        investigation_approach: "Check class balance, then look at the confusion matrix, precision/recall for the class that matters, and the cost of each error type. Ask what decision the model supports.",
        expected_answer_label: "Expected answer",
        expected_answer: "\"Accuracy can hide poor performance when classes are imbalanced. I would check the class distribution, review precision, recall and PR-AUC for the minority class, align the threshold with business cost, and then improve with class weights, better features or more minority data.\"",
        recommended_solution: "\"Accuracy can hide poor performance when classes are imbalanced. I would check the class distribution, review precision, recall and PR-AUC for the minority class, align the threshold with business cost, and then improve with class weights, better features or more minority data.\"",
        expected_outcome: "High-recall model operating at business-aligned cost threshold.",
        follow_up_questions: [
          { id: "sc-fu-1-1", question: "Is accuracy always reliable?" },
          { id: "sc-fu-1-2", question: "What metrics would you check?" },
          { id: "sc-fu-1-3", question: "Could class imbalance be involved?" },
          { id: "sc-fu-1-4", question: "How would you improve the model?" }
        ]
      },
      {
        id: "sc-2",
        num: "02",
        question: "Your training accuracy is 98%, but your test accuracy is only 72%. What could be happening?",
        default_open: false,
        interviewer_testing: "Diagnosing high variance, severe overfitting, and data contamination across partitions.",
        testing_criteria: "Diagnosing high variance, severe overfitting, and data contamination across partitions.",
        problem_context: "Diagnosing high variance, severe overfitting, and data contamination across partitions.",
        approach: "Verify feature preprocessing was fitted inside cross-validation folds without leakage, inspect feature importance for spurious correlations, and evaluate regularization and tree depth constraints.",
        investigation_approach: "Verify feature preprocessing was fitted inside cross-validation folds without leakage, inspect feature importance for spurious correlations, and evaluate regularization and tree depth constraints.",
        expected_answer_label: "Expected answer",
        expected_answer: "\"The model is severely overfitting the training partition and failing to generalize. I would inspect the pipeline for data leakage, apply k-fold cross-validation, add L1/L2 penalties or dropout, reduce tree depth, and gather more diverse training examples.\"",
        recommended_solution: "\"The model is severely overfitting the training partition and failing to generalize. I would inspect the pipeline for data leakage, apply k-fold cross-validation, add L1/L2 penalties or dropout, reduce tree depth, and gather more diverse training examples.\"",
        expected_outcome: "Generalization gap narrows with robust out-of-sample performance.",
        follow_up_questions: [
          { id: "sc-fu-2-1", question: "How do you distinguish between high bias and high variance?" },
          { id: "sc-fu-2-2", question: "What regularization techniques work best for tree-based models?" },
          { id: "sc-fu-2-3", question: "When would you prefer more training data over higher regularization?" }
        ]
      },
      {
        id: "sc-3",
        num: "03",
        question: "Your training accuracy is 98%, but your test accuracy is only 72%. What could be happening?",
        default_open: false,
        interviewer_testing: "Identifying subtle feature leakage and temporal contamination in time-series splits.",
        testing_criteria: "Identifying subtle feature leakage and temporal contamination in time-series splits.",
        problem_context: "Identifying subtle feature leakage and temporal contamination in time-series splits.",
        approach: "Verify if time-series data was randomly shuffled instead of using walk-forward or temporal splitting, and check for target-encoding leakage across folds.",
        investigation_approach: "Verify if time-series data was randomly shuffled instead of using walk-forward or temporal splitting, and check for target-encoding leakage across folds.",
        expected_answer_label: "Expected answer",
        expected_answer: "\"Randomly shuffling time-dependent data causes future information to leak into past training partitions. I would re-partition the dataset using temporal walk-forward splits, verify target encoding is computed strictly out-of-fold, and remove any lookahead features.\"",
        recommended_solution: "\"Randomly shuffling time-dependent data causes future information to leak into past training partitions. I would re-partition the dataset using temporal walk-forward splits, verify target encoding is computed strictly out-of-fold, and remove any lookahead features.\"",
        expected_outcome: "Temporal validity preserved with realistic future performance estimation.",
        follow_up_questions: [
          { id: "sc-fu-3-1", question: "How does temporal cross-validation differ from standard K-Fold?" },
          { id: "sc-fu-3-2", question: "What are the risks of using future information in production feature stores?" }
        ]
      },
      {
        id: "sc-4",
        num: "04",
        question: "Your training accuracy is 98%, but your test accuracy is only 72%. What could be happening?",
        default_open: false,
        interviewer_testing: "Investigating covariate shift and sample selection bias between train and production environments.",
        testing_criteria: "Investigating covariate shift and sample selection bias between train and production environments.",
        problem_context: "Investigating covariate shift and sample selection bias between train and production environments.",
        approach: "Compare train and test feature distributions using Adversarial Validation or Population Stability Index (PSI) to detect covariate shift.",
        investigation_approach: "Compare train and test feature distributions using Adversarial Validation or Population Stability Index (PSI) to detect covariate shift.",
        expected_answer_label: "Expected answer",
        expected_answer: "\"The test distribution differs significantly from the training distribution (covariate shift). I would train a domain classifier (adversarial validation) to distinguish train from test samples, drop non-stationary features, and re-weight training samples accordingly.\"",
        recommended_solution: "\"The test distribution differs significantly from the training distribution (covariate shift). I would train a domain classifier (adversarial validation) to distinguish train from test samples, drop non-stationary features, and re-weight training samples accordingly.\"",
        expected_outcome: "Mitigated distribution mismatch and consistent out-of-sample prediction stability.",
        follow_up_questions: [
          { id: "sc-fu-4-1", question: "What is adversarial validation and when should you run it?" },
          { id: "sc-fu-4-2", question: "How does Population Stability Index (PSI) quantify distribution drift?" }
        ]
      },
      {
        id: "sc-5",
        num: "05",
        question: "Your training accuracy is 98%, but your test accuracy is only 72%. What could be happening?",
        default_open: false,
        interviewer_testing: "Evaluating label noise, inconsistent annotation, and evaluation metric misalignment.",
        testing_criteria: "Evaluating label noise, inconsistent annotation, and evaluation metric misalignment.",
        problem_context: "Evaluating label noise, inconsistent annotation, and evaluation metric misalignment.",
        approach: "Audit test set ground truth labels for annotator disagreement, class ambiguity, or label noise that artificially penalizes model predictions.",
        investigation_approach: "Audit test set ground truth labels for annotator disagreement, class ambiguity, or label noise that artificially penalizes model predictions.",
        expected_answer_label: "Expected answer",
        expected_answer: "\"Inconsistent or noisy labels in the test set can falsely deflate generalization scores. I would inspect confident misclassifications using confident learning, audit annotation agreement scores, and correct systematically mislabeled test samples.\"",
        recommended_solution: "\"Inconsistent or noisy labels in the test set can falsely deflate generalization scores. I would inspect confident misclassifications using confident learning, audit annotation agreement scores, and correct systematically mislabeled test samples.\"",
        expected_outcome: "Clean ground-truth evaluation set reflecting true production capability.",
        follow_up_questions: [
          { id: "sc-fu-5-1", question: "How do you measure inter-annotator agreement (e.g., Cohen's Kappa)?" },
          { id: "sc-fu-5-2", question: "What is confident learning and how does it clean noisy labels?" }
        ]
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
        title: "Must–Know Questions",
        subtitle: "Start with the questions you should be able to answer before any Machine Learning interview."
      },
      "questions-answers": {
        title: "Questions & Answers",
        subtitle: "Explore interview questions topic by topic."
      },
      "scenario-based": {
        title: "Scenario-Based Interview Questions",
        subtitle: "Questions that test how you apply concepts to real-world problems."
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
      console.log('Updating existing default interview_details record with Must-Know questions matching reference design...');
      await query(
        `UPDATE interview_details
         SET must_know_questions = ?,
             qa_questions = ?,
             scenario_questions = ?,
             section_headers = ?
         WHERE slug = ?`,
        [
          JSON.stringify(defaultMustKnow),
          JSON.stringify(defaultQA),
          JSON.stringify(defaultScenario),
          JSON.stringify(defaultSectionHeaders),
          'machine-learning-interview-questions-answers'
        ]
      );
      console.log('Successfully updated existing default interview_details record.');
    }

    console.log('--- interview_details table setup complete ---');
  } catch (error) {
    console.error('Error initializing interview_details table:', error);
  } finally {
    await pool.end();
  }
}

initInterviewDetailsTable();
