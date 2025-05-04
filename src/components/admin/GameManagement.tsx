import React, { useState, useEffect } from 'react';
import { 
  getDetailedGames, deleteGame, createGame, updateGame 
} from '../../services/gameService';
import { Game, GameFormData, CreatedGameResponse } from '../../types'; // Import CreatedGameResponse
import { Trash, Edit, Plus, Search, Star, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import GameForm from '../games/GameForm';
import toast from 'react-hot-toast';

const GameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await getDetailedGames();
      // Access response.games instead of response.data
      setGames(Array.isArray(response?.games) ? response.games : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddNew = () => {
    setEditingGame(null);
    setShowForm(true);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteGame(id);
      setGames(games.filter(game => game._id !== id));
      toast.success('Game deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete game');
    }
  };

  const handleToggleRating = async (game: Game) => {
    try {
      // Include required fields along with the toggled value
      const updateData = {
        name: game.name,
        description: game.description,
        image: game.image,
        brand: game.brand,
        category: game.category, // Include category as well, might be required
        disableRating: !game.disableRating,
        disableCommenting: game.disableCommenting // Keep the other toggle state
      };
      
      // updateGame now returns the updated Game object directly
      const updatedGame = await updateGame(game._id, updateData); 
      console.log('Update game response (Rating):', updatedGame); 
      
      // Update the game in the list using the returned Game object
      setGames(games.map(g => g._id === game._id ? updatedGame : g));
      
      // Use the returned Game object for the toast message
      toast.success(`Ratings ${updatedGame.disableRating ? 'disabled' : 'enabled'} for ${updatedGame.name}`);
    } catch (err: any) {
      console.error('Error in handleToggleRating:', err); // Log the full error object
      console.error('Error response data:', err.response?.data); // Log specific response data if available
      toast.error(err.response?.data?.message || 'Failed to update game');
    }
  };

  const handleToggleCommenting = async (game: Game) => {
    try {
      // Include required fields along with the toggled value
      const updateData = {
        name: game.name,
        description: game.description,
        image: game.image,
        brand: game.brand,
        category: game.category, // Include category as well, might be required
        disableRating: game.disableRating, // Keep the other toggle state
        disableCommenting: !game.disableCommenting
      };

      // updateGame now returns the updated Game object directly
      const updatedGame = await updateGame(game._id, updateData); 
      console.log('Update game response (Commenting):', updatedGame); 
      
      // Update the game in the list using the returned Game object
      setGames(games.map(g => g._id === game._id ? updatedGame : g));
      
      // Use the returned Game object for the toast message
      toast.success(`Comments ${updatedGame.disableCommenting ? 'disabled' : 'enabled'} for ${updatedGame.name}`);
    } catch (err: any) {
      console.error('Error in handleToggleCommenting:', err); // Log the full error object
      console.error('Error response data:', err.response?.data); // Log specific response data if available
      toast.error(err.response?.data?.message || 'Failed to update game');
    }
  };

  const handleSubmit = async (formData: GameFormData) => {
    try {
      if (editingGame) {
        // Update existing game - updateGame returns the Game object directly
        const updatedGame = await updateGame(editingGame._id, formData);
        setGames(games.map(game => 
          game._id === editingGame._id ? updatedGame : game
        ));
        toast.success(`${updatedGame.name} updated successfully`);
      } else {
        // Create new game - createGame now returns CreatedGameResponse directly
        const newGameResponse = await createGame(formData); // newGameResponse is CreatedGameResponse
        
        // Check if the response looks like a valid game object
        if (newGameResponse && newGameResponse._id) { 
          // Add newGameResponse directly to the Game[] state
          // TypeScript's structural typing allows this as CreatedGameResponse has the required fields.
          setGames([...games, newGameResponse as Game]); // Add the new game response
          toast.success(`${newGameResponse.name} created successfully`); 
        } else {
          // Handle cases where createGame might not return a valid object
          console.error("Invalid response received from createGame:", newGameResponse);
          throw new Error('Failed to create game: Invalid response from server');
        }
      }
      setShowForm(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save game';
      toast.error(errorMessage);
      console.error("Error saving game:", err); 
    }
  };

  // Ensure games is always an array before filtering
  const safeGames = Array.isArray(games) ? games : [];
  const filteredGames = safeGames.filter(game => {
    // Add checks to ensure game and its properties exist and are of the correct type
    if (!game || typeof game !== 'object') {
      return false; // Skip null/undefined or non-object entries
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const nameMatch = typeof game.name === 'string' && game.name.toLowerCase().includes(lowerSearchTerm);
    const brandMatch = typeof game.brand === 'string' && game.brand.toLowerCase().includes(lowerSearchTerm);
    const categoryMatch = Array.isArray(game.category) && 
                          game.category.some(cat => typeof cat === 'string' && cat.toLowerCase().includes(lowerSearchTerm));
                          
    return nameMatch || brandMatch || categoryMatch;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {showForm ? (
        <GameForm
          initialData={editingGame || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Game Management</h1>
              <p className="text-gray-300">Manage your game catalog</p>
            </div>
            
            <button
              onClick={handleAddNew}
              className="mt-4 md:mt-0 flex items-center bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add New Game
            </button>
          </div>

          <div className="relative max-w-md mb-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Games Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Game
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Developer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <tr key={game._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden mr-3">
                              <img 
                                src={game.image} 
                                alt={game.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-white font-medium">{game.name}</div>
                              <div className="text-gray-400 text-sm">
                                {game.category.slice(0, 2).join(', ')}
                                {game.category.length > 2 && '...'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {game.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white">{game.rating.toFixed(1)}</span>
                            <span className="text-gray-400 ml-1">({game.numReviews})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleToggleRating(game)}
                              className={`flex items-center ${game.disableRating ? 'text-gray-500' : 'text-green-500'} hover:text-violet-400 transition-colors`}
                              title={game.disableRating ? 'Enable Ratings' : 'Disable Ratings'}
                            >
                              {game.disableRating ? (
                                <ToggleLeft size={20} />
                              ) : (
                                <ToggleRight size={20} />
                              )}
                              <span className="ml-1 text-xs">Ratings</span>
                            </button>
                            
                            <button
                              onClick={() => handleToggleCommenting(game)}
                              className={`flex items-center ${game.disableCommenting ? 'text-gray-500' : 'text-green-500'} hover:text-violet-400 transition-colors`}
                              title={game.disableCommenting ? 'Enable Comments' : 'Disable Comments'}
                            >
                              {game.disableCommenting ? (
                                <ToggleLeft size={20} />
                              ) : (
                                <ToggleRight size={20} />
                              )}
                              <span className="ml-1 text-xs">Comments</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <a 
                            href={`/games/${game._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                          >
                            <Eye size={18} />
                          </a>
                          <button
                            onClick={() => handleEdit(game)}
                            className="text-violet-400 hover:text-violet-300 p-1 ml-2 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(game._id)}
                            className="text-red-400 hover:text-red-300 p-1 ml-2 transition-colors"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                        No games found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{filteredGames.length}</span> of{' '}
                <span className="font-medium text-white">{safeGames.length}</span> games
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameManagement;