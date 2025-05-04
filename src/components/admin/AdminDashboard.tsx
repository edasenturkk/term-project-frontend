import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Gamepad2, BarChart3, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/users"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors shadow-lg group"
        >
          <div className="flex items-center mb-4">
            <Users size={28} className="text-violet-400 group-hover:text-violet-300 transition-colors mr-3" />
            <h2 className="text-xl font-bold text-white">User Management</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Manage users, update profiles, assign admin privileges, and delete users if necessary.
          </p>
          <span className="text-violet-400 group-hover:text-violet-300 transition-colors font-medium">
            Manage Users →
          </span>
        </Link>
        
        <Link
          to="/admin/games"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors shadow-lg group"
        >
          <div className="flex items-center mb-4">
            <Gamepad2 size={28} className="text-blue-400 group-hover:text-blue-300 transition-colors mr-3" />
            <h2 className="text-xl font-bold text-white">Game Management</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Create, update, and delete games. Control game features like ratings and comments.
          </p>
          <span className="text-blue-400 group-hover:text-blue-300 transition-colors font-medium">
            Manage Games →
          </span>
        </Link>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <BarChart3 size={28} className="text-green-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Analytics</h2>
          </div>
          <p className="text-gray-300 mb-4">
            View statistics about users, games, playtime, and ratings.
          </p>
          <span className="text-gray-400 font-medium">Coming Soon</span>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Settings size={28} className="text-yellow-400 mr-3" />
            <h2 className="text-xl font-bold text-white">System Settings</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Configure platform settings, appearance, and behavior.
          </p>
          <span className="text-gray-400 font-medium">Coming Soon</span>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Quick Tips</h2>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>Use User Management to handle user accounts and access control.</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>Game Management allows you to add new games or modify existing ones.</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>You can enable or disable ratings and comments for each game.</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>Deleting a user will automatically remove their reviews and recalculate game ratings.</span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>Deleting a game will remove all associated playtime records from user profiles.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;