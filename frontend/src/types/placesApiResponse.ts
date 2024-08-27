import { AxiosResponse } from "axios";

export interface Image {
  id: number;
  publicID: string;
  entityType: string;
  entityId: string;
  imageLink: string;
  isDeleted: boolean;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
}

export interface PlaceWithImages extends AxiosResponse {
  place: Place;
  images: Image[];
}

export interface GetAllPlacesWithImagesResponse {
  statusCode: number;
  message: string;
  error: string | null;
  timestamp: string;
  path: string;
  places: PlaceWithImages[];
}

export interface GetPlaceWithImagesResponse {
  statusCode: number;
  message: string;
  error: string | null;
  timestamp: string;
  path: string;
  data: PlaceWithImages;
}
