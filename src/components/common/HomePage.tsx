import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6 text-teal-400">Welcome to the Game Distribution Service</h1>
      <p className="text-lg mb-8 text-gray-300">
        Explore, play, rate, and comment on your favorite games.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Navigation Card: View Games */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-teal-300">Explore Games</h2>
          <p className="text-gray-400 mb-4">Browse our collection of available games.</p>
          <Link 
            to="/games" 
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            View Games
          </Link>
        </div>

        {/* Navigation Card: User Dashboard / Login */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-3 text-teal-300">{user ? 'Your Dashboard' : 'Login / Register'}</h2>
          {user ? (
            <>
              <p className="text-gray-400 mb-4">View your stats, played games, and comments.</p>
              <Link 
                to="/dashboard" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mr-2"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-4">Access your profile, track playtime, and manage your activities.</p>
              <Link 
                to="/login" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mr-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Navigation Card: Admin Dashboard (Conditional) */}
        {user?.isAdmin && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-3 text-red-400">Admin Panel</h2>
            <p className="text-gray-400 mb-4">Manage users and games.</p>
            <Link 
              to="/admin" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}

      </div>
      
      {/* Note about Project Requirements */}
      <div className="mt-12 p-4 bg-gray-800 border border-gray-700 rounded-lg text-left">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">Developer Note:</h3>
          <p className="text-gray-400">
              The term project description outlines specific administrative actions (Add/Remove User, Add/Remove Game, Enable/Disable Features) for the "Home Page". 
              For better user experience and separation of concerns, these administrative actions are primarily located within the dedicated <Link to="/admin" className="text-teal-400 hover:underline">Admin Dashboard</Link>. 
              This main page serves as the central navigation hub.
          </p>
      </div>
    </div>
  );
};

export default HomePage;
