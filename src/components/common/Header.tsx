import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, User, Menu, X, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-violet-950 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Gamepad2 size={28} className="text-violet-400 group-hover:text-violet-300 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              GameVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-violet-300 transition-colors">
              Games
            </Link>
            {user && (
              <Link to="/dashboard" className="hover:text-violet-300 transition-colors">
                Dashboard
              </Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" className="hover:text-violet-300 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-violet-300 transition-colors">
                  <User size={20} />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-violet-300 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-violet-300 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-3">
            <Link 
              to="/" 
              className="block py-2 hover:text-violet-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Games
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="block py-2 hover:text-violet-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="block py-2 hover:text-violet-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-gray-700">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block py-2 hover:text-violet-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <User size={20} />
                      <span>{user.name}</span>
                    </div>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 hover:text-violet-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut size={20} />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block py-2 hover:text-violet-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 hover:text-violet-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;