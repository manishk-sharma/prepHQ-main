import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';

async function initDatabase() {
  console.log('--- Initializing / Verifying PrepHQ Database Schema ---');

  try {
    // 1. Ensure user table exists
    await query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        lastname VARCHAR(150) DEFAULT '',
        username VARCHAR(150) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status TINYINT DEFAULT 1,
        phone VARCHAR(50) NULL,
        country VARCHAR(100) NULL,
        bio TEXT NULL,
        github VARCHAR(255) NULL,
        linkedin VARCHAR(255) NULL,
        profile_image VARCHAR(255) NULL,
        resume VARCHAR(255) NULL,
        resume_date TIMESTAMP NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: user (OK)');

    // 2. Ensure admin table exists
    await query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adminname VARCHAR(150) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        token TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: admin (OK)');

    // Seed default admin if table is empty
    const adminRows = await query('SELECT COUNT(*) as count FROM admin;');
    if (adminRows[0].count === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await query(
        `INSERT INTO admin (adminname, email, password) VALUES (?, ?, ?)`,
        ['admin', 'admin@prephq.com', hashedAdminPassword]
      );
      console.log('Seeded default admin user: admin / admin123');
    }

    // 3. Ensure accountconfirm table exists
    await query(`
      CREATE TABLE IF NOT EXISTS accountconfirm (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(20) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        attempts INT DEFAULT 0,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_email (email),
        KEY idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: accountconfirm (OK)');

    // 4. Ensure contact_messages table exists
    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(150) NULL,
        lastname VARCHAR(150) NULL,
        countryCode VARCHAR(20) DEFAULT '+91',
        phone VARCHAR(50) NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: contact_messages (OK)');

    // 5. Ensure newsletter_subscribers table exists
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) DEFAULT 'active',
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: newsletter_subscribers (OK)');

    // 6. Ensure jobs table exists
    await query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        position VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        min_year INT DEFAULT 0,
        max_year INT DEFAULT 0,
        location VARCHAR(255) NULL,
        deadline VARCHAR(100) NULL,
        description LONGTEXT NULL,
        date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        apply_link VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: jobs (OK)');

    // Seed sample jobs if empty
    const jobRows = await query('SELECT COUNT(*) as count FROM jobs;');
    if (jobRows[0].count === 0) {
      await query(`
        INSERT INTO jobs (position, company, min_year, max_year, location, deadline, description, apply_link)
        VALUES
        ('Full Stack Web Developer', 'TechNova Solutions', 1, 3, 'Bengaluru, India (Hybrid)', '30 Nov 2026', 'Looking for an enthusiastic MERN stack engineer with experience in React, Node.js, and SQL databases.', 'https://prephq.theiotacademy.co/jobs'),
        ('Machine Learning Engineer', 'Cognitive Labs', 2, 5, 'Remote', '15 Dec 2026', 'Work on cutting-edge deep learning pipelines, computer vision, and LLM fine-tuning.', 'https://prephq.theiotacademy.co/jobs'),
        ('Frontend Software Engineer', 'Pixel Craft Studio', 0, 2, 'Noida, India (On-site)', '20 Dec 2026', 'Develop high-performance React user interfaces with modern design systems and animations.', 'https://prephq.theiotacademy.co/jobs'),
        ('DevOps & Cloud Engineer', 'CloudScale Inc', 3, 6, 'Hyderabad, India (Hybrid)', '31 Dec 2026', 'Automate CI/CD pipelines, Docker containers, Kubernetes clusters, and AWS infrastructure.', 'https://prephq.theiotacademy.co/jobs');
      `);
      console.log('Seeded sample tech jobs successfully.');
    }

    // 7. Ensure coding_questions table exists
    await query(`
      CREATE TABLE IF NOT EXISTS coding_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        difficulty VARCHAR(50) DEFAULT 'Easy',
        domain VARCHAR(100) DEFAULT 'Algorithms',
        topics LONGTEXT NULL,
        description LONGTEXT NOT NULL,
        examples LONGTEXT NULL,
        constraints_list LONGTEXT NULL,
        starter_code LONGTEXT NULL,
        entry_point VARCHAR(100) DEFAULT 'solution',
        param_order LONGTEXT NULL,
        testcases LONGTEXT NULL,
        status VARCHAR(50) DEFAULT 'active',
        acceptance VARCHAR(20) DEFAULT '85%',
        likes INT DEFAULT 0,
        dislikes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: coding_questions (OK)');

    // 8. Ensure submissions table exists
    await query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id VARCHAR(100) NOT NULL UNIQUE,
        user_id INT NULL,
        question_id INT NOT NULL,
        language VARCHAR(50) NOT NULL,
        code LONGTEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'ACCEPTED',
        passed_count INT DEFAULT 0,
        total_count INT DEFAULT 0,
        runtime_ms INT DEFAULT 0,
        memory VARCHAR(50) DEFAULT '14.2 MB',
        results LONGTEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_user_id (user_id),
        KEY idx_question_id (question_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: submissions (OK)');

    // Seed sample coding questions if empty
    const [countRow] = await query('SELECT COUNT(*) as count FROM coding_questions;');
    if (countRow.count === 0) {
      console.log('Seeding initial coding questions...');

      await query(
        `INSERT INTO coding_questions (
          title, slug, difficulty, domain, topics, description, examples, constraints_list,
          starter_code, entry_point, param_order, testcases, status, acceptance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Two Sum',
          'two-sum',
          'Easy',
          'Algorithms',
          JSON.stringify(['Array', 'Hash Table']),
          '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p><p>You may assume that each input would have <b>exactly one solution</b>, and you may not use the same element twice.</p>',
          JSON.stringify([
            {
              input: 'nums = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
            },
            {
              input: 'nums = [3,2,4], target = 6',
              output: '[1,2]',
              explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
            },
          ]),
          JSON.stringify([
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
          ]),
          JSON.stringify({
            javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solution = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
            python: `class Solution:\n    def solution(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []`,
          }),
          'solution',
          JSON.stringify(['nums', 'target']),
          JSON.stringify([
            {
              inputs: { nums: '[2,7,11,15]', target: '9' },
              expected_output: '[0,1]',
            },
            {
              inputs: { nums: '[3,2,4]', target: '6' },
              expected_output: '[1,2]',
            },
            {
              inputs: { nums: '[3,3]', target: '6' },
              expected_output: '[0,1]',
            },
          ]),
          'active',
          '82%',
        ]
      );

      await query(
        `INSERT INTO coding_questions (
          title, slug, difficulty, domain, topics, description, examples, constraints_list,
          starter_code, entry_point, param_order, testcases, status, acceptance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Valid Palindrome',
          'valid-palindrome',
          'Easy',
          'Algorithms',
          JSON.stringify(['Two Pointers', 'String']),
          '<p>A phrase is a <b>palindrome</b> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.</p><p>Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.</p>',
          JSON.stringify([
            {
              input: 's = "A man, a plan, a canal: Panama"',
              output: 'true',
              explanation: '"amanaplanacanalpanama" is a palindrome.',
            },
            {
              input: 's = "race a car"',
              output: 'false',
              explanation: '"raceacar" is not a palindrome.',
            },
          ]),
          JSON.stringify([
            '1 <= s.length <= 2 * 10^5',
            's consists only of printable ASCII characters.',
          ]),
          JSON.stringify({
            javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar solution = function(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return clean === clean.split('').reverse().join('');\n};`,
            python: `class Solution:\n    def solution(self, s):\n        import re\n        clean = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n        return clean == clean[::-1]`,
          }),
          'solution',
          JSON.stringify(['s']),
          JSON.stringify([
            {
              inputs: { s: '"A man, a plan, a canal: Panama"' },
              expected_output: 'true',
            },
            {
              inputs: { s: '"race a car"' },
              expected_output: 'false',
            },
            {
              inputs: { s: '" "' },
              expected_output: 'true',
            },
          ]),
          'active',
          '78%',
        ]
      );

      console.log('Seeded Two Sum and Valid Palindrome successfully.');
    } else {
      console.log(`Table coding_questions already has ${countRow.count} records.`);
    }

    // 9. Verify total tables
    const allTables = await query('SHOW TABLES;');
    const tableNames = allTables.map((row) => Object.values(row)[0]);
    console.log(`Total tables present in database (${tableNames.length}):`, tableNames.join(', '));

    console.log('--- Database schema verification complete ---');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await pool.end();
  }
}

initDatabase();
