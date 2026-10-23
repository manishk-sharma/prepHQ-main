import { query } from '../config/db.js';

async function seedFeatured() {
  console.log('--- Checking & Seeding Featured Projects ---');
  // Projects #53 (AI Project Ideas) and #25 (Machine Learning Project Ideas)
  const defaultFeaturedIds = [53, 25];

  for (const id of defaultFeaturedIds) {
    const existing = await query(
      `SELECT meta_id, meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = 'is_featured' LIMIT 1`,
      [id]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES (?, 'is_featured', '1')`,
        [id]
      );
      console.log(`Seeded is_featured = 1 for project #${id}`);
    } else {
      console.log(`Project #${id} already has is_featured = ${existing[0].meta_value}`);
    }
  }

  const allProjects = await query(`
    SELECT p.ID, p.post_title, pm.meta_value as is_featured
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = 'is_featured'
    WHERE (p.post_type = 'project' OR (p.post_type = 'post' AND p.guid LIKE '%project%'))
      AND p.post_status = 'publish'
  `);
  console.log('Current projects with featured status:', allProjects);
  process.exit(0);
}

seedFeatured().catch(console.error);
