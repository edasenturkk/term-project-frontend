import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './components/common/HomePage'; // Import HomePage
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import GameList from './components/games/GameList';
import GameDetails from './components/games/GameDetails';
import Dashboard from './components/user/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import GameManagement from './components/admin/GameManagement';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6"> {/* Added container and padding */}
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* Set HomePage as root */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/games" element={<GameList />} /> {/* Added route for GameList */}
              <Route path="/games/:id" element={<GameDetails />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <PrivateRoute adminOnly>
                    <UserManagement />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/games" 
                element={
                  <PrivateRoute adminOnly>
                    <GameManagement />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect any unknown paths to the HomePage */}
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;