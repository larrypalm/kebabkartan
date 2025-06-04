export interface KebabPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddKebabPlaceRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  adminPassword: string;
}

export interface UpdateRatingRequest {
  placeId: string;
  rating: number; // 1-5
}

export interface APIGatewayResponse {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string;
} 