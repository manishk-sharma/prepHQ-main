import { query, pool } from '../config/db.js';

async function migrateSidebarCards() {
  console.log('--- Migrating Sidebar Cards Schema ---');
  try {
    // 1. Add sidebar_cards JSON column to project_details if not exists
    const cols = await query('SHOW COLUMNS FROM project_details');
    const hasCol = cols.some((c) => c.Field === 'sidebar_cards');
    if (!hasCol) {
      await query('ALTER TABLE project_details ADD COLUMN sidebar_cards JSON NULL');
      console.log('Added column sidebar_cards to project_details.');
    } else {
      console.log('Column sidebar_cards already exists in project_details.');
    }

    // 2. Create project_sidebar_cards table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS project_sidebar_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(100) NOT NULL UNIQUE,
        project_id INT NULL,
        project_slug VARCHAR(255) NOT NULL,
        section_type ENUM('related_project', 'tutorial', 'mini_guide') NOT NULL,
        title VARCHAR(255) NOT NULL,
        display_date VARCHAR(100) NULL,
        destination_url VARCHAR(500) NULL,
        linked_resource VARCHAR(255) NULL,
        display_order INT DEFAULT 0,
        status ENUM('active', 'inactive') DEFAULT 'active',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_slug_section (project_slug, section_type),
        KEY idx_project_id (project_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Checked table: project_sidebar_cards (OK)');

    // 3. Populate default sidebar cards for customer-churn-prediction-using-machine-learning if empty
    const slug = 'customer-churn-prediction-using-machine-learning';
    const rows = await query('SELECT id, sidebar_cards FROM project_details WHERE slug = ? LIMIT 1', [slug]);

    if (rows.length > 0) {
      const current = rows[0].sidebar_cards ? JSON.parse(rows[0].sidebar_cards) : null;
      if (!current || (!current.related_projects && !current.tutorials && !current.mini_guides)) {
        const defaultSidebarCards = {
          related_projects: [
            {
              id: 'rel-1',
              section_type: 'related_project',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/projects-details/customer-segmentation-using-k-means',
              linked_resource: 'customer-segmentation-using-k-means',
              display_order: 1,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'rel-2',
              section_type: 'related_project',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/projects-details/credit-card-fraud-detection',
              linked_resource: 'credit-card-fraud-detection',
              display_order: 2,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'rel-3',
              section_type: 'related_project',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/projects-details/stock-price-prediction',
              linked_resource: 'stock-price-prediction',
              display_order: 3,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          tutorials: [
            {
              id: 'tut-1',
              section_type: 'tutorial',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/tutorials',
              linked_resource: '',
              display_order: 1,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'tut-2',
              section_type: 'tutorial',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/tutorials',
              linked_resource: '',
              display_order: 2,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'tut-3',
              section_type: 'tutorial',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/tutorials',
              linked_resource: '',
              display_order: 3,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          mini_guides: [
            {
              id: 'guide-1',
              section_type: 'mini_guide',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/guides',
              linked_resource: '',
              display_order: 1,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'guide-2',
              section_type: 'mini_guide',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/guides',
              linked_resource: '',
              display_order: 2,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'guide-3',
              section_type: 'mini_guide',
              title: 'Create Amazing Color Schemes Design',
              display_date: '05 Aug, 2025',
              destination_url: '/guides',
              linked_resource: '',
              display_order: 3,
              status: 'active',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        };

        await query('UPDATE project_details SET sidebar_cards = ? WHERE slug = ?', [
          JSON.stringify(defaultSidebarCards),
          slug,
        ]);
        console.log('Populated default sidebar_cards in project_details.');

        // Also seed project_sidebar_cards table
        const allCards = [
          ...defaultSidebarCards.related_projects,
          ...defaultSidebarCards.tutorials,
          ...defaultSidebarCards.mini_guides,
        ];
        const projectId = rows[0].id;
        for (const c of allCards) {
          await query(
            `INSERT INTO project_sidebar_cards 
             (card_id, project_id, project_slug, section_type, title, display_date, destination_url, linked_resource, display_order, status, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
               title = VALUES(title),
               display_date = VALUES(display_date),
               destination_url = VALUES(destination_url),
               linked_resource = VALUES(linked_resource),
               display_order = VALUES(display_order),
               status = VALUES(status),
               is_active = VALUES(is_active)`,
            [
              c.id,
              projectId,
              slug,
              c.section_type,
              c.title,
              c.display_date,
              c.destination_url,
              c.linked_resource,
              c.display_order,
              c.status,
              c.is_active ? 1 : 0,
            ]
          );
        }
        console.log('Seeded project_sidebar_cards table records.');
      }
    }

    console.log('--- Migration completed successfully ---');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrateSidebarCards();
