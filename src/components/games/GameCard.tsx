import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link 
      to={`/games/${game._id}`}
      className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={game.image.startsWith('data:') ? game.image : game.image} 
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-violet-600 bg-opacity-90 px-2 py-1 rounded-md">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">{game.rating.toFixed(1)}</span>
            </div>
            {game.playTime !== undefined && (
              <div className="flex items-center space-x-1 bg-gray-800 bg-opacity-90 px-2 py-1 rounded-md">
                <Clock size={14} className="text-gray-300" />
                <span className="text-white text-sm font-medium">
                  {game.playTime >= 60 
                    ? `${Math.floor(game.playTime / 60)}h ${game.playTime % 60}m` 
                    : `${game.playTime}m`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-2">By {game.brand}</p>
        
        <div className="flex flex-wrap gap-1 mt-auto">
          {game.category.slice(0, 2).map((cat, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
            >
              {cat}
            </span>
          ))}
          {game.category.length > 2 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
              +{game.category.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;