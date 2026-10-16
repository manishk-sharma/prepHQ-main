import { pool, query } from '../config/db.js';

async function initDatabase() {
  console.log('--- Initializing / Verifying PrepHQ Database Schema ---');

  try {
    // 1. Verify existing tables
    const existingTables = await query('SHOW TABLES;');
    const tableNames = existingTables.map((row) => Object.values(row)[0]);
    console.log(`Found ${tableNames.length} existing tables:`, tableNames.join(', '));

    // 2. Ensure coding_questions table exists
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

    // 3. Ensure submissions table exists
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

    // 4. Seed sample coding questions if empty
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

    console.log('--- Database schema verification complete ---');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await pool.end();
  }
}

initDatabase();
