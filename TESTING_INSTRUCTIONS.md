# Building Permissions Management - Testing Instructions

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to `http://localhost:5173`

## 🔐 Test Credentials

### Admin Login
- **Email:** admin@manage.com
- **Password:** Admin123!
- **Role:** Admin

### Owner Login
- **Email:** owner@test.com
- **Password:** Owner123!
- **Role:** Owner

## 📋 Testing Scenarios

### 1. Homepage Testing
- ✅ Navigate to homepage
- ✅ Click "Login" button → Should go to login page
- ✅ Click "Register as Owner" button → Should go to registration page

### 2. Login Testing
- ✅ Test with valid admin credentials → Should redirect to admin dashboard
- ✅ Test with valid owner credentials → Should redirect to owner dashboard
- ✅ Test with invalid credentials → Should show error message
- ✅ Test "Forgot Password" functionality

### 3. Registration Testing
- ✅ Fill out all required fields (marked with *)
- ✅ Test password validation (uppercase, lowercase, number, special character)
- ✅ Test email validation
- ✅ Test password confirmation matching
- ✅ Submit registration → Should show success message and redirect to login

### 4. Admin Dashboard Testing
- ✅ Login as admin
- ✅ Navigate to "Manage Users" from sidebar
- ✅ Add new users with different roles
- ✅ Edit existing users
- ✅ Delete users
- ✅ View all users in the table

### 5. Owner Dashboard Testing
- ✅ Login as owner
- ✅ View owner dashboard
- ✅ Navigate through owner-specific features

## 🛠️ Features Implemented

### ✅ Authentication System
- Login with role-based access
- Registration with comprehensive form validation
- Password strength requirements
- Forgot password functionality (mock)

### ✅ User Management (Admin)
- View all users
- Add new users with different roles
- Edit user information
- Delete users
- Role-based user creation

### ✅ Enhanced Registration
- Comprehensive owner registration form
- Required fields validation
- Optional fields for additional information
- Password confirmation
- Email validation

### ✅ Role-Based Access
- Admin dashboard with user management
- Owner dashboard
- Consultant dashboard
- Engineer dashboard
- Government Boards dashboard

### ✅ UI/UX Improvements
- Responsive design
- Bootstrap styling
- Form validation
- Success/error messages
- Loading states (mock)

## 🔧 Technical Details

### Mock API Service
- Located in `src/services/mockApi.js`
- Simulates backend API calls
- Includes test data for admin and owner users
- Handles login, registration, and user management

### Components Structure
- `src/pages/` - Main page components
- `src/components/` - Reusable components
- `src/services/` - API services

### State Management
- Uses React hooks for local state
- localStorage for user session data
- Form validation with real-time feedback

## 🐛 Known Issues & Solutions

### Issue: "Login failed" error
**Solution:** Use the provided test credentials exactly as shown above.

### Issue: Registration not working
**Solution:** Ensure all required fields are filled and password meets requirements.

### Issue: Page appears blank
**Solution:** Check browser console for errors and refresh the page.

## 🚀 Next Steps

1. **Backend Integration:** Replace mock API with real backend endpoints
2. **Database:** Implement proper user data persistence
3. **Email Service:** Add real email functionality for password reset
4. **File Upload:** Implement document upload for building plans
5. **Notifications:** Add real-time notification system
6. **Security:** Implement JWT tokens and proper authentication

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure all dependencies are installed (`npm install`)
3. Restart the development server (`npm run dev`)
4. Clear browser cache and localStorage
