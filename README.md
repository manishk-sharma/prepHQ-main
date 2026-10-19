# PrepHQ — Full-Stack React & MySQL Platform

PrepHQ is an interview preparation, coding, tutorial, and career platform built with a modern **React.js (Vite)** frontend and a **Node.js / Express.js** backend connected to a **MySQL** database.

---

## 1. Project Architecture

```
prepHQ-main/
├── backend/                        # Node.js + Express.js API Server
│   ├── config/
│   │   └── db.js                   # MySQL connection pool (mysql2/promise)
│   ├── controllers/                # Business logic & parameterized database queries
│   │   ├── authController.js       # User & Admin auth, JWT, OTP, password hashing
│   │   ├── userController.js       # Profile, resume & image management
│   │   ├── contactController.js    # Contact queries & newsletter subscriptions
│   │   ├── jobsController.js       # Job listings & detailed descriptions
│   │   ├── dashboardController.js  # Aggregated admin dashboard records
│   │   ├── postsController.js      # Blogs, tutorials, projects & interviews (wp_posts & taxonomy)
│   │   ├── codingController.js     # Questions, testcases, run & submit runner
│   │   └── projectDetailsController.js # Dynamic project details, section ordering & sidebar cards
│   ├── middleware/
│   │   ├── auth.js                 # JWT Bearer token authentication & authorization
│   │   ├── errorHandler.js         # Safe centralized error handler
│   │   └── upload.js               # Multer disk storage for avatars, resumes & posts
│   ├── routes/                     # Express REST routes
│   │   ├── authRoutes.js           # Auth & account confirmation routes
│   │   ├── userRoutes.js           # User profile & document routes
│   │   ├── contactRoutes.js        # Contact & newsletter subscription routes
│   │   ├── jobsRoutes.js           # Job board routes
│   │   ├── dashboardRoutes.js      # Admin dashboard statistics routes
│   │   ├── postsRoutes.js          # Reusable post CRUD router for projects, blogs, tutorials & interviews
│   │   ├── codingRoutes.js         # Coding problems, execution sandbox & submissions
│   │   └── projectDetailsRoutes.js # Project details curriculum & sidebar management
│   ├── scripts/
│   │   ├── init_db.js              # Database initialization & coding platform seeds
│   │   ├── init_project_details.js # Project details table creation & default seeds
│   │   └── migrate_sidebar_cards.js # Sidebar cards table migration & seed script
│   ├── utils/
│   │   └── codeRunner.js           # Safe JavaScript VM & Python execution runner
│   ├── uploads/                    # Local storage for avatars, resumes, post media
│   ├── .env                        # Backend environment variables
│   ├── .env.example                # Safe environment template
│   ├── package.json
│   └── server.js                   # Main Express application entry point
│
├── src/                            # React.js (Vite) Frontend
│   ├── components/                 # Reusable UI components (Navbar, Footer, PostCard, Sidebar, etc.)
│   ├── context/                    # React Contexts (Notifications, TOC, etc.)
│   ├── hooks/                      # Custom React hooks (usePostDetail, etc.)
│   ├── pages/                      # Application views
│   │   ├── Home/                   # Landing page
│   │   ├── Projects/               # Project listing & Project Details page (`/projects-details/:slug`)
│   │   │   ├── components/         # EditableSectionHeader, Architecture, Objectives, Mistake cards
│   │   │   ├── Projectsdetails.jsx # Interactive 9-section project view with dynamic sidebar widgets
│   │   │   └── Projectsdetails.css # Project styling, responsive layout & custom scrollbar
│   │   ├── posts/                  # Unified post details view (`/projects/:id`, `/blogs/:id`, etc.)
│   │   │   └── PostDetailPage.jsx  # Rich post reader with tech stack, difficulty, GitHub/Demo links
│   │   ├── admin/                  # Admin dashboard & management interfaces
│   │   │   └── NewAdminPage/
│   │   │       ├── AdminLayout.jsx # Collapsible sidebar, topbar, active navigation & breadcrumbs
│   │   │       ├── admin.css       # Unified design system tokens, tables, metric cards & forms
│   │   │       ├── Projects/       # Admin Projects Hub
│   │   │       │   ├── ListProject.jsx         # Redesigned projects list with search, counters & actions
│   │   │       │   ├── AddProject.jsx          # New project creation flow
│   │   │       │   ├── EditProject.jsx         # Project update flow with enriched metadata
│   │   │       │   ├── AdminProjectDetails.jsx # DND section reordering, editable headers & curriculum
│   │   │       │   └── components/
│   │   │       │       ├── DndSortableWrapper.jsx   # Drag-and-drop sortable items via @dnd-kit
│   │   │       │       └── SidebarContentManager.jsx # CRUD & reordering for Related Projects/Tutorials/Guides
│   │   │       ├── components/     # Admin Sidebar with active state indicators & footer
│   │   │       │   └── post-form/
│   │   │       │       └── EditForm.jsx # Unified form UI with 3-state image dropzone & TinyMCE
│   │   │       └── schema/
│   │   │           └── schema.js   # Yup validation schema for project posts & metadata
│   │   ├── PrepCode/               # Interactive coding platform with Monaco editor & testcases
│   │   ├── Blogs/                  # Technical blogs
│   │   ├── Tutorials/              # Step-by-step tutorials
│   │   └── Jobs/                   # Job listings and career opportunities
│   ├── services/                   # Centralized API service layer (Axios + TanStack Query)
│   │   ├── api.js                  # Authenticated Axios instance with JWT interceptor
│   │   ├── publicApi.js            # Public API client
│   │   ├── adminApi.js             # Admin API client with admin token interceptor
│   │   ├── authServices.js         # Auth mutations (login, register, reset, confirm)
│   │   ├── userServices.js         # Profile and document hooks
│   │   ├── jobsServices.js         # Job query hooks
│   │   ├── codingQuestionsServices.js # Coding problem set, run & submission hooks
│   │   ├── blogServices.js         # Blog CRUD hooks
│   │   ├── tutorialServices.js     # Tutorial CRUD hooks
│   │   ├── projectsServices.js     # Projects CRUD hooks
│   │   ├── projectDetailsService.js # Project details, reordering & sidebar hooks
│   │   └── interviewsServices.js   # Interviews CRUD hooks
│   ├── redux/                      # Redux Toolkit store & persist slices
│   └── utils/                      # Helper utilities (image compression, date format, SEO generator)
│
├── .env                            # Frontend environment variables (VITE_API_URL)
├── .env.example
├── package.json
└── vite.config.js
```

