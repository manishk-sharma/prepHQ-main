import { query } from '../config/db.js';
import { executeCode } from '../utils/codeRunner.js';

const parseJsonField = (field, fallback = null) => {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'object') return field;
  try {
    return JSON.parse(field);
  } catch {
    return fallback;
  }
};

const formatQuestion = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  difficulty: row.difficulty,
  domain: row.domain,
  topics: parseJsonField(row.topics, []),
  description: row.description,
  examples: parseJsonField(row.examples, []),
  constraints_list: parseJsonField(row.constraints_list, []),
  starter_code: parseJsonField(row.starter_code, {}),
  entry_point: row.entry_point || 'solution',
  param_order: parseJsonField(row.param_order, []),
  testcases: parseJsonField(row.testcases, []),
  status: row.status,
  acceptance: row.acceptance || '80%',
  likes: row.likes || 0,
  dislikes: row.dislikes || 0,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// ── GET All Coding Questions ──────────────────────────────────────────────────
export const getAllQuestions = async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM coding_questions WHERE status = 'active' ORDER BY id ASC`
    );

    const questions = rows.map(formatQuestion);

    return res.status(200).json({
      status: 1,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Single Coding Question by Slug or ID ──────────────────────────────────
export const getQuestionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ status: 0, error: 'Question identifier is required.' });
    }

    const isNumeric = /^\d+$/.test(slug);
    const sql = isNumeric
      ? `SELECT * FROM coding_questions WHERE id = ? LIMIT 1`
      : `SELECT * FROM coding_questions WHERE slug = ? LIMIT 1`;

    const rows = await query(sql, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ status: 0, error: 'Coding question not found.' });
    }

    return res.status(200).json({
      status: 1,
      data: formatQuestion(rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

// ── Create Coding Question (Admin) ────────────────────────────────────────────
export const createQuestion = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      difficulty,
      domain,
      topics,
      description,
      examples,
      constraints_list,
      starter_code,
      entry_point,
      param_order,
      testcases,
      status,
      acceptance,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ status: 0, message: 'Title and description are required.' });
    }

    const finalSlug = (
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    ).trim();

    const insertResult = await query(
      `INSERT INTO coding_questions (
        title, slug, difficulty, domain, topics, description, examples, constraints_list,
        starter_code, entry_point, param_order, testcases, status, acceptance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        finalSlug,
        difficulty || 'Easy',
        domain || 'Algorithms',
        JSON.stringify(topics || []),
        description,
        JSON.stringify(examples || []),
        JSON.stringify(constraints_list || []),
        JSON.stringify(starter_code || {}),
        entry_point || 'solution',
        JSON.stringify(param_order || []),
        JSON.stringify(testcases || []),
        status || 'active',
        acceptance || '85%',
      ]
    );

    return res.status(201).json({
      status: 1,
      message: 'Question added successfully.',
      data: { id: insertResult.insertId },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Coding Question (Admin) ────────────────────────────────────────────
export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      difficulty,
      domain,
      topics,
      description,
      examples,
      constraints_list,
      starter_code,
      entry_point,
      param_order,
      testcases,
      status,
      acceptance,
    } = req.body;

    if (!id) {
      return res.status(400).json({ status: 0, message: 'Question ID is required.' });
    }

    await query(
      `UPDATE coding_questions
       SET title = COALESCE(?, title),
           slug = COALESCE(?, slug),
           difficulty = COALESCE(?, difficulty),
           domain = COALESCE(?, domain),
           topics = COALESCE(?, topics),
           description = COALESCE(?, description),
           examples = COALESCE(?, examples),
           constraints_list = COALESCE(?, constraints_list),
           starter_code = COALESCE(?, starter_code),
           entry_point = COALESCE(?, entry_point),
           param_order = COALESCE(?, param_order),
           testcases = COALESCE(?, testcases),
           status = COALESCE(?, status),
           acceptance = COALESCE(?, acceptance)
       WHERE id = ?`,
      [
        title,
        slug,
        difficulty,
        domain,
        topics ? JSON.stringify(topics) : null,
        description,
        examples ? JSON.stringify(examples) : null,
        constraints_list ? JSON.stringify(constraints_list) : null,
        starter_code ? JSON.stringify(starter_code) : null,
        entry_point,
        param_order ? JSON.stringify(param_order) : null,
        testcases ? JSON.stringify(testcases) : null,
        status,
        acceptance,
        id,
      ]
    );

    return res.status(200).json({
      status: 1,
      message: 'Question updated successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Coding Question (Admin) ────────────────────────────────────────────
export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 0, message: 'Question ID is required.' });
    }

    await query('DELETE FROM coding_questions WHERE id = ?', [id]);

    return res.status(200).json({
      status: 1,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ── POST Run Code ─────────────────────────────────────────────────────────────
export const runCode = async (req, res, next) => {
  try {
    const { language, code, entry_point, param_order, testcases } = req.body;

    if (!code) {
      return res.status(400).json({ status: 'error', message: 'Code is required.' });
    }

    const executionResult = await executeCode({
      language: language || 'javascript',
      code,
      entry_point: entry_point || 'solution',
      param_order: param_order || [],
      testcases: testcases || [],
    });

    return res.status(200).json(executionResult);
  } catch (error) {
    next(error);
  }
};

// ── POST Submit Code ──────────────────────────────────────────────────────────
export const submitCode = async (req, res, next) => {
  try {
    const { question_id, language, code } = req.body;
    const userId = req.user?.id || null;

    if (!question_id || !code) {
      return res.status(400).json({ status: 'error', message: 'Question ID and code are required.' });
    }

    // Fetch the question test cases
    const questions = await query('SELECT * FROM coding_questions WHERE id = ? LIMIT 1', [question_id]);
    if (questions.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Question not found.' });
    }

    const q = questions[0];
    const testcases = parseJsonField(q.testcases, []);
    const param_order = parseJsonField(q.param_order, []);

    const execResult = await executeCode({
      language: language || 'javascript',
      code,
      entry_point: q.entry_point || 'solution',
      param_order,
      testcases,
    });

    const total = execResult.summary?.total || testcases.length;
    const passed = execResult.summary?.passed || 0;
    const isAccepted = total > 0 && passed === total;
    const verdict = isAccepted ? 'ACCEPTED' : 'WRONG ANSWER';
    const runtime_ms = execResult.summary?.total_runtime_ms || 12;

    const submission_id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    await query(
      `INSERT INTO submissions (
        submission_id, user_id, question_id, language, code, status,
        passed_count, total_count, runtime_ms, memory, results
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '14.2 MB', ?)`,
      [
        submission_id,
        userId,
        question_id,
        language || 'javascript',
        code,
        verdict,
        passed,
        total,
        runtime_ms,
        JSON.stringify(execResult.results || []),
      ]
    );

    return res.status(202).json({
      status: 'success',
      submission_id,
      verdict,
      passed_count: passed,
      total_count: total,
      runtime_ms,
      message: isAccepted ? 'All test cases passed! Solution Accepted.' : `${passed}/${total} test cases passed.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Submission Poll Result ────────────────────────────────────────────────
export const getSubmissionResult = async (req, res, next) => {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({ status: 'error', message: 'Submission ID is required.' });
    }

    const rows = await query('SELECT * FROM submissions WHERE submission_id = ? LIMIT 1', [submissionId]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Submission not found.' });
    }

    const s = rows[0];
    return res.status(200).json({
      status: s.status,
      submission_id: s.submission_id,
      passed_count: s.passed_count,
      total_count: s.total_count,
      runtime_ms: s.runtime_ms,
      memory: s.memory,
      results: parseJsonField(s.results, []),
      created_at: s.created_at,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET User Submissions ──────────────────────────────────────────────────────
export const getUserSubmissions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 0, error: 'User authentication required.' });
    }

    const rows = await query(
      `SELECT s.id, s.submission_id, s.language, s.status, s.passed_count, s.total_count,
              s.runtime_ms, s.memory, s.created_at,
              q.id AS q_id, q.title AS q_title, q.slug AS q_slug, q.difficulty AS q_difficulty
       FROM submissions s
       JOIN coding_questions q ON s.question_id = q.id
       WHERE s.user_id = ?
       ORDER BY s.id DESC`,
      [userId]
    );

    const submissions = rows.map((r) => ({
      submission_id: r.submission_id,
      language: r.language,
      status: r.status,
      passed_count: r.passed_count,
      total_count: r.total_count,
      runtime_ms: r.runtime_ms,
      memory: r.memory,
      created_at: r.created_at,
      question: {
        id: r.q_id,
        title: r.q_title,
        slug: r.q_slug,
        difficulty: r.q_difficulty,
      },
    }));

    return res.status(200).json({
      status: 1,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Admin All Submissions ─────────────────────────────────────────────────
export const getAdminSubmissions = async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT s.id, s.submission_id, s.language, s.status, s.passed_count, s.total_count,
              s.runtime_ms, s.memory, s.created_at, s.code,
              u.id AS u_id, u.name AS u_name, u.email AS u_email, u.profile_image AS u_image,
              q.id AS q_id, q.title AS q_title, q.slug AS q_slug, q.difficulty AS q_difficulty
       FROM submissions s
       LEFT JOIN user u ON s.user_id = u.id
       JOIN coding_questions q ON s.question_id = q.id
       ORDER BY s.id DESC`
    );

    const submissions = rows.map((r) => ({
      id: r.id,
      submission_id: r.submission_id,
      language: r.language,
      status: r.status,
      passed_count: r.passed_count,
      total_count: r.total_count,
      runtime_ms: r.runtime_ms,
      memory: r.memory,
      created_at: r.created_at,
      code: r.code,
      user: r.u_id
        ? {
            id: r.u_id,
            name: r.u_name,
            email: r.u_email,
            profile_image: r.u_image,
          }
        : null,
      question: {
        id: r.q_id,
        title: r.q_title,
        slug: r.q_slug,
        difficulty: r.q_difficulty,
      },
    }));

    return res.status(200).json({
      status: 1,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllQuestions,
  getQuestionBySlug,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  runCode,
  submitCode,
  getSubmissionResult,
  getUserSubmissions,
  getAdminSubmissions,
};
