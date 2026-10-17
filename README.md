# PrepHQ — Full-Stack React & MySQL Platform

PrepHQ is an interview preparation, coding, tutorial, and career platform built with a **React.js** frontend and a **Node.js / Express.js** backend connected to a **MySQL** database.

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
│   │   ├── postsController.js      # Blogs, tutorials, projects & interviews (wp_posts)
│   │   ├── codingController.js     # Questions, testcases, run & submit runner
│   │   └── projectDetailsController.js # Dynamic project details, section ordering & sidebar cards
│   ├── middleware/
│   │   ├── auth.js                 # JWT Bearer token authentication & authorization
│   │   ├── errorHandler.js         # Safe centralized error handler
│   │   └── upload.js               # Multer disk storage for avatars, resumes & posts
│   ├── routes/                     # Express REST routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── jobsRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── postsRoutes.js
│   │   ├── codingRoutes.js
│   │   └── projectDetailsRoutes.js # Project details, section ordering & sidebar management
│   ├── scripts/
│   │   ├── init_db.js              # Database initialization & coding platform seeds
│   │   └── init_project_details.js # Project details table creation & default seeds
│   ├── utils/
│   │   └── codeRunner.js           # Safe JavaScript VM & Python execution runner
│   ├── uploads/                    # Local storage for avatars, resumes, post media
│   ├── .env                        # Backend environment variables
│   ├── .env.example                # Safe environment template
│   ├── package.json
│   └── server.js                   # Main Express application entry point
│
├── src/                            # React.js (Vite) Frontend
│   ├── components/                 # Reusable UI components (Navbar, Footer, PostCard, etc.)
│   ├── pages/                      # Application views
│   │   ├── Home/                   # Landing page
│   │   ├── Projects/               # Project listing & Project Details page (`/projects-details/:slug`)
│   │   │   ├── components/         # EditableSectionHeader, Architecture, Objectives, Mistake cards
│   │   │   ├── Projectsdetails.jsx # Interactive 9-section project view with dynamic sidebar widgets
│   │   │   └── Projectsdetails.css # Project styling, responsive layout & custom scrollbar
│   │   ├── admin/                  # Admin dashboard & management interfaces
│   │   │   └── NewAdminPage/
│   │   │       ├── Projects/       # Project Details Editor (`/admin/projects/details`)
│   │   │       │   ├── AdminProjectDetails.jsx # DND section reordering, editable headers, metadata
│   │   │       │   └── components/
│   │   │       │       ├── DndSortableWrapper.jsx   # Drag-and-drop sortable items via @dnd-kit
│   │   │       │       └── SidebarContentManager.jsx # CRUD & reordering for Related Projects/Tutorials/Guides
│   │   │       └── components/     # Admin Sidebar with active state indicators & footer
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
│   └── redux/                      # Redux Toolkit store & persist slices
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
- **Editor & Icons**: Monaco Editor, Lucide Icons, React Icons
- **Animation & Utilities**: Framer Motion, Dayjs, HTML-React-Parser

### Backend Dependencies (`backend/package.json`)
- `express`: REST API web framework
- `mysql2`: MySQL driver supporting connection pooling (`mysql2/promise`)
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment configuration management
- `jsonwebtoken`: Secure JWT token creation and verification
- `bcryptjs`: Password hashing (never stores plaintext passwords)
- `multer`: Multipart form data parser for file/image uploads

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

   # Initialize project details and sidebar card tables
   node backend/scripts/init_project_details.js
   ```
   This ensures:
   - `coding_questions` and `submissions` tables are created and seeded with sample problems (*Two Sum*, *Valid Palindrome*).
   - `project_details` and `project_sidebar_cards` tables are created and seeded with default data for `customer-churn-prediction-using-machine-learning`.

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

## 5. Startup Commands

### Start Backend API Server
```bash
# Option 1: From repository root
npm run backend

# Option 2: Directly inside backend directory
cd backend
npm start
```
*The backend starts on `http://localhost:5000`.*

### Start Frontend Application
```bash
# In a separate terminal in repository root
npm run dev
```
*The React application starts on `http://localhost:5173`.*

---

## 6. API Endpoint Documentation