---

## 2. Required Dependencies

### Frontend Dependencies (`package.json`)
- **Core Framework**: React 18, React DOM, React Router DOM 7
- **HTTP & Data Fetching**: Axios, `@tanstack/react-query`
- **State Management**: Redux Toolkit & Redux Persist
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **UI Components**: Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`), Bootstrap 5 & React-Bootstrap
- **Rich Text & Code Editors**: `@tinymce/tinymce-react`, `@monaco-editor/react`, React Quill
- **Image Optimization & Upload**: `browser-image-compression`, `react-dropzone`
- **Form Validation**: `react-hook-form`, `@hookform/resolvers`, `yup`
- **Icons & Graphics**: `lucide-react`, `react-icons`, `@mui/icons-material`, `recharts`
- **Animation & Utilities**: `framer-motion`, `dayjs`, `html-react-parser`, `react-helmet-async`, `react-toastify`

### Backend Dependencies (`backend/package.json`)
- `express`: REST API web framework
- `mysql2`: Fast MySQL driver supporting connection pooling (`mysql2/promise`)
- `cors`: Cross-Origin Resource Sharing middleware
- `dotenv`: Environment configuration management
- `jsonwebtoken`: Secure JWT token creation and verification
- `bcryptjs`: Password hashing (never stores plaintext passwords)
- `multer`: Multipart form data parser for avatar, resume, and featured image uploads

---

## 3. MySQL Database Setup

1. **Start MySQL Server**:
   Ensure MySQL is running on port `3306` (e.g., via XAMPP MySQL or standalone MySQL service).

2. **Database Verification**:
   The default database name is `u733794648_prephq`.
   To import the complete schema dump if setting up on a fresh machine:
   ```bash
   mysql -u root -p u733794648_prephq < u733794648_prephqproject.sql
   ```

3. **Initialize Platform Tables & Seed Data**:
   From the repository root or backend folder, run:
   ```bash
   # Initialize coding questions and submissions tables
   npm run init-db --prefix backend

   # Initialize project details tables and default seeds
   node backend/scripts/init_project_details.js

   # Run migration for sidebar cards schema and default records
   node backend/scripts/migrate_sidebar_cards.js
   ```

   This ensures:
   - `coding_questions` and `submissions` tables are created and seeded with sample problems (*Two Sum*, *Valid Palindrome*).
   - `project_details` table is created with `sidebar_cards` JSON support and seeded for `customer-churn-prediction-using-machine-learning`.
   - `project_sidebar_cards` relational table is created with proper foreign keys, indexes, and initial records for *Related Projects*, *Tutorials*, and *Mini Guides*.

---

## 4. Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` (based on `backend/.env.example`):
```ini
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=u733794648_prephq

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=prephq_jwt_dev_secret_key_8f3d99e
```

