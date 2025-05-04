import React, { useState, useEffect } from 'react';
import { getUserDashboard } from '../../services/authService';
import { UserDashboard as UserDashboardType } from '../../types';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { Star, Clock, Gamepad2, Medal, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileForm from './ProfileForm';

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<UserDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getUserDashboard();
        setDashboard(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatPlayTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboard) return <ErrorMessage message="Failed to load dashboard" />;

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {showProfileForm ? (
          <ProfileForm 
            user={dashboard.user} 
            onComplete={() => {
              setShowProfileForm(false);
              setLoading(true);
              // Reload dashboard data
              getUserDashboard()
                .then(data => setDashboard(data))
                .catch(err => setError(err.response?.data?.message || 'Failed to update profile'))
                .finally(() => setLoading(false));
            }}
            onCancel={() => setShowProfileForm(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
                <p className="text-gray-300">Welcome back, {dashboard.user.name}</p>
              </div>
              <button
                onClick={() => setShowProfileForm(true)}
                className="mt-4 md:mt-0 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
                <div className="flex items-center mb-4">
                  <Clock size={28} className="text-blue-400 mr-3" />
                  <h2 className="text-lg font-bold text-white">Total Play Time</h2>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatPlayTime(dashboard.stats.totalPlayTime)}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
                <div className="flex items-center mb-4">
                  <Star size={28} className="text-yellow-400 mr-3" />
                  <h2 className="text-lg font-bold text-white">Average Rating</h2>
                </div>
                <p className="text-3xl font-bold text-white">
                  {dashboard.stats.averageRating > 0 
                    ? dashboard.stats.averageRating.toFixed(1) 
                    : 'No ratings yet'}
                </p>
                {dashboard.stats.ratingCount > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    across {dashboard.stats.ratingCount} {dashboard.stats.ratingCount === 1 ? 'game' : 'games'}
                  </p>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
                <div className="flex items-center mb-4">
                  <Gamepad2 size={28} className="text-green-400 mr-3" />
                  <h2 className="text-lg font-bold text-white">Games Played</h2>
                </div>
                <p className="text-3xl font-bold text-white">
                  {dashboard.stats.gamesPlayedCount}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
                <div className="flex items-center mb-4">
                  <MessageSquare size={28} className="text-violet-400 mr-3" />
                  <h2 className="text-lg font-bold text-white">Reviews Written</h2>
                </div>
                <p className="text-3xl font-bold text-white">
                  {dashboard.stats.commentsCount}
                </p>
              </div>
            </div>

            {/* Most Played Game */}
            {dashboard.mostPlayedGame && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Medal size={24} className="text-yellow-400 mr-2" />
                  Most Played Game
                </h2>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4">
                      <div className="aspect-[16/9] md:h-full">
                        <img 
                          src={dashboard.mostPlayedGame.game.image} 
                          alt={dashboard.mostPlayedGame.game.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3 lg:w-3/4">
                      <Link 
                        to={`/games/${dashboard.mostPlayedGame.game._id}`}
                        className="text-2xl font-bold text-white hover:text-violet-300 transition-colors"
                      >
                        {dashboard.mostPlayedGame.game.name}
                      </Link>
                      <p className="text-gray-400 mb-4">
                        {dashboard.mostPlayedGame.game.brand}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dashboard.mostPlayedGame.game.category.map((cat, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-blue-500/20 px-3 py-1 rounded-full">
                          <Clock size={16} className="text-blue-400 mr-2" />
                          <span className="text-white">
                            {formatPlayTime(dashboard.mostPlayedGame.playTime)}
                          </span>
                        </div>
                        
                        <Link 
                          to={`/games/${dashboard.mostPlayedGame.game._id}`}
                          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Play Again
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity / Comments */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">Your Comments</h2>
              
              {dashboard.comments.length > 0 ? (
                <div className="bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-700">
                  {dashboard.comments.map((comment, index) => (
                    <div key={index} className="p-5">
                      <div className="flex items-start">
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-4">
                          <img 
                            src={comment.gameImage} 
                            alt={comment.gameName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <Link 
                            to={`/games/${comment.gameId}`}
                            className="text-lg font-bold text-white hover:text-violet-300 transition-colors"
                          >
                            {comment.gameName}
                          </Link>
                          
                          <div className="flex items-center mt-1 mb-2 space-x-4">
                            <div className="flex items-center">
                              <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="text-white">{comment.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="text-blue-400 mr-1" />
                              <span className="text-gray-400">
                                {formatPlayTime(comment.playTime)}
                              </span>
                            </div>
                            <span className="text-gray-400 text-sm">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-300">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <MessageSquare size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">You haven't written any comments yet.</p>
                </div>
              )}
            </div>

            {/* Recently Played Games */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Recently Played Games</h2>
              
              {dashboard.playedGames && dashboard.playedGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboard.playedGames.map((playedGame, index) => (
                    <Link 
                      key={index}
                      to={`/games/${playedGame.game._id}`}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:translate-y-[-4px] transition-transform"
                    >
                      <div className="aspect-[16/9] w-full">
                        <img 
                          src={playedGame.game.image} 
                          alt={playedGame.game.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-1">{playedGame.game.name}</h3>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white">{playedGame.game.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="text-blue-400 mr-1" />
                            <span className="text-gray-400">
                              {formatPlayTime(playedGame.playTime)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {playedGame.game.category.slice(0, 2).map((cat, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              {cat}
                            </span>
                          ))}
                          {playedGame.game.category.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                              +{playedGame.game.category.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <Gamepad2 size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">You haven't played any games yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;