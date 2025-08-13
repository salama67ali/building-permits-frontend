# BuildingsPermitted - Phase 1 Implementation

## Overview
BuildingsPermitted is a comprehensive building permit management system built with Spring Boot, JWT authentication, and PostgreSQL. This system manages the entire lifecycle of building permits from submission to approval.

## Phase 1 Features Implemented

### 1. Core System Architecture
- **Spring Boot 3.5.4** with Java 17
- **PostgreSQL** database integration
- **JWT-based authentication** for secure API access
- **Role-based access control** (RBAC)

### 2. User Authentication & Roles
- **JWT Token Generation & Validation**
- **User Registration & Login**
- **Password Encryption** using BCrypt
- **Role-based Authorization**:
  - Owner
  - Consultant
  - Engineer
  - Government Board
  - Admin

### 3. Project Registration Forms
- **Building Permit Project Model** with comprehensive fields
- **Project CRUD Operations**
- **Status Management** (pending, approved, rejected, in-review)
- **Role-based Project Access**

### 4. Basic Dashboards
- **Owner Dashboard** - Manage building permit submissions
- **Consultant Dashboard** - Handle permit consultations
- **Engineer Dashboard** - Review and approve permits
- **Government Board Dashboard** - Oversee regulations
- **Admin Dashboard** - System administration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `POST /api/projects` - Create new project (Owner/Admin)
- `GET /api/projects` - Get all projects (Admin)
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/owner/{ownerId}` - Get projects by owner
- `GET /api/projects/status/{status}` - Get projects by status
- `PUT /api/projects/{id}/status` - Update project status
- `DELETE /api/projects/{id}` - Delete project (Admin)

### User Management
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/{id}` - Get user by ID (Admin)
- `PUT /api/users/{id}` - Update user (Admin)
- `DELETE /api/users/{id}` - Delete user (Admin)

### Role-based Dashboards
- `GET /api/owner/dashboard` - Owner dashboard
- `GET /api/consultant/dashboard` - Consultant dashboard
- `GET /api/engineer/dashboard` - Engineer dashboard
- `GET /api/government-board/dashboard` - Government board dashboard

## Database Schema

### Users Table
- id (Primary Key)
- username
- email (Unique)
- password (Encrypted)
- role

### Projects Table
- id (Primary Key)
- project_name
- project_type
- address, city, state, zip_code
- description
- status
- submission_date, approval_date, completion_date
- owner_id, consultant_id, engineer_id, government_board_id (Foreign Keys)
- notes
- created_at, updated_at

## Security Features

### JWT Authentication
- **Token-based authentication** for stateless API
- **Configurable token expiration** (default: 24 hours)
- **Secure token validation** with HMAC-SHA256

### Role-based Access Control
- **Method-level security** using @PreAuthorize
- **URL-based access control** in SecurityConfig
- **User role validation** in business logic

### Password Security
- **BCrypt password hashing**
- **Configurable password requirements**
- **Secure password storage**

## Configuration

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/buildings_permitted
spring.datasource.username=postgres
spring.datasource.password=password

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Server
server.port=8080
server.servlet.context-path=/api
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js (for frontend)

### Backend Setup
1. **Clone the repository**
2. **Configure PostgreSQL database**
3. **Update application.properties** with your database credentials
4. **Run the application**: `mvn spring-boot:run`

### Database Setup
1. Create PostgreSQL database: `buildings_permitted`
2. Update `application.properties` with your credentials
3. Tables will be auto-created on first run

## Next Steps (Future Phases)
- **Phase 2**: Advanced project management features
- **Phase 3**: Document management and file uploads
- **Phase 4**: Notification system and workflow automation
- **Phase 5**: Reporting and analytics dashboard

## Technologies Used
- **Backend**: Spring Boot 3.5.4, Spring Security, Spring Data JPA
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Java Version**: 17

## Security Considerations
- JWT tokens are stateless and secure
- Passwords are hashed using BCrypt
- Role-based access control at method and URL levels
- CORS configuration for frontend integration
- Input validation and sanitization

## API Documentation
The API follows RESTful principles and returns JSON responses. All endpoints require proper authentication headers:
```
Authorization: Bearer <jwt-token>
```

## Support
For technical support or questions about the implementation, please refer to the codebase or contact the development team.
