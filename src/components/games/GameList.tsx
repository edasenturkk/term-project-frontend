import React, { useState, useEffect } from 'react';
import { getDetailedGames } from '../../services/gameService';
import GameCard from './GameCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { Game } from '../../types';
import { Search, Filter } from 'lucide-react';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        console.log("GameList: Calling getDetailedGames..."); // Log before call
        const apiResponse = await getDetailedGames();
        console.log("GameList: Received from getDetailedGames:", apiResponse); // Log received data

        // Check if the response structure is as expected { games: [...] } and games is an array
        if (apiResponse && Array.isArray(apiResponse.games)) {
          const gamesData = apiResponse.games;
          setGames(gamesData);

          // Extract all unique categories from games
          const categories = new Set<string>();
          gamesData.forEach((game: Game) => {
            if (Array.isArray(game.category)) {
              game.category.forEach(cat => categories.add(cat));
            }
          });
          setAllCategories(Array.from(categories).sort());
        } else {
          // Log the actual unexpected structure received in the component
          console.error("GameList: API response from getDetailedGames did not contain a 'games' array:", apiResponse);
          setError('Received invalid data structure from server.'); // Set a specific error
          setGames([]);
          setAllCategories([]);
        }
      } catch (err: any) {
        console.error("GameList: Error caught in fetchGames:", err); // Log the caught error
        // Try to get a meaningful error message
        const message = err.response?.data?.message || err.message || 'Failed to fetch games';
        setError(message);
        setGames([]); // Ensure games is an array on error
        setAllCategories([]); // Ensure categories is an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []); // Empty dependency array ensures this runs once on mount

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
                            (Array.isArray(game.category) && game.category.includes(selectedCategory)); // Add check for array

    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loading />;
  // Display error message if present
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Discover Games</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={20} className="text-gray-500" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredGames.length === 0 && !loading ? ( // Ensure not loading before showing "No games found"
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No games found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameList;