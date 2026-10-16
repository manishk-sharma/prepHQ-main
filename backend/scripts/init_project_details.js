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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_project_id (project_id),
        KEY idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Checked table: project_details (OK)');

    // Check if the default "customer-churn-prediction-using-machine-learning" exists
    const existing = await query(
      'SELECT id FROM project_details WHERE slug = ? LIMIT 1',
      ['customer-churn-prediction-using-machine-learning']
    );

    if (existing.length === 0) {
      console.log('Seeding default project details for customer-churn-prediction...');

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
        { name: 'Python', desc: 'Programming' },
        { name: 'Pandas', desc: 'Data handling' },
        { name: 'NumPy', desc: 'Computation' },
        { name: 'Scikit-learn', desc: 'ML models' },
        { name: 'Jupyter', desc: 'Development' },
      ];

      const defaultDatasetResources = [
        {
          title: 'Kaggle',
          desc: 'Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.',
          url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
        },
        {
          title: 'Kaggle',
          desc: 'Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.',
          url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
        },
        {
          title: 'Kaggle',
          desc: 'Telco Customer Churn is hosted here as a ready-to-use CSV, with notebooks from other learners.',
          url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
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
          why: 'Scaling or encoding before splitting, or keeping columns that reveal the outcome.',
          avoid: 'Split first, fit transformers on training data only, and use a Pipeline.',
        },
        {
          id: 'mistake-2',
          num: '02',
          title: 'Data Leakage',
          mistake: "Using information in training that wouldn't be available at prediction time.",
          why: 'Scaling or encoding before splitting, or keeping columns that reveal the outcome.',
          avoid: 'Split first, fit transformers on training data only, and use a Pipeline.',
        },
        {
          id: 'mistake-3',
          num: '03',
          title: 'Data Leakage',
          mistake: "Using information in training that wouldn't be available at prediction time.",
          why: 'Scaling or encoding before splitting, or keeping columns that reveal the outcome.',
          avoid: 'Split first, fit transformers on training data only, and use a Pipeline.',
        },
        {
          id: 'mistake-4',
          num: '04',
          title: 'Data Leakage',
          mistake: "Using information in training that wouldn't be available at prediction time.",
          why: 'Scaling or encoding before splitting, or keeping columns that reveal the outcome.',
          avoid: 'Split first, fit transformers on training data only, and use a Pipeline.',
        },
      ];

      await query(
        `INSERT INTO project_details (
          slug, title, subtitle, level, duration, domain, project_type,
          about_text_1, about_text_2, about_text_3,
          prerequisites, objectives, architecture_steps, architecture_details,
          implementation_steps, technologies, dataset_resources,
          technical_learnings, practical_learnings, common_mistakes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ]
      );

      console.log('Successfully seeded project details record.');
    } else {
      console.log('Default project details already present.');
    }

    console.log('--- project_details table setup complete ---');
  } catch (error) {
    console.error('Error initializing project_details table:', error);
  } finally {
    await pool.end();
  }
}

initProjectDetailsTable();
