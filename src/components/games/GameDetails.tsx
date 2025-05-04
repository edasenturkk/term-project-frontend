import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, ArrowLeft, Play, MessageSquare,
  Users 
} from 'lucide-react';
import { getGameById, playGame, reviewGame } from '../../services/gameService';
import { Game, Review } from '../../types';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import ReviewForm from './ReviewForm';
import toast from 'react-hot-toast';

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userPlayTime, setUserPlayTime] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMinutes, setPlayMinutes] = useState(15); // Default play time
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchGameDetails = async () => {
    if (!id) return; // Added check for id at the beginning
    try {
      setLoading(true);
      setError(null); // Reset error state at the beginning
      console.log(`Fetching game details for ID: ${id}`); // Log ID
      const gameData = await getGameById(id);
      console.log("Received game data:", gameData); // Log received data

      if (gameData && typeof gameData === 'object' && gameData._id) { // Check if gameData looks like a valid game object
        setGame(gameData); // Set game state
        console.log("Game state set:", gameData);

        // Find user's review if they've reviewed this game
        // Reset userReview first
        setUserReview(null); 
        if (user && gameData.reviews) {
          const foundReview = gameData.reviews.find(
            (review: Review) => review.user._id === user._id
          );
          if (foundReview) {
            setUserReview(foundReview);
          }
        }

        // Get user's play time for this game
        if (user && gameData.currentUserPlayTime !== undefined) { // Check for a user-specific playtime field
          setUserPlayTime(gameData.currentUserPlayTime);
        } else if (user) {
          // Fallback or default if specific playtime isn't available initially
          setUserPlayTime(0); // Or fetch from another endpoint if needed
          console.warn("currentUserPlayTime not found in gameData, defaulting to 0.");
        }
      } else {
        // Handle case where API returns success but no valid data
        console.error("API returned success but no valid game data.", gameData);
        setError('Game data not found or invalid.'); // Set error state explicitly
        setGame(null); // Ensure game is null if data is invalid
      }

    } catch (err: any) {
      console.error("Error fetching game details:", err); // Log the full error
      // Try to get a more specific error message
      const message = err.response?.data?.message || err.message || 'Failed to fetch game details';
      setError(message);
      setGame(null); // Ensure game is null on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]); // Keep user dependency if review/playtime depends on it

  const handlePlayGame = async () => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    
    try {
      setIsPlaying(true);
      
      // Assume playGame returns { message: string, playTime: number }
      const response = await playGame(id, { time: playMinutes });
      
      // Update user's play time from the API response
      if (response && response.playTime !== undefined) { // Access playTime directly from response
        setUserPlayTime(response.playTime);
      } else {
        // Fallback if response doesn't contain playtime - shouldn't happen on success
        setUserPlayTime(prevTime => prevTime + playMinutes); 
        console.warn("playGame response did not contain updated playTime. Updating locally.");
      }
      
      toast.success(response.message || `You played ${game?.name} for ${playMinutes} minutes!`);
    } catch (err: any) {
      // Log the full error for debugging
      console.error("Error recording play time:", err);
      
      // Try to get a more specific message
      let errorMessage = 'Failed to record play time';
      if (err.response) {
        // Server responded with a status code outside 2xx range
        console.error("API Error Response Data:", err.response.data);
        console.error("API Error Response Status:", err.response.status);
        console.error("API Error Response Headers:", err.response.headers);
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.request) {
        // Request was made but no response received (e.g., network error)
        console.error("API No Response Request:", err.request);
        errorMessage = 'Network error or server did not respond.';
      } else {
        // Something happened in setting up the request
        console.error("API Request Setup Error:", err.message);
        errorMessage = `Error: ${err.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleReviewSubmit = async (rating?: number, comment?: string) => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    
    try {
      // Check if user has played enough
      if (userPlayTime < 60) {
        toast.error('You need to play this game for at least 60 minutes to review it');
        return;
      }
      
      const reviewData = { rating, comment };
      // Call the API, but we don't need the response directly to set the game state
      await reviewGame(id, reviewData); 
      
      // Instead of using response.data, re-fetch the game details
      await fetchGameDetails(); // Re-fetch to get updated game data including new review and rating
      
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (err: any) {
      console.error("Error submitting review:", err); // Log the error
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!game) return <ErrorMessage message="Game not found" />;

  const canReview = user && userPlayTime >= 60 && !game.disableRating && !game.disableCommenting;

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Game Header with Background */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="container mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Games
            </button>
            
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                  {game.category.map((cat, index) => (
                    <span key={index} className="px-2 py-1 bg-violet-800/60 text-violet-100 text-xs rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-1">{game.name}</h1>
                
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-4">
                    <span className="font-semibold">Developer:</span> {game.brand}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <div className="flex flex-col items-center justify-center bg-gray-800 p-3 rounded-lg min-w-[100px]">
                  <div className="flex items-center">
                    <Star size={20} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-2xl font-bold text-white">{game.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{game.numReviews} reviews</span>
                </div>
                
                {game.playTime && (
                  <div className="flex flex-col items-center justify-center bg-gray-800 p-3 rounded-lg min-w-[100px]">
                    <div className="flex items-center">
                      <Clock size={20} className="text-blue-400 mr-1" />
                      <span className="text-2xl font-bold text-white">
                        {Math.floor(game.playTime / 60)}h
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Total playtime</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Game Info and Play */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {game.description}
              </p>
              
              {/* Play Game Section */}
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Play Game</h3>
                
                {user ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Clock size={18} className="text-blue-400 mr-2" />
                      <span className="text-gray-300">
                        Your playtime: {userPlayTime >= 60 
                          ? `${Math.floor(userPlayTime / 60)}h ${userPlayTime % 60}m` 
                          : `${userPlayTime}m`}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <select
                        value={playMinutes}
                        onChange={(e) => setPlayMinutes(Number(e.target.value))}
                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                      
                      <button
                        onClick={handlePlayGame}
                        disabled={isPlaying}
                        className={`flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors ${
                          isPlaying ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <Play size={20} className="fill-white" />
                        <span>{isPlaying ? 'Playing...' : 'Play Now'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-300 mb-3">Sign in to play this game</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Reviews</h2>
                
                {user && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    disabled={!canReview}
                    className={`flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-md transition-colors ${
                      !canReview ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span>{userReview ? 'Edit Review' : 'Write Review'}</span>
                  </button>
                )}
              </div>
              
              {!canReview && user && (
                <div className="bg-gray-700 p-4 rounded-md mb-6">
                  <p className="text-gray-300">
                    {userPlayTime < 60 
                      ? `You need to play this game for at least 1 hour to leave a review. Current playtime: ${userPlayTime} minutes.` 
                      : `Reviews are currently disabled for this game.`}
                  </p>
                </div>
              )}
              
              {showReviewForm && (
                <ReviewForm
                  initialRating={userReview?.rating}
                  initialComment={userReview?.comment}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}
              
              {game.reviews && game.reviews.length > 0 ? (
                <div className="space-y-6">
                  {game.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-violet-700 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{review.user.name}</div>
                            <div className="text-xs text-gray-400">
                              {formatDate(review.createdAt)}
                              {review.userPlayTime && ` • ${Math.floor(review.userPlayTime / 60)}h played`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                          <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-white font-medium">{review.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Additional Info */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Game Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users size={20} className="text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Developer</p>
                    <p className="text-white">{game.brand}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare size={20} className="text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Reviews</p>
                    <p className="text-white">{game.numReviews} reviews</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Star size={20} className="text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Rating Status</p>
                    <p className="text-white">{game.disableRating ? 'Disabled' : 'Enabled'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare size={20} className="text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Comments Status</p>
                    <p className="text-white">{game.disableCommenting ? 'Disabled' : 'Enabled'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {game.category.map((cat, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-md text-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;