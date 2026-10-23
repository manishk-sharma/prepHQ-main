import { query } from '../config/db.js';

// Helper to determine the SQL post_type condition
const getPostTypeCondition = (type) => {
  const t = (type || '').toLowerCase();
  if (t === 'project' || t === 'projects') {
    return `(p.post_type = 'project' OR (p.post_type = 'post' AND p.guid LIKE '%project%'))`;
  }
  if (t === 'blog' || t === 'blogs') {
    return `(p.post_type = 'blog' OR p.post_type = 'post')`;
  }
  if (t === 'tutorial' || t === 'tutorials') {
    return `(p.post_type = 'tutorial' OR p.post_type = 'post')`;
  }
  if (t === 'interview' || t === 'interviews') {
    return `(p.post_type = 'interview' OR p.post_type = 'post')`;
  }
  return `p.post_type = '${t}'`;
};

// Helper to enrich posts with metadata and categories
const enrichPosts = async (posts) => {
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.ID);
  const placeholders = postIds.map(() => '?').join(',');

  // Fetch categories
  const catRows = await query(
    `SELECT tr.object_id, t.name AS category_name, t.slug AS category_slug
     FROM wp_term_relationships tr
     JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
     JOIN wp_terms t ON tt.term_id = t.term_id
     WHERE tr.object_id IN (${placeholders})`,
    postIds
  );

  const catMap = {};
  catRows.forEach((row) => {
    if (!catMap[row.object_id]) catMap[row.object_id] = { names: [], slugs: [] };
    if (!catMap[row.object_id].names.includes(row.category_name)) {
      catMap[row.object_id].names.push(row.category_name);
      catMap[row.object_id].slugs.push(row.category_slug);
    }
  });

  // Fetch postmeta
  const metaRows = await query(
    `SELECT post_id, meta_key, meta_value
     FROM wp_postmeta
     WHERE post_id IN (${placeholders})`,
    postIds
  );

  const metaMap = {};
  const thumbnailIds = [];

  metaRows.forEach((row) => {
    if (!metaMap[row.post_id]) metaMap[row.post_id] = {};
    metaMap[row.post_id][row.meta_key] = row.meta_value;
    if (row.meta_key === '_thumbnail_id' && row.meta_value) {
      thumbnailIds.push(row.meta_value);
    }
  });

  // Fetch thumbnail attachment URLs if any
  const thumbMap = {};
  if (thumbnailIds.length > 0) {
    const thumbPlaceholders = thumbnailIds.map(() => '?').join(',');
    const thumbRows = await query(
      `SELECT ID, guid FROM wp_posts WHERE ID IN (${thumbPlaceholders})`,
      thumbnailIds
    );
    thumbRows.forEach((r) => {
      thumbMap[r.ID] = r.guid;
    });
  }

  return posts.map((post) => {
    const metas = metaMap[post.ID] || {};
    const cats = catMap[post.ID] || { names: [], slugs: [] };
    const thumbId = metas._thumbnail_id;
    let featured_image =
      metas.featured_image || (thumbId ? thumbMap[thumbId] : null) || null;

    if (
      featured_image &&
      typeof featured_image === 'string' &&
      featured_image.includes('prephq.theiotacademy.co/project/wp-content/uploads/')
    ) {
      featured_image = null;
    }

    const projectDescription =
      post.post_excerpt ||
      metas.project_description ||
      metas.description ||
      '';

    return {
      ID: post.ID,
      post_title: post.post_title,
      post_name: post.post_name,
      post_date: post.post_date,
      post_content: post.post_content,
      post_excerpt: projectDescription,
      description: projectDescription,
      project_description: projectDescription,
      category_name: cats.names.join(', '),
      category_slug: cats.slugs.join(', '),
      featured_image,
      author_name: metas.author_name || 'Admin',
      author_image: metas.author_image || null,
      author_quote: metas.author_quote || null,
      author_linkedin: metas.author_linkedin || null,
      seo_title: metas.seo_title || metas._yoast_wpseo_title || post.post_title,
      seo_desc: metas.seo_desc || metas._yoast_wpseo_metadesc || '',
      seo_focus_keyword: metas.seo_focus_keyword || metas._yoast_wpseo_focuskw || '',
      seo_tags: metas.seo_tags || '[]',
      likes: parseInt(metas.likes || '0', 10),
      comments: 0,
      difficulty_level: metas.difficulty_level || metas.level || 'Intermediate',
      level: metas.difficulty_level || metas.level || 'Intermediate',
      domain: metas.domain || 'Data Science',
      project_type: metas.project_type || 'Machine Learning',
      tech_stack: metas.tech_stack || metas.technologies || '',
      technologies: metas.tech_stack || metas.technologies || '',
      project_duration: metas.project_duration || metas.duration || '',
      duration: metas.project_duration || metas.duration || '',
      github_url: metas.github_url || '',
      live_demo_url: metas.live_demo_url || '',
      is_featured:
        metas.is_featured === '1' ||
        metas.is_featured === 1 ||
        metas.is_featured === 'true' ||
        metas.featured === '1' ||
        metas.featured === 'true',
    };
  });
};


