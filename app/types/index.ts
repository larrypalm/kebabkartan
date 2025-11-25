/**
 * Core Type Definitions for Kebabkartan
 * Updated with dual rating system and review features
 */

// ============================================
// RESTAURANT / PLACE TYPES
// ============================================

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;

  // Dual Rating System
  rating: number;           // General rating (1-5)
  sauceRating: number;      // Sås rating (1-5)
  totalVotes: number;       // Total number of votes
  reviewCount: number;      // Total number of text reviews

  // Additional Info
  openingHours?: string;
  priceRange?: string;      // "$", "$$", "$$$"
  city?: string;
  slug: string;             // SEO-friendly URL slug
  phone?: string;
  tags?: string[];          // e.g., ["Kebab", "Pizza", "Lunch"]

  // Computed Status
  isOpen?: boolean;
  closingTime?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// For map markers and simplified displays
export interface RestaurantSummary {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  sauceRating: number;
  slug: string;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  username: string;
  userAvatar?: string;

  // Dual ratings
  generalRating: number;    // 1-5 stars
  sauceRating: number;      // 1-5 stars

  // Review content
  generalText?: string;     // General review text
  sauceText?: string;       // Sauce-specific review text

  // Social features
  likes: number;
  likedBy: string[];        // Array of user IDs who liked this

  // Edit tracking
  isEdited: boolean;

  // Timestamps
  createdAt: string;
  editedAt?: string;
}

export interface ReviewFormData {
  generalRating: number;
  sauceRating: number;
  generalText?: string;
  sauceText?: string;
}

// ============================================
// USER TYPES
// ============================================

export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  email?: string;
  bio?: string;
  avatar?: string;

  // Statistics
  reviewCount: number;
  saucePoints: number;      // Gamification points

  // Social
  followers: string[];      // Array of user IDs
  following: string[];      // Array of user IDs

  // Preferences
  theme: 'light' | 'dark';

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  username: string;
  signInDetails?: {
    loginId?: string;
  };
}

// ============================================
// SUGGESTION TYPES
// ============================================

export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface Suggestion {
  id: string;
  userId: string;
  username: string;

  // Restaurant details
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  phone?: string;
  openingHours?: string;
  priceRange?: string;

  // Optional initial review
  initialReview?: {
    generalRating: number;
    sauceRating: number;
    generalText?: string;
    sauceText?: string;
  };

  // Moderation
  status: SuggestionStatus;
  reviewedBy?: string;      // Admin user ID
  reviewedAt?: string;
  rejectionReason?: string;

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// VOTE TYPES
// ============================================

export interface UserVote {
  userId: string;
  restaurantId: string;
  generalRating: number;
  sauceRating: number;
  votedAt: string;
}

// ============================================
// UI COMPONENT PROP TYPES
// ============================================

export interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface RestaurantCardProps {
  restaurant: Restaurant;
  showDistance?: boolean;
  distance?: number;
}

export interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  showEditButton?: boolean;
  currentUserId?: string;
}

// ============================================
// MAP TYPES
// ============================================

export interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  sauceRating: number;
  slug: string;
}

export interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  restaurants: MapLocation[];
  onMarkerClick?: (restaurant: MapLocation) => void;
}

// ============================================
// CITY TYPES
// ============================================

export interface City {
  name: string;
  path: string;
  coordinates: [number, number];
  zoom: number;
  description: string;
  keywords: string[];
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AdminStats {
  totalRestaurants: number;
  totalReviews: number;
  totalUsers: number;
  totalSuggestions: number;
  pendingSuggestions: number;
  topRatedRestaurants: RestaurantSummary[];
  topSauceRatedRestaurants: RestaurantSummary[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'review' | 'suggestion' | 'signup';
  username: string;
  restaurantName?: string;
  timestamp: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
