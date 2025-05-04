import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../services/authService';
import { User, ProfileUpdateFormData } from '../../types';
import { User as UserIcon, Mail, Lock } from 'lucide-react';
import ErrorMessage from '../common/ErrorMessage';
import useAuth from '../../hooks/useAuth';

interface ProfileFormProps {
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onComplete, onCancel }) => {
  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { confirmPassword, ...updateData } = formData;
      
      if (!updateData.password) {
        delete updateData.password;
      }
      
      // Assuming updateProfile returns an object like { data: UserData }
      const response = await updateProfile(updateData);
      const updatedApiData = response.data; // Extract data, likely the updated user object

      // Prepare the user object for the context update,
      // ensuring we only use fields present in the API response.
      const userUpdateForContext = {
        ...user, // Start with existing user data
        ...(updatedApiData?.name && { name: updatedApiData.name }), // Safely update name if present
        ...(updatedApiData?.email && { email: updatedApiData.email }), // Safely update email if present
        // Add other fields from updatedApiData if needed, e.g., isAdmin
        // ...(typeof updatedApiData?.isAdmin === 'boolean' && { isAdmin: updatedApiData.isAdmin }),
      };
      
      // Update the user in context
      updateUser(userUpdateForContext);
      
      onComplete(); // Call this after successful update
    } catch (err: any) {
      // Log the actual error for debugging if needed (optional)
      // console.error("Profile update error:", err); 
      
      // Set user-facing error message
      setError(err.response?.data?.message || 'An error occurred updating the profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserIcon size={18} className="text-gray-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            New Password (leave blank to keep current)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;