// ── GET All Posts by Resource Type ────────────────────────────────────────────
export const getPostsByType = (type) => async (req, res, next) => {
  try {
    const condition = getPostTypeCondition(type);
    const posts = await query(
      `SELECT ID, post_title, post_name, post_date, post_content, post_excerpt, post_type
       FROM wp_posts p
       WHERE ${condition} AND p.post_status = 'publish'
       ORDER BY p.ID DESC`
    );

    const enriched = await enrichPosts(posts);

    return res.status(200).json({
      status: 1,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Single Post by ID or Slug ─────────────────────────────────────────────
export const getPostById = (type) => async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 0, error: 'Post identifier is required.' });
    }

    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric
      ? `SELECT ID, post_title, post_name, post_date, post_content, post_excerpt, post_type
         FROM wp_posts WHERE ID = ? LIMIT 1`
      : `SELECT ID, post_title, post_name, post_date, post_content, post_excerpt, post_type
         FROM wp_posts WHERE post_name = ? LIMIT 1`;

    const posts = await query(sql, [id]);

    if (posts.length === 0) {
      return res.status(404).json({ status: 0, error: `${type} not found.` });
    }

    const enriched = await enrichPosts(posts);

    return res.status(200).json({
      status: 1,
      data: enriched[0],
    });
  } catch (error) {
    next(error);
  }
};