### Frontend (`.env`)
In the root directory, ensure `.env` contains:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Startup Commands & Scripts

### Quick Reference

| Command | Working Directory | Description |
| :--- | :--- | :--- |
| `npm run dev` | Repository Root | Start Vite development server on `http://localhost:5173` |
| `npm run backend` | Repository Root | Start Express API server on `http://localhost:5000` |
| `npm run backend:dev`| Repository Root | Start Express API server with automatic reload (`--watch`) |
| `npm run build` | Repository Root | Build optimized Vite production bundle |
| `npm run preview` | Repository Root | Preview production build locally |
| `npm run init-db` | `backend/` | Create and seed coding questions and submissions tables |
| `node backend/scripts/init_project_details.js` | Repository Root | Initialize project details tables and initial data |
| `node backend/scripts/migrate_sidebar_cards.js` | Repository Root | Migrate and seed sidebar cards relational table & JSON |

### Starting Frontend and Backend Concurrently
```bash
# Terminal 1: Backend API Server
npm run backend

# Terminal 2: Frontend Client
npm run dev
```

---

## 6. API Endpoint Documentation

### Authentication & Users
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System and MySQL database health check |
| **POST** | `/api/loginUser` | Public | User authentication, returns user profile + JWT |
| **POST** | `/api/register` | Public | User registration with hashed password & verification OTP |
| **POST** | `/api/confirm` | Public | Account confirmation via OTP |
| **POST** | `/api/resend-code` | Public | Resend account confirmation OTP |
| **POST** | `/api/request_reset` | Public | Request password reset verification code |
| **POST** | `/api/verify_code` | Public | Verify password reset verification code |
| **POST** | `/api/reset_password` | Public | Update password with bcrypt hash |
| **POST** | `/api/admin-login` | Public | Admin login, returns admin profile + JWT |
| **POST** | `/api/admin-logout` | Admin | Admin logout session invalidation |
| **POST** | `/api/logout` | Public | User logout |
| **GET** | `/api/user` | User | Get authenticated user profile |
| **POST** | `/api/profileupdate` | User | Update personal details (bio, phone, social links) |
| **POST** | `/api/upload-profile-image`| User | Upload profile avatar (multipart) |
| **POST** | `/api/upload-resume` | User | Upload user resume document (PDF/DOC) |
| **DELETE**| `/api/delete-resume` | User | Delete user resume |

### Content Management (Projects, Blogs, Tutorials & Interviews)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/project` | Public | Retrieve all project posts with enriched metadata |
| **GET** | `/api/project/:id` | Public | Retrieve single project post by ID with metadata |
| **GET** | `/api/project/category/:category` | Public | Retrieve project posts filtered by category slug or name |
| **POST** | `/api/project/:id/like` | Public/User | Increment likes counter for a project post |
| **POST** | `/api/project` | Admin | Create project post (supports multipart featured image, tech stack, difficulty, duration, GitHub & Demo URLs) |
| **PUT** | `/api/project/:id` | Admin | Update project post and sync category taxonomy & metadata |
| **DELETE**| `/api/project/:id` | Admin | Delete project post |
| **GET** | `/api/blog` | Public | Retrieve blog posts from MySQL (`wp_posts`) |
| **GET** | `/api/tutorial` | Public | Retrieve tutorial posts from MySQL |
| **GET** | `/api/interview` | Public | Retrieve interview questions from MySQL |
| **POST** | `/api/blog`, `/tutorial`, `/interview` | Admin | Create new content post |
| **PUT** | `/api/blog/:id`, `/tutorial/:id`, `/interview/:id` | Admin | Update existing content post |
| **DELETE**| `/api/blog/:id`, `/tutorial/:id`, `/interview/:id` | Admin | Delete content post |

### Project Details & Curriculum Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/project-details` | Public | List summary of all project details curriculum entries |
| **GET** | `/api/project-details/:slugOrId` | Public | Retrieve complete 9-section project curriculum by slug or ID |
| **POST** | `/api/project-details` | Admin | Create new project curriculum details entry |
| **PUT** | `/api/project-details/:slugOrId` | Admin/Public | Update project details (section ordering, headings, content) |
| **DELETE**| `/api/project-details/:slugOrId` | Admin | Delete project details curriculum record |
| **GET** | `/api/project-details/:slugOrId/sidebar-cards` | Public | Retrieve dynamic sidebar cards (Related Projects, Tutorials, Guides) |
| **PUT** | `/api/project-details/:slugOrId/sidebar-cards` | Admin/Public | Save / update sidebar cards order and items |

