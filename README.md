# Sprint Planner

A comprehensive Node.js/Express.js REST API for user management with role-based access control (RBAC), audit logging, and JWT authentication.

## Helmet.js Package

**Helmet** is a security middleware for Express.js that helps protect your app by setting various HTTP headers. It's essentially a collection of 15 smaller middleware functions that set security-related HTTP headers.

### What Helmet Does:
- **Content Security Policy**: Prevents XSS attacks by controlling resource loading
- **DNS Prefetch Control**: Controls browser DNS prefetching
- **Frame Guard**: Prevents clickjacking by controlling iframe embedding
- **Hide Powered-By**: Removes the `X-Powered-By` header that reveals you're using Express
- **HSTS**: Forces HTTPS connections
- **IE No Open**: Sets X-Download-Options for IE8+
- **No Sniff**: Prevents MIME type sniffing
- **Referrer Policy**: Controls referrer information
- **XSS Filter**: Enables XSS filter in browsers

```javascript
app.use(helmet()); // Applies all default protections
```

## Features

- **User Management**: Complete CRUD operations for users
- **Role-Based Access Control**: Designation-based permissions system
- **JWT Authentication**: Secure token-based authentication
- **Audit Logging**: Track all user actions and changes
- **Input Validation**: Comprehensive request validation using Joi
- **Rate Limiting**: Protect against brute force attacks
- **Swagger Documentation**: Interactive API documentation
- **Error Handling**: Centralized error handling with custom error types
- **Logging**: Winston-based logging system
- **Security**: Helmet, CORS, and other security middlewares

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```
# API Endpoints

## Authentication
- `POST /api/auth/signup` - Register a new user  
- `POST /api/auth/login` - Login user  
- `GET /api/auth/profile` - Get user profile (protected)

## Users
- `GET /api/users` - Get all users (protected)  
- `GET /api/users/:id` - Get user by ID (protected)  
- `POST /api/users` - Create new user (protected)  
- `PUT /api/users/:id` - Update user (protected)  
- `DELETE /api/users/:id` - Delete user (protected)

## User Designations
- `GET /api/user-designations` - Get all designations (protected)  
- `GET /api/user-designations/:id` - Get designation by ID (protected)  
- `POST /api/user-designations` - Create new designation (protected)  
- `PUT /api/user-designations/:id` - Update designation (protected)  
- `DELETE /api/user-designations/:id` - Delete designation (protected)

## Permissions
- `GET /api/permissions` - Get all permissions (protected)  
- `GET /api/permissions/:id` - Get permission by ID (protected)  
- `POST /api/permissions` - Create new permission (protected)  
- `PUT /api/permissions/:id` - Update permission (protected)  
- `DELETE /api/permissions/:id` - Delete permission (protected)

## Audit Logs
- `GET /api/audits` - Get all audit logs (protected)  
- `GET /api/audits/:id` - Get audit log by ID (protected)

## Sprints
- `GET /api/sprints` - Get all sprints (protected)  
- `GET /api/sprints/:id` - Get sprint by ID (protected)  
- `POST /api/sprints` - Create new sprint (protected)  
- `PUT /api/sprints/:id` - Update sprint (protected)  
- `DELETE /api/sprints/:id` - Delete sprint (protected)

## Tasks
- `GET /api/tasks` - Get all tasks (protected)  
- `GET /api/tasks/:id` - Get task by ID (protected)  
- `POST /api/tasks` - Create new task (protected)  
- `PUT /api/tasks/:id` - Update task (protected)  
- `DELETE /api/tasks/:id` - Delete task (protected)

## Task Checklists
- `GET /api/task-checklists` - Get all checklists (protected)  
- `GET /api/task-checklists/:id` - Get checklist by ID (protected)  
- `GET /api/task-checklists/task/:id` - Get checklist(s) by Task ID (protected)  
- `POST /api/task-checklists` - Create new checklist (protected)  
- `PUT /api/task-checklists/:id` - Update checklist (protected)  
- `DELETE /api/task-checklists/:id` - Delete checklist (protected)

## Task Comments
- `GET /api/task-comments/task/:taskId` - Get all comments for a task (protected)  
- `GET /api/task-comments/:id` - Get comment by ID (protected)  
- `POST /api/task-comments` - Create new comment (protected)  
- `PUT /api/task-comments/:id` - Update comment (protected)  
- `DELETE /api/task-comments/:id` - Delete comment (protected)


## Default Credentials

After running the seed command, you can use these credentials:

- **Manager**: bob@company.com / password123
- **Senior Developer**: jane@company.com / password123
- **Junior Developer**: john@company.com / password123

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

## Project Structure

```
src/
├── server.js                   # Application entry point 
├── config/                     # Configuration files
│   ├── constants.js            # Application constants
│   ├── database.js             # Database connection
│   ├── logger.js               # Winston logger configuration
│   ├── swagger.js              # Swagger setup using swagger.yaml
│   └── docs/                   # Folder for Swagger documentation
│       ├── swagger.yaml        # Main Swagger API definition file
│       └── paths/              # Folder containing path-level YAML files
│           ├── auth.yaml       # Authentication endpoints
│           ├── users.yaml      # User endpoints
│           ├── designations.yaml # User Designation endpoints
│           ├── permissions.yaml  # Permission endpoints
│           ├── tasks.yaml        # Task endpoints
│           ├── sprints.yaml      # Sprint endpoints
│           ├── checklist.yaml    # Task Checklist endpoints
│           └── comments.yaml     # Task Comment endpoints
├── controllers/                # Route controllers
├── middlewares/                # Custom middlewares
├── models/                     # Mongoose models
├── routes/                     # Express routes
├── services/                   # Business logic
├── utils/                      # Utility functions
└── validators/                 # Request validators

