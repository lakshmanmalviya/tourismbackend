export enum EntityType {
  ALL = 'ALL',
  HERITAGE = 'HERITAGE',
  HOTEL = 'HOTEL',
}

export interface SearchQueryDto {
  keyword?: string;
  entityType: EntityType;
  placeId?: number;
  hotelStarRating?: number;
  minPrice?: number;
  maxPrice?: number;
  tagIds?: number[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchResponseItem {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  entityType: 'PLACE' | 'HERITAGE' | 'HOTEL';
}

export interface PlaceResponse extends SearchResponseItem {}

export interface HeritageResponse extends SearchResponseItem {
  tags: string[];
}

export interface HotelResponse extends SearchResponseItem {
  hotelStarRating: number;
  price: number;
}

export interface SearchAllResponse {
  data: SearchResponseItem[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchPlacesResponse {
  data: PlaceResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchHeritagesResponse {
  data: HeritageResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchHotelsResponse {
  data: HotelResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchSuccessPayload {
  entityType: EntityType;
  results: SearchAllResponse;
}