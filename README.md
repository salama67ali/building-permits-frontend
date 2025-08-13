# User Management System

A React-based user management system with role-based access control and admin functionality.

## Features

### 🔐 Authentication
- **Login**: Support for all user roles (admin, owner, consultant, engineer, government-board)
- **Registration**: Self-registration for non-admin users
- **Password Validation**: Strong password requirements with regex validation
- **Role-based Access**: Different dashboards based on user role

### 👨‍💼 Admin Features
- **Admin Dashboard**: Centralized admin control panel
- **User Management**: Create, read, update, and delete users
- **Role Assignment**: Assign different roles to users
- **Access Control**: Only admin users can access management features

### 👥 User Management
- **User Creation**: Admins can create new users with usernames and passwords
- **User Editing**: Modify existing user information
- **User Deletion**: Remove users from the system
- **Role Management**: Assign and change user roles

### 🎨 User Interface
- **Bootstrap Styling**: Modern, responsive design
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Visual feedback during API calls
- **Responsive Layout**: Works on desktop and mobile devices

## User Roles

1. **Admin**: Full system access, can manage all users
2. **Owner**: Business owner with limited access
3. **Consultant**: External consultant access
4. **Engineer**: Technical staff access
5. **Government Board**: Regulatory body access

## Getting Started

### Prerequisites
- Node.js and npm installed
- Backend API running on `http://localhost:9090`
- Required API endpoints:
  - `POST /api/login` - User authentication
  - `POST /api/register` - User registration
  - `GET /api/users` - Fetch all users
  - `POST /api/users` - Create new user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

### Installation
1. Install dependencies:
   ```bash
   npm install react react-router-dom axios bootstrap
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Flow

### For Admins
1. **Login** with admin credentials
2. **Access Admin Dashboard** with system overview
3. **Manage Users** - create, edit, delete users
4. **Assign Roles** to new and existing users

### For Regular Users
1. **Register** with username, email, and password
2. **Login** with registered credentials
3. **Access User Dashboard** with profile information
4. **View Role-based Features** based on permissions

### User Creation by Admin
1. Admin logs in and navigates to "Manage Users"
2. Fills out the user creation form:
   - Username (required)
   - Email (required, unique)
   - Password (required, strong validation)
   - Role (required, select from dropdown)
3. Clicks "Add" to create the user
4. User can now login with the provided credentials

## Security Features

- **Password Strength**: Minimum 6 characters with uppercase, lowercase, number, and special character
- **Email Validation**: Proper email format validation
- **Role-based Access Control**: Users can only access features appropriate to their role
- **Protected Routes**: Unauthorized access attempts are redirected
- **Session Management**: User sessions stored in localStorage

## API Integration

The system expects the following API response format for login:

```json
{
  "role": "admin",
  "userId": "123",
  "username": "admin_user"
}
```

## File Structure

```
├── App.js                 # Main application with routing
├── Login.jsx             # User authentication component
├── Register.jsx          # User registration component
├── AdminDashboard.jsx    # Admin control panel
├── UserDashboard.jsx     # Regular user dashboard
├── ManageUsers.jsx       # User management interface
└── README.md             # This file
```

## Customization

### Adding New Roles
1. Update the role options in `Login.jsx`, `Register.jsx`, and `ManageUsers.jsx`
2. Add the new role to the `allowedRoles` array in `App.js`
3. Update the backend API to handle the new role

### Styling Changes
- Modify Bootstrap classes or add custom CSS
- Update the `bootstrap/dist/css/bootstrap.min.css` import if using a different version

### API Endpoints
- Update the base URL in all components if your API runs on a different port
- Modify the API call structure if your backend expects different data formats

## Troubleshooting

### Common Issues
1. **API Connection Error**: Ensure your backend is running on port 9090
2. **Role Access Denied**: Check that the user has the correct role assigned
3. **Form Validation Errors**: Ensure all required fields are filled and passwords meet strength requirements

### Debug Mode
- Check browser console for API errors
- Verify localStorage values for user authentication
- Ensure all required dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
