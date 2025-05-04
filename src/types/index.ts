// Authentication types
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Add this new interface for the login response
export interface LoginResponse extends User {
  token: string;
}

// Game types
export interface Review {
  _id?: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment?: string; // Made optional as it might be missing in API response
  createdAt: string;
  userPlayTime?: number;
}

export interface Game {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string[];
  description: string;
  rating: number;
  numReviews: number;
  playTime?: number;
  currentUserPlayTime?: number;
  disableRating: boolean;
  disableCommenting: boolean;
  reviews?: Review[];
  releaseDate?: string;
  developer?: string;
  platform?: string[];
  voiceActing?: boolean;
  soundtrackIncluded?: boolean;
}

// Rename Root to CreatedGameResponse
export interface CreatedGameResponse { // Renamed from Root
  user: string;
  name: string;
  image: string;
  brand: string;
  category: string[];
  description: string;
  rating: number;
  numReviews: number;
  disableRating: boolean;
  disableCommenting: boolean;
  _id: string;
  reviews: any[]; // Consider defining a proper type if possible
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// User statistics types
export interface UserStats {
  totalPlayTime: number;
  averageRating: number;
  ratingCount: number;
  gamesPlayedCount: number;
  commentsCount: number;
}

export interface PlayedGame {
  game: {
    _id: string;
    name: string;
    image: string;
    category: string[];
    brand: string;
    rating: number;
  };
  playTime: number;
}

export interface UserComment {
  gameId: string;
  gameName: string;
  gameImage: string;
  category: string[];
  comment: string;
  playTime: number;
  rating: number;
  createdAt: string;
}

export interface UserDashboard {
  user: User;
  stats: UserStats;
  mostPlayedGame: {
    game: {
      _id: string;
      name: string;
      image: string;
      category: string[];
      brand: string;
    };
    playTime: number;
  };
  comments: UserComment[];
  playedGames: PlayedGame[];
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ReviewFormData {
  rating?: number;
  comment?: string;
}

export interface PlayGameFormData {
  time: number;
}

export interface ProfileUpdateFormData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserUpdateFormData {
  name: string;
  email: string;
  isAdmin: boolean;
}

// Type for the response of GET /api/products/:id/comments
export interface GameCommentsResponse {
  gameId: string;
  gameName: string;
  comments: Array<{
    user: {
      _id: string;
      name: string;
    };
    comment: string;
    rating: number;
    userPlayTime: number;
    createdAt: string;
  }>;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface GameFormData {
  name: string;
  image: string;
  brand: string;
  category: string[];
  description: string;
  disableRating: boolean;
  disableCommenting: boolean;
  // Add optional fields that might be edited/created via form
  playTime?: number;
  releaseDate?: string;
  developer?: string;
  platform?: string[];
  voiceActing?: boolean;
  soundtrackIncluded?: boolean;
}