### Authentication & Users
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System and MySQL database health check |
| **POST** | `/api/loginUser` | Public | User authentication, returns user + JWT |
| **POST** | `/api/register` | Public | User registration with hashed password & OTP |
| **POST** | `/api/confirm` | Public | Account confirmation via OTP |
| **POST** | `/api/resend-code` | Public | Resend account confirmation OTP |
| **POST** | `/api/request_reset` | Public | Request password reset code |
| **POST** | `/api/verify_code` | Public | Verify password reset code |
| **POST** | `/api/reset_password` | Public | Update password with bcrypt hash |
| **POST** | `/api/admin-login` | Public | Admin login, returns admin profile + JWT |
| **POST** | `/api/admin-logout` | Admin | Admin logout |
| **POST** | `/api/logout` | Public | User logout |
| **GET** | `/api/user` | User | Get authenticated user profile |
| **POST** | `/api/profileupdate` | User | Update personal details (bio, phone, etc.) |
| **POST** | `/api/upload-profile-image`| User | Upload profile avatar (multipart) |
| **POST** | `/api/upload-resume` | User | Upload user resume document (PDF/DOC) |
| **DELETE**| `/api/delete-resume` | User | Delete user resume |

### Project Details & Sidebar Cards
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/project-details` | Public | List summary of all project details |
| **GET** | `/api/project-details/:slugOrId` | Public | Retrieve complete project details by slug or ID |
| **POST** | `/api/project-details` | Admin | Create new project details entry |
| **PUT** | `/api/project-details/:slugOrId` | Admin/Public | Update project details (headings, section order, content) |
| **GET** | `/api/project-details/:slugOrId/sidebar-cards` | Public | Retrieve dynamic sidebar cards (Related Projects, Tutorials, Guides) |
| **PUT** | `/api/project-details/:slugOrId/sidebar-cards` | Admin/Public | Save / update sidebar cards |
| **DELETE**| `/api/project-details/:slugOrId` | Admin | Delete project details record |

### Coding Platform & Code Runner
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/questions` | Public | Retrieve all coding problems |
| **GET** | `/api/questions/:slug` | Public | Retrieve coding problem by slug or ID |
| **POST** | `/api/questions` | Admin | Create new coding problem with test cases |
| **PUT** | `/api/questions/:id` | Admin | Update coding problem |
| **DELETE**| `/api/questions/:id` | Admin | Delete coding problem |
| **POST** | `/api/run` | Public/User | Execute solution against sample testcases |
| **POST** | `/api/submit` | Public/User | Submit code, evaluate all cases, save submission |
| **GET** | `/api/submit/:submissionId`| Public/User | Poll submission result verdict |
| **GET** | `/api/submissions` | User | User submission history |
| **GET** | `/api/admin/submissions`| Admin | Admin submission metrics and dashboard |

### Content Management (Posts, Jobs & Contacts)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/project` | Public | Retrieve projects from MySQL (`wp_posts`) |
| **GET** | `/api/blog` | Public | Retrieve blog posts from MySQL |
| **GET** | `/api/tutorial` | Public | Retrieve tutorials from MySQL |
| **GET** | `/api/interview` | Public | Retrieve interview questions from MySQL |
| **POST** | `/api/project` | Admin | Create project post |
| **PUT** | `/api/project/:id` | Admin | Update existing project post |
| **DELETE**| `/api/project/:id` | Admin | Delete project post |
| **GET** | `/api/jobs/get-all-jobs` | Public | Retrieve all jobs from database |
| **GET** | `/api/jobs/get-job` | Public | Retrieve single job by ID (`?id=:id`) |
| **POST** | `/api/contactus` | Public | Submit contact form to `contact_messages` |
| **POST** | `/api/newsletterSubscribe`| Public | Subscribe to newsletter |

---

## 7. Database Tables and Relationships

- `admin`: Admin account records (`adminname`, `email`, `password`, `token`).
- `user`: User accounts (`name`, `lastname`, `username`, `email`, `password`, `profile_image`, `resume`, `phone`, `country`, `bio`, `github`, `linkedin`).
- `jobs`: Career listings (`position`, `company`, `min_year`, `max_year`, `location`, `deadline`, `description`, `apply_link`).
- `contact_messages`: Contact form submissions (`firstname`, `lastname`, `email`, `phone`, `message`, `created_at`).
- `newsletter_subscribers`: Newsletter subscriptions (`email`, `status`, `subscribed_at`).
- `accountconfirm`: OTP verification entries (`user_id`, `email`, `code`, `status`, `expires_at`).
- `wp_posts`: Content items for projects, blogs, tutorials, and interviews (`ID`, `post_title`, `post_name`, `post_content`, `post_type`, `post_date`).
- `wp_postmeta`: Metadata for content (`_thumbnail_id`, `featured_image`, `author_name`, `seo_title`, `seo_desc`, `likes`).
- `wp_terms` / `wp_term_taxonomy` / `wp_term_relationships`: Post category taxonomy mapping.
- `coding_questions`: Coding problem definitions (`title`, `slug`, `difficulty`, `domain`, `topics`, `starter_code`, `testcases`, `entry_point`, `param_order`).
- `submissions`: Coding submissions (`submission_id`, `user_id`, `question_id`, `language`, `code`, `status`, `passed_count`, `total_count`, `runtime_ms`, `results`).
- `project_details`: Detailed project records (`slug`, `title`, `subtitle`, `level`, `duration`, `domain`, `project_type`, `about_text_1/2/3`, `prerequisites`, `objectives`, `architecture_steps`, `architecture_details`, `implementation_steps`, `technologies`, `dataset_resources`, `technical_learnings`, `practical_learnings`, `common_mistakes`, `section_headers`, `section_2_design`, `sidebar_cards`).
- `project_sidebar_cards`: Individual relational records for sidebar widgets (`project_slug`, `section_key`, `title`, `display_date`, `destination_url`, `display_order`, `status`).