```

## Application Architecture

### Directory Structure Overview

#### **1. Config Directory**
Handles application configuration and setup:
- **database.js**: MongoDB connection management
- **constants.js**: Application-wide constants and enums
- **swagger.js**: API documentation configuration
- **logger.js**: Winston logging configuration

#### **2. Models Directory**
Defines MongoDB schemas using Mongoose:
- **User.js**: User entity with authentication fields
- **UserDesignation.js**: Job roles/positions definition
- **Permission.js**: System permissions catalog
- **UserDesignationPermission.js**: Links roles to permissions
- **Audit.js**: Tracks system changes and user actions

#### **3. Controllers Directory**
Handles business logic and request processing:
- **authController.js**: Authentication and authorization logic
- **userController.js**: User CRUD operations
- **permissionController.js**: Permission management
- **auditController.js**: Audit trail management

#### **4. Middlewares Directory**

**Authentication & Authorization (`auth.js`):**
- JWT token validation and user authentication
- Role-based permission checking
- Middleware for protecting routes

**Audit Logging (`audit.js`):**
- Intercepts API responses to log user actions
- Tracks CREATE, UPDATE, DELETE operations
- Maintains audit trail for compliance

**Rate Limiting (`rateLimiter.js`):**
- General API rate limiting (100 requests/15 minutes)
- Strict auth rate limiting (5 attempts/15 minutes)
- Prevents brute force attacks

**Error Handling (`errorHandler.js`):**
- Centralized error processing
- Handles validation, duplicate key, and JWT errors
- Provides consistent error responses

#### **5. Routes Directory**
Defines API endpoints and applies middlewares:
- Protected routes with authentication and authorization
- RESTful API structure for all resources
- Middleware composition for security layers

#### **6. Services Directory**
Contains business logic separated from controllers:
- User management and data processing
- Complex database queries and operations
- Business rule enforcement and validation

#### **7. Utils Directory**

**Error Types (`errorTypes.js`):**
- Custom error classes for different scenarios
- Operational vs programming error distinction
- Consistent error handling across application

**Helper Functions (`helpers.js`):**
- MongoDB ObjectId validation utilities
- Random string generation for tokens
- Pagination calculation helpers

**Response Formatter (`responseFormatter.js`):**
- Standardized API response structure
- Success and error response formatting
- Consistent data presentation

#### **8. Validators Directory**
Input validation using Joi schema validation:
- Request body validation for all endpoints
- Data type and format enforcement
- Custom validation rules for business logic

## Application Flow

1. **Request comes in** → **Rate Limiter** → **CORS** → **Helmet Security**
2. **Route matching** → **Authentication** → **Authorization**
3. **Input Validation** → **Controller** → **Service Layer**
4. **Database Operation** → **Audit Logging** → **Response Formatting**
5. **Error Handling** (if any errors occur)

## Security Layers

- **Helmet**: HTTP header security
- **CORS**: Cross-origin request control
- **Rate Limiting**: Prevents abuse
- **JWT Authentication**: User verification
- **Role-based Authorization**: Permission checking
- **Input Validation**: Data sanitization
- **Audit Logging**: Change tracking

This architecture follows **separation of concerns**, making the application maintainable, testable, and secure. Each layer has a specific responsibility, and the middleware stack provides multiple security checkpoints.

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.