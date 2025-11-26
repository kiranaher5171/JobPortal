# Job Portal - Enterprise Architecture

## 📁 Project Structure

```
job-portal/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Root redirect
│   │   ├── root.css                  # Global styles
│   │   │
│   │   ├── (public)/                 # Public routes group
│   │   │   ├── home/
│   │   │   │   └── page.js
│   │   │   ├── about/
│   │   │   │   └── page.js
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── signup/
│   │   │       └── ...
│   │   │
│   │   ├── (admin)/                  # Admin routes group
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── jobs/
│   │   │   │   ├── users/
│   │   │   │   ├── applications/
│   │   │   │   └── settings/
│   │   │   └── layout.js             # Admin layout with protection
│   │   │
│   │   ├── (user)/                   # User routes group
│   │   │   ├── jobs/
│   │   │   ├── saved-jobs/
│   │   │   ├── my-applications/
│   │   │   ├── profile/
│   │   │   └── layout.js             # User layout with protection
│   │   │
│   │   └── api/                      # API Routes (Backend)
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   ├── refresh/
│   │       │   └── logout/
│   │       ├── jobs/
│   │       │   ├── route.js          # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.js      # GET, PUT, DELETE
│   │       ├── users/
│   │       │   ├── route.js
│   │       │   └── [id]/
│   │       │       └── route.js
│   │       └── applications/
│   │           ├── route.js
│   │           └── [id]/
│   │               └── route.js
│   │
│   ├── components/                   # React Components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── MainLayout.js
│   │   │   └── FormLayout.js
│   │   │
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.js
│   │   │   │   └── SignupForm.js
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.js
│   │   │   │   ├── JobList.js
│   │   │   │   ├── JobForm.js
│   │   │   │   └── JobSearchBar.js
│   │   │   ├── users/
│   │   │   │   ├── UserTable.js
│   │   │   │   └── UserForm.js
│   │   │   └── applications/
│   │   │       └── ApplicationCard.js
│   │   │
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── EmptyState.js
│   │   │   └── Snackbar.js
│   │   │
│   │   └── common/                   # Common components
│   │       ├── ProtectedRoute.js
│   │       ├── ErrorBoundary.js
│   │       └── ProfileMenu.js
│   │
│   ├── lib/                          # Core libraries & configs
│   │   ├── mongodb.js                # MongoDB connection
│   │   ├── jwt.js                    # JWT utilities
│   │   └── constants.js              # App constants
│   │
│   ├── services/                     # Business logic layer
│   │   ├── auth.service.js
│   │   ├── job.service.js
│   │   ├── user.service.js
│   │   └── application.service.js
│   │
│   ├── models/                       # Data models (MongoDB schemas)
│   │   ├── User.model.js
│   │   ├── Job.model.js
│   │   └── Application.model.js
│   │
│   ├── middleware/                   # Express-style middleware
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── role.middleware.js        # Role-based access
│   │   └── error.middleware.js       # Error handling
│   │
│   ├── utils/                        # Utility functions
│   │   ├── api.js                    # API client
│   │   ├── validation.js             # Form validation
│   │   ├── slug.js                   # Slug generation
│   │   ├── date.js                   # Date utilities
│   │   └── error.js                  # Error utilities
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   ├── useSnackbar.js
│   │   └── useProtectedRoute.js
│   │
│   ├── contexts/                     # React Contexts
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   │
│   ├── constants/                    # Constants
│   │   ├── routes.js                 # Route definitions
│   │   ├── roles.js                  # Role constants
│   │   └── api.js                    # API endpoints
│   │
│   └── styles/                       # Global styles
│       ├── globals.css
│       ├── variables.css
│       └── components/
│
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── .env.example                      # Environment template
├── next.config.mjs                   # Next.js config
├── package.json
└── README.md
```

## 🔐 Authentication Flow

### JWT Token System
- **Access Token**: Short-lived (15 minutes), stored in memory
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
- **Token Refresh**: Automatic refresh before expiry

### Login Flow
1. User submits credentials
2. Backend validates & generates tokens
3. Access token stored in memory (state)
4. Refresh token stored in httpOnly cookie
5. User redirected to role-based dashboard

## 🛡️ Route Protection

### Public Routes
- `/`, `/home`, `/about`
- `/auth/login`, `/auth/signup`

### Protected Routes
- **Admin**: `/admin/*`
- **User**: `/jobs/*`, `/saved-jobs`, `/my-applications`, `/profile`

### Protection Strategy
1. Client-side: `ProtectedRoute` component checks auth state
2. Server-side: API routes verify JWT token
3. Role-based: Middleware checks user role

## 📡 API Structure

### RESTful Endpoints

#### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Signup
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

#### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)

#### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

#### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application
- `PUT /api/applications/:id` - Update application

## 🏗️ Architecture Principles

1. **Separation of Concerns**: Services handle business logic, API routes handle HTTP
2. **DRY**: Reusable components, hooks, and utilities
3. **Type Safety**: Consistent data structures
4. **Error Handling**: Centralized error handling
5. **Security**: JWT tokens, role-based access, input validation
6. **Scalability**: Modular structure, easy to extend

