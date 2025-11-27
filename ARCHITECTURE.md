# Job Portal - Enterprise Architecture

## 📁 Project Structure

```
job-portal/
├── src/
│   ├── app/                              # Next.js 15 App Router
│   │   ├── layout.js                     # Root layout with fonts & metadata
│   │   ├── page.js                       # Root redirect to /home
│   │   ├── loading.js                   # Global loading component
│   │   ├── not-found.js                  # 404 page
│   │   ├── globals.css                   # Global styles
│   │   ├── root.css                      # Root CSS variables
│   │   ├── manifest.js                   # PWA manifest
│   │   ├── sitemap.js                    # Sitemap generation
│   │   │
│   │   ├── home/                         # Home page
│   │   │   ├── page.js
│   │   │   ├── HeroSection.js
│   │   │   ├── AddNewClaim.js
│   │   │   └── metadata.js
│   │   │
│   │   ├── about/                        # About page
│   │   │   ├── page.js
│   │   │   └── metadata.js
│   │   │
│   │   ├── auth/                         # Authentication pages
│   │   │   ├── login/
│   │   │   │   ├── page.js
│   │   │   │   └── Form.js
│   │   │   ├── signup/
│   │   │   │   ├── page.js
│   │   │   │   └── Form.js
│   │   │   ├── forgot-password/
│   │   │   │   ├── page.js
│   │   │   │   └── Form.js
│   │   │   ├── reset-password/
│   │   │   │   ├── page.js
│   │   │   │   └── Form.js
│   │   │   ├── password-updated/
│   │   │   │   ├── page.js
│   │   │   │   └── Form.js
│   │   │   └── auth.css
│   │   │
│   │   ├── admin/                        # Admin routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.js
│   │   │   ├── jobs/
│   │   │   │   └── page.js
│   │   │   ├── manage-users/
│   │   │   │   └── page.js
│   │   │   ├── applications/
│   │   │   │   └── page.js
│   │   │   ├── referrals/
│   │   │   │   └── page.js
│   │   │   ├── saved-jobs/
│   │   │   │   └── page.js
│   │   │   └── settings/
│   │   │       └── page.js
│   │   │
│   │   ├── users/                        # User routes
│   │   │   ├── jobs/
│   │   │   │   ├── page.js
│   │   │   │   ├── HeroSection.js
│   │   │   │   └── [slug]/
│   │   │   │       └── page.js
│   │   │   ├── saved-jobs/
│   │   │   │   └── page.js
│   │   │   ├── my-applications/
│   │   │   │   └── page.js
│   │   │   └── profile/
│   │   │       └── page.js
│   │   │
│   │   └── api/                          # API Routes (Backend)
│   │       ├── auth/
│   │       │   ├── login/route.js        # POST - User login
│   │       │   ├── register/route.js     # POST - User registration
│   │       │   ├── logout/route.js      # POST - User logout
│   │       │   ├── refresh/route.js      # POST - Refresh access token
│   │       │   └── verify/route.js      # GET - Verify token
│   │       │
│   │       ├── jobs/
│   │       │   ├── route.js              # GET, POST - List/Create jobs
│   │       │   ├── [id]/route.js         # GET, PUT, DELETE - Job by ID
│   │       │   └── [slug]/route.js       # GET - Job by slug
│   │       │
│   │       ├── users/
│   │       │   ├── [id]/route.js         # GET, PUT, DELETE - User by ID
│   │       │   ├── applications/route.js # GET, POST - User applications
│   │       │   ├── my-applications/route.js # GET - Current user applications
│   │       │   ├── saved-jobs/route.js  # GET, POST, DELETE - Saved jobs
│   │       │   └── referrals/route.js    # POST - Submit referral
│   │       │
│   │       └── admin/
│   │           ├── users/
│   │           │   ├── route.js          # GET - List all users
│   │           │   ├── [id]/route.js    # GET, PUT, DELETE - User management
│   │           │   └── count/route.js    # GET - User count
│   │           ├── jobs/
│   │           │   └── count/route.js    # GET - Job count
│   │           ├── applications/route.js # GET - All applications
│   │           ├── referrals/
│   │           │   ├── route.js          # GET - All referrals
│   │           │   └── count/route.js    # GET - Referral count
│   │           └── saved-jobs/route.js  # GET - All saved jobs
│   │
│   ├── components/                       # React Components
│   │   ├── layout/                       # Layout components
│   │   │   ├── Header.js                 # Main header with navigation
│   │   │   ├── Footer.js                 # Footer component
│   │   │   ├── MainLayout.js             # Main page layout wrapper
│   │   │   └── FormLayout.js             # Auth form layout
│   │   │
│   │   ├── dialogs/                      # Dialog components
│   │   │   ├── SessionExpiredDialog.js   # Session expiry warning
│   │   │   ├── LogoutConfirmationDialog.js # Logout confirmation
│   │   │   ├── DeleteConfirmationDialog.js # Delete confirmation
│   │   │   ├── JobFormDialog.js          # Job add/edit form dialog
│   │   │   ├── ReferFriendDialog.js      # Refer a friend form
│   │   │   ├── SuccessDialog.js          # Success message dialog
│   │   │   ├── ConformationDialog.js     # Generic confirmation dialog
│   │   │   ├── index.js                   # Dialog exports
│   │   │   └── README.md                  # Dialog documentation
│   │   │
│   │   ├── features/                     # Feature-specific components
│   │   │   ├── jobs/
│   │   │   │   ├── JobCard.js            # Job card display
│   │   │   │   └── JobSearchBar.js       # Job search component
│   │   │   └── users/
│   │   │       ├── UserTable.js          # User data table
│   │   │       └── UserStats.js           # User statistics
│   │   │
│   │   ├── ui/                           # Reusable UI components
│   │   │   ├── LoadingSpinner.js         # Loading spinner
│   │   │   └── EmptyState.js             # Empty state display
│   │   │
│   │   ├── skeletons/                     # Loading skeletons
│   │   │   ├── JobCardSkeleton.js
│   │   │   ├── TableSkeleton.js
│   │   │   ├── DashboardCardSkeleton.js
│   │   │   └── index.js
│   │   │
│   │   ├── table_components/             # Table components
│   │   │   ├── AgGridInfo.js             # AG Grid info display
│   │   │   ├── AgGridPagination.js       # AG Grid pagination
│   │   │   ├── TableSkeleton.js
│   │   │   └── pagination.module.css
│   │   │
│   │   ├── ProtectedRoute.js             # Route protection component
│   │   ├── ErrorBoundary.js              # Error boundary wrapper
│   │   ├── ProfileMenus.js               # Profile menu dropdown
│   │   ├── Breadcrumb.js                 # Breadcrumb navigation
│   │   ├── NavigationProgress.js         # Navigation progress bar
│   │   ├── SimpleDatePicker.js           # Date picker component
│   │   ├── PeriodSelection.js            # Period selection component
│   │   ├── UploadDropzone.js             # File upload component
│   │   ├── ThemeProviderComponent.js     # Theme provider
│   │   └── utils/                        # Component utilities
│   │       ├── DateFormatter.js
│   │       └── TimeAgo.js
│   │
│   ├── layouts/                          # Layout components (legacy)
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── MainLayout.js
│   │   └── FormLayout.js
│   │
│   ├── lib/                              # Core libraries
│   │   ├── mongodb.js                    # MongoDB connection (Atlas)
│   │   └── jwt.js                        # JWT token utilities
│   │
│   ├── services/                         # Business logic layer
│   │   └── auth.service.js               # Authentication service
│   │
│   ├── middleware/                       # Middleware functions
│   │   ├── auth.middleware.js           # JWT authentication
│   │   ├── role.middleware.js           # Role-based access control
│   │   └── middleware.js                 # Next.js middleware
│   │
│   ├── contexts/                         # React Contexts
│   │   └── AuthContext.js                # Authentication context
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useApi.js                     # API call hook
│   │   ├── useLocalStorage.js            # LocalStorage hook
│   │   └── useSnackbar.js                # Snackbar notification hook
│   │
│   ├── utils/                            # Utility functions
│   │   ├── api.js                        # API client utilities
│   │   ├── validation.js                 # Form validation
│   │   ├── slug.js                       # Slug generation
│   │   └── security.js                   # Security utilities
│   │
│   ├── constants/                        # Constants
│   │   ├── api.js                        # API endpoint constants
│   │   ├── routes.js                     # Route definitions
│   │   ├── roles.js                      # User role constants
│   │   └── index.js                      # Constants exports
│   │
│   ├── config/                           # Configuration
│   │   └── security.js                   # Security configuration
│   │
│   └── css/                              # Global CSS files
│       ├── buttons.css                   # Button styles
│       ├── dialogs.css                   # Dialog styles
│       ├── footer.css                    # Footer styles
│       ├── header.css                    # Header styles
│       ├── layout.css                    # Layout styles
│       ├── tables.css                    # Table styles
│       ├── textfields.css                # Text field styles
│       ├── dropzone.css                  # File upload styles
│       ├── scroll-bar.css                # Scrollbar styles
│       ├── mediaqueries.css              # Media queries
│       ├── loading.module.css            # Loading styles
│       ├── theme-ag-grid.css             # AG Grid theme
│       └── theme-ag-theme-quartz.css     # AG Grid Quartz theme
│
├── public/                               # Static assets
│   ├── assets/                           # Images, logos, etc.
│   └── uploads/                          # User uploads (resumes, etc.)
│
├── .env.local                            # Environment variables (local)
├── .gitignore                            # Git ignore rules
├── next.config.mjs                       # Next.js configuration
├── package.json                          # Dependencies
├── .npmrc                                # NPM configuration
├── vercel.json                           # Vercel deployment config
└── README.md                             # Project documentation
```