### Coding Platform & Code Runner
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/questions` | Public | Retrieve all coding problems |
| **GET** | `/api/questions/:slug` | Public | Retrieve coding problem by slug or ID |
| **POST** | `/api/questions` | Admin | Create new coding problem with testcases |
| **PUT** | `/api/questions/:id` | Admin | Update coding problem |
| **DELETE**| `/api/questions/:id` | Admin | Delete coding problem |
| **POST** | `/api/run` | Public/User | Execute solution against sample testcases via safe VM sandbox |
| **POST** | `/api/submit` | Public/User | Submit code, evaluate all cases, save submission |
| **GET** | `/api/submit/:submissionId`| Public/User | Poll submission result verdict |
| **GET** | `/api/submissions` | User | Retrieve personal submission history |
| **GET** | `/api/admin/submissions`| Admin | Admin submission metrics and monitoring |

### Careers & Contact Form
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/jobs/get-all-jobs` | Public | Retrieve all career listings |
| **GET** | `/api/jobs/get-job` | Public | Retrieve single job by ID (`?id=:id`) |
| **POST** | `/api/contactus` | Public | Submit contact form to `contact_messages` |
| **POST** | `/api/newsletterSubscribe`| Public | Subscribe email address to newsletter |

---

## 7. Database Tables and Relationships

- **`admin`**: Admin account records (`adminname`, `email`, `password`, `token`).
- **`user`**: User accounts (`name`, `lastname`, `username`, `email`, `password`, `profile_image`, `resume`, `phone`, `country`, `bio`, `github`, `linkedin`).
- **`jobs`**: Career listings (`position`, `company`, `min_year`, `max_year`, `location`, `deadline`, `description`, `apply_link`).
- **`contact_messages`**: Contact inquiries (`firstname`, `lastname`, `email`, `phone`, `message`, `created_at`).
- **`newsletter_subscribers`**: Newsletter subscriptions (`email`, `status`, `subscribed_at`).
- **`accountconfirm`**: OTP verification entries (`user_id`, `email`, `code`, `status`, `expires_at`).
- **`wp_posts`**: Content records for projects, blogs, tutorials, and interviews (`ID`, `post_title`, `post_name`, `post_content`, `post_type`, `post_status`, `post_date`).
- **`wp_postmeta`**: Key-value metadata store (`_thumbnail_id`, `featured_image`, `author_name`, `author_image`, `author_quote`, `author_linkedin`, `seo_title`, `seo_desc`, `seo_focus_keyword`, `seo_tags`, `likes`, `difficulty_level`, `level`, `tech_stack`, `technologies`, `project_duration`, `duration`, `github_url`, `live_demo_url`).
- **`wp_terms` / `wp_term_taxonomy` / `wp_term_relationships`**: Relational taxonomy system categorizing posts into searchable categories.
- **`coding_questions`**: Problem definitions (`title`, `slug`, `difficulty`, `domain`, `topics`, `starter_code`, `testcases`, `entry_point`, `param_order`).
- **`submissions`**: Coding executions (`submission_id`, `user_id`, `question_id`, `language`, `code`, `status`, `passed_count`, `total_count`, `runtime_ms`, `results`).
- **`project_details`**: In-depth project records (`slug`, `title`, `subtitle`, `level`, `duration`, `domain`, `project_type`, `about_text_1/2/3`, `prerequisites`, `objectives`, `architecture_steps`, `architecture_details`, `implementation_steps`, `technologies`, `dataset_resources`, `technical_learnings`, `practical_learnings`, `common_mistakes`, `section_headers`, `section_2_design`, `sidebar_cards`).
- **`project_sidebar_cards`**: Relational cards for sidebar widgets (`card_id`, `project_id`, `project_slug`, `section_type`, `title`, `display_date`, `destination_url`, `linked_resource`, `display_order`, `status`, `is_active`).

---

## 8. Key Features & Modules

### 1. Admin Projects Management & Redesign (`/admin/projects`)
- **Modern Management Dashboard**:
  - Real-time search with clear button by project title or category name.
  - Interactive counter pill tracking visible and total projects.
  - Category pill badges with domain-tailored color accents (AI/ML, Blockchain, Data Science, IoT, SQL).
  - Four quick-action shortcuts for each project: **View Live**, **Open Curriculum Details**, **Edit Project**, and **Delete Project** with confirmation modal and smooth exit animations.
