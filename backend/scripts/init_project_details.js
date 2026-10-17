import { pool, query } from '../config/db.js';

async function initProjectDetailsTable() {
  console.log('--- Creating / Verifying project_details Table ---');

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS project_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT NULL,
        level VARCHAR(50) DEFAULT 'Intermediate',
        duration VARCHAR(50) DEFAULT '8–12 Hours',
        domain VARCHAR(100) DEFAULT 'Data Science',
        project_type VARCHAR(100) DEFAULT 'Machine Learning',
        about_text_1 LONGTEXT NULL,
        about_text_2 LONGTEXT NULL,
        about_text_3 LONGTEXT NULL,
        prerequisites JSON NULL,
        objectives JSON NULL,
        architecture_steps JSON NULL,
        architecture_details JSON NULL,
        implementation_steps JSON NULL,
        technologies JSON NULL,
        dataset_resources JSON NULL,
        technical_learnings JSON NULL,
        practical_learnings JSON NULL,
        common_mistakes JSON NULL,
        section_headers JSON NULL,
        section_2_design VARCHAR(50) DEFAULT 'grid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_project_id (project_id),
        KEY idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure section_headers and section_2_design columns exist for existing tables
    const cols = await query('SHOW COLUMNS FROM project_details');
    const hasSectionHeaders = cols.some((c) => c.Field === 'section_headers');
    if (!hasSectionHeaders) {
      await query('ALTER TABLE project_details ADD COLUMN section_headers JSON NULL');
      console.log('Added column section_headers to project_details.');
    }

    const hasSection2Design = cols.some((c) => c.Field === 'section_2_design');
    if (!hasSection2Design) {
      await query("ALTER TABLE project_details ADD COLUMN section_2_design VARCHAR(50) DEFAULT 'grid'");
      console.log('Added column section_2_design to project_details.');
    }

    console.log('Checked table: project_details (OK)');

    // Check if the default "customer-churn-prediction-using-machine-learning" exists
    const existing = await query(
      'SELECT id, section_headers FROM project_details WHERE slug = ? LIMIT 1',
      ['customer-churn-prediction-using-machine-learning']
    );

    const defaultPrerequisites = {
      programming: ['Basic Python', 'Functions', 'Lists and dictionaries'],
      data: ['Pandas', 'NumPy', 'Basic data cleaning'],
      statistics: ['Mean', 'Median', 'Correlation', 'Basic distributions'],
      machineLearning: ['Classification', 'Train/test split', 'Basic model evaluation'],
    };

    const defaultObjectives = [
      {
        id: 'obj-1',
        num: '01',
        title: 'Understand the Business Problem',
        content: 'Understand the business problem behind customer churn and how machine learning can help identify customers at risk.',
      },
      {
        id: 'obj-2',
        num: '02',
        title: 'Understand the Business Problem',
        content: 'Understand the business problem behind customer churn and how machine learning can help identify customers at risk.',
      },
      {
        id: 'obj-3',
        num: '03',
        title: 'Understand the Business Problem',
        content: 'Understand the business problem behind customer churn and how machine learning can help identify customers at risk.',
      },
      {
        id: 'obj-4',
        num: '04',
        title: 'Understand the Business Problem',
        content: 'Understand the business problem behind customer churn and how machine learning can help identify customers at risk.',
      },
    ];

    const defaultArchitectureSteps = [
      { id: 'arch-1', num: '01', title: 'Feature\nEngineering' },
      { id: 'arch-2', num: '02', title: 'Feature\nEngineering' },
      { id: 'arch-3', num: '03', title: 'Feature\nEngineering' },
      { id: 'arch-4', num: '04', title: 'Feature\nEngineering' },
      { id: 'arch-5', num: '05', title: 'Feature\nEngineering' },
      { id: 'arch-6', num: '06', title: 'Feature\nEngineering' },
      { id: 'arch-7', num: '07', title: 'Feature\nEngineering' },
      { id: 'arch-8', num: '08', title: 'Feature\nEngineering' },
      { id: 'arch-9', num: '09', title: 'Feature\nEngineering' },
      { id: 'arch-10', num: '10', title: 'Feature\nEngineering' },
    ];

    const defaultArchitectureDetails = [
      {
        step: '01 · Dataset',
        desc: 'Raw customer records in CSV format. This is the single source of truth for the project.',
      },
      {
        step: '02 · Data Collection',
        desc: 'Load the CSV into a Pandas DataFrame and verify shape, columns and data types.',
      },
      {
        step: '03 · Data Cleaning',
        desc: 'Fix missing values, duplicates and inconsistent formats so the data is reliable.',
      },
      {
        step: '04 · EDA',
        desc: 'Visualize distributions and relationships to see what drives churn.',
      },
    ];

    const defaultImplementationSteps = [
      {
        id: 'step-1',
        num: '01',
        title: 'Set Up the Environment',
        subtitle: 'Install Python and required libraries.',
        whatYouDo: 'Create a virtual environment and install the libraries used throughout the project.',
        matters: 'A reproducible setup avoids version conflicts later.',
        output: 'A working Jupyter notebook that imports every library without errors.',
        tools: ['Python', 'php', 'Jupyter'],
        command: 'pip install pandas numpy scikit-learn matplotlib seaborn jupyter',
      },
      {
        id: 'step-2',
        num: '02',
        title: 'Set Up the Environment',
        subtitle: 'Install Python and required libraries.',
        whatYouDo: 'Create a virtual environment and install the libraries used throughout the project.',
        matters: 'A reproducible setup avoids version conflicts later.',
        output: 'A working Jupyter notebook that imports every library without errors.',
        tools: ['Python', 'Pandas', 'Jupyter'],
        command: 'pip install pandas numpy scikit-learn matplotlib seaborn jupyter',
      },
      {
        id: 'step-3',
        num: '03',
        title: 'Set Up the Environment',
        subtitle: 'Install Python and required libraries.',
        whatYouDo: 'Create a virtual environment and install the libraries used throughout the project.',
        matters: 'A reproducible setup avoids version conflicts later.',
        output: 'A working Jupyter notebook that imports every library without errors.',
        tools: ['Python', 'scikit-learn'],
        command: 'pip install pandas numpy scikit-learn matplotlib seaborn jupyter',
      },
      {
        id: 'step-4',
        num: '04',
        title: 'Set Up the Environment',
        subtitle: 'Install Python and required libraries.',
        whatYouDo: 'Create a virtual environment and install the libraries used throughout the project.',
        matters: 'A reproducible setup avoids version conflicts later.',
        output: 'A working Jupyter notebook that imports every library without errors.',
        tools: ['Python', 'Jupyter'],
        command: 'pip install pandas numpy scikit-learn matplotlib seaborn jupyter',
      },
    ];

    const defaultTechnologies = [
      { id: 'tech-1', toolName: 'Python', categoryUsage: 'Programming', name: 'Python', desc: 'Programming' },
      { id: 'tech-2', toolName: 'Pandas', categoryUsage: 'Data handling', name: 'Pandas', desc: 'Data handling' },
      { id: 'tech-3', toolName: 'NumPy', categoryUsage: 'Computation', name: 'NumPy', desc: 'Computation' },
      { id: 'tech-4', toolName: 'Scikit-learn', categoryUsage: 'ML models', name: 'Scikit-learn', desc: 'ML models' },
      { id: 'tech-5', toolName: 'Jupyter', categoryUsage: 'Development', name: 'Jupyter', desc: 'Development' },
    ];

    const defaultDatasetResources = [
      {
        id: 'ds-1',
        providerTitle: 'Kaggle',
        externalUrl: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
        description: 'Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.',
        title: 'Kaggle',
        url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
        desc: 'Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.',
      },
      {
        id: 'ds-2',
        providerTitle: 'IBM Community',
        externalUrl: 'https://github.com/IBM/telco-customer-churn-on-icp4d',
        description: 'The original enterprise telecom customer dataset with 21 customer attributes and payment histories.',
        title: 'IBM Community',
        url: 'https://github.com/IBM/telco-customer-churn-on-icp4d',
        desc: 'The original enterprise telecom customer dataset with 21 customer attributes and payment histories.',
      },
      {
        id: 'ds-3',
        providerTitle: 'UCI Machine Learning Repository',
        externalUrl: 'https://archive.ics.uci.edu/dataset/193/churn',
        description: 'Standard benchmark repository containing customer attrition and retention records for classification research.',
        title: 'UCI Machine Learning Repository',
        url: 'https://archive.ics.uci.edu/dataset/193/churn',
        desc: 'Standard benchmark repository containing customer attrition and retention records for classification research.',
      },
    ];

    const defaultTechnicalLearnings = [
      'Data cleaning',
      'Exploratory data analysis',
      'Feature engineering',
      'Machine learning',
      'Model evaluation',
      'Prediction',
    ];

    const defaultPracticalLearnings = [
      'Understanding a real-world problem',
      'Working with imperfect datasets',
      'Selecting appropriate models',
      'Interpreting results',
      'Structuring an end-to-end project',
    ];

    const defaultCommonMistakes = [
      {
        id: 'mistake-1',
        num: '01',
        title: 'Data Leakage',
        mistake: "Using information in training that wouldn't be available at prediction time.",
        why: 'Scaling, encoding, or imputing before train-test split, or keeping target-proxy columns.',
        avoid: 'Split first, fit transformers on training data only, and use scikit-learn Pipeline.',
      },
      {
        id: 'mistake-2',
        num: '02',
        title: 'Optimizing for Accuracy on Imbalanced Data',
        mistake: 'Relying on raw accuracy when the majority of customers do not churn.',
        why: "A model predicting 'no churn' for everyone can score 80% accuracy while failing completely.",
        avoid: 'Use ROC-AUC, Precision-Recall, F1-Score, and consider SMOTE or class weights.',
      },
      {
        id: 'mistake-3',
        num: '03',
        title: 'Ignoring Feature Multicollinearity',
        mistake: 'Feeding strongly correlated features without inspection or pruning.',
        why: "Features like 'TotalCharges' and 'Tenure' are collinear and destabilize model coefficients.",
        avoid: 'Check correlation heatmaps, compute Variance Inflation Factor (VIF), or use regularized models.',
      },
      {
        id: 'mistake-4',
        num: '04',
        title: 'Evaluating Without Cross-Validation',
        mistake: 'Evaluating model generalization on a single fixed train/test split.',
        why: 'A single split can result in overly optimistic or pessimistic performance estimates.',
        avoid: 'Apply Stratified 5-Fold Cross-Validation to assess true stability across folds.',
      },
    ];

    const defaultSectionHeaders = {
      'about-project': {
        title: '01 · About the Project',
        subtitle: "Understand what you'll build and why it matters.",
      },
      'prerequisites': {
        title: '02 · What You Should Know Before Starting',
        subtitle: 'A quick checklist so you can start with confidence.',
      },
      'project-objectives': {
        title: '03 · Project Objectives',
        subtitle: 'Understand what you will accomplish.',
      },
      'project-architecture': {
        title: '04 · Project Architecture',
        subtitle: 'How data flows from raw records to predictions.',
      },
      'implementation-guide': {
        title: '05 · Step-by-Step Implementation',
        subtitle: 'Follow these ten steps to build the project from start to finish.',
      },
      'technologies': {
        title: '06 · Tools / Technologies Used',
        subtitle: 'Everything you need is free and open source.',
      },
      'dataset-resources': {
        title: '07 · Where to Get Data',
        subtitle: 'Trusted places to download the dataset.',
      },
      'project-learnings': {
        title: '08 · Learnings From the Project',
        subtitle: 'Skills you will take away.',
      },
      'common-mistakes': {
        title: '09 · Common Mistakes to Avoid',
        subtitle: 'Save hours by knowing these pitfalls early.',
      },
    };

    if (existing.length === 0) {
      console.log('Seeding default project details for customer-churn-prediction...');

      await query(
        `INSERT INTO project_details (
          slug, title, subtitle, level, duration, domain, project_type,
          about_text_1, about_text_2, about_text_3,
          prerequisites, objectives, architecture_steps, architecture_details,
          implementation_steps, technologies, dataset_resources,
          technical_learnings, practical_learnings, common_mistakes, section_headers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'customer-churn-prediction-using-machine-learning',
          'Customer Churn Prediction Using Machine Learning',
          'Build an end-to-end machine learning project to identify customers who are likely to churn using real-world customer data.',
          'Intermediate',
          '8–12 Hours',
          'Data Science',
          'Machine Learning',
          "Customer churn is when a customer stops using a company's service. In subscription businesses such as telecom, losing customers is far more expensive than keeping them, so knowing who is about to leave is highly valuable.",
          "In this project you'll work with a real telecom dataset to find the patterns behind churn, then train classification models that flag at-risk customers before they leave.",
          "By the end you'll have built a complete workflow: cleaned data, insightful visualizations, a tuned and evaluated model, and a working prediction pipeline.",
          JSON.stringify(defaultPrerequisites),
          JSON.stringify(defaultObjectives),
          JSON.stringify(defaultArchitectureSteps),
          JSON.stringify(defaultArchitectureDetails),
          JSON.stringify(defaultImplementationSteps),
          JSON.stringify(defaultTechnologies),
          JSON.stringify(defaultDatasetResources),
          JSON.stringify(defaultTechnicalLearnings),
          JSON.stringify(defaultPracticalLearnings),
          JSON.stringify(defaultCommonMistakes),
          JSON.stringify(defaultSectionHeaders),
        ]
      );

      console.log('Successfully seeded project details record.');
    } else {
      console.log('Updating existing default project details with clean non-duplicate data and section headers...');
      const existingHeaders = existing[0].section_headers ? JSON.parse(existing[0].section_headers) : null;
      const headersToSave = existingHeaders && Object.keys(existingHeaders).length > 0 ? existingHeaders : defaultSectionHeaders;

      await query(
        `UPDATE project_details
         SET technologies = ?,
             dataset_resources = ?,
             technical_learnings = ?,
             practical_learnings = ?,
             common_mistakes = ?,
             section_headers = ?
         WHERE slug = ?`,
        [
          JSON.stringify(defaultTechnologies),
          JSON.stringify(defaultDatasetResources),
          JSON.stringify(defaultTechnicalLearnings),
          JSON.stringify(defaultPracticalLearnings),
          JSON.stringify(defaultCommonMistakes),
          JSON.stringify(headersToSave),
          'customer-churn-prediction-using-machine-learning',
        ]
      );
      console.log('Successfully updated existing default project details record.');
    }

    console.log('--- project_details table setup complete ---');
  } catch (error) {
    console.error('Error initializing project_details table:', error);
  } finally {
    await pool.end();
  }
}

initProjectDetailsTable();