## 🔐 Authentication & Authorization

### JWT Token System
- **Access Token**: Short-lived (15 minutes), stored in memory/state
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie
- **Token Refresh**: Automatic refresh before expiry
- **Session Management**: Auto-logout after inactivity

### Authentication Flow
1. User submits credentials via `/api/auth/login`
2. Backend validates credentials against MongoDB
3. Generates JWT access token and refresh token
4. Access token stored in React state (AuthContext)
5. Refresh token stored in httpOnly cookie
6. User redirected to role-based dashboard

### Session Management
- **Warning Interval**: Shows session expiry dialog every 1 minute
- **Countdown**: 10-second countdown before auto-logout
- **Auto-logout**: Automatic logout after countdown expires
- **Session Extension**: User can extend session via dialog

## 🛡️ Route Protection

### Public Routes
- `/`, `/home`, `/about`
- `/auth/login`, `/auth/signup`
- `/auth/forgot-password`, `/auth/reset-password`

### Protected Routes

#### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Admin dashboard
- `/admin/jobs` - Job management
- `/admin/manage-users` - User management
- `/admin/applications` - Application management
- `/admin/referrals` - Referral management
- `/admin/saved-jobs` - Saved jobs view
- `/admin/settings` - Admin settings

#### User Routes (`/users/*`)
- `/users/jobs` - Browse jobs
- `/users/jobs/[slug]` - Job details
- `/users/saved-jobs` - Saved jobs
- `/users/my-applications` - My applications
- `/users/profile` - User profile