---

## 8. Key Features & Modules

### 1. Project Details & Interactive Workflow Showcase (`/projects-details/:slug`)
- **9 Modular Sections**: About Project, Prerequisites, Project Objectives, Project Architecture, Step-by-Step Implementation Guide, Tools & Technologies Used, Where to Get Data, Learnings from the Project, Common Mistakes to Avoid.
- **Dynamic Section Reordering**: Order persists to MySQL and renders seamlessly in the main view and in the quick-navigation sidebar.
- **Editable Section & Category Headings**: Customizable headings for all sections and prerequisite/learning categories (e.g. *Python Fundamentals*, *Data Handling Prerequisites*, *Technical Skills*).
- **Architecture Workflow Pipeline**: 10 distinct, numbered pipeline steps (*Raw Dataset*, *Data Collection*, *Data Cleaning*, *Exploratory Analysis*, *Feature Engineering*, *Train-Test Split*, *Model Training*, *Model Evaluation*, *Hyperparameter Tuning*, *Deployment & Prediction*).
- **3-Card Scrollable Sidebar Widgets**:
  - Independent containers for **Related Projects**, **Tutorials**, and **Mini Guides**.
  - Displays a maximum of 3 cards at a time; additional cards are accessible via smooth vertical scrolling.
  - Custom navy pill track (`#074568`) with mint thumb (`#52c496`), with no default browser arrow buttons.
  - Consistent card heights, typography, and icon alignments.

### 2. Admin Panel & Project Details Editor (`/admin/projects/details`)
- **Drag-and-Drop Section Reordering**: Powered by `@dnd-kit/sortable` with instant preview and database persistence.
- **Layout Switcher**: Choose between 2x2 Grid and Single Column layouts for Section 02.
- **Inline Heading Customizer**: Click-to-edit category and section titles with real-time save buttons and feedback toasts.
- **Sidebar Content Manager**:
  - Add, edit, delete, and reorder cards across Related Projects, Tutorials, and Mini Guides.
  - Configure card title, display date, destination link (internal route or external URL), and active/inactive status toggle.
- **Consistent Dashboard UI**: Full-height dark navy sidebar, single active-menu highlight, and online status footer.

### 3. Interactive Coding Platform (`/prepcode`)
- Multi-language code editor powered by Monaco Editor.
- Built-in sandboxed code runner executing sample testcases in real-time.
- Comprehensive test case evaluation engine with runtime measurement and detailed error reporting.

---

## 9. Security & Best Practices Implemented

1. **Parameterized Queries**: All database queries use SQL placeholders (`?`) to prevent SQL injection vulnerabilities.
2. **Password Hashing**: Passwords are saved as bcrypt hashes with salt rounds. Legacy plain-text passwords on existing records are auto-upgraded upon login.
3. **JWT Authentication**: Private API endpoints verify Bearer tokens with separate roles for standard users and administrators.
4. **CORS Restrictions**: Server restricts cross-origin resource sharing to the authorized frontend domain.
5. **No Frontend Credential Leakage**: Database credentials remain strictly on the backend server inside `backend/.env`.
6. **Code Runner Sandbox**: JavaScript executions run inside Node.js `vm` contexts with strict timeouts to prevent infinite loops or harmful operations.

---

## 10. Troubleshooting Guidance

- **Database Connection Refused**:
  Verify MySQL service is active on port `3306`. Check `backend/.env` credentials (`DB_USER`, `DB_PASSWORD`, `DB_HOST`).
- **CORS Error in Browser**:
  Ensure `FRONTEND_URL` in `backend/.env` matches your browser URL (default: `http://localhost:5173`).
- **Port 5000 in Use**:
  Update `PORT` in `backend/.env` and update `VITE_API_URL` in root `.env` accordingly.
- **Missing Tables**:
  Run `npm run init-db --prefix backend` and `node backend/scripts/init_project_details.js` to verify and seed missing platform tables.