- **Enhanced Project Editor (`/admin/projects/add` & `/admin/projects/edit/:id`)**:
  - **Difficulty Level**: Configurable badge level (`Beginner`, `Intermediate`, `Advanced`).
  - **Estimated Duration**: Project timeline (e.g., `4-6 Weeks`, `10 Hours`).
  - **Technologies & Tech Stack**: Comma-separated tag list formatted cleanly across public views.
  - **GitHub Repository URL**: Direct link to the source code repository.
  - **Live Demo URL**: Public deployment preview link.
  - **3-State Feature Image Upload**: Drag-and-drop file upload, instant local blob preview, replace action, and client-side WebP compression.
  - **TinyMCE WYSIWYG Editor**: Full-featured content editor with custom accessibility labels.
  - **Taxonomy Auto-Sync**: Automatically checks, creates, and binds terms in `wp_terms`, `wp_term_taxonomy`, and `wp_term_relationships`.

### 2. Public Project Showcase & Technical Pages
- **Unified Post & Project Reader (`/projects/:id` / `PostDetailPage.jsx`)**:
  - Metadata header featuring Author avatar, publication date, reading time calculation, and category pills.
  - Prominent project banner with difficulty level indicator and duration badge.
  - Dedicated **Tech Stack** section rendering tool pills.
  - Quick action buttons to visit the **GitHub Source Repository** or **Launch Live Demo**.
  - Dynamic Table of Contents and related posts recommendations.
- **Interactive Project Details Curriculum (`/projects-details/:slug`)**:
  - **9 Modular Curriculum Sections**: About Project, Prerequisites, Objectives, Architecture, Step-by-Step Implementation, Tools & Technologies, Dataset Resources, Key Learnings, and Common Mistakes.
  - **10-Step Architecture Pipeline**: Sequential ML workflow pipeline (*Raw Dataset*, *Data Collection*, *Data Cleaning*, *Exploratory Analysis*, *Feature Engineering*, *Train-Test Split*, *Model Training*, *Model Evaluation*, *Hyperparameter Tuning*, *Deployment & Prediction*).
  - **3-Card Scrollable Sidebar Widgets**:
    - Dedicated widgets for *Related Projects*, *Tutorials*, and *Mini Guides*.
    - Displays up to 3 cards simultaneously with smooth vertical scrolling and custom navy/mint pill scrollbar (`#074568` track, `#52c496` thumb).
  - **Dual Layout Toggle**: Switch between 2x2 grid and single column layouts for section presentation.

### 3. Interactive Coding Platform (`/prepcode`)
- Multi-language code editor powered by **Monaco Editor**.
- Built-in sandboxed code runner executing sample testcases in real-time.
- Comprehensive testcase evaluation engine with runtime measurement and detailed error reporting.

---

## 9. Security & Best Practices Implemented

1. **Parameterized SQL Queries**: All database queries use SQL placeholders (`?`) to prevent SQL injection vulnerabilities.
2. **Password Hashing**: Passwords are saved as bcrypt hashes with salt rounds; legacy plain-text credentials are auto-upgraded upon login.
3. **JWT Authentication & Authorization**: Private API endpoints verify Bearer tokens with separate roles for standard users and administrators.
4. **CORS Restrictions**: Server restricts cross-origin resource sharing to authorized frontend origins.
5. **No Frontend Credential Leakage**: Database credentials remain strictly on the backend server inside `backend/.env`.
6. **Code Runner Sandbox**: JavaScript executions run inside isolated Node.js `vm` contexts with strict timeouts to prevent infinite loops or harmful operations.
7. **Client-Side Image Optimization**: Images are compressed to optimized WebP format before upload to conserve bandwidth and storage.

---

## 10. Troubleshooting Guidance

- **Database Connection Refused**:
  Verify MySQL service is active on port `3306`. Check `backend/.env` credentials (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`).
- **CORS Error in Browser**:
  Ensure `FRONTEND_URL` in `backend/.env` matches your browser URL (default: `http://localhost:5173`).
- **Port 5000 in Use**:
  Update `PORT` in `backend/.env` and update `VITE_API_URL` in root `.env` accordingly.
- **Missing Platform Tables or Columns**:
  Run the initialization and migration scripts in order:
  ```bash
  npm run init-db --prefix backend
  node backend/scripts/init_project_details.js
  node backend/scripts/migrate_sidebar_cards.js
  ```