### Protection Strategy
1. **Client-side**: `ProtectedRoute` component checks auth state
2. **Server-side**: API routes verify JWT token via middleware
3. **Role-based**: Middleware checks user role (admin/user)
4. **Middleware**: Next.js middleware handles route protection

## 📡 API Structure

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token validity

### Job Endpoints
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/[id]` - Get job by ID
- `GET /api/jobs/[slug]` - Get job by slug
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/[id]` - Update job (admin only)
- `DELETE /api/jobs/[id]` - Delete job (admin only)

### User Endpoints
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (admin only)
- `GET /api/users/applications` - Get user applications
- `GET /api/users/my-applications` - Get current user applications
- `POST /api/users/applications` - Create application
- `GET /api/users/saved-jobs` - Get saved jobs
- `POST /api/users/saved-jobs` - Save a job
- `DELETE /api/users/saved-jobs` - Remove saved job
- `POST /api/users/referrals` - Submit referral

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/[id]` - Get user details
- `GET /api/admin/users/count` - Get user count
- `GET /api/admin/jobs/count` - Get job count
- `GET /api/admin/applications` - List all applications
- `GET /api/admin/referrals` - List all referrals
- `GET /api/admin/referrals/count` - Get referral count
- `GET /api/admin/saved-jobs` - List all saved jobs

## 🗄️ Database Structure (MongoDB Atlas)

### Collections

#### `users`
- User accounts (regular users)
- Fields: `_id`, `email`, `password`, `firstName`, `lastName`, `role`, `createdAt`, `updatedAt`
- Indexes: `email` (unique), `username` (unique), `createdAt`

#### `admins`
- Admin accounts
- Fields: Same as users
- Indexes: `email` (unique), `username` (unique), `createdAt`

#### `jobs`
- Job postings
- Fields: `_id`, `jobId`, `slug`, `jobRole`, `companyName`, `designation`, `location`, `salary`, `experience`, `jobType`, `skills`, `jobDescription`, `createdAt`, `updatedAt`
- Indexes: `slug` (unique), `jobId` (unique), `createdAt`, `jobRole`, `location`

#### `referrals`
- Job referrals
- Fields: `_id`, `jobId`, `jobRole`, `referrerName`, `referrerEmail`, `candidateName`, `candidateEmail`, `resume`, `status`, `userId`, `userEmail`, `createdAt`, `updatedAt`
- Indexes: `jobId`, `referrerEmail`, `candidateEmail`, `status`, `createdAt`

#### `savedJobs`
- Saved jobs by users
- Fields: `_id`, `jobId`, `userId`, `userEmail`, `savedAt`
- Indexes: `jobId`, `userId`, `userEmail`, `savedAt`, `jobId + userId` (compound)

## 🎨 Component Architecture

### Dialog Components
All dialogs follow a consistent design pattern:
- **SessionExpiredDialog**: Session expiry warning with countdown
- **LogoutConfirmationDialog**: Logout confirmation with success dialog
- **DeleteConfirmationDialog**: Delete confirmation with success dialog
- **JobFormDialog**: Job add/edit form (ContainDialog layout)
- **ReferFriendDialog**: Refer a friend form (ContainDialog layout)
- **SuccessDialog**: Generic success message dialog
- **ConformationDialog**: Generic confirmation dialog

### Layout Components
- **MainLayout**: Main page layout with header and footer
- **FormLayout**: Authentication form layout
- **Header**: Navigation header with user menu
- **Footer**: Site footer

## 🔧 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **Material-UI (MUI) 7.2.0**: Component library
- **AG Grid**: Data tables
- **React Icons**: Icon library
- **React Markdown**: Markdown rendering

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB Atlas**: Cloud database
- **MongoDB Driver 7.0.0**: Database client
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

### Utilities
- **dayjs**: Date manipulation
- **nanoid**: ID generation
- **xlsx**: Excel file handling

## 🏗️ Architecture Principles

1. **Separation of Concerns**
   - Services handle business logic
   - API routes handle HTTP requests/responses
   - Components handle UI rendering

2. **DRY (Don't Repeat Yourself)**
   - Reusable components, hooks, and utilities
   - Centralized API client
   - Shared dialog components

3. **Security First**
   - JWT token authentication
   - Role-based access control
   - Input validation and sanitization
   - httpOnly cookies for refresh tokens

4. **Error Handling**
   - Centralized error handling in API routes
   - User-friendly error messages
   - Proper HTTP status codes

5. **Scalability**
   - Modular structure
   - Easy to extend with new features
   - MongoDB indexes for performance
   - Connection pooling

6. **Code Quality**
   - Clean, maintainable code
   - Consistent naming conventions
   - Proper error handling
   - No unused code or files

## 📦 Environment Variables

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
NODE_ENV=development
```

### MongoDB Atlas Setup
- Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database?options`
- Network Access: IP whitelisting required
- Database Access: User credentials required

## 🚀 Deployment

### Vercel Deployment
1. Add environment variables in Vercel Dashboard
2. Set `MONGODB_URI` with Atlas connection string
3. Set `NEXT_PUBLIC_BASE_URL` to Vercel app URL
4. Set `JWT_SECRET` and `JWT_REFRESH_SECRET`
5. Deploy from GitHub

### Build Configuration
- Uses `--legacy-peer-deps` for dependency resolution
- Automatic build optimization
- Static asset optimization

## 📝 Code Standards

### File Naming
- Components: PascalCase (e.g., `JobCard.js`)
- Utilities: camelCase (e.g., `api.js`)
- API Routes: lowercase (e.g., `route.js`)

### Code Organization
- One component per file
- Exports from index files
- Consistent import order
- Clean, minimal code (no unused imports)

### Error Handling
- Try-catch blocks in async functions
- Proper error messages
- User-friendly error display
- Console errors for debugging (development only)

---

**Last Updated**: After comprehensive cleanup and MongoDB Atlas migration
