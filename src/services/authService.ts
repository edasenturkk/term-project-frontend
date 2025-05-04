import api from './api';
// Update the import to include LoginResponse
import { LoginFormData, RegisterFormData, ProfileUpdateFormData, User, ApiResponse, UserStats, UserDashboard, UserComment, LoginResponse } from '../types';

export const login = async (formData: LoginFormData) => {
  // Expect the full Axios response containing LoginResponse in its data property
  const response = await api.post<LoginResponse>('/users/login', formData);
  console.log("Full API Response object in authService:", response); // Log the full response object
  // Return the data property which should contain the LoginResponse
  // Make sure your api.ts setup doesn't already extract .data
  return response.data;
};

export const register = async (formData: RegisterFormData) => {
  const response = await api.post<ApiResponse<User>>('/users', formData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get<ApiResponse<User>>('/users/profile');
  return response.data;
};

export const updateProfile = async (formData: ProfileUpdateFormData) => {
  const response = await api.put<ApiResponse<User>>('/users/profile', formData);
  return response.data;
};

export const getUserDashboard = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: User) => {
  // Expect the API to return the User object directly in the response data
  const response = await api.put<User>(`/users/${id}`, userData);
  // Return the data property which contains the User object
  return response.data; 
};

// Helper function to retrieve user data from localStorage
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token'); // Keep token check for validity context

  // Prioritize the user object stored during login
  if (storedUser && token) {
    try {
      const user: User = JSON.parse(storedUser);
      // Optional: Add token validation/decoding here if needed to check expiry,
      // but for simply restoring state, the stored object is sufficient.
      // Example: const decoded = jwtDecode(token); if (decoded.exp * 1000 < Date.now()) throw new Error("Token expired");
      return user; // Return the full user object from localStorage
    } catch (error) {
      console.error("Failed to parse user from localStorage or token invalid:", error);
      // Clear potentially corrupted/invalid stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  } else {
    // If no stored user or no token, clear any remnants and return null
    if (!token) localStorage.removeItem('user'); // Clean up user if token is missing
    if (!storedUser) localStorage.removeItem('token'); // Clean up token if user is missing
    return null;
  }
};

// --- New functions for missing endpoints ---

export const getUserStats = async () => {
  const response = await api.get<ApiResponse<UserStats>>('/users/stats');
  return response.data; // Return the data
};

export const getMostPlayedGame = async () => {
  // Assuming the response structure matches the mostPlayedGame part of UserDashboard
  const response = await api.get<ApiResponse<UserDashboard['mostPlayedGame']>>('/users/most-played');
  return response.data;
};

export const getUserComments = async () => {
  // Assuming the response structure matches the comments part of UserDashboard
  const response = await api.get<ApiResponse<UserComment[]>>('/users/comments');
  return response.data;
};

// Define a type for the /users/page response if it differs significantly from UserDashboard
// For now, assuming it might be similar or needs a specific type
// Let's use UserDashboard for now, adjust if needed based on actual API behavior
export const getUserPageData = async () => {
  const response = await api.get<ApiResponse<UserDashboard>>('/users/page'); // Adjust type if needed
  return response.data;
};