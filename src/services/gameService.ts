import api from './api';
import { Game, GameFormData, ReviewFormData, PlayGameFormData, ApiResponse, GameCommentsResponse, CreatedGameResponse } from '../types';

export const getAllGames = async () => {
  const response = await api.get<ApiResponse<Game[]>>('/products');
  return response.data;
};

export const getDetailedGames = async () => {
  try {
    console.log("Fetching /products/detailed..."); // Log start
    const response = await api.get<{ games: Game[] }>('/products/detailed');
    console.log("Axios response for /products/detailed:", response); // Log full Axios response

    // Check if response.data exists and has the 'games' property before returning
    if (response && response.data && typeof response.data === 'object' && 'games' in response.data) {
      console.log("Returning response.data:", response.data);
      return response.data; // Should be { games: Game[] }
    } else {
      // Log unexpected structure and return a default or throw
      console.error("Axios response for /products/detailed did not contain expected data structure:", response);
      // Option 1: Return a default empty structure (if appropriate for the UI)
      // return { games: [] };
      // Option 2: Throw an error to be caught by the caller
      throw new Error('API response missing expected data structure');
    }
  } catch (error) {
    console.error("Error fetching detailed games in gameService:", error);
    // Re-throw the error so it can be caught by the caller (GameList.tsx)
    throw error;
  }
};

export const getGameById = async (id: string) => {
  // Expect the Game object directly, not wrapped in ApiResponse
  const response = await api.get<Game>(`/products/${id}`);
  // Return the game data directly
  return response.data;
};

export const createGame = async (gameData: GameFormData): Promise<CreatedGameResponse> => {
  // Expect the API to return the CreatedGameResponse object directly
  const response = await api.post<CreatedGameResponse>('/products', gameData);
  return response.data; // response.data is the CreatedGameResponse object
};

export const updateGame = async (id: string, gameData: Partial<GameFormData>) => {
  // Expect the updated Game object directly from the API
  const response = await api.put<Game>(`/products/${id}`, gameData);
  // Return the game data directly (Axios puts the response body in response.data)
  return response.data; 
};

export const deleteGame = async (id: string) => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/products/${id}`);
  return response.data;
};

export const reviewGame = async (id: string, reviewData: ReviewFormData) => {
  const response = await api.post<ApiResponse<Game>>(`/products/${id}/reviews`, reviewData);
  return response.data;
};

export const playGame = async (id: string, playData: PlayGameFormData) => {
  // Update the expected response type to match the actual API output
  const response = await api.post<{ message: string; playTime: number; }>(`/products/${id}/play`, playData);
  // Return the data directly, which should be { message: string, playTime: number }
  return response.data;
};

export const getGameComments = async (id: string) => {
  const response = await api.get<ApiResponse<GameCommentsResponse>>(`/products/${id}/comments`);
  return response.data;
};

// Function to convert a file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};