// ── GET Posts by Category ─────────────────────────────────────────────────────
export const getPostsByCategory = (type) => async (req, res, next) => {
  try {
    const { category } = req.params;
    const condition = getPostTypeCondition(type);

    const posts = await query(
      `SELECT DISTINCT p.ID, p.post_title, p.post_name, p.post_date, p.post_content, p.post_excerpt, p.post_type
       FROM wp_posts p
       JOIN wp_term_relationships tr ON p.ID = tr.object_id
       JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
       JOIN wp_terms t ON tt.term_id = t.term_id
       WHERE ${condition} AND (t.slug = ? OR t.name = ?) AND p.post_status = 'publish'
       ORDER BY p.ID DESC`,
      [category, category]
    );

    const enriched = await enrichPosts(posts);

    return res.status(200).json({
      status: 1,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ── Create Post ───────────────────────────────────────────────────────────────
export const createPost = (type) => async (req, res, next) => {
  try {
    const {
      post_title,
      post_name,
      post_content,
      post_excerpt,
      description,
      project_description,
      category_name,
      category_slug,
      seo_title,
      seo_desc,
      seo_focus_keyword,
      seo_tags,
      author_name,
      author_image,
      author_quote,
      author_linkedin,
    } = req.body;

    if (!post_title) {
      return res.status(400).json({ status: 0, message: 'Title is required.' });
    }

    const excerpt = post_excerpt || description || project_description || '';

    const slug = (
      post_name ||
      post_title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    ).trim();

    const postDate = new Date();
    const cleanType = (type || 'post').toLowerCase();

    const insertResult = await query(
      `INSERT INTO wp_posts (post_title, post_name, post_content, post_excerpt, post_date, post_date_gmt, post_status, post_type, post_author, guid)
       VALUES (?, ?, ?, ?, ?, ?, 'publish', ?, 1, ?)`,
      [
        post_title.trim(),
        slug,
        post_content || '',
        excerpt,
        postDate,
        postDate,
        cleanType,
        `https://prephq.theiotacademy.co/${cleanType}/?p=new`,
      ]
    );

    const postId = insertResult.insertId;

    // Attach Category if provided
    if (category_name || category_slug) {
      const catSlug = (
        category_slug ||
        category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      ).trim();
      const catName = (category_name || category_slug).trim();

      let terms = await query('SELECT term_id FROM wp_terms WHERE slug = ? LIMIT 1', [catSlug]);
      let termId;

      if (terms.length > 0) {
        termId = terms[0].term_id;
      } else {
        const termInsert = await query(
          'INSERT INTO wp_terms (name, slug) VALUES (?, ?)',
          [catName, catSlug]
        );
        termId = termInsert.insertId;
        await query(
          "INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count) VALUES (?, 'category', '', 0, 1)",
          [termId]
        );
      }

      const ttRows = await query(
        "SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE term_id = ? AND taxonomy = 'category' LIMIT 1",
        [termId]
      );
      if (ttRows.length > 0) {
        await query(
          'INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id) VALUES (?, ?)',
          [postId, ttRows[0].term_taxonomy_id]
        );
      }
    }

    // Save Postmeta
    const metaEntries = [
      ['_yoast_wpseo_title', seo_title || post_title],
      ['_yoast_wpseo_metadesc', seo_desc || ''],
      ['_yoast_wpseo_focuskw', seo_focus_keyword || ''],
      ['seo_tags', typeof seo_tags === 'string' ? seo_tags : JSON.stringify(seo_tags || [])],
      ['author_name', author_name || 'Admin'],
      ['author_image', author_image || ''],
      ['author_quote', author_quote || ''],
      ['author_linkedin', author_linkedin || ''],
      ['likes', '0'],
    ];

    if (excerpt) {
      metaEntries.push(['project_description', excerpt]);
      metaEntries.push(['description', excerpt]);
    }

    if (difficulty_level) {
      metaEntries.push(['difficulty_level', difficulty_level]);
      metaEntries.push(['level', difficulty_level]);
    }
    if (tech_stack) {
      metaEntries.push(['tech_stack', tech_stack]);
      metaEntries.push(['technologies', tech_stack]);
    }
    if (project_duration) {
      metaEntries.push(['project_duration', project_duration]);
      metaEntries.push(['duration', project_duration]);
    }
    if (github_url) metaEntries.push(['github_url', github_url]);
    if (live_demo_url) metaEntries.push(['live_demo_url', live_demo_url]);
    if (req.body.domain) metaEntries.push(['domain', req.body.domain]);
    if (req.body.project_type) metaEntries.push(['project_type', req.body.project_type]);

    if (req.file) {
      metaEntries.push(['featured_image', `/uploads/posts/${req.file.filename}`]);
    }

    for (const [key, val] of metaEntries) {
      await query(
        `INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`,
        [postId, key, val]
      );
    }

    return res.status(201).json({
      status: 1,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully.`,
      data: { ID: postId },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Post ───────────────────────────────────────────────────────────────
export const updatePost = (type) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      post_title,
      post_name,
      post_content,
      post_excerpt,
      description,
      project_description,
      category_name,
      category_slug,
      seo_title,
      seo_desc,
      seo_focus_keyword,
      seo_tags,
      author_name,
      author_image,
      author_quote,
      author_linkedin,
      difficulty_level,
      tech_stack,
      project_duration,
      github_url,
      live_demo_url,
    } = req.body;

    if (!id) {
      return res.status(400).json({ status: 0, message: 'Post ID is required.' });
    }

    const excerpt =
      post_excerpt !== undefined
        ? post_excerpt
        : description !== undefined
        ? description
        : project_description;

    await query(
      `UPDATE wp_posts
       SET post_title = COALESCE(?, post_title),
           post_name = COALESCE(?, post_name),
           post_content = COALESCE(?, post_content),
           post_excerpt = COALESCE(?, post_excerpt)
       WHERE ID = ?`,
      [post_title, post_name, post_content, excerpt !== undefined ? excerpt : null, id]
    );

    // ── Update Category Relationships ──
    if (category_name || category_slug) {
      const rawCategories = (category_name || category_slug)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      if (rawCategories.length > 0) {
        // Delete previous category associations for this post
        await query(
          `DELETE tr FROM wp_term_relationships tr
           JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
           WHERE tr.object_id = ? AND tt.taxonomy = 'category'`,
          [id]
        );

        for (const cat of rawCategories) {
          const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          let terms = await query('SELECT term_id FROM wp_terms WHERE slug = ? OR name = ? LIMIT 1', [catSlug, cat]);
          let termId;

          if (terms.length > 0) {
            termId = terms[0].term_id;
          } else {
            const termInsert = await query(
              'INSERT INTO wp_terms (name, slug) VALUES (?, ?)',
              [cat, catSlug]
            );
            termId = termInsert.insertId;
            await query(
              "INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count) VALUES (?, 'category', '', 0, 1)",
              [termId]
            );
          }

          const ttRows = await query(
            "SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE term_id = ? AND taxonomy = 'category' LIMIT 1",
            [termId]
          );
          if (ttRows.length > 0) {
            await query(
              'INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id) VALUES (?, ?)',
              [id, ttRows[0].term_taxonomy_id]
            );
          }
        }
      }
    }

    const updateMeta = async (key, val) => {
      if (val !== undefined && val !== null) {
        const existing = await query(
          'SELECT meta_id FROM wp_postmeta WHERE post_id = ? AND meta_key = ? LIMIT 1',
          [id, key]
        );
        if (existing.length > 0) {
          await query(
            'UPDATE wp_postmeta SET meta_value = ? WHERE meta_id = ?',
            [String(val), existing[0].meta_id]
          );
        } else {
          await query(
            'INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)',
            [id, key, String(val)]
          );
        }
      }
    };

    await updateMeta('_yoast_wpseo_title', seo_title);
    await updateMeta('_yoast_wpseo_metadesc', seo_desc);
    await updateMeta('_yoast_wpseo_focuskw', seo_focus_keyword);
    if (seo_tags) await updateMeta('seo_tags', typeof seo_tags === 'string' ? seo_tags : JSON.stringify(seo_tags));
    if (author_name) await updateMeta('author_name', author_name);
    if (author_image) await updateMeta('author_image', author_image);
    if (author_quote) await updateMeta('author_quote', author_quote);
    if (author_linkedin) await updateMeta('author_linkedin', author_linkedin);

    // Project-specific metadata
    if (difficulty_level !== undefined) {
      await updateMeta('difficulty_level', difficulty_level);
      await updateMeta('level', difficulty_level);
    }
    if (tech_stack !== undefined) {
      await updateMeta('tech_stack', tech_stack);
      await updateMeta('technologies', tech_stack);
    }
    if (project_duration !== undefined) {
      await updateMeta('project_duration', project_duration);
      await updateMeta('duration', project_duration);
    }
    if (github_url !== undefined) await updateMeta('github_url', github_url);
    if (live_demo_url !== undefined) await updateMeta('live_demo_url', live_demo_url);
    if (req.body.domain !== undefined) await updateMeta('domain', req.body.domain);
    if (req.body.project_type !== undefined) await updateMeta('project_type', req.body.project_type);
    if (excerpt !== undefined) {
      await updateMeta('project_description', excerpt);
      await updateMeta('description', excerpt);
    }

    if (req.body.is_featured !== undefined) {
      const fVal =
        req.body.is_featured === true ||
        req.body.is_featured === 'true' ||
        req.body.is_featured === 1 ||
        req.body.is_featured === '1'
          ? '1'
          : '0';
      await updateMeta('is_featured', fVal);
    }

    if (req.file) {
      await updateMeta('featured_image', `/uploads/posts/${req.file.filename}`);
      await query(
        'DELETE FROM wp_postmeta WHERE post_id = ? AND meta_key = ?',
        [id, '_thumbnail_id']
      );
    } else if (
      req.body.remove_image === 'true' ||
      req.body.remove_image === true ||
      req.body.featured_image === ''
    ) {
      await query(
        'DELETE FROM wp_postmeta WHERE post_id = ? AND meta_key IN (?, ?)',
        [id, 'featured_image', '_thumbnail_id']
      );
    }

    return res.status(200).json({
      status: 1,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully.`,
      data: { ID: id },
    });
  } catch (error) {
    next(error);
  }
};

// ── Toggle Featured Status ───────────────────────────────────────────────────
export const toggleFeaturedPost = (type) => async (req, res, next) => {
  try {
    const { id } = req.params;
    let { is_featured } = req.body;

    if (!id) {
      return res.status(400).json({ status: 0, message: 'Post ID is required.' });
    }

    if (is_featured === undefined) {
      const rows = await query(
        `SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = 'is_featured' LIMIT 1`,
        [id]
      );
      const current =
        rows.length > 0 &&
        (rows[0].meta_value === '1' || rows[0].meta_value === 'true');
      is_featured = !current;
    } else {
      is_featured =
        is_featured === true ||
        is_featured === 'true' ||
        is_featured === 1 ||
        is_featured === '1';
    }

    const val = is_featured ? '1' : '0';
    const existing = await query(
      `SELECT meta_id FROM wp_postmeta WHERE post_id = ? AND meta_key = 'is_featured' LIMIT 1`,
      [id]
    );

    if (existing.length > 0) {
      await query(
        `UPDATE wp_postmeta SET meta_value = ? WHERE meta_id = ?`,
        [val, existing[0].meta_id]
      );
    } else {
      await query(
        `INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, 'is_featured', ?)`,
        [id, val]
      );
    }

    return res.status(200).json({
      status: 1,
      message: is_featured
        ? 'Project added to Featured.'
        : 'Project removed from Featured.',
      data: { id: parseInt(id, 10), is_featured },
    });
  } catch (error) {
    next(error);
  }
};


// ── Delete Post ───────────────────────────────────────────────────────────────
export const deletePost = (type) => async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 0, message: 'Post ID is required.' });
    }

    await query('DELETE FROM wp_posts WHERE ID = ?', [id]);
    await query('DELETE FROM wp_postmeta WHERE post_id = ?', [id]);
    await query('DELETE FROM wp_term_relationships WHERE object_id = ?', [id]);

    return res.status(200).json({
      status: 1,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Like Post ─────────────────────────────────────────────────────────────────
export const likePost = (type) => async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 0, message: 'Post ID is required.' });
    }

    const currentMeta = await query(
      `SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = 'likes' LIMIT 1`,
      [id]
    );

    const currentLikes = currentMeta.length > 0 ? parseInt(currentMeta[0].meta_value || '0', 10) : 0;
    const newLikes = currentLikes + 1;

    await query(
      `INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
       VALUES (?, 'likes', ?)
       ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)`,
      [id, String(newLikes)]
    );

    return res.status(200).json({
      status: 1,
      likes: newLikes,
      message: 'Liked successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPostsByType,
  getPostById,
  getPostsByCategory,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
