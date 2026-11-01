# Tracker and Solver App (MERN Stack)

> **B.Tech Computer Science and Engineering (CSE) Project**  
> **Student Developer**: Uday ([@uday-CSE-debug](https://github.com/uday-CSE-debug))  
> **GitHub Repository**: [https://github.com/uday-CSE-debug/tracker-and-solver-app](https://github.com/uday-CSE-debug/tracker-and-solver-app)  
> **Reference Technical Blueprint**: [sample_MERN_app_CSE_B by surendar77](https://github.com/surendar77/sample_MERN_app_CSE_B)

---

## 1. Project Overview & Objective

The **Tracker and Solver App** is a full-stack web application developed using the **MERN (MongoDB, Express.js, React.js, Node.js)** technology stack. It is engineered to streamline how developers, students, and technical professionals organize their daily workflows and systematically tackle complex problems.

While conventional task management tools only record linear to-do items, the **Tracker and Solver App** introduces a dual-engine paradigm:
1. **Activity Task Tracker**: Plans, categorizes, prioritizes, and monitors daily action items across states (`pending`, `in-progress`, `completed`).
2. **Problem Solver & Hypothesis Log**: Systematically documents technical bottlenecks, classifies error categories (Debugging, Algorithms, System, Logic), maintains chronological solution attempts with outcome ratings, and preserves resolution knowledge.
3. **Productivity Analytics & Velocity Engine**: Computes daily, weekly, and monthly velocity metrics, completion percentages, and interactive visual distributions.
4. **Role-Based Administration Console**: Provides administrative controls, system-wide task and problem oversight, and user access management.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Database** | **MongoDB** | `v8.3.x` / Mongoose `^8.9.x` | Document-oriented NoSQL database with schema validation & indexing |
| **Backend Framework** | **Express.js** | `^4.21.x` | RESTful API server, routing middleware, and static delivery |
| **Runtime Environment**| **Node.js** | `v24.x LTS` | Asynchronous event-driven JavaScript server runtime |
| **Frontend Framework** | **React.js** | `^18.x` / `^19.x` (Vite) | Declarative single-page component architecture with React Router v7 |
| **Security & Auth** | **JWT & bcryptjs** | `jsonwebtoken ^9.0`, `bcryptjs ^2.4` | Stateless token authorization and 10-round salted password hashing |
| **HTTP Client** | **Axios** | `^1.7.x` | Interceptor-driven HTTP communication with auto-bearer auth headers |
| **User Interface** | **Modern Responsive CSS & Lucide Icons** | CSS3 & `lucide-react` | Glassmorphism accents, responsive CSS Grid/Flexbox, interactive SVG charts |

---

## 3. Reference Architecture & Technical Differentiation

This project draws inspiration from the faculty's foundational starter repository ([`surendar77/sample_MERN_app_CSE_B`](https://github.com/surendar77/sample_MERN_app_CSE_B)), expanding its architecture into an enterprise-grade productivity system:

| Architectural Component | Faculty Reference App | Tracker and Solver App (Our Implementation) |
|---|---|---|
| **Domain Purpose** | Basic HR / Employee starter | Comprehensive Dual Task Tracker & Problem Solver |
| **Authentication** | Password verification, plaintext cookie/session | Full RFC-compliant **JSON Web Token (JWT)** with 7-day expiry & `Bearer` auth |
| **Data Isolation** | Global queries without user isolation | **Strict Multi-tenant Isolation**: Users only query and modify their own documents |
| **Database Models** | Basic `users` and `tasks` | Multi-collection schemas with subdocuments (`User`, `Task`, `Problem`, `SolutionAttempt`) |
| **Problem Solving** | Not implemented | Complete chronological hypothesis tracking, outcome tagging, and resolution recording |
| **Analytics & Charts** | Static numbers | Dynamic SVG Donut charts, 7-day velocity trend bars, category distribution heatmaps |
| **Admin Controls** | Simple delete user | Role modification, user deletion cascading, system-wide task & problem oversight |
| **Frontend Routing** | Basic pages | Protected Route Guards (`ProtectedRoute`, `AdminRoute`), 12 dedicated views |

---

## 4. System Architecture

```
                          ┌────────────────────────────┐
                          │   React Frontend (Vite)   │
                          │  (Responsive SPA Dashboard)│
                          └─────────────┬──────────────┘
                                        │ HTTP Requests (Bearer JWT)
                                        ▼
                          ┌────────────────────────────┐
                          │     Express.js Server      │
                          │   (Port 5000 / API Proxy)  │
                          └─────────────┬──────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Auth & Middleware   │     │  Controllers Layer   │     │  Central Error Mgmt  │
│  - JWT Verification  │     │  - Auth Controller   │     │  - CastError (404)   │
│  - Role Guards (RBAC)│     │  - Task Controller   │     │  - Duplicate (400)   │
│  - Password Hashing  │     │  - Problem Controller│     │  - Validation (400)  │
└──────────────────────┘     │  - Admin Controller  │     └──────────────────────┘
                             │  - Metrics Controller│
                             └──────────┬───────────┘
                                        │ Mongoose ODM
                                        ▼
                             ┌──────────────────────┐
                             │   MongoDB Database   │
                             │  (Collections: Users,│
                             │   Tasks, Problems)   │
                             └──────────────────────┘
```

---

## 5. Folder & Directory Organization

```
tracker-and-solver-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & reconnection handlers
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile management
│   │   ├── taskController.js     # Task CRUD, filters, priority & status updates
│   │   ├── problemController.js  # Problem CRUD, solution attempt logging, solving
│   │   ├── dashboardController.js# KPI metrics, completion rates, 7-day velocity
│   │   └── adminController.js    # User accounts, role toggling, system telemetry
│   ├── middleware/
│   │   ├── auth.js               # JWT Bearer token validator & Admin role guard
│   │   └── errorHandler.js       # Centralized HTTP & Mongoose error parser
│   ├── models/
│   │   ├── User.js               # User schema with pre-save password hash hook
│   │   ├── Task.js               # Task schema with priority, dueDate, completedAt
│   │   └── Problem.js            # Problem schema with embedded solution history
│   ├── routes/
│   │   ├── authRoutes.js         # Endpoints for /api/auth
│   │   ├── taskRoutes.js         # Endpoints for /api/tasks
│   │   ├── problemRoutes.js      # Endpoints for /api/problems
│   │   ├── dashboardRoutes.js    # Endpoints for /api/dashboard
│   │   └── adminRoutes.js        # Endpoints for /api/admin
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies & scripts
│   ├── server.js                 # Express server bootstrap & static SPA serving
│   └── test_api.js               # Automated 14-test verification suite
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Brand SVGs and design assets
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with user avatar & logout
│   │   │   ├── Sidebar.jsx       # Navigation drawer with active link states
│   │   │   ├── Footer.jsx        # Academic footer
│   │   │   ├── ProtectedRoute.jsx# Auth guard for authenticated routes
│   │   │   ├── AdminRoute.jsx    # Guard enforcing admin authorization
│   │   │   ├── StatCard.jsx      # Reusable dashboard metric card
│   │   │   └── Charts.jsx        # SVG Donut, Weekly trend, & Category bars
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global session state & token management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public presentation & feature showcase
│   │   │   ├── LoginPage.jsx     # User authentication with quick demo buttons
│   │   │   ├── RegisterPage.jsx  # Account registration with role selection
│   │   │   ├── DashboardPage.jsx # Central workspace with analytics & activities
│   │   │   ├── TasksPage.jsx     # Task management with search, filter, and CRUD
│   │   │   ├── TaskFormPage.jsx  # Create and edit task specifications
│   │   │   ├── ProblemsPage.jsx  # Problem solver directory with category filters
│   │   │   ├── ProblemFormPage.jsx # Record new issue and initial hypothesis
│   │   │   ├── ProblemDetailPage.jsx # Problem workspace with solution timeline
│   │   │   ├── ProgressPage.jsx  # Daily/Weekly/Monthly productivity meters
│   │   │   ├── ProfilePage.jsx   # User details & password update
│   │   │   └── AdminPage.jsx     # System administrator management console
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Route definitions & application frame
│   │   ├── App.css               # Core styling, responsive layouts, components
│   │   ├── index.css             # Theme variables, typography, reset rules
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML5 entry template
│   ├── package.json              # Frontend dependencies & build scripts
│   └── vite.config.js            # Vite build configuration with API reverse proxy
│
├── .gitignore                    # Git ignore file for secrets and dependencies
├── package.json                  # Root npm runner scripts
└── README.md                     # Comprehensive academic documentation
```

---

## 6. Database Models & Schema Specifications

### 1. `User` Schema
```javascript
{
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  timestamps: true
}
```
- **Hooks**: Automatically hashes `password` with `bcryptjs` (10 salt rounds) before save when modified.
- **Methods**: `matchPassword(enteredPassword)` and `toJSON()` (strips password hash from JSON responses).

### 2. `Task` Schema
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  timestamps: true
}
```
- **Lifecycle Hook**: Automatically sets `completedAt = Date.now()` when status is transitioned to `completed`, or resets to `null` if reopened.

### 3. `Problem` Schema
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Technical', 'Academic', 'Algorithm', 'Debugging', 'Logic', 'System', 'Other'], 
    default: 'Technical' 
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Solved', 'Closed'], default: 'Open' },
  solutions: [
    {
      solutionText: { type: String, required: true },
      outcome: { type: String, enum: ['Attempted', 'Partially Effective', 'Resolved'] },
      recordedAt: { type: Date, default: Date.now }
    }
  ],
  resolutionNotes: { type: String, default: '' },
  solvedAt: { type: Date, default: null },
  timestamps: true
}
```

---

## 7. REST API Endpoints Specification

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account; returns token and user object |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials; returns token and user object |
| `GET` | `/api/auth/profile` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, email, or change password |

### Tasks Management (`/api/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/tasks` | Private | Create a new task |
| `GET` | `/api/tasks` | Private | List all tasks for current user (`?status=...&priority=...&search=...`) |
| `GET` | `/api/tasks/:id` | Private | Get specific task details |
| `PUT` | `/api/tasks/:id` | Private | Update task title, description, priority, due date, or status |
| `DELETE` | `/api/tasks/:id` | Private | Delete task permanently |

### Problem Solver (`/api/problems`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/problems` | Private | Record new problem and optional initial hypothesis |
| `GET` | `/api/problems` | Private | List problems with filters (`?category=...&severity=...&status=...`) |
| `GET` | `/api/problems/:id` | Private | Get problem details with chronological solution timeline |
| `PUT` | `/api/problems/:id` | Private | Update problem attributes |
| `DELETE` | `/api/problems/:id` | Private | Delete problem record |
| `POST` | `/api/problems/:id/solutions` | Private | Append a new solution attempt (Attempted / Partially Effective / Resolved) |
| `PATCH` | `/api/problems/:id/solve` | Private | Mark problem as solved with final resolution notes |

### Analytics & Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Private | Key performance indicators, completion rates, and recent items |
| `GET` | `/api/dashboard/progress` | Private | Daily, weekly, monthly completion counts and category distributions |

### Admin Console (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin Only | System-wide statistics (users, total tasks, total problems) |
| `GET` | `/api/admin/users` | Admin Only | List all registered users with task and problem counts |
| `PUT` | `/api/admin/users/:id/role` | Admin Only | Promote or demote user role (`user` / `admin`) |
| `DELETE` | `/api/admin/users/:id` | Admin Only | Delete user account and cascade delete their tasks/problems |
| `GET` | `/api/admin/tasks` | Admin Only | View all tasks across all users |
| `GET` | `/api/admin/problems` | Admin Only | View all problems across all users |

---

## 8. Installation & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local Community Server running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI
- **Git**: Installed and configured

### 1. Clone the Repository
```bash
git clone https://github.com/uday-CSE-debug/tracker-and-solver-app.git
cd tracker-and-solver-app
```

### 2. Configure Environment Variables
In `backend/`, copy the example file or create `.env`:
```bash
# Windows PowerShell
cp backend/.env.example backend/.env
```
Ensure `backend/.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tracker_and_solver_db
JWT_SECRET=tracker_and_solver_secret_key_2026_super_secure
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install

cd ..
```

### 4. Running in Development Mode
You can run both servers concurrently:

**Terminal 1 (Backend API Server)**:
```bash
cd backend
npm run dev
# Server will listen on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
cd frontend
npm run dev
# Vite client will start on http://localhost:5173
```

### 5. Running in Production / Standalone Mode
Build the frontend and run the Express server (Express automatically serves the React SPA):
```bash
npm run build
npm start
# Visit http://localhost:5000 in your browser
```

---

## 9. Automated Testing & Verification

The project includes an in-depth automated API verification suite covering all 14 major workflows:
```bash
npm test
```
The test suite validates:
1. Health check telemetry (`GET /api/health`)
2. Standard user registration (`POST /api/auth/register`)
3. Admin account registration (`POST /api/auth/register`)
4. Credential authentication and JWT issuance (`POST /api/auth/login`)
5. Protected profile retrieval (`GET /api/auth/profile`)
6. Task creation with priority and due date (`POST /api/tasks`)
7. Task filtering and query sorting (`GET /api/tasks`)
8. Task status lifecycle update (`PUT /api/tasks/:id`)
9. Problem logging with categorization (`POST /api/problems`)
10. Solution attempt appending & auto-solving (`POST /api/problems/:id/solutions`)
11. Dashboard KPI aggregation (`GET /api/dashboard/stats`)
12. Longitudinal velocity tracking (`GET /api/dashboard/progress`)
13. Admin system telemetry access (`GET /api/admin/stats`)
14. Admin user directory inspection (`GET /api/admin/users`)

---

## 10. Default Demo Credentials (Faculty Evaluation)

For rapid grading and faculty testing, the login screen includes **Quick Demo Login** buttons, or you can use:

| Role | Email | Password |
|---|---|---|
| **Regular User** | `john@example.com` | `Password123` |
| **Administrator** | `admin@example.com` | `AdminPassword123` |

---

## 11. Academic Declaration

This project was developed by **Uday** as part of the **B.Tech Computer Science and Engineering** curriculum. The technical reference from [`surendar77/sample_MERN_app_CSE_B`](https://github.com/surendar77/sample_MERN_app_CSE_B) was analyzed to adopt clean MERN coding conventions, resulting in an original, feature-complete, and self-contained **Tracker and Solver** system.
