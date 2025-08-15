// Mock API service for testing when backend is not available
import axios from 'axios';

// Mock data for testing
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@manage.com',
    password: 'Admin123!',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: 2,
    username: 'owner1',
    email: 'owner@test.com',
    password: 'Owner123!',
    role: 'owner',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    address: '123 Main St, City, State'
  }
];

// Mock API responses
const mockApi = {
  // Mock login
  login: async (credentials) => {
    const { email, password, role } = credentials;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      return {
        data: {
          message: 'Login successful',
          role: user.role,
          userId: user.id,
          username: user.username
        }
      };
    } else {
      throw {
        response: {
          data: {
            message: 'Invalid credentials. Please check your email, password, and role.'
          }
        }
      };
    }
  },

  // Mock registration
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw {
        response: {
          data: {
            message: 'Email already registered. Please use a different email.'
          }
        }
      };
    }
    
    // Add new user to mock data
    const newUser = {
      id: mockUsers.length + 1,
      ...userData
    };
    mockUsers.push(newUser);
    
    return {
      data: {
        message: 'Registration successful! You can now login with your credentials.'
      }
    };
  },

  // Mock get users (for admin)
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: mockUsers.filter(user => user.role !== 'admin')
    };
  },

  // Mock create user (for admin)
  createUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw {
        response: {
          data: {
            message: 'Email already exists!'
          }
        }
      };
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      ...userData
    };
    mockUsers.push(newUser);
    
    return {
      data: {
        message: 'User created successfully'
      }
    };
  }
};

export default mockApi;
