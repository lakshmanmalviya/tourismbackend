import { IsString, IsOptional, IsNumber, IsUrl, IsEnum, IsInt, Min, Max } from 'class-validator';
import { RegistrationStatus } from '../hotel.entity';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  websiteLink?: string; // Optional field, must be a valid URL if provided

  @IsInt()
  @Min(1)
  @Max(5)
  hotelStarRating: number;

  @IsString()
  address: string;

  @IsInt()
  @Min(0)
  availableRooms: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  placeId: number; // Assuming you pass the place ID

  @IsInt()
  userId: number; // Assuming you pass the user ID

  @IsEnum(RegistrationStatus)
  @IsOptional()
  registrationStatus?: RegistrationStatus; // Optional, defaults to 'PENDING'
}
